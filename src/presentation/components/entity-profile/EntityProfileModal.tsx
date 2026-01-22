'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle, Package } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Avatar } from '@/presentation/components/ui/avatar';
import { Badge } from '@/presentation/components/ui/badge';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Separator } from '@/presentation/components/ui/separator';
import { EntityContent } from './EntityContent';
import { EntityTimeline } from './EntityTimeline';
import { AttributesEditor } from './AttributesEditor';
import { RelationshipsEditor } from './RelationshipsEditor';
import { EntityTypeIcon, getEntityTypeLabel } from '@/presentation/components/entities/EntityTypeIcon';
import { useUIStore, selectEntityProfileId } from '@/presentation/stores/useUIStore';
import { getEntity, getEntities } from '@/app/actions/supabase/entity-actions';
import { getAttributeDefinitionsAction } from '@/app/actions/supabase/attribute-actions';
import type { Entity } from '@/core/entities/entity';
import type { Entity as SupabaseEntity } from '@/types/supabase';
import type { AttributeDefinition } from '@/core/types/attribute-schema';
import type { CharacterAttributes } from '@/core/types/entity-attributes';

// Map Supabase entity to domain entity
function mapToDomainEntity(e: SupabaseEntity): Entity {
  return {
    id: e.id,
    projectId: e.project_id,
    type: e.type,
    name: e.name,
    description: e.description ?? undefined,
    attributes: (e.attributes as Record<string, unknown>) ?? {},
    content: e.content as Entity['content'],
    createdAt: new Date(e.created_at),
    updatedAt: new Date(e.updated_at),
  };
}

interface EntityProfileModalProps {
  projectId: string;
}

export function EntityProfileModal({ projectId }: EntityProfileModalProps) {
  const entityProfileId = useUIStore(selectEntityProfileId);
  const closeEntityProfile = useUIStore((state) => state.actions.closeEntityProfile);

  const [entity, setEntity] = useState<Entity | null>(null);
  const [allEntities, setAllEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load entity and all entities for relationships
  useEffect(() => {
    async function loadData() {
      if (!entityProfileId) return;

      setIsLoading(true);
      setError(null);

      // Load entity
      const entityResult = await getEntity(entityProfileId);
      if (entityResult.error || !entityResult.data) {
        setError(entityResult.error || 'Entity not found');
        setIsLoading(false);
        return;
      }

      setEntity(mapToDomainEntity(entityResult.data));

      // Load all entities for relationships
      const entitiesResult = await getEntities(projectId);
      if (entitiesResult.data) {
        setAllEntities(entitiesResult.data.map(mapToDomainEntity));
      }

      setIsLoading(false);
    }

    loadData();
  }, [projectId, entityProfileId]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeEntityProfile();
      }
    };

    if (entityProfileId) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [entityProfileId, closeEntityProfile]);

  // Reset state when closing
  useEffect(() => {
    if (!entityProfileId) {
      setEntity(null);
      setError(null);
      setIsLoading(true);
    }
  }, [entityProfileId]);

  if (!entityProfileId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={closeEntityProfile}
      />

      {/* Modal Container - large but not fullscreen */}
      <div className="relative w-[95vw] h-[92vh] max-w-[1800px] bg-canvas border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={closeEntityProfile}
          className="absolute top-3 right-3 z-10 w-8 h-8 p-0 bg-surface/80 hover:bg-surface"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="text-fg-muted">Загрузка...</span>
            </div>
          </div>
        ) : error || !entity ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-error" />
              <h1 className="text-xl font-semibold text-fg">
                {error || 'Сущность не найдена'}
              </h1>
              <p className="text-fg-muted">
                Запрошенная сущность не существует или была удалена.
              </p>
              <Button variant="secondary" onClick={closeEntityProfile}>
                Закрыть
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-[280px_1fr_320px] overflow-hidden">
            {/* Left Column: Passport */}
            <aside className="h-full overflow-hidden border-r border-border bg-surface">
              <EntityPassportForModal
                entity={entity}
                projectId={projectId}
                allEntities={allEntities}
                onClose={closeEntityProfile}
              />
            </aside>

            {/* Center Column: Content */}
            <main className="h-full overflow-hidden bg-canvas">
              <EntityContent entity={entity} />
            </main>

            {/* Right Column: Timeline */}
            <aside className="h-full overflow-hidden border-l border-border bg-surface">
              <EntityTimeline
                entityId={entity.id}
                projectId={projectId}
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

// Modified EntityPassport for modal - with close button instead of back
interface EntityPassportForModalProps {
  entity: Entity;
  projectId: string;
  allEntities: Entity[];
  onClose: () => void;
}

function EntityPassportForModal({ entity, projectId, allEntities, onClose }: EntityPassportForModalProps) {
  const [definitions, setDefinitions] = useState<AttributeDefinition[]>([]);
  const [definitionsVersion, setDefinitionsVersion] = useState(0);

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
      {/* Header with close button */}
      <div className="px-4 py-3 border-b border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1.5 -ml-2"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
          Закрыть
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
