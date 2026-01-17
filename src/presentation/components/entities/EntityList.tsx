'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Grid, List, Filter } from 'lucide-react';
import { EntityCard } from './EntityCard';
import { EntityTypeIcon, ENTITY_LABELS } from './EntityTypeIcon';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import type { Entity, EntityType } from '@/types/supabase';

const ALL_ENTITY_TYPES: EntityType[] = [
  'CHARACTER',
  'LOCATION',
  'ITEM',
  'EVENT',
  'FACTION',
  'WORLDBUILDING',
  'NOTE',
];

interface EntityListProps {
  entities: Entity[];
  onCreateNew?: () => void;
  onEdit?: (entity: Entity) => void;
  onDelete?: (entity: Entity) => void;
  onSelect?: (entity: Entity) => void;
  compact?: boolean;
}

export function EntityList({
  entities,
  onCreateNew,
  onEdit,
  onDelete,
  onSelect,
  compact = false,
}: EntityListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEntities = useMemo(() => {
    return entities.filter((entity) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = entity.name.toLowerCase().includes(query);
        const matchesDescription = entity.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

      // Filter by type
      if (selectedTypes.length > 0 && !selectedTypes.includes(entity.type)) {
        return false;
      }

      return true;
    });
  }, [entities, searchQuery, selectedTypes]);

  const toggleType = (type: EntityType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const entityCountByType = useMemo(() => {
    const counts: Record<EntityType, number> = {
      CHARACTER: 0,
      LOCATION: 0,
      ITEM: 0,
      EVENT: 0,
      FACTION: 0,
      WORLDBUILDING: 0,
      NOTE: 0,
    };
    entities.forEach((e) => {
      counts[e.type]++;
    });
    return counts;
  }, [entities]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[#444c56]">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#768390]" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск сущностей..."
              className="pl-10"
            />
          </div>
          {onCreateNew && (
            <Button
              onClick={onCreateNew}
              className="bg-[#347d39] hover:bg-[#46954a] text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Создать
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'text-[#539bf5]' : ''}
          >
            <Filter className="w-4 h-4 mr-1" />
            Фильтры
            {selectedTypes.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#539bf5] text-white rounded">
                {selectedTypes.length}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'text-[#539bf5]' : ''}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'text-[#539bf5]' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Type Filters */}
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_ENTITY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  selectedTypes.includes(type)
                    ? 'bg-[#539bf5] text-white'
                    : 'bg-[#373e47] text-[#adbac7] hover:bg-[#444c56]'
                }`}
              >
                <EntityTypeIcon type={type} size="sm" />
                <span>{ENTITY_LABELS[type]}</span>
                <span className="text-xs opacity-70">
                  ({entityCountByType[type]})
                </span>
              </button>
            ))}
            {selectedTypes.length > 0 && (
              <button
                onClick={() => setSelectedTypes([])}
                className="px-3 py-1.5 text-sm text-[#768390] hover:text-[#adbac7]"
              >
                Сбросить
              </button>
            )}
          </div>
        )}
      </div>

      {/* Entity List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredEntities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#768390]">
              {searchQuery || selectedTypes.length > 0
                ? 'Ничего не найдено'
                : 'Нет сущностей'}
            </p>
            {onCreateNew && !searchQuery && selectedTypes.length === 0 && (
              <Button
                onClick={onCreateNew}
                variant="ghost"
                className="mt-4 text-[#539bf5]"
              >
                <Plus className="w-4 h-4 mr-1" />
                Создать первую сущность
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntities.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onEdit={onEdit}
                onDelete={onDelete}
                onLinkClick={onSelect}
                compact={compact}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEntities.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onEdit={onEdit}
                onDelete={onDelete}
                onLinkClick={onSelect}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-[#444c56] text-xs text-[#768390]">
        {filteredEntities.length} из {entities.length} сущностей
      </div>
    </div>
  );
}
