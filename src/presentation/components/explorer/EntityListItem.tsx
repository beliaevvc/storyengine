'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Entity, EntityType } from '@/core/entities/entity';
import { useWorkspaceStore } from '@/presentation/stores';
import { cn } from '@/lib/utils';

interface EntityListItemProps {
  entity: Entity;
  isSelected: boolean;
  onSelect: () => void;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
}

const entityColorMap: Record<EntityType, string> = {
  CHARACTER: 'bg-blue-400',
  LOCATION: 'bg-green-400',
  ITEM: 'bg-yellow-400',
  EVENT: 'bg-purple-400',
  FACTION: 'bg-red-400',
  WORLDBUILDING: 'bg-cyan-400',
  NOTE: 'bg-gray-400',
};

export function EntityListItem({ 
  entity, 
  isSelected, 
  onSelect,
  onRename,
  onDelete,
}: EntityListItemProps) {
  const openTab = useWorkspaceStore((s) => s.actions.openTab);
  
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(entity.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Sync editValue when entity.name changes
  useEffect(() => {
    setEditValue(entity.name);
  }, [entity.name]);

  const handleClick = () => {
    if (isEditing) return;
    
    // Select entity in sidebar
    onSelect();
    
    // Open entity in workspace tab
    openTab({
      id: entity.id,
      type: 'entity',
      title: entity.name,
      entityType: entity.type,
    });
  };

  const handleRename = () => {
    if (editValue.trim() && editValue !== entity.name) {
      onRename?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditValue(entity.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm group relative',
        'hover:bg-overlay transition-colors',
        isSelected && 'bg-accent-subtle'
      )}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
      role="option"
      aria-selected={isSelected}
    >
      <span 
        className={cn(
          'w-2 h-2 rounded-full flex-shrink-0',
          entityColorMap[entity.type]
        )} 
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-sm bg-transparent border-b border-accent text-fg px-0 py-0 outline-none"
          />
        ) : (
          <>
            <p className="text-sm truncate">{entity.name}</p>
            {entity.description && (
              <p className="text-xs text-fg-muted truncate">{entity.description}</p>
            )}
          </>
        )}
      </div>

      {/* Actions on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-surface-hover transition-opacity"
      >
        <MoreHorizontal className="w-3.5 h-3.5 text-fg-muted" />
      </button>

      {/* Context Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] bg-surface border border-border rounded-md shadow-lg py-1"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              setIsEditing(true);
              setEditValue(entity.name);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-surface-hover text-left"
          >
            <Pencil className="w-3.5 h-3.5" />
            Переименовать
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onDelete?.();
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-surface-hover text-left text-red-400"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
