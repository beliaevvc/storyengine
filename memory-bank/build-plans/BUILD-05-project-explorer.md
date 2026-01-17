# BUILD-05: Project Explorer Plan

> **Plan ID**: BUILD-05
> **Component**: Project Explorer (Left Panel)
> **Dependencies**: BUILD-02, BUILD-03, BUILD-04
> **Priority**: MEDIUM
> **Estimated Effort**: Phase 4 of Implementation

---

## 1. OBJECTIVE

Создать левую панель Project Explorer с деревом файлов (Documents/Scenes) и вкладкой Database (Entities list) с фильтрацией.

---

## 2. FILES TO CREATE

```
src/presentation/components/
├── explorer/
│   ├── ProjectExplorer.tsx        # Main component with tabs
│   ├── FilesTab.tsx               # Files/Documents tree tab
│   ├── DatabaseTab.tsx            # Entities list tab
│   ├── FileTree.tsx               # Tree view component
│   ├── FileTreeItem.tsx           # Individual tree item
│   ├── EntityList.tsx             # Filtered entity list
│   ├── EntityListItem.tsx         # Individual entity item
│   ├── EntityTypeFilter.tsx       # Filter by entity type
│   ├── SearchInput.tsx            # Search input component
│   └── index.ts
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Install Additional Dependencies

```bash
npm install @radix-ui/react-tabs
npm install @radix-ui/react-collapsible
```

### Step 2: Create Tabs Component (if not exists)

**File**: `src/presentation/components/ui/tabs.tsx`

```typescript
'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-9 items-center justify-start gap-1 bg-surface px-1 border-b border-border w-full',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-xs font-medium',
      'text-fg-secondary hover:text-fg transition-colors',
      'data-[state=active]:text-fg data-[state=active]:border-b-2 data-[state=active]:border-accent',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('flex-1 overflow-hidden', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

### Step 3: Create Explorer Components

**File**: `src/presentation/components/explorer/SearchInput.tsx`

```typescript
'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-muted" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-7 pr-7 h-7 text-xs"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/FileTreeItem.tsx`

```typescript
'use client';

import { ChevronRight, ChevronDown, FileText, FolderOpen, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeItemProps {
  id: string;
  title: string;
  type: 'document' | 'scene';
  isExpanded?: boolean;
  isSelected?: boolean;
  level?: number;
  hasChildren?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
}

export function FileTreeItem({
  id,
  title,
  type,
  isExpanded = false,
  isSelected = false,
  level = 0,
  hasChildren = false,
  onToggle,
  onSelect,
}: FileTreeItemProps) {
  const Icon = type === 'document' 
    ? (isExpanded ? FolderOpen : Folder) 
    : FileText;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div
      className={cn(
        'tree-item',
        isSelected && 'tree-item-selected'
      )}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={onSelect}
    >
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className="p-0.5 hover:bg-overlay rounded-sm"
        >
          <ChevronIcon className="w-3.5 h-3.5 text-fg-muted" />
        </button>
      ) : (
        <span className="w-4" />
      )}
      <Icon className={cn(
        'w-4 h-4',
        type === 'document' ? 'text-fg-secondary' : 'text-fg-muted'
      )} />
      <span className="truncate text-sm">{title}</span>
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/FileTree.tsx`

```typescript
'use client';

import { useState } from 'react';
import { FileTreeItem } from './FileTreeItem';
import { Document, Scene } from '@/core/entities';

interface DocumentWithScenes extends Document {
  scenes?: Scene[];
}

interface FileTreeProps {
  documents: DocumentWithScenes[];
  selectedId: string | null;
  onSelectDocument: (id: string) => void;
  onSelectScene: (id: string) => void;
}

export function FileTree({
  documents,
  selectedId,
  onSelectDocument,
  onSelectScene,
}: FileTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <div className="py-1">
      {documents.map((doc) => (
        <div key={doc.id}>
          <FileTreeItem
            id={doc.id}
            title={doc.title}
            type="document"
            isExpanded={expandedIds.has(doc.id)}
            isSelected={selectedId === doc.id}
            hasChildren={doc.scenes && doc.scenes.length > 0}
            onToggle={() => toggleExpanded(doc.id)}
            onSelect={() => onSelectDocument(doc.id)}
          />
          {expandedIds.has(doc.id) && doc.scenes?.map((scene) => (
            <FileTreeItem
              key={scene.id}
              id={scene.id}
              title={scene.title || `Scene ${scene.order + 1}`}
              type="scene"
              level={1}
              isSelected={selectedId === scene.id}
              onSelect={() => onSelectScene(scene.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/EntityTypeFilter.tsx`

```typescript
'use client';

import { EntityType } from '@/core/entities';
import { Badge } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

const entityTypes: { type: EntityType; label: string; variant: string }[] = [
  { type: 'CHARACTER', label: 'Characters', variant: 'character' },
  { type: 'LOCATION', label: 'Locations', variant: 'location' },
  { type: 'ITEM', label: 'Items', variant: 'item' },
  { type: 'EVENT', label: 'Events', variant: 'event' },
  { type: 'CONCEPT', label: 'Concepts', variant: 'concept' },
];

interface EntityTypeFilterProps {
  selected: EntityType | null;
  onSelect: (type: EntityType | null) => void;
}

export function EntityTypeFilter({ selected, onSelect }: EntityTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 p-2">
      <Badge
        variant={selected === null ? 'default' : 'secondary'}
        className="cursor-pointer text-2xs"
        onClick={() => onSelect(null)}
      >
        All
      </Badge>
      {entityTypes.map(({ type, label, variant }) => (
        <Badge
          key={type}
          variant={selected === type ? (variant as any) : 'secondary'}
          className="cursor-pointer text-2xs"
          onClick={() => onSelect(type)}
        >
          {label}
        </Badge>
      ))}
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/EntityListItem.tsx`

```typescript
'use client';

import { Entity, EntityType } from '@/core/entities';
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
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm',
        'hover:bg-overlay transition-colors',
        isSelected && 'bg-accent-subtle'
      )}
      onClick={onSelect}
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

**File**: `src/presentation/components/explorer/EntityList.tsx`

```typescript
'use client';

import { useMemo } from 'react';
import { Entity, EntityType } from '@/core/entities';
import { EntityListItem } from './EntityListItem';

interface EntityListProps {
  entities: Entity[];
  selectedId: string | null;
  filterType: EntityType | null;
  searchQuery: string;
  onSelect: (id: string) => void;
}

export function EntityList({
  entities,
  selectedId,
  filterType,
  searchQuery,
  onSelect,
}: EntityListProps) {
  const filteredEntities = useMemo(() => {
    let result = entities;

    if (filterType) {
      result = result.filter((e) => e.type === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [entities, filterType, searchQuery]);

  if (filteredEntities.length === 0) {
    return (
      <div className="p-4 text-center text-fg-muted text-sm">
        {searchQuery ? 'No entities found' : 'No entities yet'}
      </div>
    );
  }

  return (
    <div className="py-1">
      {filteredEntities.map((entity) => (
        <EntityListItem
          key={entity.id}
          entity={entity}
          isSelected={selectedId === entity.id}
          onSelect={() => onSelect(entity.id)}
        />
      ))}
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/FilesTab.tsx`

```typescript
'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { SearchInput } from './SearchInput';
import { FileTree } from './FileTree';
import { useDocumentStore } from '@/presentation/stores';

export function FilesTab() {
  const documents = useDocumentStore((s) => s.documents);
  const currentDocumentId = useDocumentStore((s) => s.currentDocumentId);
  const setCurrentDocument = useDocumentStore((s) => s.actions.setCurrentDocument);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-border flex items-center gap-2">
        <SearchInput
          value=""
          onChange={() => {}}
          placeholder="Search files..."
          className="flex-1"
        />
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <FileTree
          documents={documents as any}
          selectedId={currentDocumentId}
          onSelectDocument={setCurrentDocument}
          onSelectScene={() => {}}
        />
      </div>
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/DatabaseTab.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { EntityType } from '@/core/entities';
import { Button } from '@/presentation/components/ui';
import { SearchInput } from './SearchInput';
import { EntityTypeFilter } from './EntityTypeFilter';
import { EntityList } from './EntityList';
import { useEntityStore, useUIStore } from '@/presentation/stores';

export function DatabaseTab() {
  const entities = useEntityStore((s) => s.entities);
  const selectedEntityId = useUIStore((s) => s.selectedEntityId);
  const selectEntity = useUIStore((s) => s.actions.selectEntity);
  
  const [filterType, setFilterType] = useState<EntityType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-border flex items-center gap-2">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search entities..."
          className="flex-1"
        />
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <EntityTypeFilter selected={filterType} onSelect={setFilterType} />
      <div className="flex-1 overflow-auto">
        <EntityList
          entities={entities}
          selectedId={selectedEntityId}
          filterType={filterType}
          searchQuery={searchQuery}
          onSelect={selectEntity}
        />
      </div>
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/ProjectExplorer.tsx`

```typescript
'use client';

import { FileText, Database } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/presentation/components/ui/tabs';
import { FilesTab } from './FilesTab';
import { DatabaseTab } from './DatabaseTab';
import { useUIStore } from '@/presentation/stores';

export function ProjectExplorer() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.actions.setActiveTab);

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'files' | 'database')}
        className="h-full flex flex-col"
      >
        <TabsList>
          <TabsTrigger value="files" className="gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Files
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-1.5">
            <Database className="w-3.5 h-3.5" />
            Database
          </TabsTrigger>
        </TabsList>
        <TabsContent value="files" className="flex-1">
          <FilesTab />
        </TabsContent>
        <TabsContent value="database" className="flex-1">
          <DatabaseTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**File**: `src/presentation/components/explorer/index.ts`

```typescript
export { ProjectExplorer } from './ProjectExplorer';
export { FilesTab } from './FilesTab';
export { DatabaseTab } from './DatabaseTab';
export { FileTree } from './FileTree';
export { FileTreeItem } from './FileTreeItem';
export { EntityList } from './EntityList';
export { EntityListItem } from './EntityListItem';
export { EntityTypeFilter } from './EntityTypeFilter';
export { SearchInput } from './SearchInput';
```

---

## 4. SUCCESS CRITERIA

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Two tabs render | Files and Database tabs visible |
| 2 | Tab switching works | Active tab changes content |
| 3 | File tree expands | Documents expand to show scenes |
| 4 | Entity filter works | Filtering by type shows correct entities |
| 5 | Search works | Search filters list |
| 6 | Selection highlight | Selected item is highlighted |
| 7 | Tab state persists | UIStore remembers active tab |
| 8 | Scrolling works | Long lists scroll properly |

---

## 5. COMMANDS TO EXECUTE

```bash
# Install dependencies
npm install @radix-ui/react-tabs @radix-ui/react-collapsible

# Create directory
mkdir -p src/presentation/components/explorer
```

---

## 6. NOTES

- Requires Zustand stores from BUILD-08
- Entity selection updates UIStore
- Document selection updates DocumentStore
- Use collapsible for tree expand/collapse
