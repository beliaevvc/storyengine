'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { IconPicker, DynamicIcon } from '@/presentation/components/ui/icon-picker';
import { ColorPicker } from '@/presentation/components/ui/color-picker';
import type { 
  EntityTypeDefinition, 
  CreateEntityTypeInput, 
  UpdateEntityTypeInput,
} from '@/core/types/entity-type-schema';
import { PRESET_COLORS } from '@/core/types/entity-type-schema';

interface EntityTypeSchemaFormProps {
  projectId: string;
  entityType?: EntityTypeDefinition;
  onSubmit: (data: CreateEntityTypeInput | UpdateEntityTypeInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EntityTypeSchemaForm({
  projectId,
  entityType,
  onSubmit,
  onCancel,
  isLoading = false,
}: EntityTypeSchemaFormProps) {
  const isEditing = !!entityType;

  const [label, setLabel] = useState(entityType?.label ?? '');
  const [icon, setIcon] = useState(entityType?.icon ?? 'Star');
  const [color, setColor] = useState(entityType?.color ?? PRESET_COLORS[0]);

  useEffect(() => {
    if (entityType) {
      setLabel(entityType.label);
      setIcon(entityType.icon);
      setColor(entityType.color);
    }
  }, [entityType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!label.trim()) return;

    if (isEditing) {
      await onSubmit({
        label: label.trim(),
        icon,
        color,
      } as UpdateEntityTypeInput);
    } else {
      await onSubmit({
        projectId,
        name: label.trim().toUpperCase().replace(/\s+/g, '_'),
        label: label.trim(),
        icon,
        color,
      } as CreateEntityTypeInput);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preview */}
      <div className="flex items-center justify-center">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center transition-colors"
          style={{ backgroundColor: `${color}20` }}
        >
          <DynamicIcon 
            name={icon} 
            className="w-8 h-8"
            style={{ color }}
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-1.5">
          Название типа *
        </label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Например: Артефакт, Квест, Организация"
          required
          autoFocus
        />
        {!isEditing && label.trim() && (
          <p className="text-xs text-fg-muted mt-1">
            ID: {label.trim().toUpperCase().replace(/\s+/g, '_')}
          </p>
        )}
      </div>

      {/* Icon */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-2">
          Иконка
        </label>
        <IconPicker value={icon} onChange={setIcon} />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-fg-default mb-2">
          Цвет
        </label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading || !label.trim()}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {isEditing ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}
