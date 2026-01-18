'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import { Plus } from 'lucide-react';
import { useEditorStore } from '@/presentation/stores/useEditorStore';

interface BlockHandleProps {
  editor: Editor | null;
}

export function BlockHandle({ editor }: BlockHandleProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [targetPos, setTargetPos] = useState<number | null>(null);
  const viewMode = useEditorStore((s) => s.viewMode);
  const isCleanMode = viewMode === 'clean';

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const { state, view } = editor;
      const { selection } = state;
      const { $from } = selection;
      
      // Find the current block
      let blockNode = null;
      let blockPos = $from.pos;
      
      for (let depth = $from.depth; depth >= 0; depth--) {
        const node = $from.node(depth);
        if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'scene') {
          blockNode = node;
          blockPos = $from.before(depth);
          break;
        }
      }
      
      if (!blockNode) {
        setPosition(null);
        return;
      }
      
      // Get coordinates
      try {
        const coords = view.coordsAtPos(blockPos);
        const editorRect = view.dom.getBoundingClientRect();
        
        setPosition({
          top: coords.top - editorRect.top + view.dom.scrollTop,
          left: -32,
        });
        setTargetPos(blockPos);
      } catch {
        setPosition(null);
      }
    };

    // Update on selection change
    editor.on('selectionUpdate', updatePosition);
    editor.on('focus', updatePosition);
    
    // Initial update
    updatePosition();

    return () => {
      editor.off('selectionUpdate', updatePosition);
      editor.off('focus', updatePosition);
    };
  }, [editor]);

  const handleClick = useCallback(() => {
    if (!editor) return;

    // Simply insert "/" - menu will open anywhere
    editor.chain().focus().insertContent('/').run();
  }, [editor]);

  // Hide in clean mode (must be after all hooks)
  if (isCleanMode || !editor || !position) return null;

  return (
    <button
      onClick={handleClick}
      className="
        absolute
        w-6
        h-6
        flex
        items-center
        justify-center
        rounded
        bg-[#2d333b]
        hover:bg-[#373e47]
        border
        border-[#444c56]
        text-[#768390]
        hover:text-[#adbac7]
        transition-all
        cursor-pointer
        z-20
        shadow-sm
      "
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
      }}
      title="Добавить блок (меню команд)"
    >
      <Plus className="w-4 h-4" />
    </button>
  );
}

export default BlockHandle;
