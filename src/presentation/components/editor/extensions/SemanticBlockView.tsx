'use client';

import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { MessageCircle, Mountain, Zap, Brain, X, GripVertical, FileText, Film } from 'lucide-react';
import type { SemanticBlockType } from './SemanticBlock';
import { useEntityStore } from '@/presentation/stores/useEntityStore';
import { useEditorStore } from '@/presentation/stores/useEditorStore';

// ============================================================================
// Configuration - Clean card style
// ============================================================================

interface BlockTypeConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  labelFull: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const BLOCK_TYPE_CONFIG: Record<SemanticBlockType, BlockTypeConfig> = {
  empty: {
    icon: FileText,
    label: '',
    labelFull: 'Блок',
    bgColor: '',
    borderColor: 'border-[#3a3f4b]',
    textColor: 'text-[#6e7681]',
  },
  unmarked: {
    icon: FileText,
    label: '',
    labelFull: 'Неразмеченный',
    bgColor: '',
    borderColor: 'border-[#5a6c7d]',
    textColor: 'text-[#8b949e]',
  },
  dialogue: {
    icon: MessageCircle,
    label: 'DLG',
    labelFull: 'Диалог',
    bgColor: '',
    borderColor: 'border-[#444c56]',
    textColor: 'text-[#8b949e]',
  },
  description: {
    icon: Mountain,
    label: 'DSC',
    labelFull: 'Описание',
    bgColor: '',
    borderColor: 'border-[#444c56]',
    textColor: 'text-[#8b949e]',
  },
  action: {
    icon: Zap,
    label: 'ACT',
    labelFull: 'Действие',
    bgColor: '',
    borderColor: 'border-[#444c56]',
    textColor: 'text-[#8b949e]',
  },
  thought: {
    icon: Brain,
    label: 'THT',
    labelFull: 'Мысли',
    bgColor: '',
    borderColor: 'border-[#444c56]',
    textColor: 'text-[#8b949e]',
  },
};

// Available types for conversion (excluding empty)
const BLOCK_TYPES: SemanticBlockType[] = ['dialogue', 'description', 'action', 'thought'];

// ============================================================================
// Component
// ============================================================================

interface Speaker {
  id: string;
  name: string;
}

export function SemanticBlockView({ node, deleteNode, editor, getPos, updateAttributes }: NodeViewProps) {
  // Safely extract and validate attributes
  const rawAttrs = node.attrs || {};
  const rawBlockType = rawAttrs.blockType;
  const rawSpeakers = rawAttrs.speakers;
  const rawIsNew = rawAttrs.isNew;

  // Ensure blockType is a valid string
  const blockType: SemanticBlockType = (
    typeof rawBlockType === 'string' && 
    ['empty', 'unmarked', 'dialogue', 'description', 'action', 'thought'].includes(rawBlockType)
  ) ? rawBlockType as SemanticBlockType : 'description';

  // Ensure speakers is always an array of valid objects with string names
  const speakers: Speaker[] = Array.isArray(rawSpeakers) 
    ? rawSpeakers
        .filter((s): s is Speaker => 
          s && typeof s === 'object' && 'id' in s && 'name' in s
        )
        .map(s => ({
          id: String(s.id || ''),
          name: String(s.name || ''),
        }))
    : [];

  const isNew = rawIsNew === true;

  const config = BLOCK_TYPE_CONFIG[blockType] || BLOCK_TYPE_CONFIG.description;
  console.log('[SemanticBlockView] Rendering block:', blockType, 'speakers:', JSON.stringify(speakers), 'isNew:', isNew);
  const viewMode = useEditorStore((s) => s.viewMode);
  const isCleanMode = viewMode === 'clean';

  const [isHovered, setIsHovered] = useState(false);
  const [showSpeakerPicker, setShowSpeakerPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const typePickerRef = useRef<HTMLDivElement>(null);

  // Remove isNew flag on hover or after timeout
  useEffect(() => {
    if (isNew && isHovered) {
      updateAttributes({ isNew: false });
    }
  }, [isNew, isHovered, updateAttributes]);

  // Auto-remove isNew flag after 5 seconds
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        updateAttributes({ isNew: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isNew, updateAttributes]);

  // Get characters from store
  const allEntities = useEntityStore((state) => state.entities);
  const characters = useMemo(
    () => allEntities.filter((e) => e.type === 'CHARACTER'),
    [allEntities]
  );

  // Filter out already added speakers
  const availableCharacters = useMemo(
    () => characters.filter((c) => !speakers.some((s) => s.id === c.id)),
    [characters, speakers]
  );

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowSpeakerPicker(false);
      }
    };
    if (showSpeakerPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSpeakerPicker]);

  // Close type picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typePickerRef.current && !typePickerRef.current.contains(e.target as Node)) {
        setShowTypePicker(false);
      }
    };
    if (showTypePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTypePicker]);

  const handleRemove = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const handleAddSpeaker = useCallback((char: { id: string; name: string }) => {
    const newSpeakers = [...speakers, { id: char.id, name: char.name }];
    updateAttributes({ speakers: newSpeakers });
    setShowSpeakerPicker(false);
  }, [speakers, updateAttributes]);

  const handleRemoveSpeaker = useCallback((speakerId: string) => {
    const newSpeakers = speakers.filter((s) => s.id !== speakerId);
    updateAttributes({ speakers: newSpeakers });
  }, [speakers, updateAttributes]);

  // Change block type
  const handleChangeType = useCallback((newType: SemanticBlockType) => {
    console.log('[SemanticBlockView] handleChangeType:', blockType, '->', newType);
    updateAttributes({ blockType: newType });
  }, [blockType, updateAttributes]);

  // Move entire block to a new scene
  const handleMoveToNewScene = useCallback(() => {
    if (!editor || typeof getPos !== 'function') return;
    
    const pos = getPos();
    if (pos === undefined) return;
    
    if (!node.textContent.trim()) return;
    
    console.log('[SemanticBlockView] Moving block to new scene');
    
    // Find parent scene position
    const $pos = editor.state.doc.resolve(pos);
    let sceneAfterPos = -1;
    
    for (let depth = $pos.depth; depth >= 0; depth--) {
      const parentNode = $pos.node(depth);
      if (parentNode.type.name === 'scene') {
        sceneAfterPos = $pos.after(depth);
        break;
      }
    }
    
    if (sceneAfterPos === -1) return;
    
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        if (dispatch) {
          const schema = editor.state.schema;
          
          // Copy the block's content as-is (preserves paragraphs structure)
          const blockContent = node.content;
          
          // Create new scene with unmarked block containing the same content
          const newScene = schema.nodes.scene.create(
            { title: 'Новая сцена' },
            schema.nodes.semanticBlock.create(
              { blockType: 'unmarked', speakers: [], isNew: false },
              blockContent
            )
          );
          
          // Delete current block
          const nodeSize = node.nodeSize;
          tr.delete(pos, pos + nodeSize);
          
          // Insert new scene (adjust position after deletion)
          const adjustedPos = sceneAfterPos - nodeSize;
          tr.insert(adjustedPos, newScene);
        }
        return true;
      })
      .run();
  }, [editor, getPos, node]);

  // Show speaker picker only for dialogue and thought
  const showSpeakerField = blockType === 'dialogue' || blockType === 'thought';
  const isEmptyBlock = blockType === 'empty';
  const isUnmarkedBlock = blockType === 'unmarked';
  const Icon = config.icon;

  // Clean mode: minimal wrapper with just content
  if (isCleanMode) {
    return (
      <NodeViewWrapper className="semantic-block my-3" data-block-type={blockType}>
        <NodeViewContent className="prose prose-invert prose-sm max-w-none" />
      </NodeViewWrapper>
    );
  }

  // Syntax mode: Clean neutral style - compact with always visible border
  return (
    <NodeViewWrapper
      className={`semantic-block relative mt-1 mb-3 group/semantic rounded border transition-all ${
        isNew 
          ? 'border-purple-500/50 bg-purple-500/5 animate-pulse' 
          : 'border-[#3a3f4b] hover:border-[#444c56]'
      }`}
      data-block-type={blockType}
      data-is-new={isNew}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Block header - draggable */}
      <div
        className="flex items-center gap-2 px-2 py-1 cursor-grab active:cursor-grabbing"
        contentEditable={false}
        ref={pickerRef}
        data-drag-handle
      >
        {/* Drag indicator */}
        <GripVertical className="w-4 h-4 text-[#6e7681] flex-shrink-0" />
        {/* Empty block: show type selector */}
        {isEmptyBlock ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#6e7681] mr-1">Тип:</span>
            {BLOCK_TYPES.map((type) => {
              const typeConfig = BLOCK_TYPE_CONFIG[type];
              const TypeIcon = typeConfig.icon;
              return (
                <button
                  key={type}
                  onClick={() => handleChangeType(type)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs text-[#8b949e] hover:text-white hover:bg-[#3a3f4b] rounded transition-colors"
                  title={typeConfig.labelFull}
                >
                  <TypeIcon className="w-3.5 h-3.5" />
                  {typeConfig.labelFull}
                </button>
              );
            })}
          </div>
        ) : isUnmarkedBlock ? (
          /* Unmarked block: show hint + quick type buttons + move to scene */
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b949e]">Неразмеченный</span>
            <span className="text-xs text-[#6e7681]">—</span>
            {BLOCK_TYPES.map((type) => {
              const typeConfig = BLOCK_TYPE_CONFIG[type];
              const TypeIcon = typeConfig.icon;
              return (
                <button
                  key={type}
                  onClick={() => handleChangeType(type)}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-[#6e7681] hover:text-white hover:bg-[#3a3f4b] rounded transition-colors"
                  title={typeConfig.labelFull}
                >
                  <TypeIcon className="w-3 h-3" />
                </button>
              );
            })}
            <span className="text-xs text-[#6e7681]">|</span>
            <button
              onClick={handleMoveToNewScene}
              className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-[#6e7681] hover:text-white hover:bg-[#3a3f4b] rounded transition-colors"
              title="Перенести в новую сцену"
            >
              <Film className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <>
            {/* Regular block: clickable type selector */}
            <div className="relative" ref={typePickerRef}>
              <button
                onClick={() => setShowTypePicker(!showTypePicker)}
                className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-[#3a3f4b] transition-colors"
                title="Изменить тип блока"
              >
                <Icon className={`w-4 h-4 ${config.textColor}`} />
                <span className={`text-xs font-medium ${config.textColor}`}>
                  {config.labelFull}
                </span>
              </button>
              {showTypePicker && (
                <div className="absolute top-full left-0 mt-1 bg-[#22272e] border border-[#444c56] rounded shadow-lg z-50 min-w-[140px]">
                  {BLOCK_TYPES.map((type) => {
                    const typeConfig = BLOCK_TYPE_CONFIG[type];
                    const TypeIcon = typeConfig.icon;
                    const isSelected = type === blockType;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          handleChangeType(type);
                          setShowTypePicker(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                          isSelected 
                            ? 'bg-[#3a3f4b] text-white' 
                            : 'text-[#c9d1d9] hover:bg-[#2d333b]'
                        }`}
                      >
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeConfig.labelFull}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Speakers for dialogue/thought */}
            {showSpeakerField && speakers.length > 0 && (
              <div className="flex items-center gap-1.5 ml-2">
                {speakers.map((speaker) => (
                  <span key={speaker.id} className="text-xs bg-[#2d333b] px-2 py-0.5 rounded text-[#c9d1d9] flex items-center gap-1">
                    {speaker.name}
                    <button
                      onClick={() => handleRemoveSpeaker(speaker.id)}
                      className="text-[#6e7681] hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {showSpeakerField && (
              <div className="relative">
                <button
                  onClick={() => setShowSpeakerPicker(!showSpeakerPicker)}
                  className="text-xs text-[#6e7681] hover:text-[#c9d1d9] transition-colors"
                >
                  + персонаж
                </button>
                {showSpeakerPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-[#22272e] border border-[#444c56] rounded shadow-lg z-50 min-w-[140px]">
                    {availableCharacters.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-[#6e7681]">Все добавлены</div>
                    ) : (
                      availableCharacters.map((char) => (
                        <button
                          key={char.id}
                          onClick={() => handleAddSpeaker(char)}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#c9d1d9] hover:bg-[#2d333b] transition-colors"
                        >
                          {char.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Delete button - always present, opacity changes */}
        <button
          onClick={handleRemove}
          className={`p-1 text-[#6e7681] hover:text-red-400 transition-all ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          contentEditable={false}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Divider line */}
      <div className="mx-2 border-t border-[#3a3f4b]" contentEditable={false} />

      {/* Content */}
      <div className="px-2 py-1">
        <NodeViewContent className="prose prose-invert prose-sm max-w-none [&>*]:my-0.5" />
      </div>

    </NodeViewWrapper>
  );
}

export default SemanticBlockView;
