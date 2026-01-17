'use client';

import type { Entity, EntityType } from '@/core/entities';
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

const entityBgColors: Record<EntityType, string> = {
  CHARACTER: 'bg-entity-character/20',
  LOCATION: 'bg-entity-location/20',
  ITEM: 'bg-entity-item/20',
  EVENT: 'bg-entity-event/20',
  CONCEPT: 'bg-entity-concept/20',
};

const entityTextColors: Record<EntityType, string> = {
  CHARACTER: 'text-entity-character',
  LOCATION: 'text-entity-location',
  ITEM: 'text-entity-item',
  EVENT: 'text-entity-event',
  CONCEPT: 'text-entity-concept',
};

export function EntityCard({ entity, className }: EntityCardProps) {
  const Icon = entityIcons[entity.type];

  const attributes = (entity.attributes ?? {}) as Record<string, unknown>;
  const relationships = attributes.relationships as Record<string, { type: string; description?: string }> | undefined;
  const aliases = attributes.aliases as string[] | undefined;

  return (
    <Card className={cn('bg-overlay', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('p-1.5 rounded-md', entityBgColors[entity.type])}>
              <Icon className={cn('w-4 h-4', entityTextColors[entity.type])} />
            </div>
            <div>
              <CardTitle className="text-base">{entity.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                <Badge variant={entity.type.toLowerCase() as 'character' | 'location' | 'item' | 'event' | 'concept'} className="text-2xs">
                  {entity.type}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <button className="p-1 hover:bg-surface rounded" type="button">
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

        {entity.type === 'CHARACTER' && relationships && Object.keys(relationships).length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-fg-secondary mb-2">Relationships</h4>
            <EntityRelationships
              relationships={relationships as Record<string, { type: 'family' | 'friend' | 'enemy' | 'romantic' | 'professional' | 'other'; description?: string }>}
            />
          </div>
        )}

        {aliases && aliases.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-fg-secondary mb-2">Also known as</h4>
            <div className="flex flex-wrap gap-1">
              {aliases.map((alias) => (
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
