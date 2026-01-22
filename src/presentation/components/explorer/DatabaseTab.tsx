'use client';

import { useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import type { EntityType } from '@/core/entities/entity';
import { Button } from '@/presentation/components/ui';
import { Modal } from '@/presentation/components/ui/modal';
import { EntityForm } from '@/presentation/components/entities/EntityForm';
import { SearchInput } from './SearchInput';
import { EntityTypeFilter } from './EntityTypeFilter';
import { EntityList } from './EntityList';
import { useEntityStore, useUIStore, useWorkspaceStore } from '@/presentation/stores';
import { createEntity, updateEntity, deleteEntity } from '@/app/actions/supabase/entity-actions';
import type { Entity } from '@/core/entities';
import { mapSupabaseToEntity } from '@/lib/mappers';
import type { InsertTables, UpdateTables } from '@/types/supabase';

export function DatabaseTab() {
  const params = useParams();
  const projectId = params.projectId as string;

  const entities = useEntityStore((s) => s.entities);
  const addEntity = useEntityStore((s) => s.actions.addEntity);
  const updateEntityInStore = useEntityStore((s) => s.actions.updateEntity);
  const removeEntityFromStore = useEntityStore((s) => s.actions.removeEntity);
  const selectedEntityId = useUIStore((s) => s.selectedEntityId);
  const selectEntity = useUIStore((s) => s.actions.selectEntity);
  const closeTab = useWorkspaceStore((s) => s.actions.closeTab);
  const updateTabTitle = useWorkspaceStore((s) => s.actions.updateTabTitle);
  
  const [filterType, setFilterType] = useState<EntityType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (data: InsertTables<'entities'> | UpdateTables<'entities'>) => {
    setIsCreating(true);
    const { data: createdEntity, error } = await createEntity(data as InsertTables<'entities'>);

    if (createdEntity && !error) {
      addEntity(mapSupabaseToEntity(createdEntity));
      setShowCreateModal(false);
    }
    setIsCreating(false);
  };

  const handleRename = (entityId: string, newName: string) => {
    startTransition(async () => {
      const { data, error } = await updateEntity(entityId, { name: newName });
      
      if (data && !error) {
        // Update in store
        updateEntityInStore(entityId, { name: newName });
        // Update tab title if open
        updateTabTitle(entityId, newName);
      }
    });
  };

  const handleDelete = (entityId: string) => {
    startTransition(async () => {
      const { success, error } = await deleteEntity(entityId, projectId);
      
      if (success && !error) {
        // Remove from store
        removeEntityFromStore(entityId);
        // Close tab if open
        closeTab(entityId);
        // Clear selection if deleted entity was selected
        if (selectedEntityId === entityId) {
          selectEntity(null);
        }
      }
    });
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-2 border-b border-border flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск..."
            className="flex-1"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 flex-shrink-0"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter */}
        <EntityTypeFilter selected={filterType} onSelect={setFilterType} />

        {/* List */}
        <div className="flex-1 overflow-auto">
          {entities.length === 0 ? (
            <div className="p-4 text-center text-fg-muted text-sm">
              <p>Нет сущностей</p>
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setShowCreateModal(true)}
                className="mt-2"
              >
                Создать первую сущность
              </Button>
            </div>
          ) : (
            <EntityList
              entities={entities}
              selectedId={selectedEntityId}
              filterType={filterType}
              searchQuery={searchQuery}
              onSelect={selectEntity}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Create Entity Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Новая сущность"
        size="lg"
      >
        <EntityForm
          projectId={projectId}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isCreating}
        />
      </Modal>
    </>
  );
}
