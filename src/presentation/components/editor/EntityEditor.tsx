'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import { Loader2, Check, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/presentation/components/ui';
import { DynamicIcon } from '@/presentation/components/ui/icon-picker';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { getEntityTemplate } from './templates';
import { useEditorStore, useWorkspaceStore, useEntityStore } from '@/presentation/stores';
import { updateEntityContent, updateEntity } from '@/app/actions/supabase/entity-actions';
import { getEntityTypeIcon, getEntityTypeLabel, getEntityTypeColor } from '@/presentation/components/entities/EntityTypeIcon';
import type { Entity, TiptapContent } from '@/core/entities/entity';

// ============================================================================
// Types & Constants
// ============================================================================

interface EntityEditorProps {
  entity: Entity;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function EntityEditor({ entity, className }: EntityEditorProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>('');

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(entity.name);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const setEditor = useEditorStore((s) => s.actions.setEditor);
  const updateCounts = useEditorStore((s) => s.actions.updateCounts);
  const setTabDirty = useWorkspaceStore((s) => s.actions.setTabDirty);
  const updateTabTitle = useWorkspaceStore((s) => s.actions.updateTabTitle);
  const updateEntityInStore = useEntityStore((s) => s.actions.updateEntity);

  // Get initial content - use template if entity has no content
  const getInitialContent = useCallback((): TiptapContent => {
    if (entity.content) {
      return entity.content as TiptapContent;
    }
    return getEntityTemplate(entity.type);
  }, [entity.content, entity.type]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Начните писать...',
        includeChildren: true,
      }),
      Typography,
      CharacterCount,
    ],
    content: getInitialContent(),
    onUpdate: ({ editor }) => {
      const content = editor.getJSON() as TiptapContent;
      handleContentUpdate(content);

      // Update word/character counts
      const storage = editor.storage.characterCount;
      if (storage) {
        updateCounts(storage.words(), storage.characters());
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert max-w-none',
          'prose-headings:font-serif prose-headings:text-fg prose-headings:mt-8 prose-headings:mb-4',
          'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl',
          'prose-p:font-serif prose-p:text-fg prose-p:leading-relaxed prose-p:my-4',
          'prose-strong:text-fg prose-em:text-fg',
          'prose-ul:my-4 prose-ol:my-4 prose-li:my-1',
          'prose-blockquote:border-l-accent prose-blockquote:text-fg-muted',
          'focus:outline-none min-h-[calc(100vh-16rem)]'
        ),
      },
    },
  });

  // Clear timeout on unmount
  useEffect(() => {
    lastSavedContentRef.current = JSON.stringify(getInitialContent());
    setSaveStatus('idle');

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [entity.id, getInitialContent]);

  // Sync editNameValue when entity.name changes
  useEffect(() => {
    setEditNameValue(entity.name);
  }, [entity.name]);

  // Focus input when editing name starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSave = useCallback(async () => {
    const trimmedName = editNameValue.trim();
    if (!trimmedName || trimmedName === entity.name) {
      setEditNameValue(entity.name);
      setIsEditingName(false);
      return;
    }

    try {
      const { data, error } = await updateEntity(entity.id, { name: trimmedName });
      
      if (data && !error) {
        updateEntityInStore(entity.id, { name: trimmedName });
        updateTabTitle(entity.id, trimmedName);
      }
    } catch (err) {
      console.error('Failed to update entity name:', err);
      setEditNameValue(entity.name);
    }
    
    setIsEditingName(false);
  }, [editNameValue, entity.id, entity.name, updateEntityInStore, updateTabTitle]);

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditNameValue(entity.name);
      setIsEditingName(false);
    }
  };

  // Sync editor instance with store
  useEffect(() => {
    if (editor) {
      setEditor(editor);

      const storage = editor.storage.characterCount;
      if (storage) {
        updateCounts(storage.words(), storage.characters());
      }
    }

    return () => {
      setEditor(null);
    };
  }, [editor, setEditor, updateCounts]);

  const handleContentUpdate = useCallback(
    (content: TiptapContent) => {
      const contentStr = JSON.stringify(content);

      // Skip if content hasn't changed
      if (contentStr === lastSavedContentRef.current) return;

      // Mark tab as dirty
      setTabDirty(entity.id, true);

      // Debounce save to server
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setSaveStatus('saving');

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const { success, error } = await updateEntityContent(entity.id, content);

          if (success) {
            lastSavedContentRef.current = contentStr;
            setSaveStatus('saved');
            setTabDirty(entity.id, false);

            // Update entity in store
            updateEntityInStore(entity.id, { content });

            // Reset to idle after 2 seconds
            setTimeout(() => setSaveStatus('idle'), 2000);
          } else {
            console.error('Save failed:', error);
            setSaveStatus('idle');
          }
        } catch (err) {
          console.error('Save error:', err);
          setSaveStatus('idle');
        }
      }, 1000);
    },
    [entity.id, setTabDirty, updateEntityInStore]
  );

  const wordCount = useEditorStore((s) => s.wordCount);
  const characterCount = useEditorStore((s) => s.characterCount);

  const iconName = getEntityTypeIcon(entity.type);
  const typeColor = getEntityTypeColor(entity.type);

  return (
    <div className={cn('h-full flex flex-col bg-canvas', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${typeColor}20` }}
        >
          <DynamicIcon name={iconName} className="w-5 h-5" style={{ color: typeColor }} />
        </div>
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyDown}
              className="text-lg font-medium bg-transparent border-b-2 border-accent text-fg px-0 py-0.5 outline-none w-full focus:border-accent"
            />
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 
                className="text-lg font-medium truncate cursor-pointer hover:text-accent transition-colors"
                onClick={() => setIsEditingName(true)}
              >
                {entity.name}
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-surface-hover transition-opacity"
                aria-label="Переименовать"
              >
                <Pencil className="w-3.5 h-3.5 text-fg-muted" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className="text-xs">
              {getEntityTypeLabel(entity.type)}
            </Badge>
            {entity.description && (
              <span className="text-xs text-fg-muted truncate">
                {entity.description}
              </span>
            )}
          </div>
        </div>

        {/* Save status */}
        <div className="flex items-center gap-1.5 text-xs text-fg-muted">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Сохранение...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500">Сохранено</span>
            </>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar wordCount={wordCount} characterCount={characterCount} />
    </div>
  );
}
