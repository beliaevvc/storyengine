'use client';

import { useEffect, useCallback } from 'react';
import { detectEntitiesAtCursor, type DetectedEntity } from '@/core/use-cases/entity/detectEntitiesAtCursor';
import { useEntityStore, useEditorStore, useUIStore } from '@/presentation/stores';

/**
 * Hook for detecting entities at the current cursor position.
 * Automatically selects the entity in the UI when cursor is placed on an entity mark.
 */
export function useEntityDetection() {
  const editor = useEditorStore((s) => s.editor);
  const entities = useEntityStore((s) => s.entities);
  const setCursorPosition = useEditorStore((s) => s.actions.setCursorPosition);
  const selectEntity = useUIStore((s) => s.actions.selectEntity);

  const detectAtCursor = useCallback((): DetectedEntity[] => {
    if (!editor || entities.length === 0) return [];

    const detector = detectEntitiesAtCursor(editor, entities);
    return detector.execute();
  }, [editor, entities]);

  // Listen for selection changes in the editor
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      setCursorPosition({ from, to });

      // Auto-select entity at cursor position
      const detected = detectAtCursor();
      if (detected.length > 0) {
        // Select the first detected entity
        selectEntity(detected[0].entity.id);
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, detectAtCursor, setCursorPosition, selectEntity]);

  return { detectAtCursor };
}
