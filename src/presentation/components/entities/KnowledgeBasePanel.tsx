'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { EntityList } from './EntityList';
import { EntityForm } from './EntityForm';
import { EntityRelations } from './EntityRelations';
import { Modal } from '@/presentation/components/ui/modal';
import {
  getEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from '@/app/actions/supabase/entity-actions';
import type { Entity, InsertTables, UpdateTables } from '@/types/supabase';

interface KnowledgeBasePanelProps {
  projectId: string;
}

export function KnowledgeBasePanel({ projectId }: KnowledgeBasePanelProps) {
  const router = useRouter();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  useEffect(() => {
    loadEntities();
  }, [projectId]);

  const loadEntities = async () => {
    setLoading(true);
    const { data, error } = await getEntities(projectId);
    if (data) {
      setEntities(data);
    }
    setLoading(false);
  };

  const handleCreate = async (data: InsertTables<'entities'>) => {
    setActionLoading(true);
    const { error } = await createEntity(data);
    if (!error) {
      await loadEntities();
      setShowCreateModal(false);
    }
    setActionLoading(false);
  };

  const handleUpdate = async (data: UpdateTables<'entities'>) => {
    if (!editingEntity) return;
    
    setActionLoading(true);
    const { error } = await updateEntity(editingEntity.id, data);
    if (!error) {
      await loadEntities();
      setEditingEntity(null);
    }
    setActionLoading(false);
  };

  const handleDelete = async (entity: Entity) => {
    if (!confirm(`Удалить "${entity.name}"? Это действие нельзя отменить.`)) {
      return;
    }
    
    setActionLoading(true);
    const { error } = await deleteEntity(entity.id, projectId);
    if (!error) {
      await loadEntities();
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#768390]" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <EntityList
        entities={entities}
        onCreateNew={() => setShowCreateModal(true)}
        onEdit={setEditingEntity}
        onDelete={handleDelete}
        onSelect={setSelectedEntity}
      />

      {/* Create Modal */}
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
          isLoading={actionLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingEntity}
        onClose={() => setEditingEntity(null)}
        title="Редактировать сущность"
        size="lg"
      >
        {editingEntity && (
          <EntityForm
            projectId={projectId}
            entity={editingEntity}
            onSubmit={handleUpdate}
            onCancel={() => setEditingEntity(null)}
            isLoading={actionLoading}
          />
        )}
      </Modal>

      {/* Relations Modal */}
      <Modal
        isOpen={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        title="Связи сущности"
        size="lg"
      >
        {selectedEntity && (
          <EntityRelations
            entity={selectedEntity}
            allEntities={entities}
            onClose={() => setSelectedEntity(null)}
          />
        )}
      </Modal>
    </div>
  );
}
