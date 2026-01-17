'use client';

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
