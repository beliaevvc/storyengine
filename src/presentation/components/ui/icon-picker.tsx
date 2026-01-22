'use client';

import { useState, useMemo, type CSSProperties } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, type LucideIcon } from 'lucide-react';
import { Input } from './input';
import { AVAILABLE_ICONS } from '@/core/types/entity-type-schema';

// Тип для доступа к иконкам по имени
type IconMap = Record<string, LucideIcon>;

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return AVAILABLE_ICONS;
    const searchLower = search.toLowerCase();
    return AVAILABLE_ICONS.filter(icon => 
      icon.toLowerCase().includes(searchLower)
    );
  }, [search]);

  return (
    <div className={className}>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск иконки..."
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-6 gap-1.5 max-h-[200px] overflow-y-auto p-1">
        {filteredIcons.map((iconName) => {
          const Icon = (LucideIcons as unknown as IconMap)[iconName];
          if (!Icon) return null;
          
          const isSelected = value === iconName;
          
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              title={iconName}
              className={`
                w-9 h-9 rounded-lg flex items-center justify-center transition-all
                ${isSelected 
                  ? 'bg-accent-primary/20 ring-2 ring-accent-primary' 
                  : 'bg-overlay hover:bg-surface-hover border border-transparent hover:border-border-emphasis'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-accent-primary' : 'text-fg-muted'}`} />
            </button>
          );
        })}
      </div>

      {filteredIcons.length === 0 && (
        <p className="text-sm text-fg-muted text-center py-4">
          Иконки не найдены
        </p>
      )}
    </div>
  );
}

/**
 * Рендерит иконку Lucide по имени
 */
export function DynamicIcon({ 
  name, 
  className,
  style,
  fallback = 'HelpCircle',
}: { 
  name: string; 
  className?: string;
  style?: CSSProperties;
  fallback?: string;
}) {
  const Icon = (LucideIcons as unknown as IconMap)[name] 
    || (LucideIcons as unknown as IconMap)[fallback];
  
  if (!Icon) return null;
  
  return <Icon className={className} style={style} />;
}
