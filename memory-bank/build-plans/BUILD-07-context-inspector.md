# BUILD-07: Context Inspector Plan

> **Plan ID**: BUILD-07
> **Component**: Context Inspector (Right Panel)
> **Dependencies**: CP-3, CP-4, BUILD-03
> **Priority**: MEDIUM
> **Estimated Effort**: Phase 6 of Implementation

---

## 1. OBJECTIVE

Создать правую панель Context Inspector с Active Entities секцией, Entity Card компонентом и AI Chat placeholder.

---

## 2. FILES TO CREATE

```
src/presentation/components/
├── inspector/
│   ├── ContextInspector.tsx        # Main inspector component
│   ├── ActiveEntities.tsx          # Active entities section
│   ├── EntityCard.tsx              # Detailed entity card
│   ├── EntityAttributes.tsx        # Attributes display
│   ├── EntityRelationships.tsx     # Relationships display
│   ├── AIChatPlaceholder.tsx       # AI chat placeholder
│   └── index.ts
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Create Entity Card Components

**File**: `src/presentation/components/inspector/EntityAttributes.tsx`

```typescript
import { cn } from '@/lib/utils';

interface EntityAttributesProps {
  attributes: Record<string, unknown>;
  className?: string;
}

export function EntityAttributes({ attributes, className }: EntityAttributesProps) {
  const entries = Object.entries(attributes).filter(
    ([key, value]) => value !== undefined && value !== null && key !== 'aliases'
  );

  if (entries.length === 0) {
    return (
      <p className="text-xs text-fg-muted italic">No attributes defined</p>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-start gap-2 text-xs">
          <span className="text-fg-muted font-mono min-w-[80px]">{key}:</span>
          <span className="text-fg font-mono">
            {formatValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}
```

**File**: `src/presentation/components/inspector/EntityRelationships.tsx`

```typescript
import { useEntityStore } from '@/presentation/stores';
import { Badge } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

interface Relationship {
  type: 'family' | 'friend' | 'enemy' | 'romantic' | 'professional' | 'other';
  description?: string;
}

interface EntityRelationshipsProps {
  relationships?: Record<string, Relationship>;
  className?: string;
}

export function EntityRelationships({ relationships, className }: EntityRelationshipsProps) {
  const entities = useEntityStore((s) => s.entities);

  if (!relationships || Object.keys(relationships).length === 0) {
    return (
      <p className="text-xs text-fg-muted italic">No relationships defined</p>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Object.entries(relationships).map(([entityId, rel]) => {
        const relatedEntity = entities.find((e) => e.id === entityId);
        return (
          <div key={entityId} className="flex items-center gap-2">
            <Badge variant="secondary" className="text-2xs">
              {rel.type}
            </Badge>
            <span className="text-sm text-fg">
              {relatedEntity?.name || entityId}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

**File**: `src/presentation/components/inspector/EntityCard.tsx`

```typescript
'use client';

import { Entity, EntityType } from '@/core/entities';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from '@/presentation/components/ui';
import { EntityAttributes } from './EntityAttributes';
import { EntityRelationships } from './EntityRelationships';
import { User, MapPin, Package, Calendar, Lightbulb, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EntityCardProps {
  entity: Entity;
  className?: string;
}

const entityIcons: Record<EntityType, React.ElementType> = {
  CHARACTER: User,
  LOCATION: MapPin,
  ITEM: Package,
  EVENT: Calendar,
  CONCEPT: Lightbulb,
};

const entityColors: Record<EntityType, string> = {
  CHARACTER: 'character',
  LOCATION: 'location',
  ITEM: 'item',
  EVENT: 'event',
  CONCEPT: 'concept',
};

export function EntityCard({ entity, className }: EntityCardProps) {
  const Icon = entityIcons[entity.type];
  const color = entityColors[entity.type];

  const attributes = entity.attributes as Record<string, unknown>;
  const relationships = attributes.relationships as Record<string, { type: string; description?: string }> | undefined;

  return (
    <Card className={cn('bg-overlay', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('p-1.5 rounded-md', `bg-entity-${color}/20`)}>
              <Icon className={cn('w-4 h-4', `text-entity-${color}`)} />
            </div>
            <div>
              <CardTitle className="text-base">{entity.name}</CardTitle>
              <CardDescription className="text-xs">
                <Badge variant={color as any} className="text-2xs">
                  {entity.type}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <button className="p-1 hover:bg-surface rounded">
            <MoreVertical className="w-4 h-4 text-fg-muted" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entity.description && (
          <div>
            <h4 className="text-xs font-medium text-fg-secondary mb-1">Description</h4>
            <p className="text-sm text-fg">{entity.description}</p>
          </div>
        )}

        <div>
          <h4 className="text-xs font-medium text-fg-secondary mb-2">Attributes</h4>
          <EntityAttributes attributes={attributes} />
        </div>

        {entity.type === 'CHARACTER' && relationships && (
          <div>
            <h4 className="text-xs font-medium text-fg-secondary mb-2">Relationships</h4>
            <EntityRelationships relationships={relationships as any} />
          </div>
        )}

        {(attributes.aliases as string[])?.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-fg-secondary mb-2">Also known as</h4>
            <div className="flex flex-wrap gap-1">
              {(attributes.aliases as string[]).map((alias) => (
                <Badge key={alias} variant="secondary" className="text-2xs">
                  {alias}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**File**: `src/presentation/components/inspector/ActiveEntities.tsx`

```typescript
'use client';

import { useUIStore, useEntityStore, useEditorStore } from '@/presentation/stores';
import { EntityCard } from './EntityCard';
import { PanelHeader } from '@/presentation/components/layout';
import { Users } from 'lucide-react';

export function ActiveEntities() {
  const selectedEntityId = useUIStore((s) => s.selectedEntityId);
  const entities = useEntityStore((s) => s.entities);
  const activeEntityIds = useEditorStore((s) => s.activeEntityIds);

  const selectedEntity = entities.find((e) => e.id === selectedEntityId);
  const activeEntities = entities.filter((e) => activeEntityIds.includes(e.id));

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Active Entities" icon={Users} />
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {selectedEntity ? (
          <EntityCard entity={selectedEntity} />
        ) : activeEntities.length > 0 ? (
          activeEntities.map((entity) => (
            <EntityCard key={entity.id} entity={entity} />
          ))
        ) : (
          <div className="p-4 text-center text-fg-muted text-sm">
            <p>No entity selected</p>
            <p className="text-xs mt-1">
              Click on an entity in the text or select from the database
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**File**: `src/presentation/components/inspector/AIChatPlaceholder.tsx`

```typescript
'use client';

import { Bot, Send } from 'lucide-react';
import { Button, Input } from '@/presentation/components/ui';
import { PanelHeader } from '@/presentation/components/layout';

export function AIChatPlaceholder() {
  return (
    <div className="flex flex-col h-full border-t border-border">
      <PanelHeader title="AI Assistant" icon={Bot} />
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="text-center text-fg-muted">
          <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">AI Assistant</p>
          <p className="text-xs mt-1">Coming soon</p>
        </div>
      </div>
      <div className="p-2 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your story..."
            disabled
            className="text-xs h-8"
          />
          <Button variant="secondary" size="icon" disabled className="h-8 w-8">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**File**: `src/presentation/components/inspector/ContextInspector.tsx`

```typescript
'use client';

import { ActiveEntities } from './ActiveEntities';
import { AIChatPlaceholder } from './AIChatPlaceholder';

export function ContextInspector() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ActiveEntities />
      </div>
      <div className="h-64 flex-shrink-0">
        <AIChatPlaceholder />
      </div>
    </div>
  );
}
```

**File**: `src/presentation/components/inspector/index.ts`

```typescript
export { ContextInspector } from './ContextInspector';
export { ActiveEntities } from './ActiveEntities';
export { EntityCard } from './EntityCard';
export { EntityAttributes } from './EntityAttributes';
export { EntityRelationships } from './EntityRelationships';
export { AIChatPlaceholder } from './AIChatPlaceholder';
```

---

## 4. SUCCESS CRITERIA

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Inspector renders | Right panel visible |
| 2 | Selected entity shows | Click updates card |
| 3 | Entity card complete | All sections render |
| 4 | Attributes display | Key-value pairs shown |
| 5 | Relationships display | Character relationships shown |
| 6 | AI chat placeholder | Disabled input visible |
| 7 | Scrolling works | Long content scrolls |
| 8 | No entity state | Helpful message shown |

---

## 5. COMMANDS TO EXECUTE

```bash
# Create directory
mkdir -p src/presentation/components/inspector
```

---

## 6. NOTES

- EntityCard shows different sections based on entity type
- AI Chat is placeholder only for MVP
- Active Entities shows selected OR entities in current view
- Uses Zustand stores for state
