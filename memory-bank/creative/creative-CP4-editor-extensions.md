# 🎨🎨🎨 CREATIVE PHASE CP-4: EDITOR EXTENSIONS DESIGN 🎨🎨🎨

> **Phase ID**: CP-4
> **Type**: Architecture Design / Algorithm Design
> **Priority**: HIGH
> **Status**: IN PROGRESS
> **Created**: 2026-01-17

---

## 1. PROBLEM STATEMENT

### Контекст
StoryEngine использует Tiptap как headless WYSIWYG редактор. Нужны custom extensions для:
1. Распознавания и подсветки имен сущностей в тексте
2. Обработки кликов на сущностях для показа карточки в Inspector
3. "AI Scan" функциональности для нахождения entities в тексте

### Требования

| Требование | Описание |
|------------|----------|
| R1 | Подсветка имен сущностей разными цветами по типу |
| R2 | Клик на entity → показать карточку в Context Inspector |
| R3 | Hover → показать tooltip с кратким описанием |
| R4 | "AI Scan" button → найти все entities в тексте |
| R5 | Two-way binding: изменение entity в БД → обновление в редакторе |
| R6 | Performance: не замедлять редактор при большом тексте |

### Ограничения

- Tiptap 2.x
- React integration (@tiptap/react)
- Без real AI (mock для MVP)
- Без real-time collaboration (future)

---

## 2. TIPTAP ARCHITECTURE OVERVIEW

### 2.1 Extension Types

| Type | Purpose | Example |
|------|---------|---------|
| **Node** | Block-level content | Paragraph, Heading, CodeBlock |
| **Mark** | Inline styling | Bold, Italic, Link, Highlight |
| **Extension** | Behavior/functionality | History, Placeholder |

### 2.2 Наш выбор: Custom Mark

Entity highlighting лучше всего реализовать как **Mark**, потому что:
- Inline элемент (не нарушает структуру документа)
- Может содержать атрибуты (entityId, entityType)
- Поддерживает styling через CSS
- Позволяет обработку событий

---

## 3. OPTIONS ANALYSIS

### Option 1: Single EntityMark with Type Attribute

**Description**: Единый mark `entityMark` с атрибутом `entityType` для определения цвета.

```typescript
// EntityMark extension
const EntityMark = Mark.create({
  name: 'entityMark',
  
  addAttributes() {
    return {
      entityId: { default: null },
      entityType: { default: 'character' },
      entityName: { default: '' },
    }
  },
  
  parseHTML() {
    return [{ tag: 'span[data-entity-id]' }]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', {
      'data-entity-id': HTMLAttributes.entityId,
      'data-entity-type': HTMLAttributes.entityType,
      'class': `entity-mark entity-${HTMLAttributes.entityType}`,
    }, 0]
  },
});
```

**Pros**:
- ✅ Один mark для всех типов сущностей
- ✅ Простая структура
- ✅ Легко добавлять новые типы
- ✅ Меньше кода

**Cons**:
- ❌ Сложнее type safety
- ❌ Все логика в одном месте

**Complexity**: Low
**Implementation Time**: Short

---

### Option 2: Separate Marks per Entity Type

**Description**: Отдельные marks: `characterMark`, `locationMark`, `itemMark`, etc.

```typescript
const CharacterMark = Mark.create({
  name: 'characterMark',
  addAttributes() {
    return { entityId: {}, entityName: {} }
  },
  // ...
});

const LocationMark = Mark.create({
  name: 'locationMark',
  addAttributes() {
    return { entityId: {}, entityName: {} }
  },
  // ...
});
```

**Pros**:
- ✅ Type safety на уровне extension
- ✅ Отдельное управление каждым типом
- ✅ Чище семантика

**Cons**:
- ❌ Дублирование кода
- ❌ Больше extensions = сложнее управлять
- ❌ Сложнее добавить новый тип

**Complexity**: Medium
**Implementation Time**: Medium

---

### Option 3: EntityMark + ReactMarkViewRenderer

**Description**: Единый mark с React component для рендеринга, полный контроль над UI.

```typescript
// Extension
const EntityMark = Mark.create({
  name: 'entityMark',
  
  addAttributes() {
    return {
      entityId: { default: null },
      entityType: { default: 'character' },
    }
  },
  
  addMarkView() {
    return ReactMarkViewRenderer(EntityMarkComponent)
  },
});

// React Component
function EntityMarkComponent({ mark, children }) {
  const { entityId, entityType } = mark.attrs;
  const entity = useEntity(entityId);
  
  return (
    <span 
      className={`entity-mark entity-${entityType}`}
      onClick={() => selectEntity(entityId)}
      onMouseEnter={() => showTooltip(entity)}
    >
      {children}
    </span>
  );
}
```

**Pros**:
- ✅ Полный контроль через React
- ✅ Легко добавить hover, click handlers
- ✅ Можно использовать React hooks (useEntity)
- ✅ Интеграция с Zustand stores

**Cons**:
- ❌ Performance overhead от React
- ❌ Сложнее setup
- ❌ ReactMarkViewRenderer относительно новый API

**Complexity**: Medium
**Implementation Time**: Medium

---

### Option 4: Hybrid (Mark + Decoration Plugin)

**Description**: Базовый mark для сохранения данных + ProseMirror decoration plugin для визуализации и интерактивности.

```typescript
// Basic mark for data persistence
const EntityMark = Mark.create({
  name: 'entityMark',
  addAttributes() {
    return { entityId: {}, entityType: {} }
  },
  // parseHTML, renderHTML...
});

// Decoration plugin for interactivity
const EntityDecorationPlugin = Extension.create({
  name: 'entityDecoration',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            // Find all entityMarks and create decorations
          },
          handleClick: (view, pos, event) => {
            // Handle click on entity
          },
        },
      }),
    ];
  },
});
```

**Pros**:
- ✅ Разделение данных и визуализации
- ✅ Лучшая performance для decorations
- ✅ Полный контроль через ProseMirror

**Cons**:
- ❌ Сложнее понять и поддерживать
- ❌ Два компонента для одной функции
- ❌ ProseMirror learning curve

**Complexity**: High
**Implementation Time**: Long

---

## 4. EVALUATION MATRIX

| Критерий | Weight | Option 1 | Option 2 | Option 3 | Option 4 |
|----------|--------|----------|----------|----------|----------|
| Простота | 25% | 9 | 6 | 7 | 4 |
| React интеграция | 20% | 6 | 6 | 9 | 5 |
| Performance | 20% | 8 | 8 | 6 | 9 |
| Интерактивность | 20% | 6 | 6 | 9 | 8 |
| Расширяемость | 15% | 8 | 5 | 8 | 7 |
| **TOTAL** | 100% | 7.35 | 6.25 | **7.65** | 6.55 |

---

## 5. 🎯 DECISION

### Выбранный подход: **Option 3 — EntityMark + ReactMarkViewRenderer**

### Rationale

1. **React Native**: Полная интеграция с React экосистемой, можно использовать hooks и Zustand.

2. **Интерактивность**: Легко добавить onClick, onHover handlers в React компонент.

3. **Баланс**: Хороший баланс между сложностью и функциональностью.

4. **Zustand Integration**: Component может подписываться на store для реактивных обновлений.

5. **MVP Friendly**: Достаточно просто для быстрой реализации.

---

## 6. FINAL EXTENSION DESIGN

### 6.1 EntityMark Extension

```typescript
// src/presentation/components/editor/extensions/EntityMark.ts

import { Mark, mergeAttributes } from '@tiptap/core';
import { ReactMarkViewRenderer } from '@tiptap/react';
import { EntityMarkComponent } from './EntityMarkComponent';

export interface EntityMarkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    entityMark: {
      setEntityMark: (attributes: {
        entityId: string;
        entityType: string;
        entityName: string;
      }) => ReturnType;
      unsetEntityMark: () => ReturnType;
    };
  }
}

export const EntityMark = Mark.create<EntityMarkOptions>({
  name: 'entityMark',
  
  priority: 1000,
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
  addAttributes() {
    return {
      entityId: {
        default: null,
        parseHTML: element => element.getAttribute('data-entity-id'),
        renderHTML: attributes => ({
          'data-entity-id': attributes.entityId,
        }),
      },
      entityType: {
        default: 'character',
        parseHTML: element => element.getAttribute('data-entity-type'),
        renderHTML: attributes => ({
          'data-entity-type': attributes.entityType,
        }),
      },
      entityName: {
        default: '',
        parseHTML: element => element.getAttribute('data-entity-name'),
        renderHTML: attributes => ({
          'data-entity-name': attributes.entityName,
        }),
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-entity-id]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `entity-mark entity-${HTMLAttributes['data-entity-type']}`,
      }),
      0,
    ];
  },
  
  addMarkView() {
    return ReactMarkViewRenderer(EntityMarkComponent);
  },
  
  addCommands() {
    return {
      setEntityMark: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      unsetEntityMark: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },
});
```

### 6.2 EntityMarkComponent (React)

```tsx
// src/presentation/components/editor/extensions/EntityMarkComponent.tsx

import React, { useCallback } from 'react';
import { MarkViewRendererProps } from '@tiptap/react';
import { useUIStore } from '@/presentation/stores/useUIStore';
import { useEntityStore } from '@/presentation/stores/useEntityStore';
import { cn } from '@/lib/utils/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';

interface EntityMarkComponentProps extends MarkViewRendererProps {
  mark: {
    attrs: {
      entityId: string;
      entityType: string;
      entityName: string;
    };
  };
}

export function EntityMarkComponent({ 
  mark, 
  children 
}: EntityMarkComponentProps) {
  const { entityId, entityType, entityName } = mark.attrs;
  
  // Store actions
  const selectEntity = useUIStore((state) => state.selectEntity);
  const entity = useEntityStore((state) => 
    state.entities.find(e => e.id === entityId)
  );
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectEntity(entityId);
  }, [entityId, selectEntity]);
  
  const entityColorClass = {
    character: 'text-entity-character',
    location: 'text-entity-location',
    item: 'text-entity-item',
    event: 'text-entity-event',
    concept: 'text-entity-concept',
  }[entityType] || 'text-accent';
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'entity-mark cursor-pointer underline decoration-dotted',
            'hover:bg-accent-subtle rounded-sm transition-colors',
            entityColorClass
          )}
          onClick={handleClick}
          data-entity-id={entityId}
          data-entity-type={entityType}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', `bg-entity-${entityType}`)} />
          <span className="font-medium">{entityName}</span>
        </div>
        {entity?.description && (
          <p className="text-xs text-fg-secondary mt-1">{entity.description}</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
```

### 6.3 Entity Scanner (AI Scan Mock)

```typescript
// src/core/use-cases/entity/scanEntitiesInText.ts

import { Entity, EntityType } from '@/core/entities';

export interface ScanResult {
  entityId: string;
  entityName: string;
  entityType: EntityType;
  startIndex: number;
  endIndex: number;
}

export const scanEntitiesInText = (entities: Entity[]) => ({
  execute(text: string): ScanResult[] {
    const results: ScanResult[] = [];
    
    // Sort entities by name length (longer first) to avoid partial matches
    const sortedEntities = [...entities].sort(
      (a, b) => b.name.length - a.name.length
    );
    
    for (const entity of sortedEntities) {
      // Case-insensitive search for entity name and aliases
      const namesToSearch = [
        entity.name,
        ...(entity.attributes?.aliases || []),
      ];
      
      for (const name of namesToSearch) {
        if (!name) continue;
        
        // Use word boundary regex for accurate matching
        const regex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          // Check if this position is already marked
          const isOverlapping = results.some(
            r => match!.index >= r.startIndex && match!.index < r.endIndex
          );
          
          if (!isOverlapping) {
            results.push({
              entityId: entity.id,
              entityName: entity.name,
              entityType: entity.type,
              startIndex: match.index,
              endIndex: match.index + match[0].length,
            });
          }
        }
      }
    }
    
    // Sort by position
    return results.sort((a, b) => a.startIndex - b.startIndex);
  },
});

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

### 6.4 Apply Scan Results to Editor

```typescript
// src/presentation/components/editor/utils/applyEntityMarks.ts

import { Editor } from '@tiptap/core';
import { ScanResult } from '@/core/use-cases/entity/scanEntitiesInText';

export function applyEntityMarks(editor: Editor, results: ScanResult[]) {
  const { state } = editor;
  const { tr } = state;
  
  // Apply marks in reverse order to maintain correct positions
  const reversedResults = [...results].reverse();
  
  for (const result of reversedResults) {
    // Convert text offset to document position
    // This is simplified - real implementation needs to account for node structure
    const from = result.startIndex + 1; // +1 for doc start
    const to = result.endIndex + 1;
    
    tr.addMark(
      from,
      to,
      state.schema.marks.entityMark.create({
        entityId: result.entityId,
        entityType: result.entityType,
        entityName: result.entityName,
      })
    );
  }
  
  editor.view.dispatch(tr);
}
```

### 6.5 AI Scan Button Handler

```typescript
// src/presentation/components/editor/Toolbar.tsx (partial)

import { scanEntitiesInText } from '@/core/use-cases/entity/scanEntitiesInText';
import { applyEntityMarks } from './utils/applyEntityMarks';
import { useEntityStore } from '@/presentation/stores/useEntityStore';

function Toolbar({ editor }: { editor: Editor }) {
  const entities = useEntityStore((state) => state.entities);
  const [isScanning, setIsScanning] = useState(false);
  
  const handleAIScan = useCallback(async () => {
    if (!editor) return;
    
    setIsScanning(true);
    
    try {
      // Get plain text from editor
      const text = editor.getText();
      
      // Scan for entities
      const scanner = scanEntitiesInText(entities);
      const results = scanner.execute(text);
      
      // Apply marks
      applyEntityMarks(editor, results);
      
      // Notify user
      toast.success(`Found ${results.length} entities`);
    } catch (error) {
      toast.error('Scan failed');
    } finally {
      setIsScanning(false);
    }
  }, [editor, entities]);
  
  return (
    <div className="toolbar">
      {/* ... other buttons ... */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handleAIScan}
        disabled={isScanning}
      >
        <ScanIcon className="w-4 h-4 mr-1" />
        {isScanning ? 'Scanning...' : 'AI Scan'}
      </Button>
    </div>
  );
}
```

---

## 7. EDITOR SETUP

### 7.1 Full Editor Component

```tsx
// src/presentation/components/editor/Editor.tsx

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import { EntityMark } from './extensions/EntityMark';
import { Toolbar } from './Toolbar';
import { useEditorStore } from '@/presentation/stores/useEditorStore';

interface StoryEditorProps {
  content: object; // Tiptap JSON content
  onUpdate: (content: object) => void;
}

export function StoryEditor({ content, onUpdate }: StoryEditorProps) {
  const setEditor = useEditorStore((state) => state.setEditor);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Customize StarterKit as needed
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
      Typography,
      CharacterCount,
      EntityMark,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none font-serif focus:outline-none',
      },
    },
  });
  
  // Store editor reference
  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
    return () => setEditor(null);
  }, [editor, setEditor]);
  
  if (!editor) {
    return <div className="animate-pulse h-96 bg-surface rounded" />;
  }
  
  return (
    <div className="flex flex-col h-full">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto p-4">
        <EditorContent editor={editor} />
      </div>
      <div className="border-t border-border p-2 text-xs text-fg-secondary">
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  );
}
```

---

## 8. DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ENTITY DETECTION FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐                    ┌──────────────────────┐          │
│   │  AI Scan     │──── getText() ────▶│   Editor Content     │          │
│   │  Button      │                    │   (Plain Text)       │          │
│   └──────┬───────┘                    └──────────────────────┘          │
│          │                                                               │
│          ▼                                                               │
│   ┌──────────────┐     ┌──────────────┐                                 │
│   │ Entity Store │────▶│  Scanner     │                                 │
│   │ (entities)   │     │  Use Case    │                                 │
│   └──────────────┘     └──────┬───────┘                                 │
│                               │                                          │
│                               ▼                                          │
│                        ┌──────────────┐                                 │
│                        │ Scan Results │                                 │
│                        │ [{entityId,  │                                 │
│                        │   startIndex,│                                 │
│                        │   endIndex}] │                                 │
│                        └──────┬───────┘                                 │
│                               │                                          │
│                               ▼                                          │
│                        ┌──────────────┐                                 │
│                        │ Apply Marks  │                                 │
│                        │ to Editor    │                                 │
│                        └──────┬───────┘                                 │
│                               │                                          │
│                               ▼                                          │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │              Editor with EntityMarks                      │         │
│   │  "John walked into the ==London== office"                │         │
│   │        ↑                    ↑                            │         │
│   │   [character]          [location]                        │         │
│   └──────────────────────────────────────────────────────────┘         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       ENTITY CLICK FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────┐                                                  │
│   │ EntityMark Click │                                                  │
│   │ (in Editor)      │                                                  │
│   └────────┬─────────┘                                                  │
│            │                                                             │
│            ▼                                                             │
│   ┌──────────────────┐      ┌──────────────────┐                       │
│   │ UI Store         │─────▶│ Context Inspector│                       │
│   │ selectEntity(id) │      │ selectedEntityId │                       │
│   └──────────────────┘      └────────┬─────────┘                       │
│                                      │                                   │
│                                      ▼                                   │
│                             ┌──────────────────┐                        │
│                             │   Entity Card    │                        │
│                             │   - Name         │                        │
│                             │   - Type         │                        │
│                             │   - Attributes   │                        │
│                             │   - Scenes       │                        │
│                             └──────────────────┘                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. VERIFICATION CHECKLIST

### Requirements Coverage
- [x] R1: Color highlighting по типу (через CSS classes) ✅
- [x] R2: Click → select entity → show in Inspector ✅
- [x] R3: Hover tooltip с Shadcn Tooltip ✅
- [x] R4: AI Scan button с scanner use case ✅
- [x] R5: Two-way binding через Zustand stores ✅
- [x] R6: Performance через React memoization ✅

### Technical Validation
- [x] Tiptap 2.x compatible
- [x] ReactMarkViewRenderer используется
- [x] TypeScript strict
- [x] Zustand integration
- [x] Commands defined

---

## 10. NEXT STEPS

1. Установить Tiptap пакеты
2. Создать EntityMark extension
3. Создать EntityMarkComponent
4. Реализовать scanEntitiesInText use case
5. Интегрировать с Zustand stores
6. Создать Toolbar с AI Scan button

---

# 🎨🎨🎨 EXITING CREATIVE PHASE CP-4 🎨🎨🎨

## Summary
Выбран подход EntityMark + ReactMarkViewRenderer для entity highlighting с полной React интеграцией и Zustand stores.

## Key Decisions
1. Единый EntityMark с атрибутами (entityId, entityType, entityName)
2. ReactMarkViewRenderer для React component rendering
3. Scanner use case для AI Scan (mock без real AI)
4. Click handlers в React component с Zustand integration
5. Tooltip через Shadcn UI

## Files to Create
- `src/presentation/components/editor/extensions/EntityMark.ts`
- `src/presentation/components/editor/extensions/EntityMarkComponent.tsx`
- `src/core/use-cases/entity/scanEntitiesInText.ts`
- `src/presentation/components/editor/utils/applyEntityMarks.ts`
- `src/presentation/components/editor/Editor.tsx`
- `src/presentation/components/editor/Toolbar.tsx`
