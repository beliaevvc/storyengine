'use client';

import { useCallback } from 'react';
import { MarkViewContent, type MarkViewRendererProps } from '@tiptap/react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/presentation/components/ui';
import { useUIStore, useEntityStore } from '@/presentation/stores';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface EntityMarkAttrs {
  entityId: string;
  entityType: string;
  entityName: string;
}

// ============================================================================
// Color Mapping
// ============================================================================

const entityColorClasses: Record<string, string> = {
  CHARACTER: 'text-entity-character',
  LOCATION: 'text-entity-location',
  ITEM: 'text-entity-item',
  EVENT: 'text-entity-event',
  CONCEPT: 'text-entity-concept',
};

const entityBgClasses: Record<string, string> = {
  CHARACTER: 'bg-entity-character',
  LOCATION: 'bg-entity-location',
  ITEM: 'bg-entity-item',
  EVENT: 'bg-entity-event',
  CONCEPT: 'bg-entity-concept',
};

// ============================================================================
// Component
// ============================================================================

export function EntityMarkComponent(props: MarkViewRendererProps) {
  const mark = props.mark as unknown as { attrs: EntityMarkAttrs };
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

  const colorClass = entityColorClasses[entityType] || 'text-accent';
  const bgClass = entityBgClasses[entityType] || 'bg-accent';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'cursor-pointer underline decoration-dotted underline-offset-2',
            'hover:bg-accent/10 rounded-sm px-0.5 transition-colors',
            colorClass
          )}
          onClick={handleClick}
          data-entity-id={entityId}
        >
          <MarkViewContent />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', bgClass)} />
          <span className="font-medium text-fg">{entityName}</span>
        </div>
        {entity?.description && (
          <p className="text-xs text-fg-muted mt-1 line-clamp-2">
            {entity.description}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
