'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Edit, Trash2, Link, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { EntityTypeIcon, getEntityTypeLabel } from './EntityTypeIcon';
import { Button } from '@/presentation/components/ui/button';
import type { Entity, EntityType, Json } from '@/types/supabase';

interface EntityCardProps {
  entity: Entity;
  onEdit?: (entity: Entity) => void;
  onDelete?: (entity: Entity) => void;
  onLinkClick?: (entity: Entity) => void;
  compact?: boolean;
  /** Show "Open Profile" in menu (requires projectId) */
  showProfileLink?: boolean;
}

export function EntityCard({
  entity,
  onEdit,
  onDelete,
  onLinkClick,
  compact = false,
  showProfileLink = true,
}: EntityCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const attributes = entity.attributes as Record<string, unknown> | null;
  const hasAttributes = attributes && Object.keys(attributes).length > 0;

  const handleOpenProfile = () => {
    const projectId = entity.project_id;
    router.push(`/projects/${projectId}/entity/${entity.id}`);
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-3 bg-[#2d333b] border border-[#444c56] rounded-lg hover:border-[#539bf5] transition-colors cursor-pointer"
        onClick={() => onLinkClick?.(entity)}
        onDoubleClick={handleOpenProfile}
      >
        <EntityTypeIcon type={entity.type} size="sm" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[#adbac7] truncate">
            {entity.name}
          </h4>
          <p className="text-xs text-[#768390]">
            {getEntityTypeLabel(entity.type)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2d333b] border border-[#444c56] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <EntityTypeIcon type={entity.type} size="md" />
            <div>
              <h3 
                className="text-base font-medium text-[#adbac7] hover:text-[#539bf5] cursor-pointer transition-colors"
                onClick={handleOpenProfile}
              >
                {entity.name}
              </h3>
              <p className="text-xs text-[#768390]">
                {getEntityTypeLabel(entity.type)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-[#22272e] border border-[#444c56] rounded-md shadow-lg z-20 py-1 min-w-[120px]">
                  {showProfileLink && (
                    <button
                      onClick={() => {
                        handleOpenProfile();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#adbac7] hover:bg-[#373e47]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Открыть профиль
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(entity);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#adbac7] hover:bg-[#373e47]"
                    >
                      <Edit className="w-4 h-4" />
                      Изменить
                    </button>
                  )}
                  {onLinkClick && (
                    <button
                      onClick={() => {
                        onLinkClick(entity);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#adbac7] hover:bg-[#373e47]"
                    >
                      <Link className="w-4 h-4" />
                      Связи
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(entity);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#373e47]"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {entity.description && (
          <p className="text-sm text-[#768390] mt-3 line-clamp-2">
            {entity.description}
          </p>
        )}
      </div>

      {/* Attributes */}
      {hasAttributes && (
        <div className="border-t border-[#444c56]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-[#768390] hover:bg-[#373e47]"
          >
            <span>Атрибуты ({Object.keys(attributes!).length})</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isExpanded && (
            <div className="px-4 pb-4 space-y-2">
              {Object.entries(attributes!).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  <span className="text-xs text-[#768390] min-w-[80px]">
                    {key}:
                  </span>
                  <span className="text-xs text-[#adbac7]">
                    {formatAttributeValue(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatAttributeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
