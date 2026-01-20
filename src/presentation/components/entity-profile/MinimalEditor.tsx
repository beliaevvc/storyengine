'use client';

import { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { cn } from '@/lib/utils';
import { MinimalBubbleMenu } from './MinimalBubbleMenu';

interface MinimalEditorProps {
  content?: object;
  onUpdate?: (content: object) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

/**
 * Минимальный Tiptap редактор для страницы профиля сущности.
 * Без сцен, блоков и специальных расширений.
 * Только базовое форматирование: заголовки, жирный, курсив, списки.
 */
export function MinimalEditor({
  content,
  onUpdate,
  placeholder = 'Начните писать...',
  className,
  editable = true,
}: MinimalEditorProps) {
  const editor = useEditor({
    // CRITICAL: Prevents SSR hydration mismatches in Next.js
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        dropcursor: {
          color: '#539bf5',
          width: 2,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content: content ?? {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert prose-sm max-w-none',
          'focus:outline-none',
          // Typography
          'prose-headings:font-semibold prose-headings:text-fg',
          'prose-p:text-fg prose-p:leading-relaxed',
          'prose-strong:text-fg prose-strong:font-semibold',
          'prose-em:text-fg',
          // Lists
          'prose-ul:text-fg prose-ol:text-fg',
          'prose-li:text-fg',
          // Links
          'prose-a:text-fg-link prose-a:no-underline hover:prose-a:underline',
          // Code
          'prose-code:text-accent prose-code:bg-overlay prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
          // Blockquote
          'prose-blockquote:border-l-accent prose-blockquote:text-fg-secondary'
        ),
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.getJSON();
      // Only update if content actually changed (avoid infinite loops)
      if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  // Handle content updates
  const handleUpdate = useCallback(() => {
    if (editor && onUpdate) {
      onUpdate(editor.getJSON());
    }
  }, [editor, onUpdate]);

  useEffect(() => {
    if (editor) {
      editor.on('update', handleUpdate);
      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor, handleUpdate]);

  if (!editor) {
    return (
      <div className={cn('min-h-[300px] bg-canvas rounded p-4', className)}>
        <div className="h-full flex items-center justify-center text-fg-muted">
          Загрузка редактора...
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn('min-h-[300px] cursor-text', className)}
      onClick={() => editor.commands.focus()}
    >
      <MinimalBubbleMenu editor={editor} />
      <EditorContent 
        editor={editor} 
        className="h-full [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-2"
      />
    </div>
  );
}
