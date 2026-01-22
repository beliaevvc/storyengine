'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/presentation/components/ui/icon-picker';
import { getEntityTypeIcon, getEntityTypeColor, getEntityTypeLabel } from '@/presentation/components/entities/EntityTypeIcon';
import type { Entity } from '@/core/entities/entity';

// Standard entity types
const STANDARD_TYPES = ['CHARACTER', 'LOCATION', 'ITEM', 'EVENT', 'FACTION', 'WORLDBUILDING', 'NOTE'];

interface EntityTypeFilterProps {
  selected: string | null;
  onSelect: (type: string | null) => void;
  entities?: Entity[];
}

export function EntityTypeFilter({ selected, onSelect, entities = [] }: EntityTypeFilterProps) {
  // Count entities by type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entities.forEach((e) => {
      const type = typeof e.type === 'string' ? e.type : String(e.type || '');
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [entities]);

  // Get all unique types (standard + custom)
  const allTypes = useMemo(() => {
    const customTypes = new Set<string>();
    entities.forEach((e) => {
      const type = typeof e.type === 'string' ? e.type : String(e.type || '');
      if (!STANDARD_TYPES.includes(type)) {
        customTypes.add(type);
      }
    });
    return [...STANDARD_TYPES, ...Array.from(customTypes)];
  }, [entities]);

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border overflow-x-auto">
      {/* All button */}
      <button
        onClick={() => onSelect(null)}
        title="Все сущности"
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all flex-shrink-0',
          selected === null
            ? 'bg-accent/15 text-accent'
            : 'text-fg-muted hover:text-fg hover:bg-surface-hover'
        )}
      >
        Все
      </button>

      <div className="w-px h-4 bg-border flex-shrink-0" />

      {/* Type icons */}
      {allTypes.map((type) => {
        const iconName = getEntityTypeIcon(type);
        const color = getEntityTypeColor(type);
        const label = getEntityTypeLabel(type);
        const count = typeCounts[type] || 0;
        const isSelected = selected === type;

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            title={`${label}${count > 0 ? ` (${count})` : ''}`}
            className={cn(
              'relative w-7 h-7 rounded-md flex items-center justify-center transition-all flex-shrink-0',
              !isSelected && 'hover:bg-surface-hover'
            )}
            style={isSelected ? {
              backgroundColor: `${color}20`,
            } : undefined}
          >
            <DynamicIcon 
              name={iconName} 
              className="w-4 h-4" 
              style={{ color: isSelected ? color : '#768390' }}
            />
            {/* Count badge */}
            {count > 0 && (
              <span 
                className={cn(
                  'absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] text-[9px] font-medium rounded-full flex items-center justify-center',
                  isSelected ? 'text-white' : 'bg-overlay text-fg-muted'
                )}
                style={isSelected ? { backgroundColor: color } : undefined}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
