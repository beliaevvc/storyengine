'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { Avatar } from '@/presentation/components/ui/avatar';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Separator } from '@/presentation/components/ui/separator';
import { AttributesEditor } from './AttributesEditor';
import { RelationshipsEditor } from './RelationshipsEditor';
import { EntityTypeIcon, getEntityTypeLabel } from '@/presentation/components/entities/EntityTypeIcon';
import { getAttributeDefinitionsAction } from '@/app/actions/supabase/attribute-actions';
import type { Entity } from '@/core/entities/entity';
import type { AttributeDefinition } from '@/core/types/attribute-schema';
import type { CharacterAttributes } from '@/core/types/entity-attributes';

interface EntityPassportProps {
  entity: Entity;
  projectId: string;
  /** All entities in project (for relationships) */
  allEntities: Entity[];
}

export function EntityPassport({ entity, projectId, allEntities }: EntityPassportProps) {
  const [definitions, setDefinitions] = useState<AttributeDefinition[]>([]);
  const [definitionsVersion, setDefinitionsVersion] = useState(0);

  // Handle back navigation
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  // Load attribute definitions
  useEffect(() => {
    async function loadDefinitions() {
      const result = await getAttributeDefinitionsAction(projectId);
      if (result.success) {
        setDefinitions(result.data);
      }
    }
    loadDefinitions();
  }, [projectId, definitionsVersion]);

  const reloadDefinitions = () => setDefinitionsVersion((v) => v + 1);

  const attributes = entity.attributes as Record<string, unknown>;
  const characterAttrs = attributes as CharacterAttributes;

  // Get relationships (for CHARACTER type)
  const relationships = characterAttrs.relationships ?? [];

  // Get inventory (from attributes, if defined)
  const inventory = (attributes.inventory as string[]) ?? [];

  // Status badge (for CHARACTER)
  const status = attributes.status as string | undefined;

  return (
    <div className="h-full flex flex-col">
      {/* Header with back button */}
      <div className="px-4 py-3 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1.5 -ml-2"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center">
            <Avatar
              alt={entity.name}
              fallback={entity.name}
              size="xl"
              className="mb-3"
            />
            <h1 className="text-xl font-semibold text-fg">{entity.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <EntityTypeIcon type={entity.type} size="sm" />
              <span className="text-sm text-fg-secondary">
                {getEntityTypeLabel(entity.type)}
              </span>
            </div>

            {/* Status badge */}
            {status && (
              <Badge
                variant={status === 'Dead' ? 'error' : 'success'}
                className="mt-2"
              >
                {status === 'Dead' ? 'Мёртв' : status === 'Alive' ? 'Жив' : status}
              </Badge>
            )}
          </div>

          {/* Description */}
          {entity.description && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs font-medium text-fg-secondary uppercase tracking-wider mb-2">
                  Описание
                </h3>
                <p className="text-sm text-fg-secondary leading-relaxed">
                  {entity.description}
                </p>
              </div>
            </>
          )}

          {/* Attributes */}
          <Separator />
          <AttributesEditor
            entityId={entity.id}
            projectId={projectId}
            attributes={attributes}
            definitions={definitions}
            entityType={entity.type}
            onDefinitionsChange={reloadDefinitions}
          />

          {/* Inventory (for CHARACTER) */}
          {entity.type === 'CHARACTER' && inventory.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-xs font-medium text-fg-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  Инвентарь
                </h3>
                <div className="space-y-1">
                  {inventory.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm text-fg py-1 px-2 bg-overlay rounded"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Relationships */}
          <Separator />
          <RelationshipsEditor
            entityId={entity.id}
            entityType={entity.type}
            projectId={projectId}
            relationships={relationships}
            allEntities={allEntities}
            attributes={attributes}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
