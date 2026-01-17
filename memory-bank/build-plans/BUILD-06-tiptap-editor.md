# BUILD-06: Tiptap Editor Plan

> **Plan ID**: BUILD-06
> **Component**: Editor Integration
> **Dependencies**: CP-4, BUILD-02, BUILD-03
> **Priority**: HIGH
> **Estimated Effort**: Phase 5 of Implementation

---

## 1. OBJECTIVE

Интегрировать Tiptap редактор с custom EntityMark extension, toolbar и breadcrumbs согласно CP-4.

---

## 2. FILES TO CREATE

```
src/presentation/components/
├── editor/
│   ├── Editor.tsx                    # Main editor component
│   ├── EditorContent.tsx             # Tiptap EditorContent wrapper
│   ├── Toolbar.tsx                   # Editor toolbar
│   ├── ToolbarButton.tsx             # Reusable toolbar button
│   ├── Breadcrumbs.tsx               # Document breadcrumbs
│   ├── StatusBar.tsx                 # Word/character count
│   ├── extensions/
│   │   ├── EntityMark.ts             # Custom entity mark
│   │   ├── EntityMarkComponent.tsx   # React component for mark
│   │   └── index.ts
│   ├── utils/
│   │   ├── applyEntityMarks.ts       # Apply marks after scan
│   │   └── index.ts
│   └── index.ts
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Install Tiptap Dependencies

```bash
npm install @tiptap/react @tiptap/pm @tiptap/core
npm install @tiptap/starter-kit
npm install @tiptap/extension-placeholder
npm install @tiptap/extension-typography
npm install @tiptap/extension-character-count
```

### Step 2: Create EntityMark Extension

**File**: `src/presentation/components/editor/extensions/EntityMark.ts`

```typescript
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
        parseHTML: (el) => el.getAttribute('data-entity-id'),
        renderHTML: (attrs) => ({ 'data-entity-id': attrs.entityId }),
      },
      entityType: {
        default: 'CHARACTER',
        parseHTML: (el) => el.getAttribute('data-entity-type'),
        renderHTML: (attrs) => ({ 'data-entity-type': attrs.entityType }),
      },
      entityName: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-entity-name'),
        renderHTML: (attrs) => ({ 'data-entity-name': attrs.entityName }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-entity-id]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `entity-mark entity-${HTMLAttributes['data-entity-type']?.toLowerCase()}`,
      }),
      0,
    ];
  },

  addMarkView() {
    return ReactMarkViewRenderer(EntityMarkComponent);
  },

  addCommands() {
    return {
      setEntityMark:
        (attributes) =>
        ({ commands }) =>
          commands.setMark(this.name, attributes),
      unsetEntityMark:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
```

**File**: `src/presentation/components/editor/extensions/EntityMarkComponent.tsx`

```typescript
'use client';

import { useCallback } from 'react';
import { MarkViewRendererProps } from '@tiptap/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui';
import { useUIStore, useEntityStore } from '@/presentation/stores';
import { cn } from '@/lib/utils';
import { EntityType } from '@/core/entities';

interface EntityMarkAttrs {
  entityId: string;
  entityType: string;
  entityName: string;
}

export function EntityMarkComponent({
  mark,
  children,
}: MarkViewRendererProps & { mark: { attrs: EntityMarkAttrs } }) {
  const { entityId, entityType, entityName } = mark.attrs;

  const selectEntity = useUIStore((s) => s.actions.selectEntity);
  const entity = useEntityStore((s) =>
    s.entities.find((e) => e.id === entityId)
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      selectEntity(entityId);
    },
    [entityId, selectEntity]
  );

  const colorClass = {
    CHARACTER: 'text-entity-character',
    LOCATION: 'text-entity-location',
    ITEM: 'text-entity-item',
    EVENT: 'text-entity-event',
    CONCEPT: 'text-entity-concept',
  }[entityType as EntityType] || 'text-accent';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'cursor-pointer underline decoration-dotted underline-offset-2',
            'hover:bg-accent-subtle rounded-sm px-0.5 transition-colors',
            colorClass
          )}
          onClick={handleClick}
          data-entity-id={entityId}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', `bg-entity-${entityType.toLowerCase()}`)} />
          <span className="font-medium">{entityName}</span>
        </div>
        {entity?.description && (
          <p className="text-xs text-fg-secondary mt-1 line-clamp-2">
            {entity.description}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
```

**File**: `src/presentation/components/editor/extensions/index.ts`

```typescript
export { EntityMark } from './EntityMark';
export { EntityMarkComponent } from './EntityMarkComponent';
```

### Step 3: Create Utility Functions

**File**: `src/presentation/components/editor/utils/applyEntityMarks.ts`

```typescript
import { Editor } from '@tiptap/core';
import { ScanResult } from '@/core/use-cases/entity/scanEntitiesInText';

export function applyEntityMarks(editor: Editor, results: ScanResult[]) {
  const { tr } = editor.state;

  // Clear existing entity marks first
  const { doc } = editor.state;
  doc.descendants((node, pos) => {
    if (node.marks.some((mark) => mark.type.name === 'entityMark')) {
      tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.entityMark);
    }
  });

  // Apply new marks in reverse order to maintain positions
  const reversed = [...results].reverse();

  for (const result of reversed) {
    // +1 for doc offset
    const from = result.startIndex + 1;
    const to = result.endIndex + 1;

    tr.addMark(
      from,
      to,
      editor.schema.marks.entityMark.create({
        entityId: result.entityId,
        entityType: result.entityType,
        entityName: result.entityName,
      })
    );
  }

  editor.view.dispatch(tr);
}
```

**File**: `src/presentation/components/editor/utils/index.ts`

```typescript
export { applyEntityMarks } from './applyEntityMarks';
```

### Step 4: Create Editor Components

**File**: `src/presentation/components/editor/ToolbarButton.tsx`

```typescript
import { LucideIcon } from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ToolbarButton({
  icon: Icon,
  label,
  isActive,
  disabled,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', isActive && 'bg-accent-subtle text-accent')}
          disabled={disabled}
          onClick={onClick}
        >
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
```

**File**: `src/presentation/components/editor/Toolbar.tsx`

```typescript
'use client';

import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/core';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ScanSearch,
  Loader2,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { ToolbarButton } from './ToolbarButton';
import { applyEntityMarks } from './utils';
import { scanEntitiesInText } from '@/core/use-cases/entity/scanEntitiesInText';
import { useEntityStore } from '@/presentation/stores';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  editor: Editor | null;
  className?: string;
}

export function Toolbar({ editor, className }: ToolbarProps) {
  const entities = useEntityStore((s) => s.entities);
  const [isScanning, setIsScanning] = useState(false);

  const handleAIScan = useCallback(async () => {
    if (!editor) return;

    setIsScanning(true);

    try {
      const text = editor.getText();
      const scanner = scanEntitiesInText(entities);
      const results = scanner.execute(text);
      applyEntityMarks(editor, results);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  }, [editor, entities]);

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
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <ToolbarButton
        icon={Redo}
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />

      <div className="w-px h-5 bg-border mx-1" />

      {/* Headings */}
      <ToolbarButton
        icon={Heading1}
        label="Heading 1"
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        icon={Heading2}
        label="Heading 2"
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={Heading3}
        label="Heading 3"
        isActive={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <div className="w-px h-5 bg-border mx-1" />

      {/* Formatting */}
      <ToolbarButton
        icon={Bold}
        label="Bold"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Strikethrough}
        label="Strikethrough"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <div className="w-px h-5 bg-border mx-1" />

      {/* Lists */}
      <ToolbarButton
        icon={List}
        label="Bullet List"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="Numbered List"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={Quote}
        label="Quote"
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <div className="flex-1" />

      {/* AI Scan */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handleAIScan}
        disabled={isScanning}
        className="gap-1.5"
      >
        {isScanning ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ScanSearch className="w-4 h-4" />
        )}
        AI Scan
      </Button>
    </div>
  );
}
```

**File**: `src/presentation/components/editor/Breadcrumbs.tsx`

```typescript
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
  projectName?: string;
  documentName?: string;
  className?: string;
}

export function Breadcrumbs({ projectName, documentName, className }: BreadcrumbsProps) {
  return (
    <div
      className={cn(
        'h-8 bg-surface border-b border-border px-4 flex items-center gap-1.5 text-sm',
        className
      )}
    >
      <Home className="w-3.5 h-3.5 text-fg-muted" />
      {projectName && (
        <>
          <ChevronRight className="w-3 h-3 text-fg-muted" />
          <span className="text-fg-secondary hover:text-fg cursor-pointer">
            {projectName}
          </span>
        </>
      )}
      {documentName && (
        <>
          <ChevronRight className="w-3 h-3 text-fg-muted" />
          <span className="text-fg">{documentName}</span>
        </>
      )}
    </div>
  );
}
```

**File**: `src/presentation/components/editor/StatusBar.tsx`

```typescript
import { cn } from '@/lib/utils';

interface StatusBarProps {
  wordCount: number;
  characterCount: number;
  className?: string;
}

export function StatusBar({ wordCount, characterCount, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        'h-6 bg-surface border-t border-border px-4 flex items-center justify-end gap-4 text-xs text-fg-muted',
        className
      )}
    >
      <span>{wordCount} words</span>
      <span>{characterCount} characters</span>
    </div>
  );
}
```

**File**: `src/presentation/components/editor/Editor.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import { EntityMark } from './extensions';
import { Toolbar } from './Toolbar';
import { Breadcrumbs } from './Breadcrumbs';
import { StatusBar } from './StatusBar';
import { useEditorStore } from '@/presentation/stores';
import { cn } from '@/lib/utils';

interface StoryEditorProps {
  projectName?: string;
  documentName?: string;
  content?: object;
  onUpdate?: (content: object) => void;
  className?: string;
}

export function StoryEditor({
  projectName,
  documentName,
  content,
  onUpdate,
  className,
}: StoryEditorProps) {
  const setEditor = useEditorStore((s) => s.actions.setEditor);
  const updateCounts = useEditorStore((s) => s.actions.updateCounts);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
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
      onUpdate?.(editor.getJSON());
      updateCounts(
        editor.storage.characterCount.words(),
        editor.storage.characterCount.characters()
      );
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert max-w-none',
          'prose-headings:font-serif prose-headings:text-fg',
          'prose-p:font-serif prose-p:text-fg prose-p:leading-relaxed',
          'prose-strong:text-fg prose-em:text-fg',
          'focus:outline-none min-h-full'
        ),
      },
    },
  });

  useEffect(() => {
    if (editor) {
      setEditor(editor);
      updateCounts(
        editor.storage.characterCount?.words() || 0,
        editor.storage.characterCount?.characters() || 0
      );
    }
    return () => setEditor(null);
  }, [editor, setEditor, updateCounts]);

  const wordCount = useEditorStore((s) => s.wordCount);
  const characterCount = useEditorStore((s) => s.characterCount);

  return (
    <div className={cn('h-full flex flex-col bg-canvas', className)}>
      <Breadcrumbs projectName={projectName} documentName={documentName} />
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
      <StatusBar wordCount={wordCount} characterCount={characterCount} />
    </div>
  );
}
```

**File**: `src/presentation/components/editor/index.ts`

```typescript
export { StoryEditor } from './Editor';
export { Toolbar } from './Toolbar';
export { Breadcrumbs } from './Breadcrumbs';
export { StatusBar } from './StatusBar';
export { EntityMark, EntityMarkComponent } from './extensions';
```

---

## 4. EDITOR STYLES

Add to `globals.css`:

```css
/* Editor entity mark styles */
.entity-mark {
  @apply cursor-pointer;
}

.entity-character {
  @apply text-entity-character;
}

.entity-location {
  @apply text-entity-location;
}

.entity-item {
  @apply text-entity-item;
}

.entity-event {
  @apply text-entity-event;
}

.entity-concept {
  @apply text-entity-concept;
}

/* Tiptap specific styles */
.ProseMirror {
  @apply outline-none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  @apply text-fg-muted pointer-events-none float-left h-0;
  content: attr(data-placeholder);
}
```

---

## 5. SUCCESS CRITERIA

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Editor renders | EditorContent visible |
| 2 | Formatting works | Bold, italic, headings function |
| 3 | Placeholder shows | Empty editor shows placeholder |
| 4 | Word count updates | StatusBar reflects content |
| 5 | AI Scan finds entities | Marks applied after scan |
| 6 | Entity click selects | Click updates UIStore |
| 7 | Tooltip shows | Hover on entity shows info |
| 8 | Breadcrumbs render | Path displayed correctly |

---

## 6. COMMANDS TO EXECUTE

```bash
# Install Tiptap
npm install @tiptap/react @tiptap/pm @tiptap/core
npm install @tiptap/starter-kit @tiptap/extension-placeholder
npm install @tiptap/extension-typography @tiptap/extension-character-count

# Create directories
mkdir -p src/presentation/components/editor/extensions
mkdir -p src/presentation/components/editor/utils
```

---

## 7. NOTES

- EntityMark requires ReactMarkViewRenderer from @tiptap/react
- AI Scan is synchronous (mock, no real AI)
- Editor state stored in EditorStore
- Content format is Tiptap JSON
