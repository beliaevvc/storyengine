'use client';

import { useCallback, useState, useRef, useEffect, useMemo, useTransition } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { GripVertical, ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import type { SceneStatus } from './SceneExtension';
import { useEntityStore } from '@/presentation/stores/useEntityStore';
import { useProjectStore } from '@/presentation/stores/useProjectStore';
import { useEditorStore } from '@/presentation/stores/useEditorStore';
import { createEntity } from '@/app/actions/supabase/entity-actions';

// Status config - using design tokens
const STATUS_CONFIG: Record<SceneStatus, { label: string; bgClass: string; textClass: string }> = {
  draft: { label: 'Черновик', bgClass: 'bg-fg-muted/20', textClass: 'text-fg-secondary' },
  review: { label: 'Проверка', bgClass: 'bg-warning/20', textClass: 'text-warning' },
  final: { label: 'Готово', bgClass: 'bg-success/20', textClass: 'text-success' },
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

  // View mode
  const viewMode = useEditorStore((s) => s.viewMode);
  const isCleanMode = viewMode === 'clean';
  
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
        useEntityStore.getState().actions.addEntity(data as any);
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
    // Don't close picker - allow adding multiple characters
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

  // Add new scene after this one
  const handleAddAfterScene = useCallback(() => {
    if (!editor || typeof getPos !== 'function') return;
    
    const pos = getPos();
    if (pos === undefined) return;
    const endPos = pos + node.nodeSize;
    
    // Insert a new scene with empty block after this one
    editor
      .chain()
      .focus()
      .insertContentAt(endPos, {
        type: 'scene',
        attrs: {
          slug: 'Новая сцена',
          status: 'draft',
        },
        content: [{
          type: 'semanticBlock',
          attrs: { blockType: 'empty' },
          content: [{ type: 'paragraph' }],
        }],
      })
      .setTextSelection(endPos + 3)
      .run();
  }, [editor, getPos, node.nodeSize]);

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

  const statusConfig = STATUS_CONFIG[(status || 'draft') as SceneStatus];

  // Calculate word count (no memo - updates on every render for real-time count)
  const text = node.textContent || '';
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  
  // Russian word declension
  const getWordLabel = (count: number) => {
    const lastTwo = count % 100;
    const lastOne = count % 10;
    if (lastTwo >= 11 && lastTwo <= 19) return 'слов';
    if (lastOne === 1) return 'слово';
    if (lastOne >= 2 && lastOne <= 4) return 'слова';
    return 'слов';
  };

  // Clean mode: minimal
  if (isCleanMode) {
    return (
      <NodeViewWrapper className="scene-node my-8" data-scene-id={id}>
        <div className="pb-2 mb-4 border-b border-border-muted" contentEditable={false}>
          <h2 className="text-lg font-serif text-fg">{slug}</h2>
        </div>
        <div className="scene-content">
          <NodeViewContent className="prose prose-invert prose-sm max-w-none" />
        </div>
      </NodeViewWrapper>
    );
  }

  // Syntax mode: Clean card style - compact
  return (
    <NodeViewWrapper
      className="scene-node relative my-2 group/scene"
      data-scene-id={id}
    >
      {/* Drag Handle - appears on hover */}
      <div
        className="absolute -left-6 top-2 opacity-0 group-hover/scene:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        contentEditable={false}
        draggable
        data-drag-handle
      >
        <GripVertical className="w-4 h-4 text-fg-muted" />
      </div>

      {/* Main Card */}
      <div className="bg-surface rounded-lg shadow-panel border border-border overflow-hidden">
        
        {/* Card Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border" contentEditable={false}>
          {/* Left: Collapse + Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCollapse}
              className="p-0.5 text-fg-secondary hover:text-fg transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isEditingSlug ? (
              <input
                ref={slugInputRef}
                type="text"
                value={slugValue}
                onChange={(e) => setSlugValue(e.target.value)}
                onBlur={handleSlugSave}
                onKeyDown={handleSlugKeyDown}
                className="bg-surface border border-border-emphasis rounded px-2 py-1 text-sm text-fg outline-none focus:border-accent w-48"
              />
            ) : (
              <button
                onClick={() => setIsEditingSlug(true)}
                className="text-sm font-medium text-fg hover:text-accent transition-colors"
              >
                Сцена {sceneNumber}
                {slug !== 'Новая сцена' && `: ${slug}`}
              </button>
            )}
          </div>

          {/* Right: Word count + Status + Actions */}
          <div className="flex items-center gap-3">
            {/* Word count */}
            <span className="text-xs text-fg-secondary">{wordCount} {getWordLabel(wordCount)}</span>
            
            {/* Status label */}
            <button
              onClick={cycleStatus}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${statusConfig.bgClass} ${statusConfig.textClass}`}
              title="Клик для смены статуса"
            >
              {statusConfig.label}
            </button>

            {/* Delete button with confirmation */}
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-error">Удалить?</span>
                <button
                  onClick={handleDelete}
                  className="px-1.5 py-0.5 text-error hover:bg-error/20 rounded transition-colors"
                >
                  Да
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-1.5 py-0.5 text-fg-muted hover:bg-overlay rounded transition-colors"
                >
                  Нет
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1 text-fg-muted hover:text-error transition-colors"
                title="Удалить сцену"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Location & Characters row - always visible */}
        {!collapsed && (
          <div className="flex items-center gap-4 px-3 py-1.5 border-b border-border text-xs" contentEditable={false}>
            {/* Location */}
            <div className="relative flex items-center gap-1.5" ref={locationPickerRef}>
              <span className="text-fg-muted">📍</span>
              {currentLocation ? (
                <span className="text-accent flex items-center gap-1">
                  {currentLocation.name}
                  <button onClick={clearLocation} className="text-fg-muted hover:text-error">×</button>
                </span>
              ) : (
                <button
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="text-fg-muted hover:text-accent transition-colors"
                >
                  + локация
                </button>
              )}
              {showLocationPicker && (
                <div className="absolute left-0 top-full mt-1 bg-surface border border-border-emphasis rounded shadow-dropdown z-50 min-w-[160px]">
                  <div className="p-2 border-b border-border-emphasis">
                    <input
                      ref={newLocationInputRef}
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      onKeyDown={handleNewLocationKeyDown}
                      placeholder="Новая локация..."
                      className="w-full bg-overlay border border-border-emphasis rounded px-2 py-1 text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="max-h-[120px] overflow-y-auto">
                    {allLocations.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => selectLocation(loc)}
                        className="w-full text-left px-3 py-1.5 text-xs text-fg hover:bg-overlay"
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-border">|</span>

            {/* Characters */}
            <div className="flex items-center gap-1.5 flex-wrap" ref={characterPickerRef}>
              <span className="text-fg-muted">👤</span>
              {sceneCharacters.map((charId) => (
                <span key={charId} className="bg-overlay px-1.5 py-0.5 rounded text-fg flex items-center gap-1">
                  {getCharacterName(charId)}
                  <button onClick={() => removeCharacter(charId)} className="text-fg-muted hover:text-error">×</button>
                </span>
              ))}
              <div className="relative">
                <button
                  onClick={() => setShowCharacterPicker(!showCharacterPicker)}
                  className="text-fg-muted hover:text-accent transition-colors"
                >
                  +
                </button>
                {showCharacterPicker && (
                  <div className="absolute left-0 top-full mt-1 bg-surface border border-border-emphasis rounded shadow-dropdown z-50 min-w-[140px]">
                    {availableCharacters.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-fg-muted">Все добавлены</div>
                    ) : (
                      availableCharacters.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => addCharacter(char.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-fg hover:bg-overlay"
                        >
                          {char.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Meta Section - Goal/Event/Change - always visible */}
        {!collapsed && (
          <div className="px-3 py-2 bg-inset border-b border-border space-y-1.5" contentEditable={false}>
            <div className="flex items-center gap-2">
              <span className="text-xs text-fg-muted w-20">Цель:</span>
              <input
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                onBlur={() => handleMetaFieldSave('goal', goalValue)}
                placeholder="..."
                className="flex-1 bg-transparent text-xs text-fg placeholder:text-fg-muted focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-fg-muted w-20">Событие:</span>
              <input
                value={eventValue}
                onChange={(e) => setEventValue(e.target.value)}
                onBlur={() => handleMetaFieldSave('event', eventValue)}
                placeholder="..."
                className="flex-1 bg-transparent text-xs text-fg placeholder:text-fg-muted focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-fg-muted w-20">Изменение:</span>
              <input
                value={changeValue}
                onChange={(e) => setChangeValue(e.target.value)}
                onBlur={() => handleMetaFieldSave('change', changeValue)}
                placeholder="..."
                className="flex-1 bg-transparent text-xs text-fg placeholder:text-fg-muted focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {!collapsed && (
          <div className="scene-content px-2 py-2">
            <NodeViewContent className="prose prose-invert prose-sm max-w-none [&>*]:my-1" />
          </div>
        )}

        {/* Collapsed preview */}
        {collapsed && (
          <div className="px-3 py-2 text-sm text-fg-secondary" contentEditable={false}>
            {(node.textContent || '').slice(0, 120)}{(node.textContent || '').length > 120 && '...'}
          </div>
        )}
      </div>

      {/* Add Scene Button - appears between scenes */}
      <div
        className="flex items-center justify-center h-4 opacity-0 group-hover/scene:opacity-100 transition-opacity"
        contentEditable={false}
      >
        <button
          onClick={handleAddAfterScene}
          className="flex items-center gap-1 px-2 py-0.5 text-xs text-fg-muted hover:text-fg hover:bg-overlay rounded transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export default SceneView;
