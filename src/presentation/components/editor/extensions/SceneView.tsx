'use client';

import { useCallback, useState, useRef, useEffect, useMemo, useTransition } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  MapPin,
  Circle,
  Trash2,
  Users,
  Plus,
  X,
  Sparkles,
  Target,
  Zap,
  ArrowRightLeft,
  Loader2,
} from 'lucide-react';
import type { SceneStatus } from './SceneExtension';
import { useEntityStore } from '@/presentation/stores/useEntityStore';
import { useProjectStore } from '@/presentation/stores/useProjectStore';
import { createEntity } from '@/app/actions/supabase/entity-actions';

const STATUS_COLORS: Record<SceneStatus, string> = {
  draft: 'bg-zinc-500',
  review: 'bg-amber-500',
  final: 'bg-emerald-500',
};

const STATUS_BORDER_COLORS: Record<SceneStatus, string> = {
  draft: 'border-l-zinc-600',
  review: 'border-l-amber-500',
  final: 'border-l-emerald-500',
};

const STATUS_LABELS: Record<SceneStatus, string> = {
  draft: 'Черновик',
  review: 'На проверке',
  final: 'Готово',
};

export function SceneView({ node, updateAttributes, editor, getPos, deleteNode }: NodeViewProps) {
  // Extract attrs with defaults for backward compatibility
  const {
    id,
    slug = 'Новая сцена',
    location = '',
    locationId = null,
    status = 'draft',
    collapsed = false,
    characters = [],
    goal = '',
    event = '',
    change = '',
    metaExpanded = false,
  } = node.attrs;
  
  // State for editing fields
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugValue, setSlugValue] = useState(slug || 'Новая сцена');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [isCreatingLocation, startCreatingLocation] = useTransition();
  
  // Meta fields state
  const [goalValue, setGoalValue] = useState(goal || '');
  const [eventValue, setEventValue] = useState(event || '');
  const [changeValue, setChangeValue] = useState(change || '');
  
  const slugInputRef = useRef<HTMLInputElement>(null);
  const characterPickerRef = useRef<HTMLDivElement>(null);
  const locationPickerRef = useRef<HTMLDivElement>(null);
  const newLocationInputRef = useRef<HTMLInputElement>(null);
  
  // Get current project
  const currentProject = useProjectStore((state) => state.currentProject);

  // Get all entities from store (stable selector)
  const allEntities = useEntityStore((state) => state.entities);
  
  // Filter characters with useMemo to avoid re-creating on each render
  const allCharacters = useMemo(
    () => allEntities.filter((e) => e.type === 'CHARACTER'),
    [allEntities]
  );
  
  // Filter locations
  const allLocations = useMemo(
    () => allEntities.filter((e) => e.type === 'LOCATION'),
    [allEntities]
  );
  
  // Memoize scene characters array
  const sceneCharacters = useMemo(
    () => (characters || []) as string[],
    [characters]
  );
  
  // Get current location entity
  const currentLocation = useMemo(
    () => locationId ? allLocations.find((l) => l.id === locationId) : null,
    [locationId, allLocations]
  );

  // Sync local state with props when they change externally
  useEffect(() => {
    setSlugValue(slug || 'Новая сцена');
  }, [slug]);

  useEffect(() => {
    setGoalValue(goal || '');
  }, [goal]);

  useEffect(() => {
    setEventValue(event || '');
  }, [event]);

  useEffect(() => {
    setChangeValue(change || '');
  }, [change]);

  // Close location picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationPickerRef.current && !locationPickerRef.current.contains(e.target as Node)) {
        setShowLocationPicker(false);
        setNewLocationName('');
      }
    };
    if (showLocationPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationPicker]);

  // Focus new location input when picker opens
  useEffect(() => {
    if (showLocationPicker && newLocationInputRef.current) {
      newLocationInputRef.current.focus();
    }
  }, [showLocationPicker]);

  // Calculate scene number based on position in document
  const [sceneNumber, setSceneNumber] = useState(1);
  
  useEffect(() => {
    if (typeof getPos !== 'function') return;
    
    let count = 0;
    const pos = getPos();
    
    editor.state.doc.descendants((n, p) => {
      if (n.type.name === 'scene') {
        count++;
        if (p === pos) {
          setSceneNumber(count);
          return false;
        }
      }
    });
  }, [editor.state.doc, getPos]);

  useEffect(() => {
    if (isEditingSlug && slugInputRef.current) {
      slugInputRef.current.focus();
      slugInputRef.current.select();
    }
  }, [isEditingSlug]);

  // Close character picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (characterPickerRef.current && !characterPickerRef.current.contains(e.target as Node)) {
        setShowCharacterPicker(false);
      }
    };
    if (showCharacterPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCharacterPicker]);

  const handleSlugSave = useCallback(() => {
    updateAttributes({ slug: slugValue || `Сцена ${sceneNumber}` });
    setIsEditingSlug(false);
  }, [slugValue, sceneNumber, updateAttributes]);

  const handleSlugKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSlugSave();
      } else if (e.key === 'Escape') {
        setSlugValue(slug);
        setIsEditingSlug(false);
      }
    },
    [handleSlugSave, slug]
  );

  // Location handlers
  const selectLocation = useCallback((loc: { id: string; name: string }) => {
    updateAttributes({ locationId: loc.id, location: loc.name });
    setShowLocationPicker(false);
    setNewLocationName('');
  }, [updateAttributes]);

  const clearLocation = useCallback(() => {
    updateAttributes({ locationId: null, location: '' });
  }, [updateAttributes]);

  const handleCreateLocation = useCallback(() => {
    if (!newLocationName.trim() || !currentProject?.id) return;
    
    startCreatingLocation(async () => {
      const { data, error } = await createEntity({
        project_id: currentProject.id,
        name: newLocationName.trim(),
        type: 'LOCATION',
        description: '',
      });
      
      if (data && !error) {
        // Add to local store
        useEntityStore.getState().actions.addEntity(data);
        // Select the new location
        updateAttributes({ locationId: data.id, location: data.name });
        setShowLocationPicker(false);
        setNewLocationName('');
      }
    });
  }, [newLocationName, currentProject?.id, updateAttributes]);

  const handleNewLocationKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreateLocation();
      } else if (e.key === 'Escape') {
        setShowLocationPicker(false);
        setNewLocationName('');
      }
    },
    [handleCreateLocation]
  );

  const cycleStatus = useCallback(() => {
    const statuses: SceneStatus[] = ['draft', 'review', 'final'];
    const currentIndex = statuses.indexOf(status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateAttributes({ status: nextStatus });
  }, [status, updateAttributes]);

  const toggleCollapse = useCallback(() => {
    updateAttributes({ collapsed: !collapsed });
  }, [collapsed, updateAttributes]);

  const handleDelete = useCallback(() => {
    if (deleteNode) {
      deleteNode();
    }
    setShowDeleteConfirm(false);
  }, [deleteNode]);

  const addCharacter = useCallback((characterId: string) => {
    const newCharacters = [...sceneCharacters, characterId];
    updateAttributes({ characters: newCharacters });
    setShowCharacterPicker(false);
  }, [sceneCharacters, updateAttributes]);

  const removeCharacter = useCallback((characterId: string) => {
    const newCharacters = sceneCharacters.filter(id => id !== characterId);
    updateAttributes({ characters: newCharacters });
  }, [sceneCharacters, updateAttributes]);

  const toggleMeta = useCallback(() => {
    updateAttributes({ metaExpanded: !metaExpanded });
  }, [metaExpanded, updateAttributes]);

  const handleMetaFieldSave = useCallback((field: 'goal' | 'event' | 'change', value: string) => {
    updateAttributes({ [field]: value });
  }, [updateAttributes]);

  // Get character names for display
  const getCharacterName = useCallback((charId: string) => {
    const char = allCharacters.find(c => c.id === charId);
    return char?.name || 'Неизвестный';
  }, [allCharacters]);

  // Characters not yet added to this scene (memoized)
  const availableCharacters = useMemo(
    () => allCharacters.filter(c => !sceneCharacters.includes(c.id)),
    [allCharacters, sceneCharacters]
  );

  return (
    <NodeViewWrapper
      className={`
        scene-node 
        relative 
        my-4 
        rounded-md 
        border-l-4 
        ${STATUS_BORDER_COLORS[(status || 'draft') as SceneStatus]} 
        bg-[#1e2329] 
        transition-all
        group
      `}
      data-scene-id={id}
    >
      {/* Drag Handle */}
      <div
        className="
          absolute 
          -left-6 
          top-0 
          h-full 
          w-5 
          flex 
          items-center 
          justify-center 
          opacity-0 
          group-hover:opacity-100 
          transition-opacity
          cursor-grab
          active:cursor-grabbing
        "
        contentEditable={false}
        draggable
        data-drag-handle
      >
        <GripVertical className="w-4 h-4 text-fg-muted" />
      </div>

      {/* Header / Meta Bar */}
      <div
        className="
          flex 
          items-center 
          justify-between 
          px-3 
          py-2 
          bg-[#282d35] 
          border-b 
          border-border 
          rounded-t-md
          select-none
        "
        contentEditable={false}
      >
        {/* Left side: Scene number, slug, location */}
        <div className="flex items-center gap-3 text-sm">
          {/* Scene Number */}
          <span className="text-fg-muted font-mono text-xs">
            #{sceneNumber}
          </span>

          {/* Slug / Title */}
          {isEditingSlug ? (
            <input
              ref={slugInputRef}
              type="text"
              value={slugValue}
              onChange={(e) => setSlugValue(e.target.value)}
              onBlur={handleSlugSave}
              onKeyDown={handleSlugKeyDown}
              className="
                bg-surface 
                border 
                border-accent 
                rounded 
                px-2 
                py-0.5 
                text-sm 
                text-fg 
                outline-none
                w-32
              "
            />
          ) : (
            <button
              onClick={() => setIsEditingSlug(true)}
              className="
                text-fg 
                hover:text-accent 
                font-medium 
                transition-colors
              "
            >
              {slug}
            </button>
          )}

          {/* Location Picker */}
          <div className="relative flex items-center gap-1" ref={locationPickerRef}>
            <MapPin className="w-3 h-3 text-fg-muted" />
            {currentLocation ? (
              <span className="
                inline-flex 
                items-center 
                gap-1 
                px-2 
                py-0.5 
                bg-green-500/20 
                text-green-300 
                rounded 
                text-xs
                group/loc
              ">
                {currentLocation.name}
                <button
                  onClick={clearLocation}
                  className="opacity-0 group-hover/loc:opacity-100 hover:text-red-400 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : (
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="
                  text-xs 
                  text-fg-muted
                  hover:text-fg 
                  transition-colors
                  flex
                  items-center
                  gap-1
                "
              >
                Локация...
                <Plus className="w-3 h-3" />
              </button>
            )}
            
            {/* Location Picker Dropdown */}
            {showLocationPicker && (
              <div className="
                absolute 
                left-0 
                top-full 
                mt-1 
                w-56 
                bg-[#22272e] 
                border 
                border-border 
                rounded-md 
                shadow-lg 
                z-50
                max-h-64
                overflow-hidden
              ">
                {/* Create new location */}
                <div className="p-2 border-b border-border">
                  <div className="flex items-center gap-1">
                    <input
                      ref={newLocationInputRef}
                      type="text"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      onKeyDown={handleNewLocationKeyDown}
                      placeholder="Новая локация..."
                      disabled={isCreatingLocation}
                      className="
                        flex-1
                        bg-[#1e2329] 
                        border 
                        border-border 
                        rounded 
                        px-2 
                        py-1 
                        text-xs 
                        text-fg 
                        placeholder:text-fg-muted
                        focus:border-green-500
                        focus:outline-none
                        disabled:opacity-50
                      "
                    />
                    <button
                      onClick={handleCreateLocation}
                      disabled={!newLocationName.trim() || isCreatingLocation}
                      className="
                        p-1
                        rounded
                        bg-green-500/20
                        text-green-400
                        hover:bg-green-500/30
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition-colors
                      "
                    >
                      {isCreatingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Existing locations */}
                <div className="max-h-40 overflow-y-auto">
                  {allLocations.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-fg-muted">
                      Нет локаций в проекте
                    </div>
                  ) : (
                    allLocations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => selectLocation(loc)}
                        className="
                          w-full 
                          text-left 
                          px-3 
                          py-2 
                          text-sm 
                          text-fg 
                          hover:bg-overlay 
                          transition-colors
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <MapPin className="w-3 h-3 text-green-400" />
                        {loc.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Status, AI Toggle, Delete & Collapse */}
        <div className="flex items-center gap-2">
          {/* Meta Fields Toggle */}
          <button
            onClick={toggleMeta}
            className={`
              p-1 
              rounded 
              hover:bg-overlay 
              transition-colors
              ${metaExpanded ? 'text-purple-400' : 'text-fg-muted hover:text-fg'}
            `}
            title="Метаданные сцены"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Status Indicator */}
          <button
            onClick={cycleStatus}
            className="
              flex 
              items-center 
              gap-1.5 
              text-xs 
              text-fg-muted 
              hover:text-fg 
              transition-colors
              px-2
              py-1
              rounded
              hover:bg-overlay
            "
            title={`Статус: ${STATUS_LABELS[(status || 'draft') as SceneStatus]}`}
          >
            <Circle
              className={`w-2 h-2 ${STATUS_COLORS[(status || 'draft') as SceneStatus]} rounded-full`}
              fill="currentColor"
            />
            <span className="hidden sm:inline">
              {STATUS_LABELS[(status || 'draft') as SceneStatus]}
            </span>
          </button>

          {/* Delete Button */}
          <div className="relative">
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1 bg-red-500/20 rounded px-2 py-1">
                <span className="text-xs text-red-400">Удалить?</span>
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 text-xs font-medium"
                >
                  Да
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-fg-muted hover:text-fg text-xs"
                >
                  Нет
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="
                  p-1 
                  rounded 
                  hover:bg-red-500/20 
                  text-fg-muted 
                  hover:text-red-400 
                  transition-colors
                "
                title="Удалить сцену"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="
              p-1 
              rounded 
              hover:bg-overlay 
              text-fg-muted 
              hover:text-fg 
              transition-colors
            "
            title={collapsed ? 'Развернуть' : 'Свернуть'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Characters Bar */}
      <div
        className="
          flex 
          items-center 
          gap-2 
          px-3 
          py-1.5 
          bg-[#252a32] 
          border-b 
          border-border
          select-none
        "
        contentEditable={false}
      >
        <Users className="w-3.5 h-3.5 text-fg-muted" />
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {sceneCharacters.length === 0 ? (
            <span className="text-xs text-fg-muted italic">Нет персонажей</span>
          ) : (
            sceneCharacters.map((charId) => (
              <span
                key={charId}
                className="
                  inline-flex 
                  items-center 
                  gap-1 
                  px-2 
                  py-0.5 
                  bg-blue-500/20 
                  text-blue-300 
                  rounded 
                  text-xs
                  group/char
                "
              >
                {getCharacterName(charId)}
                <button
                  onClick={() => removeCharacter(charId)}
                  className="opacity-0 group-hover/char:opacity-100 hover:text-red-400 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
        
        {/* Add Character Button */}
        <div className="relative" ref={characterPickerRef}>
          <button
            onClick={() => setShowCharacterPicker(!showCharacterPicker)}
            className="
              p-1 
              rounded 
              hover:bg-overlay 
              text-fg-muted 
              hover:text-fg 
              transition-colors
            "
            title="Добавить персонажа"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          {/* Character Picker Dropdown */}
          {showCharacterPicker && (
            <div className="
              absolute 
              right-0 
              top-full 
              mt-1 
              w-48 
              bg-[#22272e] 
              border 
              border-border 
              rounded-md 
              shadow-lg 
              z-50
              max-h-48
              overflow-y-auto
            ">
              {availableCharacters.length === 0 ? (
                <div className="px-3 py-2 text-xs text-fg-muted">
                  {allCharacters.length === 0 
                    ? 'Нет персонажей в проекте' 
                    : 'Все персонажи добавлены'}
                </div>
              ) : (
                availableCharacters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => addCharacter(char.id)}
                    className="
                      w-full 
                      text-left 
                      px-3 
                      py-2 
                      text-sm 
                      text-fg 
                      hover:bg-overlay 
                      transition-colors
                    "
                  >
                    {char.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meta Fields Section (Collapsible) */}
      {metaExpanded && (
        <div
          className="
            px-3 
            py-2 
            bg-[#1a1f26] 
            border-b 
            border-border
            space-y-2
          "
          contentEditable={false}
        >
          <div className="text-xs text-purple-400 font-medium flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3" />
            Метаданные сцены
          </div>
          
          {/* Goal */}
          <div className="flex items-start gap-2">
            <Target className="w-3.5 h-3.5 text-fg-muted mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <label className="text-xs text-fg-muted block mb-1">Цель сцены</label>
              <input
                type="text"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                onBlur={() => handleMetaFieldSave('goal', goalValue)}
                placeholder="Что должна достичь эта сцена..."
                className="
                  w-full 
                  bg-[#282d35] 
                  border 
                  border-border 
                  rounded 
                  px-2 
                  py-1.5 
                  text-xs 
                  text-fg 
                  placeholder:text-fg-muted
                  focus:border-purple-500
                  focus:outline-none
                  transition-colors
                "
              />
            </div>
          </div>
          
          {/* Event */}
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-fg-muted mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <label className="text-xs text-fg-muted block mb-1">Ключевое событие</label>
              <input
                type="text"
                value={eventValue}
                onChange={(e) => setEventValue(e.target.value)}
                onBlur={() => handleMetaFieldSave('event', eventValue)}
                placeholder="Что происходит в этой сцене..."
                className="
                  w-full 
                  bg-[#282d35] 
                  border 
                  border-border 
                  rounded 
                  px-2 
                  py-1.5 
                  text-xs 
                  text-fg 
                  placeholder:text-fg-muted
                  focus:border-purple-500
                  focus:outline-none
                  transition-colors
                "
              />
            </div>
          </div>
          
          {/* Change */}
          <div className="flex items-start gap-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-fg-muted mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <label className="text-xs text-fg-muted block mb-1">Изменение</label>
              <input
                type="text"
                value={changeValue}
                onChange={(e) => setChangeValue(e.target.value)}
                onBlur={() => handleMetaFieldSave('change', changeValue)}
                placeholder="Что изменилось в результате..."
                className="
                  w-full 
                  bg-[#282d35] 
                  border 
                  border-border 
                  rounded 
                  px-2 
                  py-1.5 
                  text-xs 
                  text-fg 
                  placeholder:text-fg-muted
                  focus:border-purple-500
                  focus:outline-none
                  transition-colors
                "
              />
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div
        className={`
          scene-content 
          px-4 
          py-3 
          ${collapsed ? 'hidden' : 'block'}
        `}
      >
        <NodeViewContent className="prose prose-invert prose-sm max-w-none" />
      </div>

      {/* Collapsed Preview */}
      {collapsed && (
        <div
          className="px-4 py-2 text-sm text-fg-muted italic truncate"
          contentEditable={false}
        >
          {node.textContent.slice(0, 100)}
          {node.textContent.length > 100 && '...'}
        </div>
      )}
    </NodeViewWrapper>
  );
}

export default SceneView;
