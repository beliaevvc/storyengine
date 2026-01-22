'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Entity } from '@/core/entities/entity';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/presentation/components/ui/icon-picker';
import { getEntityTypeColor, getEntityTypeIcon, getEntityTypeLabel } from '@/presentation/components/entities/EntityTypeIcon';
import { useUIStore } from '@/presentation/stores/useUIStore';

interface EntityListItemProps {
  entity: Entity;
  isSelected: boolean;
  onSelect: () => void;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
}

export function EntityListItem({ 
  entity, 
  isSelected, 
  onSelect,
  onRename,
  onDelete,
}: EntityListItemProps) {
  const openEntityProfile = useUIStore((state) => state.actions.openEntityProfile);
  
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(entity.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const typeColor = getEntityTypeColor(entity.type);
  const typeIcon = getEntityTypeIcon(entity.type);

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
    
    // Select entity in sidebar (single click)
    onSelect();
  };

  const handleDoubleClick = () => {
    if (isEditing) return;
    
    // Open entity profile modal (double click)
    openEntityProfile(entity.id);
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
        'flex items-center gap-2.5 px-2 py-2 mx-1 cursor-pointer rounded-lg group relative transition-all',
        isSelected 
          ? 'bg-accent/10 ring-1 ring-accent/30' 
          : 'hover:bg-surface-hover'
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
      role="option"
      aria-selected={isSelected}
    >
      {/* Icon with colored background */}
      <div 
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ 
          backgroundColor: isSelected ? `${typeColor}25` : `${typeColor}15`,
        }}
      >
        <DynamicIcon 
          name={typeIcon} 
          className="w-3.5 h-3.5" 
          style={{ color: typeColor }}
        />
      </div>

      {/* Content */}
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
          <p className={cn(
            'text-sm truncate font-medium',
            isSelected ? 'text-fg' : 'text-fg-muted group-hover:text-fg'
          )}>
            {entity.name}
          </p>
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
