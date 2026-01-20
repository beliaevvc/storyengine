'use client';

import { useState, useEffect } from 'react';
import { Loader2, Hash, Type, ToggleLeft, List, ListOrdered } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { TypeConfigFields } from './TypeConfigFields';
import type {
  AttributeDefinition,
  AttributeType,
  CreateAttributeInput,
  UpdateAttributeInput,
} from '@/core/types/attribute-schema';
import {
  ATTRIBUTE_TYPE_LABELS,
  DEFAULT_ATTRIBUTE_CONFIGS,
} from '@/core/types/attribute-schema';

// Entity types for selection
const ENTITY_TYPES = [
  { value: 'CHARACTER', label: 'Персонаж' },
  { value: 'LOCATION', label: 'Локация' },
  { value: 'ITEM', label: 'Предмет' },
  { value: 'EVENT', label: 'Событие' },
  { value: 'FACTION', label: 'Фракция' },
  { value: 'WORLDBUILDING', label: 'Мир' },
  { value: 'NOTE', label: 'Заметка' },
] as const;

// Иконки для каждого типа атрибута
const TYPE_ICONS: Record<AttributeType, React.ElementType> = {
  number: Hash,
  text: Type,
  boolean: ToggleLeft,
  enum: List,
  list: ListOrdered,
};

const ATTRIBUTE_TYPES: AttributeType[] = ['number', 'text', 'boolean', 'enum', 'list'];

interface AttributeSchemaFormProps {
  projectId: string;
  attribute?: AttributeDefinition;
  onSubmit: (data: CreateAttributeInput | UpdateAttributeInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AttributeSchemaForm({
  projectId,
  attribute,
  onSubmit,
  onCancel,
  isLoading = false,
}: AttributeSchemaFormProps) {
  const isEditing = !!attribute;

  // Form state
  const [name, setName] = useState(attribute?.name ?? '');
  const [type, setType] = useState<AttributeType>(attribute?.type ?? 'text');
  const [config, setConfig] = useState<Record<string, unknown>>(
    (attribute?.config ?? DEFAULT_ATTRIBUTE_CONFIGS.text) as Record<string, unknown>
  );
  const [entityTypes, setEntityTypes] = useState<string[]>(
    attribute?.entityTypes ?? []
  );

  // Reset config when type changes (only for new attributes)
  useEffect(() => {
    if (!isEditing) {
      setConfig(DEFAULT_ATTRIBUTE_CONFIGS[type] as Record<string, unknown>);
    }
  }, [type, isEditing]);

  const handleTypeChange = (newType: AttributeType) => {
    setType(newType);
    if (!isEditing) {
      setConfig(DEFAULT_ATTRIBUTE_CONFIGS[newType] as Record<string, unknown>);
    }
  };

  const handleEntityTypeToggle = (entityType: string) => {
    setEntityTypes((prev) =>
      prev.includes(entityType)
        ? prev.filter((t) => t !== entityType)
        : [...prev, entityType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      await onSubmit({
        name,
        type,
        config,
        entityTypes,
      } as UpdateAttributeInput);
    } else {
      await onSubmit({
        projectId,
        name,
        type,
        config,
        entityTypes,
      } as CreateAttributeInput);
    }
  };

  const isValid = name.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-fg-default mb-1"
        >
          Название атрибута *
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Например: Здоровье, Фракция, Ранен"
          required
          autoFocus
        />
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-2">
          Тип данных *
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
                  flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors
                  ${type === t
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-border-default hover:border-border-emphasis'
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

      {/* Type-specific config */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-2">
          Настройки типа
        </label>
        <div className="p-4 bg-bg-subtle rounded-lg border border-border-default">
          <TypeConfigFields type={type} config={config} onChange={setConfig} />
        </div>
      </div>

      {/* Entity Types */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-2">
          Применяется к типам сущностей
        </label>
        <p className="text-sm text-fg-muted mb-3">
          Оставьте пустым, чтобы атрибут был доступен для всех типов
        </p>
        <div className="flex flex-wrap gap-2">
          {ENTITY_TYPES.map((et) => (
            <button
              key={et.value}
              type="button"
              onClick={() => handleEntityTypeToggle(et.value)}
              className={`
                px-3 py-1.5 rounded-md border text-sm transition-colors
                ${entityTypes.includes(et.value)
                  ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                  : 'border-border-default text-fg-muted hover:border-border-emphasis'
                }
              `}
            >
              {et.label}
            </button>
          ))}
        </div>
        {entityTypes.length === 0 && (
          <p className="text-xs text-fg-muted mt-2 italic">
            Атрибут будет доступен для всех типов сущностей
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-default">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEditing ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}
