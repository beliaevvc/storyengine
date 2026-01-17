'use client';

import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { EntityTypeIcon, ENTITY_LABELS } from './EntityTypeIcon';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
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

// Default attributes templates for each entity type
const DEFAULT_ATTRIBUTES: Record<EntityType, Record<string, string>> = {
  CHARACTER: {
    role: '',
    age: '',
    occupation: '',
    personality: '',
  },
  LOCATION: {
    region: '',
    population: '',
    atmosphere: '',
  },
  ITEM: {
    rarity: '',
    origin: '',
    significance: '',
  },
  EVENT: {
    date: '',
    duration: '',
    participants: '',
  },
  FACTION: {
    type: '',
    alignment: '',
    headquarters: '',
  },
  WORLDBUILDING: {
    category: '',
    rules: '',
  },
  NOTE: {},
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
  const [attributes, setAttributes] = useState<Record<string, string>>(
    (entity?.attributes as Record<string, string>) || DEFAULT_ATTRIBUTES[type]
  );
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');

  const handleTypeChange = (newType: EntityType) => {
    setType(newType);
    if (!entity) {
      // Reset attributes to default for new type
      setAttributes(DEFAULT_ATTRIBUTES[newType]);
    }
  };

  const handleAttributeChange = (key: string, value: string) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveAttribute = (key: string) => {
    setAttributes((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleAddAttribute = () => {
    if (newAttrKey.trim()) {
      setAttributes((prev) => ({
        ...prev,
        [newAttrKey.trim()]: newAttrValue,
      }));
      setNewAttrKey('');
      setNewAttrValue('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty attributes
    const cleanedAttributes = Object.fromEntries(
      Object.entries(attributes).filter(([_, v]) => v.trim() !== '')
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

  return (
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
        <label className="block text-sm font-medium text-[#adbac7] mb-2">
          Атрибуты
        </label>
        <div className="space-y-2">
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <Input
                type="text"
                value={key}
                disabled
                className="w-1/3 bg-[#1c2128]"
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => handleAttributeChange(key, e.target.value)}
                placeholder="Значение"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAttribute(key)}
                className="text-[#768390] hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add new attribute */}
          <div className="flex items-center gap-2 pt-2">
            <Input
              type="text"
              value={newAttrKey}
              onChange={(e) => setNewAttrKey(e.target.value)}
              placeholder="Ключ"
              className="w-1/3"
            />
            <Input
              type="text"
              value={newAttrValue}
              onChange={(e) => setNewAttrValue(e.target.value)}
              placeholder="Значение"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAttribute();
                }
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddAttribute}
              disabled={!newAttrKey.trim()}
              className="text-[#539bf5]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
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
  );
}
