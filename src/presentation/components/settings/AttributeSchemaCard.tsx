'use client';

import { Pencil, Trash2, Hash, Type, ToggleLeft, List, ListOrdered, GripVertical } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import type { AttributeDefinition, AttributeType } from '@/core/types/attribute-schema';
import { ATTRIBUTE_TYPE_LABELS } from '@/core/types/attribute-schema';

// Иконки для каждого типа атрибута
const TYPE_ICONS: Record<AttributeType, React.ElementType> = {
  number: Hash,
  text: Type,
  boolean: ToggleLeft,
  enum: List,
  list: ListOrdered,
};

// Цвета для типов (если не задан пользователем)
const TYPE_COLORS: Record<AttributeType, string> = {
  number: 'bg-blue-500/20 text-blue-400',
  text: 'bg-green-500/20 text-green-400',
  boolean: 'bg-purple-500/20 text-purple-400',
  enum: 'bg-orange-500/20 text-orange-400',
  list: 'bg-pink-500/20 text-pink-400',
};

interface AttributeSchemaCardProps {
  attribute: AttributeDefinition;
  onEdit: (attribute: AttributeDefinition) => void;
  onDelete: (attribute: AttributeDefinition) => void;
  isDragging?: boolean;
}

export function AttributeSchemaCard({
  attribute,
  onEdit,
  onDelete,
  isDragging = false,
}: AttributeSchemaCardProps) {
  const Icon = TYPE_ICONS[attribute.type];
  const typeColor = TYPE_COLORS[attribute.type];

  // Format entity types for display
  const entityTypesDisplay =
    attribute.entityTypes.length === 0
      ? 'Все типы'
      : attribute.entityTypes.join(', ');

  // Format config preview
  const configPreview = getConfigPreview(attribute);

  return (
    <div
      className={`
        group flex items-center gap-3 p-4 rounded-lg border transition-all
        ${isDragging 
          ? 'border-accent-primary bg-bg-surface shadow-lg' 
          : 'border-border-default bg-bg-surface hover:border-border-emphasis'
        }
      `}
    >
      {/* Drag handle */}
      <div className="cursor-grab text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Icon */}
      <div className={`p-2 rounded-md ${typeColor}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-fg-default truncate">
            {attribute.name}
          </h3>
          <span className="text-xs text-fg-muted px-2 py-0.5 bg-bg-subtle rounded">
            {ATTRIBUTE_TYPE_LABELS[attribute.type]}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-fg-muted">
          <span>{entityTypesDisplay}</span>
          {configPreview && (
            <>
              <span className="text-border-default">•</span>
              <span className="truncate">{configPreview}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(attribute)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(attribute)}
          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/** Получить краткое описание конфигурации для отображения */
function getConfigPreview(attribute: AttributeDefinition): string | null {
  const config = attribute.config;

  switch (attribute.type) {
    case 'number': {
      const parts: string[] = [];
      if (config.min !== undefined) parts.push(`мин: ${config.min}`);
      if (config.max !== undefined) parts.push(`макс: ${config.max}`);
      return parts.length > 0 ? parts.join(', ') : null;
    }
    case 'text': {
      if (config.maxLength !== undefined) {
        return `до ${config.maxLength} симв.`;
      }
      return null;
    }
    case 'boolean': {
      if (config.default !== undefined) {
        return `по умолч.: ${config.default ? 'Да' : 'Нет'}`;
      }
      return null;
    }
    case 'enum': {
      const options = config.options as string[] | undefined;
      if (options && options.length > 0) {
        return `${options.length} вариант${options.length > 1 ? 'ов' : ''}`;
      }
      return null;
    }
    case 'list': {
      return 'список строк';
    }
    default:
      return null;
  }
}
