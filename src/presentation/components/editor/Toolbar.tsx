'use client';

import { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import {
  Undo,
  Redo,
  ScanSearch,
  Loader2,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { ToolbarButton } from './ToolbarButton';
import { useEntityScanner } from '@/presentation/hooks';
import { useEntityStore, useEditorStore } from '@/presentation/stores';
import type { ViewMode } from '@/presentation/stores/useEditorStore';
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
  const viewMode = useEditorStore((s) => s.viewMode);
  const setViewMode = useEditorStore((s) => s.actions.setViewMode);
  const { isScanning, scan } = useEntityScanner();

  const handleAIScan = async () => {
    const results = await scan();
    console.log('[Toolbar] AI Scan found:', results.length, 'matches');
  };

  // Handle mode switch
  const handleModeSwitch = useCallback((mode: ViewMode) => {
    if (!editor) {
      setViewMode(mode);
      return;
    }
    
    if (mode === 'syntax') {
      // Convert empty blocks with text to unmarked
      const { doc } = editor.state;
      const positions: number[] = [];
      
      doc.descendants((node, pos) => {
        if (node.type.name === 'semanticBlock' && 
            node.attrs.blockType === 'empty' && 
            node.textContent.trim()) {
          positions.push(pos);
        }
        return true;
      });
      
      if (positions.length > 0) {
        console.log('[Toolbar] Converting', positions.length, 'empty blocks to unmarked');
        editor.chain().focus().command(({ tr, dispatch }) => {
          if (dispatch) {
            positions.reverse().forEach((pos) => {
              const node = tr.doc.nodeAt(pos);
              if (node) {
                tr.setNodeMarkup(pos, undefined, { 
                  ...node.attrs, 
                  blockType: 'unmarked' 
                });
              }
            });
          }
          return true;
        }).run();
      }
    } else if (mode === 'clean') {
      // Check if last block is already unmarked - if not, add one
      const { doc } = editor.state;
      let lastSceneEnd = -1;
      let lastBlockType: string | null = null;
      
      doc.descendants((node, pos) => {
        if (node.type.name === 'scene') {
          lastSceneEnd = pos + node.nodeSize - 1;
          // Find the last semantic block in this scene
          node.descendants((child) => {
            if (child.type.name === 'semanticBlock') {
              lastBlockType = child.attrs.blockType;
            }
            return true;
          });
        }
        return true;
      });
      
      console.log('[Toolbar] Last block type:', lastBlockType);
      
      // Only add unmarked block if last block is NOT unmarked
      if (lastSceneEnd > 0 && lastBlockType !== 'unmarked') {
        console.log('[Toolbar] Adding unmarked block at end of scene');
        editor.chain().focus().insertContentAt(lastSceneEnd, {
          type: 'semanticBlock',
          attrs: { blockType: 'unmarked' },
          content: [{ type: 'paragraph' }],
        }).run();
      }
      
      // Move cursor to the end
      setTimeout(() => {
        editor.commands.focus('end');
      }, 10);
    }
    
    setViewMode(mode);
  }, [setViewMode, editor]);

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
        label="Отменить (⌘Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <ToolbarButton
        icon={Redo}
        label="Повторить (⌘⇧Z)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
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

      {/* View Mode Toggle */}
      <div className="flex items-center bg-[#282c34] rounded-lg border border-[#3a3f4b] overflow-hidden ml-2">
        <button
          onClick={() => handleModeSwitch('syntax')}
          className={cn(
            'px-3 py-1.5 text-xs transition-colors',
            viewMode === 'syntax'
              ? 'bg-[#3a3f4b] text-white'
              : 'text-[#6e7681] hover:text-[#c9d1d9] hover:bg-[#21252b]'
          )}
        >
          Синтаксис
        </button>
        <button
          onClick={() => handleModeSwitch('clean')}
          className={cn(
            'px-3 py-1.5 text-xs transition-colors',
            viewMode === 'clean'
              ? 'bg-[#3a3f4b] text-white'
              : 'text-[#6e7681] hover:text-[#c9d1d9] hover:bg-[#21252b]'
          )}
        >
          Чистый
        </button>
      </div>
    </div>
  );
}
