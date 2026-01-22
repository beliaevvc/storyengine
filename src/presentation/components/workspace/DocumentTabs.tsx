'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { X, FileText, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useWorkspaceStore,
  selectOpenTabs,
  selectActiveTabId,
  type Tab,
} from '@/presentation/stores';
import { DynamicIcon } from '@/presentation/components/ui/icon-picker';
import { getEntityTypeIcon, getEntityTypeColor } from '@/presentation/components/entities/EntityTypeIcon';

// ============================================================================
// Tab Item Component
// ============================================================================

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function TabItem({
  tab,
  isActive,
  onActivate,
  onClose,
  onContextMenu,
}: TabItemProps) {
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  const handleMiddleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  // Determine icon
  let iconName = 'FileText';
  let iconColor = '#768390'; // fg-muted

  if (tab.type === 'entity' && tab.entityType) {
    iconName = getEntityTypeIcon(tab.entityType);
    iconColor = getEntityTypeColor(tab.entityType);
  }

  return (
    <div
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        'group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer',
        'border-r border-border select-none',
        'hover:bg-surface-hover transition-colors',
        isActive
          ? 'bg-canvas border-b-2 border-b-accent'
          : 'bg-surface border-b border-b-transparent'
      )}
      onClick={onActivate}
      onMouseDown={handleMiddleClick}
      onContextMenu={onContextMenu}
    >
      {tab.type === 'entity' ? (
        <DynamicIcon name={iconName} className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
      ) : (
        <FileText className="w-4 h-4 flex-shrink-0 text-fg-muted" />
      )}

      <span
        className={cn(
          'text-sm truncate max-w-[120px]',
          isActive ? 'text-fg' : 'text-fg-muted'
        )}
      >
        {tab.title}
      </span>

      {tab.isDirty && (
        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
      )}

      <button
        type="button"
        className={cn(
          'ml-1 p-0.5 rounded hover:bg-overlay transition-colors flex-shrink-0',
          'opacity-0 group-hover:opacity-100',
          isActive && 'opacity-100'
        )}
        onClick={handleClose}
        aria-label={`Close ${tab.title}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ============================================================================
// Context Menu Component
// ============================================================================

interface ContextMenuProps {
  x: number;
  y: number;
  tabId: string;
  onClose: () => void;
  onCloseTab: (id: string) => void;
  onCloseOthers: (id: string) => void;
  onCloseAll: () => void;
}

function ContextMenu({
  x,
  y,
  tabId,
  onClose,
  onCloseTab,
  onCloseOthers,
  onCloseAll,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const menuItems = [
    { label: 'Закрыть', action: () => onCloseTab(tabId) },
    { label: 'Закрыть другие', action: () => onCloseOthers(tabId) },
    { label: 'Закрыть все', action: onCloseAll },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] bg-surface border border-border rounded-lg shadow-lg py-1"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          type="button"
          className="w-full px-3 py-1.5 text-sm text-left hover:bg-surface-hover transition-colors"
          onClick={() => {
            item.action();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface DocumentTabsProps {
  className?: string;
}

export function DocumentTabs({ className }: DocumentTabsProps) {
  const openTabs = useWorkspaceStore(selectOpenTabs);
  const activeTabId = useWorkspaceStore(selectActiveTabId);
  const { setActiveTab, closeTab, closeOtherTabs, closeAllTabs } =
    useWorkspaceStore((s) => s.actions);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, tabId });
    },
    []
  );

  if (openTabs.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center bg-surface border-b border-border overflow-x-auto',
        className
      )}
      role="tablist"
    >
      {openTabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onActivate={() => setActiveTab(tab.id)}
          onClose={() => closeTab(tab.id)}
          onContextMenu={(e) => handleContextMenu(e, tab.id)}
        />
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Overflow menu (for future enhancement) */}
      {openTabs.length > 5 && (
        <button
          type="button"
          className="px-2 py-1.5 text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          tabId={contextMenu.tabId}
          onClose={() => setContextMenu(null)}
          onCloseTab={closeTab}
          onCloseOthers={closeOtherTabs}
          onCloseAll={closeAllTabs}
        />
      )}
    </div>
  );
}
