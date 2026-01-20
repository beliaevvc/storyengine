'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { Avatar } from '@/presentation/components/ui/avatar';
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
          <Link
            key={`${rel.entityId}-${index}`}
            href={`/projects/${projectId}/entity/${rel.entityId}`}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-overlay transition-colors group"
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
          </Link>
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
