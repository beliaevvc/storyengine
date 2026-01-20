'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2, AlertCircle, Database } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Modal } from '@/presentation/components/ui/modal';
import { AttributeSchemaCard } from './AttributeSchemaCard';
import { AttributeSchemaForm } from './AttributeSchemaForm';
import {
  getAttributeDefinitionsAction,
  createAttributeDefinitionAction,
  updateAttributeDefinitionAction,
  deleteAttributeDefinitionAction,
} from '@/app/actions/supabase/attribute-actions';
import type {
  AttributeDefinition,
  CreateAttributeInput,
  UpdateAttributeInput,
} from '@/core/types/attribute-schema';

interface AttributeSchemaListProps {
  projectId: string;
}

export function AttributeSchemaList({ projectId }: AttributeSchemaListProps) {
  // State
  const [attributes, setAttributes] = useState<AttributeDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<AttributeDefinition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation
  const [deletingAttribute, setDeletingAttribute] = useState<AttributeDefinition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load attributes
  const loadAttributes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await getAttributeDefinitionsAction(projectId);
    
    if (result.success) {
      setAttributes(result.data);
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadAttributes();
  }, [loadAttributes]);

  // Handlers
  const handleCreate = () => {
    setEditingAttribute(null);
    setIsModalOpen(true);
  };

  const handleEdit = (attribute: AttributeDefinition) => {
    setEditingAttribute(attribute);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (attribute: AttributeDefinition) => {
    setDeletingAttribute(attribute);
  };

  const handleSubmit = async (data: CreateAttributeInput | UpdateAttributeInput) => {
    setIsSubmitting(true);

    let result;
    if (editingAttribute) {
      result = await updateAttributeDefinitionAction(editingAttribute.id, data as UpdateAttributeInput);
    } else {
      result = await createAttributeDefinitionAction(data as CreateAttributeInput);
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setEditingAttribute(null);
      await loadAttributes();
    } else {
      // Show error in form (could be improved with form-level error state)
      alert(result.error);
    }
  };

  const handleDelete = async () => {
    if (!deletingAttribute) return;

    setIsDeleting(true);
    const result = await deleteAttributeDefinitionAction(deletingAttribute.id);
    setIsDeleting(false);

    if (result.success) {
      setDeletingAttribute(null);
      await loadAttributes();
    } else {
      alert(result.error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAttribute(null);
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
        <Button variant="secondary" onClick={loadAttributes}>
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
          {attributes.length === 0
            ? 'Атрибуты не созданы'
            : `${attributes.length} ${getAttributeWord(attributes.length)}`}
        </span>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить атрибут
        </Button>
      </div>

      {/* Empty state */}
      {attributes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border-default rounded-lg">
          <Database className="w-12 h-12 text-fg-muted mb-4" />
          <h3 className="text-lg font-medium text-fg-default mb-2">
            Схема пуста
          </h3>
          <p className="text-fg-muted mb-6 max-w-md">
            Создайте кастомные атрибуты для ваших сущностей.
            Например: Здоровье, Фракция, Инвентарь, Ранен.
          </p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Создать первый атрибут
          </Button>
        </div>
      ) : (
        /* Attributes list */
        <div className="space-y-2">
          {attributes.map((attribute) => (
            <AttributeSchemaCard
              key={attribute.id}
              attribute={attribute}
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
        title={editingAttribute ? 'Редактировать атрибут' : 'Новый атрибут'}
        size="lg"
      >
        <AttributeSchemaForm
          projectId={projectId}
          attribute={editingAttribute ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingAttribute}
        onClose={() => setDeletingAttribute(null)}
        title="Удалить атрибут?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-fg-muted">
            Вы уверены, что хотите удалить атрибут{' '}
            <strong className="text-fg-default">{deletingAttribute?.name}</strong>?
          </p>
          <p className="text-sm text-fg-muted">
            Это действие нельзя отменить. Данные атрибута в существующих сущностях
            не будут затронуты, но атрибут больше не будет отображаться в формах.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
            <Button
              variant="ghost"
              onClick={() => setDeletingAttribute(null)}
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
function getAttributeWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'атрибутов';
  }

  if (lastDigit === 1) {
    return 'атрибут';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'атрибута';
  }

  return 'атрибутов';
}
