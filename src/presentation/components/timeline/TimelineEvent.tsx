'use client';

import { Calendar, Link2, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { EntityTypeIcon } from '@/presentation/components/entities';
import type { Event as TimelineEvent, Entity } from '@/types/supabase';
import { useState } from 'react';

interface TimelineEventProps {
  event: TimelineEvent;
  linkedEntities?: Entity[];
  color?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onEntityClick?: (entityId: string) => void;
}

export function TimelineEventCard({
  event,
  linkedEntities = [],
  color = '#539bf5',
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onEntityClick,
}: TimelineEventProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`
        relative bg-[#22272e] border rounded-lg overflow-hidden cursor-pointer
        transition-all hover:shadow-lg
        ${isSelected ? 'border-[#539bf5] shadow-lg shadow-[#539bf5]/20' : 'border-[#444c56]'}
      `}
    >
      {/* Color indicator */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: color }}
      />

      <div className="pl-4 pr-3 py-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#768390]" />
            <span className="text-xs text-[#768390]">
              Позиция: {event.position}
            </span>
          </div>

          {/* Actions */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 bg-[#2d333b] border border-[#444c56] rounded-md shadow-lg z-20 py-1 min-w-[100px]">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#adbac7] hover:bg-[#373e47]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Изменить
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-[#373e47]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Удалить
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-medium text-[#adbac7] mb-1">
          {event.name}
        </h4>

        {/* Description */}
        {event.description && (
          <p className="text-xs text-[#768390] line-clamp-2 mb-2">
            {event.description}
          </p>
        )}

        {/* Linked entities */}
        {linkedEntities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-[#444c56]">
            {linkedEntities.slice(0, 3).map((entity) => (
              <button
                key={entity.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEntityClick?.(entity.id);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-[#2d333b] rounded text-xs text-[#768390] hover:bg-[#373e47]"
              >
                <EntityTypeIcon type={entity.type} size="sm" />
                <span>{entity.name}</span>
              </button>
            ))}
            {linkedEntities.length > 3 && (
              <span className="text-xs text-[#545d68]">
                +{linkedEntities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
