'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  EntityProfileLayout,
  EntityPassport,
  EntityContent,
  EntityTimeline,
} from '@/presentation/components/entity-profile';
import { getEntity, getEntities } from '@/app/actions/supabase/entity-actions';
import type { Entity } from '@/core/entities/entity';
import type { Entity as SupabaseEntity } from '@/types/supabase';

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
    documents: e.documents as Entity['documents'],
    createdAt: new Date(e.created_at),
    updatedAt: new Date(e.updated_at),
  };
}

export default function EntityProfilePage() {
  const params = useParams<{ projectId: string; entityId: string }>();
  const projectId = params.projectId;
  const entityId = params.entityId;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [allEntities, setAllEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load entity and all entities for relationships
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      // Load entity
      const entityResult = await getEntity(entityId);
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
  }, [projectId, entityId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <span className="text-fg-muted">Загрузка...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !entity) {
    return (
      <div className="h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-error" />
          <h1 className="text-xl font-semibold text-fg">
            {error || 'Сущность не найдена'}
          </h1>
          <p className="text-fg-muted">
            Запрошенная сущность не существует или была удалена.
          </p>
        </div>
      </div>
    );
  }

  return (
    <EntityProfileLayout
      leftPanel={
        <EntityPassport
          entity={entity}
          projectId={projectId}
          allEntities={allEntities}
        />
      }
      centerPanel={
        <EntityContent
          entity={entity}
        />
      }
      rightPanel={
        <EntityTimeline
          entityId={entityId}
          projectId={projectId}
        />
      }
    />
  );
}
