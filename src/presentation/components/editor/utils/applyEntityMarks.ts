import type { Editor } from '@tiptap/core';
import type { ScanResult } from '@/core/use-cases/entity/scanEntitiesInText';

/**
 * Apply entity marks to the editor based on scan results.
 *
 * This function:
 * 1. Clears existing entity marks from the document
 * 2. Applies new marks in reverse order to maintain correct positions
 *
 * @param editor - Tiptap editor instance
 * @param results - Array of scan results with entity positions
 */
export function applyEntityMarks(editor: Editor, results: ScanResult[]): void {
  const { tr } = editor.state;
  const entityMarkType = editor.schema.marks.entityMark;

  if (!entityMarkType) {
    console.warn('EntityMark extension not found in editor schema');
    return;
  }

  // Clear existing entity marks first
  const { doc } = editor.state;
  doc.descendants((node, pos) => {
    if (node.isText && node.marks.some((mark) => mark.type.name === 'entityMark')) {
      tr.removeMark(pos, pos + node.nodeSize, entityMarkType);
    }
  });

  // Apply new marks in reverse order to maintain positions
  // (applying from end to start prevents position shifts)
  const reversedResults = [...results].sort((a, b) => b.startIndex - a.startIndex);

  for (const result of reversedResults) {
    // +1 for doc offset (Tiptap adds 1 for the document node)
    const from = result.startIndex + 1;
    const to = result.endIndex + 1;

    // Validate positions are within document bounds
    if (from < 1 || to > doc.content.size + 1) {
      console.warn(`Invalid position for entity "${result.entityName}": ${from}-${to}`);
      continue;
    }

    tr.addMark(
      from,
      to,
      entityMarkType.create({
        entityId: result.entityId,
        entityType: result.entityType,
        entityName: result.entityName,
      })
    );
  }

  // Dispatch the transaction
  editor.view.dispatch(tr);
}

/**
 * Remove all entity marks from the editor.
 *
 * @param editor - Tiptap editor instance
 */
export function clearEntityMarks(editor: Editor): void {
  const { tr } = editor.state;
  const entityMarkType = editor.schema.marks.entityMark;

  if (!entityMarkType) {
    return;
  }

  const { doc } = editor.state;
  doc.descendants((node, pos) => {
    if (node.isText && node.marks.some((mark) => mark.type.name === 'entityMark')) {
      tr.removeMark(pos, pos + node.nodeSize, entityMarkType);
    }
  });

  editor.view.dispatch(tr);
}
