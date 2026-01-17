'use client';

import type { Editor } from '@tiptap/core';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ScanSearch,
  Loader2,
  Film,
  Split,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { ToolbarButton } from './ToolbarButton';
import { useEntityScanner } from '@/presentation/hooks';
import { useEntityStore } from '@/presentation/stores';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ToolbarProps {
  editor: Editor | null;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Toolbar({ editor, className }: ToolbarProps) {
  const entities = useEntityStore((s) => s.entities);
  const { isScanning, scan } = useEntityScanner();

  // Debug: log entities count
  console.log('[Toolbar] entities count:', entities.length, 'isScanning:', isScanning);

  const handleAIScan = async () => {
    console.log('[Toolbar] AI Scan clicked, entities:', entities.map(e => e.name));
    const results = await scan();
    console.log('[Toolbar] AI Scan found:', results.length, 'matches');
  };

  if (!editor) return null;

  return (
    <div
      className={cn(
        'h-10 bg-surface border-b border-border px-2 flex items-center gap-1',
        className
      )}
    >
      {/* History */}
      <ToolbarButton
        icon={Undo}
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <ToolbarButton
        icon={Redo}
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />

      <div className="w-px h-5 bg-border mx-1" />

      {/* Headings */}
      <ToolbarButton
        icon={Heading1}
        label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        icon={Heading2}
        label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={Heading3}
        label="Heading 3"
        isActive={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <div className="w-px h-5 bg-border mx-1" />

      {/* Formatting */}
      <ToolbarButton
        icon={Bold}
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Strikethrough}
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <div className="w-px h-5 bg-border mx-1" />

      {/* Lists */}
      <ToolbarButton
        icon={List}
        label="Bullet List"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="Numbered List"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={Quote}
        label="Quote"
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <div className="w-px h-5 bg-border mx-1" />

      {/* Scene Controls */}
      <ToolbarButton
        icon={Film}
        label="Вставить сцену (⌘⇧S)"
        onClick={() => editor.chain().focus().insertScene().run()}
      />
      <ToolbarButton
        icon={Split}
        label="Разделить сцену (⌘⌥↵)"
        onClick={() => editor.chain().focus().splitScene().run()}
        disabled={!editor.isActive('scene')}
      />

      <div className="flex-1" />

      {/* AI Scan */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handleAIScan}
        disabled={isScanning || entities.length === 0}
        className="gap-1.5"
      >
        {isScanning ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ScanSearch className="w-4 h-4" />
        )}
        AI Scan
      </Button>
    </div>
  );
}
