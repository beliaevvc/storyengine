'use client';

import {
  User,
  MapPin,
  Package,
  Calendar,
  Users,
  Globe,
  StickyNote,
  LucideIcon,
} from 'lucide-react';
import type { EntityType } from '@/types/supabase';

const ENTITY_ICONS: Record<EntityType, LucideIcon> = {
  CHARACTER: User,
  LOCATION: MapPin,
  ITEM: Package,
  EVENT: Calendar,
  FACTION: Users,
  WORLDBUILDING: Globe,
  NOTE: StickyNote,
};

const ENTITY_COLORS: Record<EntityType, string> = {
  CHARACTER: 'text-blue-400 bg-blue-400/10',
  LOCATION: 'text-green-400 bg-green-400/10',
  ITEM: 'text-yellow-400 bg-yellow-400/10',
  EVENT: 'text-purple-400 bg-purple-400/10',
  FACTION: 'text-orange-400 bg-orange-400/10',
  WORLDBUILDING: 'text-cyan-400 bg-cyan-400/10',
  NOTE: 'text-gray-400 bg-gray-400/10',
};

const ENTITY_LABELS: Record<EntityType, string> = {
  CHARACTER: 'Персонаж',
  LOCATION: 'Локация',
  ITEM: 'Предмет',
  EVENT: 'Событие',
  FACTION: 'Фракция',
  WORLDBUILDING: 'Мир',
  NOTE: 'Заметка',
};

interface EntityTypeIconProps {
  type: EntityType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function EntityTypeIcon({ type, size = 'md', showLabel = false }: EntityTypeIconProps) {
  const Icon = ENTITY_ICONS[type];
  const colorClass = ENTITY_COLORS[type];
  const label = ENTITY_LABELS[type];

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
        className={`${sizeClasses[size]} rounded-md flex items-center justify-center ${colorClass}`}
      >
        <Icon className={iconSizes[size]} />
      </div>
      {showLabel && <span className="text-sm text-[#768390]">{label}</span>}
    </div>
  );
}

export function getEntityTypeLabel(type: EntityType): string {
  return ENTITY_LABELS[type];
}

export function getEntityTypeColor(type: EntityType): string {
  return ENTITY_COLORS[type];
}

export { ENTITY_ICONS, ENTITY_COLORS, ENTITY_LABELS };
