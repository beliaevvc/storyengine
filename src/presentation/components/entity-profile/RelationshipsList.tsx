'use client';

import { Users } from 'lucide-react';
import { Avatar } from '@/presentation/components/ui/avatar';
import { useUIStore } from '@/presentation/stores/useUIStore';
import type { Entity } from '@/core/entities/entity';

interface Relationship {
  entityId: string;
  type: string;
  description?: string;
}

interface RelationshipsListProps {
  relationships: Relationship[];
  /** All entities in project (for resolving names) */
  entities: Entity[];
  /** Project ID for links */
  projectId: string;
}

export function RelationshipsList({
  relationships,
  entities,
  projectId,
}: RelationshipsListProps) {
  const openEntityProfile = useUIStore((state) => state.actions.openEntityProfile);

  if (relationships.length === 0) {
    return (
      <p className="text-sm text-fg-muted italic">Нет связей</p>
    );
  }

  // Create a map for quick lookup
  const entityMap = new Map(entities.map((e) => [e.id, e]));

  return (
    <div className="space-y-2">
      {relationships.map((rel, index) => {
        const relatedEntity = entityMap.get(rel.entityId);
        
        if (!relatedEntity) {
          return null;
        }

        return (
          <button
            key={`${rel.entityId}-${index}`}
            onClick={() => openEntityProfile(rel.entityId)}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-overlay transition-colors group w-full text-left"
          >
            <Avatar
              alt={relatedEntity.name}
              fallback={relatedEntity.name}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-fg group-hover:text-fg-link truncate">
                {relatedEntity.name}
              </div>
              <div className="text-xs text-fg-secondary truncate">
                {rel.type}
                {rel.description && ` — ${rel.description}`}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Empty state component
export function RelationshipsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Users className="w-8 h-8 text-fg-muted mb-2" />
      <p className="text-sm text-fg-muted">Нет связей</p>
    </div>
  );
}
