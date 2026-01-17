import type { Entity } from '@/core/entities/entity';
import type { Editor } from '@tiptap/core';

export interface DetectedEntity {
  entity: Entity;
  from: number;
  to: number;
  text: string;
}

/**
 * Detects entities at the current cursor position in the editor.
 * Looks for EntityMark marks at the cursor and returns matching entities.
 */
export const detectEntitiesAtCursor = (editor: Editor, entities: Entity[]) => ({
  execute(): DetectedEntity[] {
    const { from } = editor.state.selection;
    const detected: DetectedEntity[] = [];

    // Get the position resolver
    const $from = editor.state.doc.resolve(from);
    const marks = $from.marks();

    for (const mark of marks) {
      if (mark.type.name === 'entityMark') {
        const entityId = mark.attrs.entityId as string;
        const entity = entities.find((e) => e.id === entityId);

        if (entity) {
          // Find the extent of this mark by walking the document
          let markFrom = from;
          let markTo = from;

          // Walk backwards to find mark start
          for (let pos = from - 1; pos >= 0; pos--) {
            try {
              const $pos = editor.state.doc.resolve(pos);
              const hasEntityMark = $pos.marks().some(
                (m) => m.type.name === 'entityMark' && m.attrs.entityId === entityId
              );
              if (hasEntityMark) {
                markFrom = pos;
              } else {
                break;
              }
            } catch {
              break;
            }
          }

          // Walk forwards to find mark end
          const docSize = editor.state.doc.content.size;
          for (let pos = from + 1; pos <= docSize; pos++) {
            try {
              const $pos = editor.state.doc.resolve(pos);
              const hasEntityMark = $pos.marks().some(
                (m) => m.type.name === 'entityMark' && m.attrs.entityId === entityId
              );
              if (hasEntityMark) {
                markTo = pos;
              } else {
                break;
              }
            } catch {
              break;
            }
          }

          // Get the text content
          const text = editor.state.doc.textBetween(markFrom, markTo + 1, ' ');

          detected.push({
            entity,
            from: markFrom,
            to: markTo + 1,
            text: text.trim(),
          });
        }
      }
    }

    return detected;
  },
});
