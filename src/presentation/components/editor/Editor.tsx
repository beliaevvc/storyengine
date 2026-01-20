'use client';

import { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import {
  DocumentExtension,
  EntityMark,
  EntityMention,
  createMentionSuggestion,
  SceneExtension,
  SemanticBlock,
} from './extensions';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { BubbleMenu } from './BubbleMenu';
import { BlockHandle } from './BlockHandle';
import { useEditorStore } from '@/presentation/stores';
import { useEntityDetection } from '@/presentation/hooks';
import { cn } from '@/lib/utils';
import { migrateDocument } from '@/presentation/utils/migrateDocument';

// Extension to store viewMode in editor storage
const ViewModeStorage = Extension.create({
  name: 'viewMode',
  addStorage() {
    return {
      current: 'clean' as 'clean' | 'syntax',
    };
  },
});

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

  // Migrate document to scene-centric format if needed
  const migratedContent = useMemo(() => {
    const migrated = migrateDocument(content);
    console.log('[StoryEditor] Content migration:', {
      original: content,
      migrated,
      sceneCount: migrated.content?.length || 0,
    });
    return migrated;
  }, [content]);

  const editor = useEditor({
    // CRITICAL: Prevents SSR hydration mismatches in Next.js
    immediatelyRender: false,
    extensions: [
      // Override default document with scene-centric version
      DocumentExtension,
      
      // StarterKit without document (we use our own)
      StarterKit.configure({
        document: false, // Use our DocumentExtension instead
        heading: { levels: [1, 2, 3] },
        dropcursor: {
          color: '#539bf5', // accent color
          width: 2,
        },
      }),
      
      // Placeholder for empty states
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'scene') {
            return 'Начните писать...';
          }
          if (node.type.name === 'semanticBlock') {
            return 'Введите текст...';
          }
          return 'Введите текст...';
        },
        includeChildren: true,
      }),
      
      Typography,
      CharacterCount,
      EntityMark,
      
      // @mentions for entities (inline speaker markers in dialogues)
      EntityMention.configure({
        suggestion: createMentionSuggestion(),
      }),
      
      // Scene-centric architecture
      SceneExtension,
      SemanticBlock,
      
      // View mode storage for extensions
      ViewModeStorage,
    ],
    content: migratedContent,
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
  const viewMode = useEditorStore((s) => s.viewMode);

  // Sync viewMode to editor storage for extensions
  useEffect(() => {
    if (editor && (editor.storage as any).viewMode) {
      (editor.storage as any).viewMode.current = viewMode;
    }
  }, [editor, viewMode]);

  // Enable entity detection at cursor position
  useEntityDetection();

  return (
    <div className={cn('h-full flex flex-col bg-canvas', className)}>
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-5xl mx-auto relative">
          {/* Bubble Menu - appears on text selection */}
          <BubbleMenu editor={editor} />
          {/* Block Handle - plus button on hover for adding blocks */}
          <BlockHandle editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
      <StatusBar wordCount={wordCount} characterCount={characterCount} />
    </div>
  );
}
