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

  const totalCount = entities.length;

  return (
    <div className="p-2 border-b border-border">
      {/* All button */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg mb-2 transition-all',
          selected === null
            ? 'bg-accent/15 text-accent ring-1 ring-accent/30'
            : 'bg-surface hover:bg-surface-hover text-fg-muted hover:text-fg'
        )}
      >
        <span className="font-medium text-sm">Все сущности</span>
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full',
          selected === null ? 'bg-accent/20 text-accent' : 'bg-overlay text-fg-muted'
        )}>
          {totalCount}
        </span>
      </button>

      {/* Type grid */}
      <div className="grid grid-cols-2 gap-1.5">
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
              className={cn(
                'flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all text-left',
                !isSelected && 'bg-surface hover:bg-surface-hover'
              )}
              style={isSelected ? {
                backgroundColor: `${color}15`,
                color: color,
                boxShadow: `inset 0 0 0 1px ${color}40`,
              } : undefined}
            >
              <div 
                className={cn(
                  'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0',
                  !isSelected && 'bg-overlay'
                )}
                style={isSelected ? { backgroundColor: `${color}25` } : undefined}
              >
                <DynamicIcon 
                  name={iconName} 
                  className="w-3.5 h-3.5" 
                  style={{ color: isSelected ? color : '#768390' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'text-xs font-medium truncate',
                  !isSelected && 'text-fg-muted'
                )}>
                  {label}
                </div>
              </div>
              {count > 0 && (
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0',
                  isSelected ? 'bg-white/20' : 'bg-overlay text-fg-muted'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
