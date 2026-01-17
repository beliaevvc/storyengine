'use client';

import { useMemo } from 'react';
import type { Entity, EntityType } from '@/core/entities/entity';
import { EntityListItem } from './EntityListItem';

interface EntityListProps {
  entities: Entity[];
  selectedId: string | null;
  filterType: EntityType | null;
  searchQuery: string;
  onSelect: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
}

export function EntityList({
  entities,
  selectedId,
  filterType,
  searchQuery,
  onSelect,
  onRename,
  onDelete,
}: EntityListProps) {
  const filteredEntities = useMemo(() => {
    let result = entities;

    if (filterType) {
      result = result.filter((e) => e.type === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description?.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [entities, filterType, searchQuery]);

  if (filteredEntities.length === 0) {
    return (
      <div className="p-4 text-center text-fg-muted text-sm">
        {searchQuery ? 'Сущности не найдены' : 'Нет сущностей'}
      </div>
    );
  }

  return (
    <div className="py-1" role="listbox">
      {filteredEntities.map((entity) => (
        <EntityListItem
          key={entity.id}
          entity={entity}
          isSelected={selectedId === entity.id}
          onSelect={() => onSelect(entity.id)}
          onRename={onRename ? (newName) => onRename(entity.id, newName) : undefined}
          onDelete={onDelete ? () => onDelete(entity.id) : undefined}
        />
      ))}
    </div>
  );
}
