'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Settings, Hash, Type, ToggleLeft, List, ListOrdered, X } from 'lucide-react';
import { EntityTypeIcon, ENTITY_LABELS } from './EntityTypeIcon';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Modal } from '@/presentation/components/ui/modal';
import { TypeConfigFields } from '@/presentation/components/settings/TypeConfigFields';
import { getAttributeDefinitionsAction, createAttributeDefinitionAction } from '@/app/actions/supabase/attribute-actions';
import type { AttributeDefinition, AttributeType as AttrType } from '@/core/types/attribute-schema';
import { ATTRIBUTE_TYPE_LABELS, DEFAULT_ATTRIBUTE_CONFIGS } from '@/core/types/attribute-schema';
import type { Entity, EntityType, InsertTables, UpdateTables } from '@/types/supabase';

const ALL_ENTITY_TYPES: EntityType[] = [
  'CHARACTER',
  'LOCATION',
  'ITEM',
  'EVENT',
  'FACTION',
  'WORLDBUILDING',
  'NOTE',
];

const TYPE_ICONS: Record<AttrType, React.ElementType> = {
  number: Hash,
  text: Type,
  boolean: ToggleLeft,
  enum: List,
  list: ListOrdered,
};

interface EntityFormProps {
  projectId: string;
  entity?: Entity;
  onSubmit: (data: InsertTables<'entities'> | UpdateTables<'entities'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityForm({
  projectId,
  entity,
  onSubmit,
  onCancel,
  isLoading = false,
}: EntityFormProps) {
  const isEditing = !!entity;

  const [type, setType] = useState<EntityType>(entity?.type || 'CHARACTER');
  const [name, setName] = useState(entity?.name || '');
  const [description, setDescription] = useState(entity?.description || '');
  const [attributes, setAttributes] = useState<Record<string, unknown>>(
    (entity?.attributes as Record<string, unknown>) || {}
  );
  
  // Attribute definitions from database
  const [definitions, setDefinitions] = useState<AttributeDefinition[]>([]);
  const [isLoadingDefinitions, setIsLoadingDefinitions] = useState(true);
  const [showCreateAttrModal, setShowCreateAttrModal] = useState(false);

  // Load attribute definitions
  useEffect(() => {
    async function loadDefinitions() {
      setIsLoadingDefinitions(true);
      const result = await getAttributeDefinitionsAction(projectId);
      if (result.success) {
        setDefinitions(result.data);
      }
      setIsLoadingDefinitions(false);
    }
    loadDefinitions();
  }, [projectId]);

  // Filter definitions for selected entity type
  const applicableDefinitions = definitions.filter(
    (d) => d.entityTypes.length === 0 || d.entityTypes.includes(type)
  );

  const handleTypeChange = (newType: EntityType) => {
    setType(newType);
    // Keep attribute values when switching types
  };

  const handleAttributeChange = (attrName: string, value: unknown) => {
    setAttributes((prev) => ({ ...prev, [attrName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty/null attributes
    const cleanedAttributes = Object.fromEntries(
      Object.entries(attributes).filter(([_, v]) => 
        v !== null && v !== undefined && v !== '' && 
        !(Array.isArray(v) && v.length === 0)
      )
    );

    if (isEditing) {
      await onSubmit({
        name,
        description: description || null,
        type,
        attributes: cleanedAttributes,
      } as UpdateTables<'entities'>);
    } else {
      await onSubmit({
        project_id: projectId,
        name,
        description: description || null,
        type,
        attributes: cleanedAttributes,
      } as InsertTables<'entities'>);
    }
  };

  const handleCreateAttribute = async (attrData: { name: string; type: AttrType; config: Record<string, unknown> }) => {
    await createAttributeDefinitionAction({
      projectId,
      name: attrData.name,
      type: attrData.type,
      config: attrData.config,
      entityTypes: [type],
    });
    // Reload definitions
    const result = await getAttributeDefinitionsAction(projectId);
    if (result.success) {
      setDefinitions(result.data);
    }
    setShowCreateAttrModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-[#adbac7] mb-2">
            Тип сущности
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ALL_ENTITY_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                  type === t
                    ? 'border-[#539bf5] bg-[#539bf5]/10'
                    : 'border-[#444c56] hover:border-[#768390]'
                }`}
              >
                <EntityTypeIcon type={t} size="md" />
                <span className="text-xs text-[#adbac7]">
                  {ENTITY_LABELS[t]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#adbac7] mb-1"
          >
            Название *
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Название ${ENTITY_LABELS[type].toLowerCase()}`}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#adbac7] mb-1"
          >
            Описание
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Добавьте описание..."
            rows={3}
            className="w-full px-3 py-2 bg-[#22272e] border border-[#444c56] rounded-md text-[#adbac7] placeholder:text-[#545d68] focus:outline-none focus:ring-2 focus:ring-[#539bf5] focus:border-transparent resize-none"
          />
        </div>

        {/* Attributes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[#adbac7]">
              Атрибуты
            </label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowCreateAttrModal(true)}
              className="h-7 gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Создать атрибут
            </Button>
          </div>
          
          {isLoadingDefinitions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#768390]" />
            </div>
          ) : applicableDefinitions.length === 0 ? (
            <div className="text-center py-6 text-sm text-[#768390]">
              <p>Нет атрибутов для типа "{ENTITY_LABELS[type]}"</p>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => setShowCreateAttrModal(true)}
                className="mt-1"
              >
                Создать первый атрибут
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {applicableDefinitions.map((def) => (
                <AttributeField
                  key={def.id}
                  definition={def}
                  value={attributes[def.name]}
                  onChange={(value) => handleAttributeChange(def.name, value)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#444c56]">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="bg-[#347d39] hover:bg-[#46954a] text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isEditing ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </form>

      {/* Create Attribute Modal */}
      <CreateAttributeModal
        isOpen={showCreateAttrModal}
        onClose={() => setShowCreateAttrModal(false)}
        onSubmit={handleCreateAttribute}
        entityType={type}
      />
    </>
  );
}

// ============================================================================
// Attribute Field Component
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
      <label className="flex items-center gap-1.5 text-xs text-[#768390]">
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
          className="h-9"
        />
      )}

      {definition.type === 'text' && (
        <Input
          type="text"
          value={value as string ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          maxLength={config.maxLength as number | undefined}
          placeholder={config.default as string ?? ''}
          className="h-9"
        />
      )}

      {definition.type === 'boolean' && (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`
            w-full h-9 px-3 rounded border text-sm text-left transition-colors
            ${value
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : 'bg-[#2d333b] border-[#444c56] hover:border-[#768390] text-[#768390]'
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

// ============================================================================
// Enum Field
// ============================================================================

function EnumField({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  if (options.length === 0) {
    return (
      <p className="text-xs text-[#768390] italic py-2">
        Нет опций. Настройте атрибут в настройках проекта.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(value === option ? null : option)}
          className={`
            px-2.5 py-1.5 rounded text-xs transition-colors
            ${value === option
              ? 'bg-[#539bf5]/20 border border-[#539bf5] text-[#539bf5]'
              : 'bg-[#2d333b] border border-[#444c56] hover:border-[#768390] text-[#adbac7]'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// List Field
// ============================================================================

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
          <span className="flex-1 text-sm text-[#adbac7] px-2 py-1.5 bg-[#2d333b] rounded">
            {item}
          </span>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-1 text-[#768390] hover:text-red-400 transition-colors"
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
          className="h-8 text-sm"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleAdd}
          className="h-8 w-8 p-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Create Attribute Modal
// ============================================================================

interface CreateAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: AttrType; config: Record<string, unknown> }) => Promise<void>;
  entityType: EntityType;
}

function CreateAttributeModal({ isOpen, onClose, onSubmit, entityType }: CreateAttributeModalProps) {
  const [name, setName] = useState('');
  const [attrType, setAttrType] = useState<AttrType>('text');
  const [config, setConfig] = useState<Record<string, unknown>>(
    DEFAULT_ATTRIBUTE_CONFIGS.text as unknown as Record<string, unknown>
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setAttrType('text');
      setConfig(DEFAULT_ATTRIBUTE_CONFIGS.text as unknown as Record<string, unknown>);
    }
  }, [isOpen]);

  useEffect(() => {
    setConfig(DEFAULT_ATTRIBUTE_CONFIGS[attrType] as unknown as Record<string, unknown>);
  }, [attrType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    await onSubmit({ name: name.trim(), type: attrType, config });
    setIsSubmitting(false);
  };

  const ATTR_TYPES: AttrType[] = ['text', 'number', 'boolean', 'enum', 'list'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создать атрибут" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-[#768390]">
          Атрибут будет создан для типа "{ENTITY_LABELS[entityType]}"
        </p>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#adbac7] mb-1.5">
            Название
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Возраст, Статус, Навыки"
            autoFocus
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-[#adbac7] mb-2">
            Тип данных
          </label>
          <div className="grid grid-cols-5 gap-2">
            {ATTR_TYPES.map((t) => {
              const Icon = TYPE_ICONS[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAttrType(t)}
                  className={`
                    flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors
                    ${attrType === t
                      ? 'border-[#539bf5] bg-[#539bf5]/10'
                      : 'border-[#444c56] hover:border-[#768390]'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${attrType === t ? 'text-[#539bf5]' : 'text-[#768390]'}`} />
                  <span className={`text-xs ${attrType === t ? 'text-[#539bf5]' : 'text-[#768390]'}`}>
                    {ATTRIBUTE_TYPE_LABELS[t]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Config */}
        <div>
          <label className="block text-sm font-medium text-[#adbac7] mb-2">
            Настройки
          </label>
          <div className="p-4 bg-[#2d333b] rounded-lg border border-[#444c56]">
            <TypeConfigFields type={attrType} config={config} onChange={setConfig} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting || !name.trim()} className="flex-1">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Создать
          </Button>
        </div>
      </form>
    </Modal>
  );
}
