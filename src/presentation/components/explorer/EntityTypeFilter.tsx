'use client';

import type { EntityType } from '@/core/entities/entity';
import { Badge } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

const entityTypes: { type: EntityType; label: string; color: string }[] = [
  { type: 'CHARACTER', label: 'Персонажи', color: 'bg-blue-500/20 text-blue-400' },
  { type: 'LOCATION', label: 'Локации', color: 'bg-green-500/20 text-green-400' },
  { type: 'ITEM', label: 'Предметы', color: 'bg-yellow-500/20 text-yellow-400' },
  { type: 'EVENT', label: 'События', color: 'bg-purple-500/20 text-purple-400' },
  { type: 'FACTION', label: 'Фракции', color: 'bg-red-500/20 text-red-400' },
  { type: 'WORLDBUILDING', label: 'Мир', color: 'bg-cyan-500/20 text-cyan-400' },
  { type: 'NOTE', label: 'Заметки', color: 'bg-gray-500/20 text-gray-400' },
];

interface EntityTypeFilterProps {
  selected: EntityType | null;
  onSelect: (type: EntityType | null) => void;
}

export function EntityTypeFilter({ selected, onSelect }: EntityTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-2 py-0.5 rounded text-[10px] font-medium transition-colors',
          selected === null
            ? 'bg-accent/20 text-accent'
            : 'bg-surface hover:bg-surface-hover text-fg-muted'
        )}
      >
        Все
      </button>
      {entityTypes.map(({ type, label, color }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            'px-2 py-0.5 rounded text-[10px] font-medium transition-colors',
            selected === type
              ? color
              : 'bg-surface hover:bg-surface-hover text-fg-muted'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
