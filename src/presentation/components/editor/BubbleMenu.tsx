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
  Film,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/presentation/stores';

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
  const [isInsideUnmarkedBlock, setIsInsideUnmarkedBlock] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const viewMode = useEditorStore((s) => s.viewMode);

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

      // Check if selection is inside an unmarked semantic block
      let insideUnmarked = false;
      editor.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === 'semanticBlock' && node.attrs.blockType === 'unmarked') {
          console.log('[BubbleMenu] Found unmarked block');
          insideUnmarked = true;
          return false; // Stop searching
        }
      });
      console.log('[BubbleMenu] Inside unmarked:', insideUnmarked, 'viewMode:', viewMode);
      setIsInsideUnmarkedBlock(insideUnmarked);

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

  // Extract selected text into a new typed block
  const markBlock = (blockType: 'dialogue' | 'description' | 'action' | 'thought') => {
    console.log('[BubbleMenu] markBlock called:', blockType);
    if (!editor) return;
    
    const { selection } = editor.state;
    const { from, to, $from } = selection;
    
    // Get selected text
    const selectedText = editor.state.doc.textBetween(from, to, '\n');
    if (!selectedText.trim()) return;
    
    console.log('[BubbleMenu] Selected text:', selectedText.substring(0, 50));
    
    // Find parent unmarked block
    let blockPos = -1;
    let blockDepth = -1;
    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === 'semanticBlock' && node.attrs.blockType === 'unmarked') {
        blockPos = $from.before(depth);
        blockDepth = depth;
        break;
      }
    }
    
    if (blockPos === -1) {
      console.log('[BubbleMenu] No unmarked block found');
      return;
    }
    
    console.log('[BubbleMenu] Creating new', blockType, 'block at', blockPos);
    
    // Create new block with selected content, then delete selection
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        if (dispatch) {
          // First delete the selected text
          tr.delete(from, to);
          
          // Insert new block before the unmarked block
          const newBlock = editor.state.schema.nodes.semanticBlock.create(
            { blockType, speakers: [], isNew: false },
            editor.state.schema.nodes.paragraph.create(
              null,
              selectedText ? editor.state.schema.text(selectedText) : null
            )
          );
          
          tr.insert(blockPos, newBlock);
        }
        return true;
      })
      .run();
  };

  // Create new scene from selected text
  const createSceneFromSelection = () => {
    console.log('[BubbleMenu] createSceneFromSelection called');
    if (!editor) return;
    
    const { selection } = editor.state;
    const { from, to, $from } = selection;
    
    // Get selected content as slice (preserves structure)
    const slice = editor.state.doc.slice(from, to);
    if (!slice.content.size) return;
    
    console.log('[BubbleMenu] Creating scene from selection');
    
    // Find parent scene
    let scenePos = -1;
    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === 'scene') {
        scenePos = $from.after(depth);
        break;
      }
    }
    
    if (scenePos === -1) return;
    
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        if (dispatch) {
          const schema = editor.state.schema;
          
          // Convert slice content to array of paragraph nodes
          const paragraphs: any[] = [];
          slice.content.forEach((node) => {
            if (node.type.name === 'paragraph') {
              paragraphs.push(node);
            } else if (node.isText) {
              paragraphs.push(schema.nodes.paragraph.create(null, node));
            }
          });
          
          // If no paragraphs found, create one from text
          if (paragraphs.length === 0) {
            const text = editor.state.doc.textBetween(from, to);
            if (text) {
              paragraphs.push(schema.nodes.paragraph.create(null, schema.text(text)));
            }
          }
          
          // Create new scene with unmarked block
          const newScene = schema.nodes.scene.create(
            { title: 'Новая сцена' },
            schema.nodes.semanticBlock.create(
              { blockType: 'unmarked', speakers: [], isNew: false },
              paragraphs
            )
          );
          
          // Delete selection first
          tr.delete(from, to);
          
          // Insert new scene (adjust position after deletion)
          const adjustedPos = scenePos - (to - from);
          tr.insert(adjustedPos, newScene);
        }
        return true;
      })
      .run();
  };

  if (!editor || !isVisible) return null;

  const showSemanticButtons = viewMode === 'syntax' && isInsideUnmarkedBlock;

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

      {/* Semantic block buttons - only in Syntax mode and inside unmarked block */}
      {showSemanticButtons && (
        <>
          <div className="w-px h-5 bg-[#4a5568] mx-1" />
          <MenuButton
            icon={MessageCircle}
            onClick={() => markBlock('dialogue')}
            tooltip="Диалог"
          />
          <MenuButton
            icon={Mountain}
            onClick={() => markBlock('description')}
            tooltip="Описание"
          />
          <MenuButton
            icon={Zap}
            onClick={() => markBlock('action')}
            tooltip="Действие"
          />
          <MenuButton
            icon={Brain}
            onClick={() => markBlock('thought')}
            tooltip="Мысли"
          />
          <div className="w-px h-5 bg-[#4a5568] mx-1" />
          <MenuButton
            icon={Film}
            onClick={createSceneFromSelection}
            tooltip="Создать сцену"
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
