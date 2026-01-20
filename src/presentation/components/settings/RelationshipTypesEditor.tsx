'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Loader2, AlertCircle, Link2, ArrowRight, Trash2, Pencil, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Modal } from '@/presentation/components/ui/modal';
import {
  getRelationshipTypesAction,
  createRelationshipTypeAction,
  updateRelationshipTypeAction,
  deleteRelationshipTypeAction,
  reorderRelationshipTypesAction,
  seedDefaultRelationshipTypesAction,
} from '@/app/actions/supabase/relationship-type-actions';
import type { RelationshipType, CreateRelationshipTypeData, UpdateRelationshipTypeData } from '@/core/types/relationship-types';

// ============================================================================
// Types
// ============================================================================

interface RelationshipTypesEditorProps {
  projectId: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function RelationshipTypesEditor({ projectId }: RelationshipTypesEditorProps) {
  const [types, setTypes] = useState<RelationshipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<RelationshipType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation
  const [deletingType, setDeletingType] = useState<RelationshipType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load types
  const loadTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // First, try to seed defaults if needed
    await seedDefaultRelationshipTypesAction(projectId);

    const result = await getRelationshipTypesAction(projectId);

    if (result.success) {
      setTypes(result.data);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  // Handlers
  const handleCreate = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type: RelationshipType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (type: RelationshipType) => {
    setDeletingType(type);
  };

  const handleSubmit = async (data: CreateRelationshipTypeData | UpdateRelationshipTypeData) => {
    setIsSubmitting(true);

    let result;
    if (editingType) {
      result = await updateRelationshipTypeAction(editingType.id, projectId, data as UpdateRelationshipTypeData);
    } else {
      result = await createRelationshipTypeAction({ ...data, projectId } as CreateRelationshipTypeData);
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsModalOpen(false);
      setEditingType(null);
      await loadTypes();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async () => {
    if (!deletingType) return;

    setIsDeleting(true);
    const result = await deleteRelationshipTypeAction(deletingType.id, projectId);
    setIsDeleting(false);

    if (result.success) {
      setDeletingType(null);
      await loadTypes();
    } else {
      alert(result.error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = types.findIndex((t) => t.id === active.id);
      const newIndex = types.findIndex((t) => t.id === over.id);

      const newOrder = arrayMove(types, oldIndex, newIndex);
      setTypes(newOrder);

      // Save new order
      await reorderRelationshipTypesAction(projectId, newOrder.map((t) => t.id));
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
        <Button variant="secondary" onClick={loadTypes}>
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
          {types.length === 0
            ? 'Типы связей не созданы'
            : `${types.length} ${getTypeWord(types.length)}`}
        </span>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить тип
        </Button>
      </div>

      {/* Empty state */}
      {types.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border-default rounded-lg">
          <Link2 className="w-12 h-12 text-fg-muted mb-4" />
          <h3 className="text-lg font-medium text-fg-default mb-2">
            Типы связей не определены
          </h3>
          <p className="text-fg-muted mb-6 max-w-md">
            Создайте типы связей между сущностями.
            Например: Друг, Враг, Наставник → Ученик.
          </p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Создать первый тип
          </Button>
        </div>
      ) : (
        /* Types list with drag and drop */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={types.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {types.map((type) => (
                <SortableTypeItem
                  key={type.id}
                  type={type}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingType ? 'Редактировать тип связи' : 'Новый тип связи'}
      >
        <RelationshipTypeForm
          type={editingType ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingType}
        onClose={() => setDeletingType(null)}
        title="Удалить тип связи?"
      >
        <div className="space-y-4">
          <p className="text-fg-muted">
            Вы уверены, что хотите удалить тип связи{' '}
            <strong className="text-fg-default">{deletingType?.name}</strong>
            {deletingType?.reverseName && (
              <>
                {' '}/ <strong className="text-fg-default">{deletingType.reverseName}</strong>
              </>
            )}
            ?
          </p>
          <p className="text-sm text-fg-muted">
            Существующие связи этого типа не будут удалены, но тип больше не будет доступен для выбора.
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
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================================
// Sortable Type Item
// ============================================================================

interface SortableTypeItemProps {
  type: RelationshipType;
  onEdit: (type: RelationshipType) => void;
  onDelete: (type: RelationshipType) => void;
}

// Entity type labels map
const ENTITY_TYPE_LABELS: Record<string, string> = {
  CHARACTER: 'Персонаж',
  LOCATION: 'Локация',
  ITEM: 'Предмет',
  EVENT: 'Событие',
  FACTION: 'Фракция',
  WORLDBUILDING: 'Мироустройство',
  NOTE: 'Заметка',
};

function getEntityTypesLabel(types: string[] | null): string {
  if (!types || types.length === 0) return 'Все';
  if (types.length === 1) return ENTITY_TYPE_LABELS[types[0]] || types[0];
  if (types.length === 2) {
    return types.map(t => ENTITY_TYPE_LABELS[t] || t).join(', ');
  }
  return `${types.length} типов`;
}

function SortableTypeItem({ type, onEdit, onDelete }: SortableTypeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: type.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSymmetric = type.reverseName === null;
  const sourceLabel = getEntityTypesLabel(type.sourceEntityTypes);
  const targetLabel = getEntityTypesLabel(type.targetEntityTypes);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-bg-surface border border-border-default rounded-lg group"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-fg-muted hover:text-fg cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Type info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-fg-default">{type.name}</span>
          {!isSymmetric && (
            <>
              <ArrowRight className="w-4 h-4 text-fg-muted" />
              <span className="font-medium text-fg-default">{type.reverseName}</span>
            </>
          )}
          {isSymmetric && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-overlay text-fg-muted">
              симметричная
            </span>
          )}
        </div>
        {/* Entity type restrictions */}
        <div className="flex items-center gap-1 mt-1 text-xs text-fg-muted">
          <span>{sourceLabel}</span>
          <span>{isSymmetric ? '↔' : '→'}</span>
          <span>{targetLabel}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(type)}
          className="p-1.5 text-fg-muted hover:text-fg hover:bg-overlay rounded transition-colors"
          title="Редактировать"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(type)}
          className="p-1.5 text-fg-muted hover:text-error hover:bg-overlay rounded transition-colors"
          title="Удалить"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Relationship Type Form
// ============================================================================

interface RelationshipTypeFormProps {
  type?: RelationshipType;
  onSubmit: (data: CreateRelationshipTypeData | UpdateRelationshipTypeData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Entity type labels
const ENTITY_TYPE_OPTIONS = [
  { value: 'CHARACTER', label: 'Персонаж' },
  { value: 'LOCATION', label: 'Локация' },
  { value: 'ITEM', label: 'Предмет' },
  { value: 'EVENT', label: 'Событие' },
  { value: 'FACTION', label: 'Фракция' },
  { value: 'WORLDBUILDING', label: 'Мироустройство' },
  { value: 'NOTE', label: 'Заметка' },
];

function RelationshipTypeForm({ type, onSubmit, onCancel, isLoading }: RelationshipTypeFormProps) {
  const [name, setName] = useState(type?.name ?? '');
  const [reverseName, setReverseName] = useState(type?.reverseName ?? '');
  const [isSymmetric, setIsSymmetric] = useState(type?.reverseName === null || type?.reverseName === undefined);
  const [sourceTypes, setSourceTypes] = useState<string[]>(type?.sourceEntityTypes ?? []);
  const [targetTypes, setTargetTypes] = useState<string[]>(type?.targetEntityTypes ?? []);
  const [restrictEntityTypes, setRestrictEntityTypes] = useState(
    Boolean(
      (type?.sourceEntityTypes && type.sourceEntityTypes.length > 0) ||
      (type?.targetEntityTypes && type.targetEntityTypes.length > 0)
    )
  );

  const toggleSourceType = (value: string) => {
    setSourceTypes(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleTargetType = (value: string) => {
    setTargetTypes(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      reverseName: isSymmetric ? null : (reverseName.trim() || null),
      sourceEntityTypes: restrictEntityTypes && sourceTypes.length > 0 ? sourceTypes as RelationshipType['sourceEntityTypes'] : null,
      targetEntityTypes: restrictEntityTypes && targetTypes.length > 0 ? targetTypes as RelationshipType['targetEntityTypes'] : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-1">
          Название связи *
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Друг, Наставник, Владелец"
          required
        />
      </div>

      {/* Symmetric toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSymmetric}
            onChange={(e) => setIsSymmetric(e.target.checked)}
            className="w-4 h-4 rounded border-border-default"
          />
          <span className="text-sm text-fg-default">
            Симметричная связь
          </span>
        </label>
        <p className="text-xs text-fg-muted mt-1 ml-6">
          Если включено, оба объекта получат одинаковый тип (например, Друг ↔ Друг)
        </p>
      </div>

      {/* Reverse name (only if not symmetric) */}
      {!isSymmetric && (
        <div>
          <label className="block text-sm font-medium text-fg-default mb-1">
            Обратное название
          </label>
          <Input
            value={reverseName}
            onChange={(e) => setReverseName(e.target.value)}
            placeholder="Например: Ученик, Ребёнок, Принадлежит"
          />
          <p className="text-xs text-fg-muted mt-1">
            Тип связи, который получит целевой объект
          </p>
        </div>
      )}

      {/* Entity type restrictions */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={restrictEntityTypes}
            onChange={(e) => setRestrictEntityTypes(e.target.checked)}
            className="w-4 h-4 rounded border-border-default"
          />
          <span className="text-sm text-fg-default">
            Ограничить типы сущностей
          </span>
        </label>
        <p className="text-xs text-fg-muted mt-1 ml-6">
          Если выключено, связь доступна между любыми сущностями
        </p>
      </div>

      {restrictEntityTypes && (
        <div className="space-y-3 pl-6">
          {/* Source entity types */}
          <div>
            <label className="block text-xs font-medium text-fg-muted mb-2">
              Источник (кто создаёт связь):
            </label>
            <div className="flex flex-wrap gap-1">
              {ENTITY_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleSourceType(opt.value)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    sourceTypes.includes(opt.value)
                      ? 'bg-accent-primary text-white'
                      : 'bg-overlay text-fg-secondary hover:bg-surface-hover'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {sourceTypes.length === 0 && (
              <p className="text-xs text-fg-muted mt-1">Не выбрано = любой тип</p>
            )}
          </div>

          {/* Target entity types */}
          <div>
            <label className="block text-xs font-medium text-fg-muted mb-2">
              Цель (с кем создаётся связь):
            </label>
            <div className="flex flex-wrap gap-1">
              {ENTITY_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleTargetType(opt.value)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    targetTypes.includes(opt.value)
                      ? 'bg-accent-primary text-white'
                      : 'bg-overlay text-fg-secondary hover:bg-surface-hover'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {targetTypes.length === 0 && (
              <p className="text-xs text-fg-muted mt-1">Не выбрано = любой тип</p>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="p-3 bg-overlay rounded-lg">
        <p className="text-xs text-fg-muted mb-2">Предпросмотр:</p>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="px-2 py-1 bg-bg-surface rounded">
            {sourceTypes.length > 0 
              ? sourceTypes.map(t => ENTITY_TYPE_OPTIONS.find(o => o.value === t)?.label).join(', ')
              : 'Любой'
            }
          </span>
          <span className="text-fg-muted">—</span>
          <span className="font-medium text-fg-default">{name || '???'}</span>
          <ArrowRight className="w-4 h-4 text-fg-muted" />
          <span className="px-2 py-1 bg-bg-surface rounded">
            {targetTypes.length > 0 
              ? targetTypes.map(t => ENTITY_TYPE_OPTIONS.find(o => o.value === t)?.label).join(', ')
              : 'Любой'
            }
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-2 flex-wrap">
          <span className="px-2 py-1 bg-bg-surface rounded">
            {targetTypes.length > 0 
              ? targetTypes.map(t => ENTITY_TYPE_OPTIONS.find(o => o.value === t)?.label).join(', ')
              : 'Любой'
            }
          </span>
          <span className="text-fg-muted">—</span>
          <span className="font-medium text-fg-default">
            {isSymmetric ? (name || '???') : (reverseName || name || '???')}
          </span>
          <ArrowRight className="w-4 h-4 text-fg-muted" />
          <span className="px-2 py-1 bg-bg-surface rounded">
            {sourceTypes.length > 0 
              ? sourceTypes.map(t => ENTITY_TYPE_OPTIONS.find(o => o.value === t)?.label).join(', ')
              : 'Любой'
            }
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {type ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// Helpers
// ============================================================================

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
