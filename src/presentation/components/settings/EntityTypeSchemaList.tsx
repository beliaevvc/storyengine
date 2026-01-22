'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2, AlertCircle, Layers } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Modal } from '@/presentation/components/ui/modal';
import { EntityTypeSchemaCard } from './EntityTypeSchemaCard';
import { EntityTypeSchemaForm } from './EntityTypeSchemaForm';
import {
  getEntityTypeDefinitionsAction,
  createEntityTypeDefinitionAction,
  updateEntityTypeDefinitionAction,
  deleteEntityTypeDefinitionAction,
  seedDefaultEntityTypesAction,
} from '@/app/actions/supabase/entity-type-actions';
import type {
  EntityTypeDefinition,
  CreateEntityTypeInput,
  UpdateEntityTypeInput,
} from '@/core/types/entity-type-schema';

interface EntityTypeSchemaListProps {
  projectId: string;
}

export function EntityTypeSchemaList({ projectId }: EntityTypeSchemaListProps) {
  // State
  const [entityTypes, setEntityTypes] = useState<EntityTypeDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<EntityTypeDefinition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation
  const [deletingType, setDeletingType] = useState<EntityTypeDefinition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load entity types
  const loadEntityTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let result = await getEntityTypeDefinitionsAction(projectId);
    
    // If no types exist, seed defaults
    if (result.success && result.data.length === 0) {
      result = await seedDefaultEntityTypesAction(projectId);
    }
    
    if (result.success) {
      setEntityTypes(result.data);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadEntityTypes();
  }, [loadEntityTypes]);

  // Handlers
  const handleCreate = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entityType: EntityTypeDefinition) => {
    setEditingType(entityType);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (entityType: EntityTypeDefinition) => {
    setDeletingType(entityType);
  };

  const handleSubmit = async (data: CreateEntityTypeInput | UpdateEntityTypeInput) => {
    setIsSubmitting(true);

    let result;
    if (editingType) {
      result = await updateEntityTypeDefinitionAction(editingType.id, data as UpdateEntityTypeInput);
    } else {
      result = await createEntityTypeDefinitionAction(data as CreateEntityTypeInput);
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setEditingType(null);
      await loadEntityTypes();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async () => {
    if (!deletingType) return;

    setIsDeleting(true);
    const result = await deleteEntityTypeDefinitionAction(deletingType.id);
    setIsDeleting(false);

    if (result.success) {
      setDeletingType(null);
      await loadEntityTypes();
    } else {
      alert(result.error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-fg-muted" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <p className="text-fg-muted mb-4">{error}</p>
        <Button variant="secondary" onClick={loadEntityTypes}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Add button */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-fg-muted">
          {entityTypes.length === 0
            ? 'Типы не созданы'
            : `${entityTypes.length} ${getTypeWord(entityTypes.length)}`}
        </span>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить тип
        </Button>
      </div>

      {/* Empty state */}
      {entityTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border-default rounded-lg">
          <Layers className="w-12 h-12 text-fg-muted mb-4" />
          <h3 className="text-lg font-medium text-fg-default mb-2">
            Типы не настроены
          </h3>
          <p className="text-fg-muted mb-6 max-w-md">
            Создайте типы сущностей для вашего проекта.
            Например: Артефакт, Квест, Организация.
          </p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Создать первый тип
          </Button>
        </div>
      ) : (
        /* Types list */
        <div className="space-y-2">
          {entityTypes.map((entityType) => (
            <EntityTypeSchemaCard
              key={entityType.id}
              entityType={entityType}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingType ? 'Редактировать тип' : 'Новый тип сущности'}
        size="lg"
      >
        <EntityTypeSchemaForm
          projectId={projectId}
          entityType={editingType ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingType}
        onClose={() => setDeletingType(null)}
        title="Удалить тип?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-fg-muted">
            Вы уверены, что хотите удалить тип{' '}
            <strong className="text-fg-default">{deletingType?.label}</strong>?
          </p>
          <p className="text-sm text-fg-muted">
            Существующие сущности этого типа сохранятся, но тип больше не будет
            отображаться в списке доступных.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
            <Button
              variant="ghost"
              onClick={() => setDeletingType(null)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/** Helper function for Russian pluralization */
function getTypeWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'типов';
  }

  if (lastDigit === 1) {
    return 'тип';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'типа';
  }

  return 'типов';
}
