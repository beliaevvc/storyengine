'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileText, FolderOpen, Folder, MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeItemProps {
  id: string;
  title: string;
  type: 'folder' | 'document';
  isExpanded?: boolean;
  isSelected?: boolean;
  level?: number;
  hasChildren?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  onRename?: (newTitle: string) => void;
  onDelete?: () => void;
  onAddDocument?: () => void;
  isFolder?: boolean;
}

export function FileTreeItem({
  title,
  type,
  isExpanded = false,
  isSelected = false,
  level = 0,
  hasChildren = false,
  onToggle,
  onSelect,
  onRename,
  onDelete,
  onAddDocument,
  isFolder = false,
}: FileTreeItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const Icon = type === 'folder' 
    ? (isExpanded ? FolderOpen : Folder) 
    : FileText;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

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

  const handleRename = () => {
    if (editValue.trim() && editValue !== title) {
      onRename?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    if (isFolder) {
      // Folders toggle expand/collapse on click
      onToggle?.();
    } else {
      // Documents open in editor
      onSelect?.();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 cursor-pointer rounded-sm group relative',
        'hover:bg-overlay transition-colors',
        isSelected && !isFolder && 'bg-accent-subtle text-fg'
      )}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
    >
      {hasChildren || isFolder ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className="p-0.5 hover:bg-surface-overlay rounded-sm"
          type="button"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ChevronIcon className="w-3.5 h-3.5 text-fg-muted" />
        </button>
      ) : (
        <span className="w-4" aria-hidden="true" />
      )}
      <Icon className={cn(
        'w-4 h-4 flex-shrink-0',
        type === 'folder' ? 'text-[#57ab5a]' : 'text-[#986ee2]'
      )} />
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 text-sm bg-overlay text-fg border border-border-muted rounded px-1.5 py-0.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
        />
      ) : (
        <span className="truncate text-sm flex-1">{title}</span>
      )}

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
          {isFolder && onAddDocument && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onAddDocument();
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-surface-hover text-left"
            >
              <Plus className="w-3.5 h-3.5" />
              Добавить документ
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              setIsEditing(true);
              setEditValue(title);
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
