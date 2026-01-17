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
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
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
