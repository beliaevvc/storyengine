'use client';

import { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import { EntityMark, SceneExtension } from './extensions';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { useEditorStore } from '@/presentation/stores';
import { useEntityDetection } from '@/presentation/hooks';
import { cn } from '@/lib/utils';
import type { SceneAttributes } from './extensions/SceneExtension';

// ============================================================================
// Types
// ============================================================================

interface StoryEditorProps {
  content?: object;
  onUpdate?: (content: object) => void;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function StoryEditor({
  content,
  onUpdate,
  className,
}: StoryEditorProps) {
  const setEditor = useEditorStore((s) => s.actions.setEditor);
  const updateCounts = useEditorStore((s) => s.actions.updateCounts);
  const setDirty = useEditorStore((s) => s.actions.setDirty);

  // DEBUG: Log initial content
  const contentObj = content as { type?: string; content?: unknown[] } | undefined;
  const sceneNodes = contentObj?.content?.filter((n: any) => n.type === 'scene') || [];
  console.log('[StoryEditor] Initializing with content:', {
    hasContent: !!content,
    contentType: contentObj?.type,
    totalNodes: contentObj?.content?.length || 0,
    sceneCount: sceneNodes.length,
    scenes: sceneNodes.map((s: any) => ({ id: s.attrs?.id, slug: s.attrs?.slug })),
  });

  const editor = useEditor({
    // CRITICAL: Prevents SSR hydration mismatches in Next.js
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Нажмите Cmd+Shift+S чтобы создать первую сцену...',
        includeChildren: true,
      }),
      Typography,
      CharacterCount,
      EntityMark,
      SceneExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
      setDirty(true);

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
          'focus:outline-none min-h-[calc(100vh-12rem)]',
          'pl-8' // Space for drag handles
        ),
      },
    },
  });

  // Sync editor instance with store
  useEffect(() => {
    if (editor) {
      setEditor(editor);

      // Initial counts
      const storage = editor.storage.characterCount;
      if (storage) {
        updateCounts(storage.words(), storage.characters());
      }
    }

    return () => {
      setEditor(null);
    };
  }, [editor, setEditor, updateCounts]);

  const wordCount = useEditorStore((s) => s.wordCount);
  const characterCount = useEditorStore((s) => s.characterCount);

  // Enable entity detection at cursor position
  useEntityDetection();

  return (
    <div className={cn('h-full flex flex-col bg-canvas', className)}>
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
      <StatusBar wordCount={wordCount} characterCount={characterCount} />
    </div>
  );
}
