'use client';

import type { Entity } from '@/core/entities';
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
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/presentation/components/ui/icon-picker';
import { getEntityTypeIcon, getEntityTypeLabel, getEntityTypeColor } from '@/presentation/components/entities/EntityTypeIcon';

interface EntityCardProps {
  entity: Entity;
  className?: string;
}

export function EntityCard({ entity, className }: EntityCardProps) {
  // Ensure entity.type is a string
  const entityType = typeof entity.type === 'string' ? entity.type : String(entity.type || 'NOTE');
  
  const iconName = getEntityTypeIcon(entityType);
  const typeColor = getEntityTypeColor(entityType);
  const typeLabel = getEntityTypeLabel(entityType);

  const attributes = (entity.attributes ?? {}) as Record<string, unknown>;
  const relationships = attributes.relationships as Record<string, { type: string; description?: string }> | undefined;
  const aliases = attributes.aliases as string[] | undefined;

  return (
    <Card className={cn('bg-overlay', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-md"
              style={{ backgroundColor: `${typeColor}20` }}
            >
              <DynamicIcon name={iconName} className="w-4 h-4" style={{ color: typeColor }} />
            </div>
            <div>
              <CardTitle className="text-base">{entity.name}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                <Badge variant="secondary" className="text-2xs">
                  {typeLabel}
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
