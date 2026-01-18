'use client';

import type { Editor } from '@tiptap/core';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  MessageCircle,
  Mountain,
  Zap,
  Brain,
  FileText,
} from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/presentation/stores/useEditorStore';

// ============================================================================
// Types
// ============================================================================

interface BubbleMenuProps {
  editor: Editor | null;
}

interface MenuPosition {
  top: number;
  left: number;
}

// ============================================================================
// Component
// ============================================================================

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const viewMode = useEditorStore((s) => s.viewMode);
  const isCleanMode = viewMode === 'clean';

  const updatePositionRef = useRef<() => void>();

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { selection } = editor.state;
      const { empty, from, to } = selection;

      if (empty || from === to) {
        setIsVisible(false);
        return;
      }

      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const menuWidth = menuRef.current?.offsetWidth || 300;
      const left = Math.max(10, (start.left + end.left) / 2 - menuWidth / 2);
      const top = start.top - 50;

      setPosition({ top, left });
      setIsVisible(true);
    };

    // Store for scroll handler
    updatePositionRef.current = updatePosition;

    // Listen to selection changes
    editor.on('selectionUpdate', updatePosition);
    editor.on('blur', () => setIsVisible(false));

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('blur', () => setIsVisible(false));
    };
  }, [editor]);

  // Separate scroll effect that directly updates DOM for zero lag
  useEffect(() => {
    if (!isVisible || !editor) return;

    const handleScroll = () => {
      const { selection } = editor.state;
      const { empty, from, to } = selection;
      if (empty || from === to) return;

      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const menuWidth = menuRef.current?.offsetWidth || 300;
      const left = Math.max(10, (start.left + end.left) / 2 - menuWidth / 2);
      const top = start.top - 50;

      // Direct DOM update for zero lag
      if (menuRef.current) {
        menuRef.current.style.top = `${top}px`;
        menuRef.current.style.left = `${left}px`;
      }
    };

    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', handleScroll, true);
  }, [isVisible, editor]);

  const wrapInSemanticBlock = useCallback(
    (blockType: 'dialogue' | 'description' | 'action' | 'thought') => {
      if (!editor) return;
      
      const { from, to } = editor.state.selection;
      
      // Collect all block nodes in selection to preserve paragraph structure
      const blocks: Array<{ type: string; content?: Array<{ type: string; text?: string; attrs?: Record<string, unknown> }> }> = [];
      
      editor.state.doc.nodesBetween(from, to, (node, pos) => {
        // Only collect block-level nodes (paragraphs, headings, etc.)
        if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'scene' && node.type.name !== 'semanticBlock') {
          // Check if this node is within our selection
          const nodeFrom = pos;
          const nodeTo = pos + node.nodeSize;
          
          // Only include if node overlaps with selection
          if (nodeFrom < to && nodeTo > from) {
            const blockContent: Array<{ type: string; text?: string; attrs?: Record<string, unknown> }> = [];
            
            // Get text content of this block
            node.forEach((child) => {
              if (child.isText) {
                blockContent.push({ type: 'text', text: child.text || '' });
              } else if (child.type.name === 'entityMention') {
                // Preserve @mentions
                blockContent.push({
                  type: 'entityMention',
                  attrs: child.attrs as Record<string, unknown>,
                });
              }
            });
            
            if (blockContent.length > 0) {
              blocks.push({
                type: node.type.name,
                content: blockContent,
              });
            }
          }
        }
        return true; // Continue traversing
      });
      
      if (blocks.length === 0) {
        setIsVisible(false);
        return;
      }
      
      // Delete selection and insert semantic block preserving structure
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent({
          type: 'semanticBlock',
          attrs: { blockType },
          content: blocks,
        })
        .run();
      
      setIsVisible(false);
    },
    [editor]
  );

  const convertToPlainText = useCallback(() => {
    if (!editor) return;
    editor.commands.unsetSemanticBlock();
    setIsVisible(false);
  }, [editor]);

  if (!editor || !isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="
        fixed
        z-50
        flex 
        items-center 
        gap-0.5
        bg-[#1a1d23] 
        border 
        border-[#4a5568] 
        rounded-lg 
        shadow-2xl
        ring-1
        ring-black/30
        p-1.5
        animate-in
        fade-in
        duration-150
      "
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseDown={(e) => e.preventDefault()} // Prevent blur
    >
      {/* Text formatting */}
      <MenuButton
        icon={Bold}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        tooltip="Жирный"
      />
      <MenuButton
        icon={Italic}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        tooltip="Курсив"
      />
      <MenuButton
        icon={Strikethrough}
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        tooltip="Зачёркнутый"
      />

      <div className="w-px h-5 bg-[#4a5568] mx-1" />

      {/* Block formatting - headings */}
      <MenuButton
        icon={Heading1}
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        tooltip="Заголовок 1"
      />
      <MenuButton
        icon={Heading2}
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        tooltip="Заголовок 2"
      />
      <MenuButton
        icon={Heading3}
        isActive={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        tooltip="Заголовок 3"
      />

      <div className="w-px h-5 bg-[#4a5568] mx-1" />

      {/* Block formatting - lists & quote */}
      <MenuButton
        icon={List}
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        tooltip="Маркированный список"
      />
      <MenuButton
        icon={ListOrdered}
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        tooltip="Нумерованный список"
      />
      <MenuButton
        icon={Quote}
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        tooltip="Цитата"
      />

      {/* Semantic block conversions - hidden in clean mode */}
      {!isCleanMode && (
        <>
          <div className="w-px h-5 bg-[#4a5568] mx-1" />

          <MenuButton
            icon={MessageCircle}
            onClick={() => wrapInSemanticBlock('dialogue')}
            tooltip="Диалог"
          />
          <MenuButton
            icon={Mountain}
            onClick={() => wrapInSemanticBlock('description')}
            tooltip="Описание"
          />
          <MenuButton
            icon={Zap}
            onClick={() => wrapInSemanticBlock('action')}
            tooltip="Действие"
          />
          <MenuButton
            icon={Brain}
            onClick={() => wrapInSemanticBlock('thought')}
            tooltip="Мысли"
          />

          <div className="w-px h-5 bg-[#4a5568] mx-1" />

          <MenuButton
            icon={FileText}
            onClick={convertToPlainText}
            tooltip="Обычный текст"
          />
        </>
      )}
    </div>
  );
}

// ============================================================================
// Menu Button
// ============================================================================

interface MenuButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isActive?: boolean;
  tooltip: string;
}

function MenuButton({ icon: Icon, onClick, isActive, tooltip }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        'p-1.5 rounded transition-colors',
        isActive
          ? 'bg-[#3a4556] text-white'
          : 'text-[#8b949e] hover:text-white hover:bg-[#2d3748]'
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default BubbleMenu;
