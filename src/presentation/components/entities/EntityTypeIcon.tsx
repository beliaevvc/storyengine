'use client';

import { DynamicIcon } from '@/presentation/components/ui/icon-picker';
import type { EntityTypeDefinition } from '@/core/types/entity-type-schema';

// Fallback конфигурация для обратной совместимости
const FALLBACK_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  CHARACTER: { icon: 'User', color: '#3b82f6', label: 'Персонаж' },
  LOCATION: { icon: 'MapPin', color: '#22c55e', label: 'Локация' },
  ITEM: { icon: 'Package', color: '#eab308', label: 'Предмет' },
  EVENT: { icon: 'Calendar', color: '#a855f7', label: 'Событие' },
  FACTION: { icon: 'Users', color: '#f97316', label: 'Фракция' },
  WORLDBUILDING: { icon: 'Globe', color: '#06b6d4', label: 'Мир' },
  NOTE: { icon: 'StickyNote', color: '#6b7280', label: 'Заметка' },
};

const DEFAULT_CONFIG = { icon: 'HelpCircle', color: '#6b7280', label: 'Неизвестный тип' };

interface EntityTypeIconProps {
  type: string;
  /** Определения типов из БД (опционально для обратной совместимости) */
  definitions?: EntityTypeDefinition[];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function EntityTypeIcon({ 
  type, 
  definitions,
  size = 'md', 
  showLabel = false,
}: EntityTypeIconProps) {
  // Ищем определение в переданных definitions
  const definition = definitions?.find(d => d.name === type);
  
  // Fallback на статическую конфигурацию
  const config = definition 
    ? { icon: definition.icon, color: definition.color, label: definition.label }
    : (FALLBACK_CONFIG[type] ?? DEFAULT_CONFIG);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-md flex items-center justify-center`}
        style={{ backgroundColor: `${config.color}20` }}
      >
        <DynamicIcon 
          name={config.icon} 
          className={iconSizes[size]}
          style={{ color: config.color }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-fg-muted">{config.label}</span>
      )}
    </div>
  );
}

/**
 * Получить label типа из definitions или fallback
 */
export function getEntityTypeLabel(
  type: string, 
  definitions?: EntityTypeDefinition[]
): string {
  const definition = definitions?.find(d => d.name === type);
  if (definition) return definition.label;
  return FALLBACK_CONFIG[type]?.label ?? type;
}

/**
 * Получить цвет типа из definitions или fallback
 */
export function getEntityTypeColor(
  type: string, 
  definitions?: EntityTypeDefinition[]
): string {
  const definition = definitions?.find(d => d.name === type);
  if (definition) return definition.color;
  return FALLBACK_CONFIG[type]?.color ?? '#6b7280';
}

/**
 * Получить иконку типа из definitions или fallback
 */
export function getEntityTypeIcon(
  type: string, 
  definitions?: EntityTypeDefinition[]
): string {
  const definition = definitions?.find(d => d.name === type);
  if (definition) return definition.icon;
  return FALLBACK_CONFIG[type]?.icon ?? 'HelpCircle';
}

// Экспорт для обратной совместимости
export const ENTITY_LABELS = Object.fromEntries(
  Object.entries(FALLBACK_CONFIG).map(([k, v]) => [k, v.label])
) as Record<string, string>;

export const ENTITY_COLORS = Object.fromEntries(
  Object.entries(FALLBACK_CONFIG).map(([k, v]) => [k, v.color])
) as Record<string, string>;
