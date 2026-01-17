'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/presentation/stores';

interface EntityOccurrence {
  from: number;
  to: number;
  text: string;
}

/**
 * Hook for two-way binding between entity data and editor marks.
 * Provides navigation and synchronization utilities.
 */
export function useTwoWayBinding() {
  const editor = useEditorStore((s) => s.editor);

  /**
   * Update mark attributes when an entity's name changes.
   */
  const updateEntityInEditor = useCallback(
    (entityId: string, newName: string) => {
      if (!editor) return;

      const { tr } = editor.state;
      const entityMarkType = editor.schema.marks.entityMark;

      if (!entityMarkType) return;

      let hasChanges = false;

      editor.state.doc.descendants((node, pos) => {
        const entityMark = node.marks.find(
          (m) => m.type.name === 'entityMark' && m.attrs.entityId === entityId
        );

        if (entityMark) {
          // Update the mark attributes
          tr.removeMark(pos, pos + node.nodeSize, entityMark);
          tr.addMark(
            pos,
            pos + node.nodeSize,
            entityMarkType.create({
              ...entityMark.attrs,
              entityName: newName,
            })
          );
          hasChanges = true;
        }
      });

      if (hasChanges) {
        editor.view.dispatch(tr);
      }
    },
    [editor]
  );

  /**
   * Find all occurrences of an entity in the editor.
   */
  const findEntityOccurrences = useCallback(
    (entityId: string): EntityOccurrence[] => {
      if (!editor) return [];

      const occurrences: EntityOccurrence[] = [];

      editor.state.doc.descendants((node, pos) => {
        const entityMark = node.marks.find(
          (m) => m.type.name === 'entityMark' && m.attrs.entityId === entityId
        );

        if (entityMark && node.isText) {
          occurrences.push({
            from: pos,
            to: pos + node.nodeSize,
            text: node.text || '',
          });
        }
      });

      return occurrences;
    },
    [editor]
  );

  /**
   * Navigate to the first occurrence of an entity in the editor.
   */
  const navigateToEntity = useCallback(
    (entityId: string) => {
      if (!editor) return false;

      const occurrences = findEntityOccurrences(entityId);
      if (occurrences.length > 0) {
        const { from } = occurrences[0];
        editor.chain().focus().setTextSelection(from).run();
        return true;
      }
      return false;
    },
    [editor, findEntityOccurrences]
  );

  /**
   * Navigate to a specific occurrence index.
   */
  const navigateToOccurrence = useCallback(
    (entityId: string, index: number) => {
      if (!editor) return false;

      const occurrences = findEntityOccurrences(entityId);
      if (index >= 0 && index < occurrences.length) {
        const { from } = occurrences[index];
        editor.chain().focus().setTextSelection(from).run();
        return true;
      }
      return false;
    },
    [editor, findEntityOccurrences]
  );

  /**
   * Get the count of entity occurrences in the document.
   */
  const getOccurrenceCount = useCallback(
    (entityId: string): number => {
      return findEntityOccurrences(entityId).length;
    },
    [findEntityOccurrences]
  );

  return {
    updateEntityInEditor,
    findEntityOccurrences,
    navigateToEntity,
    navigateToOccurrence,
    getOccurrenceCount,
  };
}
