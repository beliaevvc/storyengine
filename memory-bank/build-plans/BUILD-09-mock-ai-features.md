# BUILD-09: Mock AI Features Plan

> **Plan ID**: BUILD-09
> **Component**: Mock AI Features
> **Dependencies**: CP-4, CP-5, BUILD-06, BUILD-08
> **Priority**: MEDIUM
> **Estimated Effort**: Phase 8 of Implementation

---

## 1. OBJECTIVE

Реализовать mock AI функциональность: Entity Scanner, AI Scan button, Two-way binding между текстом и database.

---

## 2. FILES TO CREATE/MODIFY

```
src/
├── core/use-cases/entity/
│   ├── scanEntitiesInText.ts       # Entity scanner (already in BUILD-06)
│   └── detectEntitiesAtCursor.ts   # Detect entities at cursor position
├── presentation/
│   ├── hooks/
│   │   ├── useEntityScanner.ts     # Hook for scanning
│   │   ├── useEntityDetection.ts   # Hook for cursor detection
│   │   └── useTwoWayBinding.ts     # Hook for entity ↔ text sync
│   └── components/editor/
│       └── EntityHighlighter.tsx   # Real-time highlighting
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Create Cursor Detection Use Case

**File**: `src/core/use-cases/entity/detectEntitiesAtCursor.ts`

```typescript
import { Entity } from '@/core/entities/entity';
import { Editor } from '@tiptap/core';

export interface DetectedEntity {
  entity: Entity;
  from: number;
  to: number;
  text: string;
}

export const detectEntitiesAtCursor = (editor: Editor, entities: Entity[]) => ({
  execute(): DetectedEntity[] {
    const { from, to } = editor.state.selection;
    const detected: DetectedEntity[] = [];

    // Get marks at cursor position
    const $from = editor.state.doc.resolve(from);
    const marks = $from.marks();

    for (const mark of marks) {
      if (mark.type.name === 'entityMark') {
        const entityId = mark.attrs.entityId;
        const entity = entities.find((e) => e.id === entityId);
        
        if (entity) {
          // Find the extent of this mark
          let markFrom = from;
          let markTo = to;

          // Walk backwards to find mark start
          editor.state.doc.nodesBetween(0, from, (node, pos) => {
            if (node.marks.some((m) => m.attrs.entityId === entityId)) {
              markFrom = pos;
            }
          });

          // Walk forwards to find mark end
          editor.state.doc.nodesBetween(from, editor.state.doc.content.size, (node, pos) => {
            if (node.marks.some((m) => m.attrs.entityId === entityId)) {
              markTo = pos + node.nodeSize;
            }
          });

          detected.push({
            entity,
            from: markFrom,
            to: markTo,
            text: editor.state.doc.textBetween(markFrom, markTo),
          });
        }
      }
    }

    return detected;
  },
});
```

### Step 2: Create Entity Scanner Hook

**File**: `src/presentation/hooks/useEntityScanner.ts`

```typescript
'use client';

import { useCallback, useState } from 'react';
import { scanEntitiesInText, ScanResult } from '@/core/use-cases/entity/scanEntitiesInText';
import { applyEntityMarks } from '@/presentation/components/editor/utils';
import { useEntityStore, useEditorStore } from '@/presentation/stores';

interface UseScannerResult {
  isScanning: boolean;
  lastScanResults: ScanResult[];
  scan: () => Promise<ScanResult[]>;
  clearMarks: () => void;
}

export function useEntityScanner(): UseScannerResult {
  const entities = useEntityStore((s) => s.entities);
  const editor = useEditorStore((s) => s.editor);
  const setActiveEntityIds = useEditorStore((s) => s.actions.setActiveEntityIds);

  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResults, setLastScanResults] = useState<ScanResult[]>([]);

  const scan = useCallback(async () => {
    if (!editor) return [];

    setIsScanning(true);

    try {
      // Simulate async operation (for future real AI)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const text = editor.getText();
      const scanner = scanEntitiesInText(entities);
      const results = scanner.execute(text);

      // Apply marks to editor
      applyEntityMarks(editor, results);

      // Update active entities
      const uniqueEntityIds = [...new Set(results.map((r) => r.entityId))];
      setActiveEntityIds(uniqueEntityIds);

      setLastScanResults(results);
      return results;
    } finally {
      setIsScanning(false);
    }
  }, [editor, entities, setActiveEntityIds]);

  const clearMarks = useCallback(() => {
    if (!editor) return;

    const { tr } = editor.state;
    editor.state.doc.descendants((node, pos) => {
      if (node.marks.some((mark) => mark.type.name === 'entityMark')) {
        tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.entityMark);
      }
    });
    editor.view.dispatch(tr);
    setActiveEntityIds([]);
    setLastScanResults([]);
  }, [editor, setActiveEntityIds]);

  return { isScanning, lastScanResults, scan, clearMarks };
}
```

### Step 3: Create Entity Detection Hook

**File**: `src/presentation/hooks/useEntityDetection.ts`

```typescript
'use client';

import { useEffect, useCallback } from 'react';
import { detectEntitiesAtCursor, DetectedEntity } from '@/core/use-cases/entity/detectEntitiesAtCursor';
import { useEntityStore, useEditorStore, useUIStore } from '@/presentation/stores';

export function useEntityDetection() {
  const editor = useEditorStore((s) => s.editor);
  const entities = useEntityStore((s) => s.entities);
  const setCursorPosition = useEditorStore((s) => s.actions.setCursorPosition);
  const selectEntity = useUIStore((s) => s.actions.selectEntity);

  const detectAtCursor = useCallback((): DetectedEntity[] => {
    if (!editor) return [];
    
    const detector = detectEntitiesAtCursor(editor, entities);
    return detector.execute();
  }, [editor, entities]);

  // Listen for selection changes
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      setCursorPosition({ from, to });

      // Auto-select entity at cursor
      const detected = detectAtCursor();
      if (detected.length > 0) {
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
```

### Step 4: Create Two-Way Binding Hook

**File**: `src/presentation/hooks/useTwoWayBinding.ts`

```typescript
'use client';

import { useEffect, useCallback } from 'react';
import { Entity } from '@/core/entities/entity';
import { useEntityStore, useEditorStore } from '@/presentation/stores';

/**
 * Two-way binding between entity data and editor marks.
 * When an entity is updated in the store, update the marks in the editor.
 */
export function useTwoWayBinding() {
  const editor = useEditorStore((s) => s.editor);
  const entities = useEntityStore((s) => s.entities);

  // Update marks when entity name changes
  const updateEntityInEditor = useCallback(
    (entityId: string, newName: string) => {
      if (!editor) return;

      const { tr } = editor.state;
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
            editor.schema.marks.entityMark.create({
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

  // Find all occurrences of an entity in the editor
  const findEntityOccurrences = useCallback(
    (entityId: string): { from: number; to: number; text: string }[] => {
      if (!editor) return [];

      const occurrences: { from: number; to: number; text: string }[] = [];

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

  // Navigate to entity occurrence
  const navigateToEntity = useCallback(
    (entityId: string) => {
      if (!editor) return;

      const occurrences = findEntityOccurrences(entityId);
      if (occurrences.length > 0) {
        const { from } = occurrences[0];
        editor.chain().focus().setTextSelection(from).run();
      }
    },
    [editor, findEntityOccurrences]
  );

  return {
    updateEntityInEditor,
    findEntityOccurrences,
    navigateToEntity,
  };
}
```

### Step 5: Create Hooks Index

**File**: `src/presentation/hooks/index.ts`

```typescript
export { useEntityScanner } from './useEntityScanner';
export { useEntityDetection } from './useEntityDetection';
export { useTwoWayBinding } from './useTwoWayBinding';
```

### Step 6: Update EntityListItem for Navigation

**File**: `src/presentation/components/explorer/EntityListItem.tsx` (update)

Add double-click to navigate:

```typescript
'use client';

import { Entity, EntityType } from '@/core/entities';
import { useTwoWayBinding } from '@/presentation/hooks';
import { cn } from '@/lib/utils';

interface EntityListItemProps {
  entity: Entity;
  isSelected: boolean;
  onSelect: () => void;
}

const entityColorMap: Record<EntityType, string> = {
  CHARACTER: 'entity-dot-character',
  LOCATION: 'entity-dot-location',
  ITEM: 'entity-dot-item',
  EVENT: 'entity-dot-event',
  CONCEPT: 'entity-dot-concept',
};

export function EntityListItem({ entity, isSelected, onSelect }: EntityListItemProps) {
  const { navigateToEntity } = useTwoWayBinding();

  const handleDoubleClick = () => {
    navigateToEntity(entity.id);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm',
        'hover:bg-overlay transition-colors',
        isSelected && 'bg-accent-subtle'
      )}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
    >
      <span className={cn('entity-dot', entityColorMap[entity.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{entity.name}</p>
        {entity.description && (
          <p className="text-xs text-fg-muted truncate">{entity.description}</p>
        )}
      </div>
    </div>
  );
}
```

### Step 7: Integrate Detection into Editor

**File**: Update `src/presentation/components/editor/Editor.tsx`

Add detection hook:

```typescript
// Add to Editor.tsx imports
import { useEntityDetection } from '@/presentation/hooks';

// Inside StoryEditor component
export function StoryEditor({ ... }) {
  // ... existing code ...
  
  // Add detection
  useEntityDetection();
  
  // ... rest of component
}
```

---

## 4. FEATURE SUMMARY

### Entity Scanning (AI Scan)
- Scans full document text
- Matches entity names and aliases
- Applies EntityMark to all occurrences
- Updates activeEntityIds in EditorStore

### Cursor Detection
- Listens for selection changes
- Detects entities at cursor position
- Auto-selects entity in UIStore
- Shows entity card in Inspector

### Two-Way Binding
- Entity name change → updates marks
- Double-click entity → navigates to first occurrence
- Find all occurrences of entity

---

## 5. SUCCESS CRITERIA

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | AI Scan works | Button scans and marks entities |
| 2 | Cursor detection | Clicking on entity selects it |
| 3 | Auto-select in Inspector | Entity card shows on cursor |
| 4 | Navigate to entity | Double-click jumps to text |
| 5 | Find occurrences | Hook returns all positions |
| 6 | Active entities track | EditorStore tracks visible entities |
| 7 | Clear marks | Can remove all entity marks |
| 8 | Hooks export | All hooks importable |

---

## 6. COMMANDS TO EXECUTE

```bash
# Create directories
mkdir -p src/presentation/hooks
```

---

## 7. FUTURE ENHANCEMENTS (Post-MVP)

1. **Real AI Integration**
   - Replace mock scanner with LLM-based detection
   - Context-aware entity recognition
   - Relationship extraction

2. **Real-time Scanning**
   - Debounced scanning on content change
   - Incremental updates

3. **Entity Suggestions**
   - AI suggests new entities from text
   - Auto-create entities from mentions

4. **Conflict Resolution**
   - Handle entity name changes
   - Merge duplicate entities

---

## 8. NOTES

- All AI features are mocked for MVP
- Scanner uses simple regex matching
- No real LLM integration yet
- Two-way binding is one-directional for MVP (DB → Text only)
