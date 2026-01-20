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
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface MinimalBubbleMenuProps {
  editor: Editor | null;
}

interface MenuPosition {
  top: number;
  left: number;
}

// ============================================================================
// Component
// ============================================================================

export function MinimalBubbleMenu({ editor }: MinimalBubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

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

      const menuWidth = menuRef.current?.offsetWidth || 280;
      const left = Math.max(10, (start.left + end.left) / 2 - menuWidth / 2);
      const top = start.top - 50;

      setPosition({ top, left });
      setIsVisible(true);
    };

    editor.on('selectionUpdate', updatePosition);
    editor.on('blur', () => setIsVisible(false));

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('blur', () => setIsVisible(false));
    };
  }, [editor]);

  // Direct DOM update on scroll for zero lag
  useEffect(() => {
    if (!isVisible || !editor) return;

    const handleScroll = () => {
      const { selection } = editor.state;
      const { empty, from, to } = selection;
      if (empty || from === to) return;

      const { view } = editor;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const menuWidth = menuRef.current?.offsetWidth || 280;
      const left = Math.max(10, (start.left + end.left) / 2 - menuWidth / 2);
      const top = start.top - 50;

      if (menuRef.current) {
        menuRef.current.style.top = `${top}px`;
        menuRef.current.style.left = `${left}px`;
      }
    };

    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', handleScroll, true);
  }, [isVisible, editor]);

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
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Text formatting */}
      <MenuButton
        icon={Bold}
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        tooltip="Жирный (Ctrl+B)"
      />
      <MenuButton
        icon={Italic}
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        tooltip="Курсив (Ctrl+I)"
      />
      <MenuButton
        icon={Strikethrough}
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        tooltip="Зачёркнутый"
      />

      <div className="w-px h-5 bg-[#4a5568] mx-1" />

      {/* Headings */}
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

      {/* Lists & quote */}
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
