'use client';

import { useState, useEffect } from 'react';
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
import { Hash, Type, ToggleLeft, List, ListOrdered, Save, Loader2, Plus, X, Settings, GripVertical, Trash2, Pencil } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Modal } from '@/presentation/components/ui/modal';
import { TypeConfigFields } from '@/presentation/components/settings/TypeConfigFields';
import { updateEntityAttributes } from '@/app/actions/supabase/entity-actions';
import { 
  createAttributeDefinitionAction, 
  deleteAttributeDefinitionAction,
  updateAttributeDefinitionAction,
} from '@/app/actions/supabase/attribute-actions';
import type { AttributeDefinition, AttributeType } from '@/core/types/attribute-schema';
import { ATTRIBUTE_TYPE_LABELS, DEFAULT_ATTRIBUTE_CONFIGS } from '@/core/types/attribute-schema';

// ============================================================================
// Constants
// ============================================================================

const TYPE_ICONS: Record<AttributeType, React.ElementType> = {
  number: Hash,
  text: Type,
  boolean: ToggleLeft,
  enum: List,
  list: ListOrdered,
};

// ============================================================================
// Main Component
// ============================================================================

interface AttributesEditorProps {
  entityId: string;
  projectId: string;
  attributes: Record<string, unknown>;
  definitions: AttributeDefinition[];
  entityType: string;
  onSave?: (newAttributes: Record<string, unknown>) => void;
  onDefinitionsChange?: () => void;
}

export function AttributesEditor({
  entityId,
  projectId,
  attributes,
  definitions,
  entityType,
  onSave,
  onDefinitionsChange,
}: AttributesEditorProps) {
  const filteredDefinitions = definitions.filter(
    (d) => d.entityTypes.length === 0 || d.entityTypes.includes(entityType)
  );

  const savedOrder = attributes._attributeOrder as string[] | undefined;
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    if (savedOrder && Array.isArray(savedOrder)) {
      const validOrder = savedOrder.filter(id => filteredDefinitions.some(d => d.id === id));
      const newIds = filteredDefinitions.filter(d => !validOrder.includes(d.id)).map(d => d.id);
      setOrderedIds([...validOrder, ...newIds]);
    } else {
      setOrderedIds(filteredDefinitions.map(d => d.id));
    }
  }, [definitions, entityType]);

  const applicableDefinitions = orderedIds
    .map(id => filteredDefinitions.find(d => d.id === id))
    .filter(Boolean) as AttributeDefinition[];

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const initialValues: Record<string, unknown> = {};
    filteredDefinitions.forEach((def) => {
      initialValues[def.name] = attributes[def.name] ?? getDefaultValue(def);
    });
    setValues(initialValues);
    setHasChanges(false);
  }, [attributes, definitions, entityType]);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newAttributes = { ...attributes, ...values };
      const result = await updateEntityAttributes(entityId, newAttributes);
      
      if (result.error) {
        console.error('Failed to save attributes:', result.error);
      } else {
        setHasChanges(false);
        onSave?.(newAttributes);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleOrderChange = async (newOrder: string[]) => {
    setOrderedIds(newOrder);
    const newAttributes = { ...attributes, _attributeOrder: newOrder };
    await updateEntityAttributes(entityId, newAttributes);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-fg-secondary uppercase tracking-wide">
          Атрибуты
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowEditModal(true)}
          className="h-6 w-6 p-0"
          title="Управление атрибутами"
        >
          <Settings className="w-3.5 h-3.5" />
        </Button>
      </div>

      {applicableDefinitions.length === 0 ? (
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full py-3 text-sm text-fg-muted italic hover:text-fg hover:bg-overlay rounded transition-colors"
        >
          + Добавить атрибуты
        </button>
      ) : (
        <div className="space-y-3">
          {applicableDefinitions.map((def) => (
            <AttributeField
              key={def.id}
              definition={def}
              value={values[def.name]}
              onChange={(value) => handleChange(def.name, value)}
            />
          ))}
        </div>
      )}

      {hasChanges && (
        <div className="pt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Сохранить
          </Button>
        </div>
      )}

      <AttributeEditorModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        projectId={projectId}
        entityType={entityType}
        definitions={filteredDefinitions}
        orderedIds={orderedIds}
        onOrderChange={handleOrderChange}
        onDefinitionsChange={onDefinitionsChange}
      />
    </div>
  );
}

// ============================================================================
// Attribute Field (display in sidebar)
// ============================================================================

interface AttributeFieldProps {
  definition: AttributeDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

function AttributeField({ definition, value, onChange }: AttributeFieldProps) {
  const Icon = TYPE_ICONS[definition.type];
  const config = definition.config as Record<string, unknown>;

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-xs text-fg-secondary">
        <Icon className="w-3 h-3" />
        {definition.name}
      </label>
      
      {definition.type === 'number' && (
        <Input
          type="number"
          value={value as number ?? ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          min={config.min as number | undefined}
          max={config.max as number | undefined}
          placeholder={config.default?.toString() ?? '0'}
          className="h-8 text-sm"
        />
      )}

      {definition.type === 'text' && (
        <Input
          type="text"
          value={value as string ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          maxLength={config.maxLength as number | undefined}
          placeholder={config.default as string ?? ''}
          className="h-8 text-sm"
        />
      )}

      {definition.type === 'boolean' && (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`
            w-full h-8 px-3 rounded border text-sm text-left transition-colors
            ${value
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : 'bg-overlay border-border hover:border-border-emphasis text-fg-muted'
            }
          `}
        >
          {value ? 'Да' : 'Нет'}
        </button>
      )}

      {definition.type === 'enum' && (
        <EnumField
          options={(config.options as string[]) ?? []}
          value={value as string | null}
          onChange={onChange}
        />
      )}

      {definition.type === 'list' && (
        <ListField
          value={(value as string[]) ?? []}
          onChange={onChange}
        />
      )}
    </div>
  );
}

function EnumField({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(value === option ? null : option)}
          className={`
            px-2 py-1 rounded text-xs transition-colors
            ${value === option
              ? 'bg-accent-primary/20 border border-accent-primary text-accent-primary'
              : 'bg-overlay border border-border hover:border-border-emphasis text-fg-muted'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ListField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="flex-1 text-sm text-fg px-2 py-1 bg-overlay rounded">
            {item}
          </span>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-1 text-fg-muted hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-1">
        <Input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="Добавить..."
          className="h-7 text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleAdd}
          className="h-7 w-7 p-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Full Attribute Editor Modal
// ============================================================================

interface AttributeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  entityType: string;
  definitions: AttributeDefinition[];
  orderedIds: string[];
  onOrderChange: (newOrder: string[]) => void;
  onDefinitionsChange?: () => void;
}

function AttributeEditorModal({
  isOpen,
  onClose,
  projectId,
  entityType,
  definitions,
  orderedIds,
  onOrderChange,
  onDefinitionsChange,
}: AttributeEditorModalProps) {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingAttribute, setEditingAttribute] = useState<AttributeDefinition | null>(null);
  const [localOrder, setLocalOrder] = useState<string[]>(orderedIds);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    setLocalOrder(orderedIds);
  }, [orderedIds]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = localOrder.indexOf(active.id as string);
      const newIndex = localOrder.indexOf(over.id as string);
      const newOrder = arrayMove(localOrder, oldIndex, newIndex);
      setLocalOrder(newOrder);
      onOrderChange(newOrder);
    }
  };

  const orderedDefinitions = localOrder
    .map(id => definitions.find(d => d.id === id))
    .filter(Boolean) as AttributeDefinition[];

  const handleDelete = async (defId: string) => {
    setIsDeleting(defId);
    try {
      await deleteAttributeDefinitionAction(defId);
      onDefinitionsChange?.();
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (def: AttributeDefinition) => {
    setEditingAttribute(def);
    setMode('edit');
  };

  const handleClose = () => {
    setMode('list');
    setEditingAttribute(null);
    onClose();
  };

  const handleFormSuccess = () => {
    setMode('list');
    setEditingAttribute(null);
    onDefinitionsChange?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Редактор атрибутов" size="lg">
      {mode === 'list' ? (
        <div className="space-y-4">
          {orderedDefinitions.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs text-fg-muted mb-2">Перетащите для изменения порядка:</p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={localOrder} strategy={verticalListSortingStrategy}>
                  {orderedDefinitions.map((def) => (
                    <SortableAttributeItem
                      key={def.id}
                      definition={def}
                      isDeleting={isDeleting === def.id}
                      onEdit={() => handleEdit(def)}
                      onDelete={() => handleDelete(def.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <p className="text-sm text-fg-muted text-center py-6">
              Нет атрибутов. Создайте первый!
            </p>
          )}

          <Button onClick={() => setMode('create')} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Создать атрибут
          </Button>
        </div>
      ) : (
        <AttributeForm
          projectId={projectId}
          entityType={entityType}
          attribute={editingAttribute}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setMode('list');
            setEditingAttribute(null);
          }}
        />
      )}
    </Modal>
  );
}

// ============================================================================
// Sortable Attribute Item
// ============================================================================

interface SortableAttributeItemProps {
  definition: AttributeDefinition;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableAttributeItem({ definition, isDeleting, onEdit, onDelete }: SortableAttributeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: definition.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = TYPE_ICONS[definition.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2.5 bg-overlay rounded border border-transparent
        ${isDragging ? 'opacity-50 border-accent-primary' : ''}
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-fg-muted hover:text-fg"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <Icon className="w-4 h-4 text-fg-muted" />
      <span className="text-sm text-fg flex-1">{definition.name}</span>

      <span className="text-xs text-fg-muted px-2 py-0.5 bg-surface rounded">
        {ATTRIBUTE_TYPE_LABELS[definition.type]}
      </span>

      <button
        onClick={onEdit}
        className="p-1.5 text-fg-muted hover:text-fg transition-colors"
        title="Редактировать"
      >
        <Pencil className="w-4 h-4" />
      </button>

      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="p-1.5 text-fg-muted hover:text-red-400 transition-colors disabled:opacity-50"
        title="Удалить"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

// ============================================================================
// Attribute Form (Create/Edit)
// ============================================================================

interface AttributeFormProps {
  projectId: string;
  entityType: string;
  attribute: AttributeDefinition | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function AttributeForm({ projectId, entityType, attribute, onSuccess, onCancel }: AttributeFormProps) {
  const isEditing = !!attribute;
  
  const [name, setName] = useState(attribute?.name ?? '');
  const [type, setType] = useState<AttributeType>(attribute?.type ?? 'enum');
  const [config, setConfig] = useState<Record<string, unknown>>(
    attribute?.config ?? DEFAULT_ATTRIBUTE_CONFIGS.enum
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setConfig(DEFAULT_ATTRIBUTE_CONFIGS[type]);
    }
  }, [type, isEditing]);

  const handleTypeChange = (newType: AttributeType) => {
    setType(newType);
    if (!isEditing) {
      setConfig(DEFAULT_ATTRIBUTE_CONFIGS[newType]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      if (isEditing && attribute) {
        await updateAttributeDefinitionAction(attribute.id, {
          name: name.trim(),
          type,
          config,
          entityTypes: attribute.entityTypes,
        });
      } else {
        await createAttributeDefinitionAction({
          projectId,
          name: name.trim(),
          type,
          config,
          entityTypes: [entityType],
        });
      }
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const ATTRIBUTE_TYPES: AttributeType[] = ['number', 'text', 'boolean', 'enum', 'list'];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-1.5">
          Название атрибута
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Возраст, Профессия, Статус"
          autoFocus
        />
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-2">
          Тип данных
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ATTRIBUTE_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`
                  flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors
                  ${type === t
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-border hover:border-border-emphasis'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${type === t ? 'text-accent-primary' : 'text-fg-muted'}`} />
                <span className={`text-xs ${type === t ? 'text-accent-primary' : 'text-fg-muted'}`}>
                  {ATTRIBUTE_TYPE_LABELS[t]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Type Config */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-2">
          Настройки
        </label>
        <div className="p-4 bg-overlay rounded-lg border border-border">
          <TypeConfigFields type={type} config={config} onChange={setConfig} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Назад
        </Button>
        <Button type="submit" disabled={isLoading || !name.trim()} className="flex-1">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEditing ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function getDefaultValue(def: AttributeDefinition): unknown {
  const config = def.config as Record<string, unknown>;
  
  switch (def.type) {
    case 'number':
      return config.default ?? null;
    case 'text':
      return config.default ?? null;
    case 'boolean':
      return config.default ?? false;
    case 'enum':
      return config.default ?? null;
    case 'list':
      return [];
    default:
      return null;
  }
}
