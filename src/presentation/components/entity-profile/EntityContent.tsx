'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Check, Loader2, Plus, X, Pencil, FileText, MoreHorizontal } from 'lucide-react';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { MinimalEditor } from './MinimalEditor';
import { updateEntityDocuments } from '@/app/actions/supabase/entity-actions';
import type { Entity, TiptapContent, EntityDocument, EntityDocuments } from '@/core/entities/entity';
import { cn } from '@/lib/utils';

// ============================================================================
// Default tabs configuration by entity type
// ============================================================================

type TabConfig = Omit<EntityDocument, 'content'>;

// Default tabs for known entity types
const ENTITY_TABS: Record<string, TabConfig[]> = {
  CHARACTER: [
    { id: 'biography', title: 'Биография', isDefault: true, order: 0 },
    { id: 'psychology', title: 'Психология', isDefault: true, order: 1 },
    { id: 'notes', title: 'Заметки', isDefault: true, order: 2 },
    { id: 'references', title: 'Референсы', isDefault: true, order: 3 },
  ],
  LOCATION: [
    { id: 'description', title: 'Описание', isDefault: true, order: 0 },
    { id: 'history', title: 'История', isDefault: true, order: 1 },
    { id: 'notes', title: 'Заметки', isDefault: true, order: 2 },
    { id: 'references', title: 'Референсы', isDefault: true, order: 3 },
  ],
  ITEM: [
    { id: 'description', title: 'Описание', isDefault: true, order: 0 },
    { id: 'origin', title: 'Происхождение', isDefault: true, order: 1 },
    { id: 'notes', title: 'Заметки', isDefault: true, order: 2 },
    { id: 'references', title: 'Референсы', isDefault: true, order: 3 },
  ],
  EVENT: [
    { id: 'description', title: 'Описание', isDefault: true, order: 0 },
    { id: 'timeline', title: 'Хронология', isDefault: true, order: 1 },
    { id: 'participants', title: 'Участники', isDefault: true, order: 2 },
    { id: 'notes', title: 'Заметки', isDefault: true, order: 3 },
  ],
  FACTION: [
    { id: 'description', title: 'Описание', isDefault: true, order: 0 },
    { id: 'history', title: 'История', isDefault: true, order: 1 },
    { id: 'members', title: 'Члены', isDefault: true, order: 2 },
    { id: 'notes', title: 'Заметки', isDefault: true, order: 3 },
  ],
  WORLDBUILDING: [
    { id: 'description', title: 'Описание', isDefault: true, order: 0 },
    { id: 'rules', title: 'Правила', isDefault: true, order: 1 },
    { id: 'notes', title: 'Заметки', isDefault: true, order: 2 },
    { id: 'references', title: 'Референсы', isDefault: true, order: 3 },
  ],
  NOTE: [
    { id: 'content', title: 'Содержание', isDefault: true, order: 0 },
  ],
};

// Default tabs for custom entity types
const DEFAULT_CUSTOM_TABS: TabConfig[] = [
  { id: 'description', title: 'Описание', isDefault: true, order: 0 },
  { id: 'notes', title: 'Заметки', isDefault: true, order: 1 },
  { id: 'references', title: 'Референсы', isDefault: true, order: 2 },
];

const TAB_PLACEHOLDERS: Record<string, string> = {
  // Character
  biography: 'Опишите историю и биографию персонажа...',
  psychology: 'Опишите характер, мотивацию, страхи и желания...',
  // Location
  description: 'Опишите это место, его особенности и атмосферу...',
  history: 'Опишите историю и важные события...',
  // Item
  origin: 'Опишите происхождение, создание и историю предмета...',
  // Event
  timeline: 'Опишите хронологию событий...',
  participants: 'Опишите участников и их роли...',
  // Faction
  members: 'Опишите ключевых членов организации...',
  // Worldbuilding
  rules: 'Опишите правила и законы этого аспекта мира...',
  // Common
  notes: 'Заметки для себя, идеи, TODO...',
  references: 'Ссылки на референсы, изображения, источники...',
  content: 'Начните писать...',
};

function getDefaultTabs(entityType: string): TabConfig[] {
  // Ensure entityType is a string
  const typeStr = typeof entityType === 'string' ? entityType : String(entityType || '');
  
  // Return tabs for known types, or default custom tabs for unknown types
  return ENTITY_TABS[typeStr] || DEFAULT_CUSTOM_TABS;
}

// ============================================================================
// Component
// ============================================================================

interface EntityContentProps {
  entity: Entity;
}

export function EntityContent({ entity }: EntityContentProps) {
  // Get default tabs for this entity type
  const defaultTabs = useMemo(() => getDefaultTabs(entity.type), [entity.type]);
  const firstTabId = defaultTabs[0]?.id || 'content';

  // Initialize documents from entity or create defaults
  const initialDocs = useMemo((): EntityDocuments => {
    if (entity.documents?.tabs?.length) {
      return entity.documents;
    }
    return {
      tabs: defaultTabs.map((tab) => ({
        ...tab,
        content: tab.id === firstTabId && entity.content ? entity.content : null,
      })),
    };
  }, [entity.documents, entity.content, defaultTabs, firstTabId]);

  const [documents, setDocuments] = useState<EntityDocuments>(initialDocs);
  const [activeTabId, setActiveTabId] = useState<string>(documents.tabs[0]?.id || 'biography');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const activeTab = documents.tabs.find((t) => t.id === activeTabId) || documents.tabs[0];

  // Save documents to Supabase
  const saveDocuments = useCallback(
    async (docsToSave: EntityDocuments) => {
      setSaveStatus('saving');

      const result = await updateEntityDocuments(entity.id, docsToSave);

      if (result.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        console.error('Failed to save:', result.error);
        setSaveStatus('idle');
      }
    },
    [entity.id]
  );

  // Handle content update for current tab
  const handleContentUpdate = useCallback(
    (newContent: object) => {
      const updatedDocs: EntityDocuments = {
        tabs: documents.tabs.map((tab) =>
          tab.id === activeTabId ? { ...tab, content: newContent as TiptapContent } : tab
        ),
      };
      setDocuments(updatedDocs);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveDocuments(updatedDocs);
      }, 1500);
    },
    [documents, activeTabId, saveDocuments]
  );

  // Add new custom tab
  const handleAddTab = useCallback(() => {
    const newId = `custom-${Date.now()}`;
    const newTab: EntityDocument = {
      id: newId,
      title: 'Новый документ',
      content: null,
      isDefault: false,
      order: documents.tabs.length,
    };

    const updatedDocs: EntityDocuments = {
      tabs: [...documents.tabs, newTab],
    };

    setDocuments(updatedDocs);
    setActiveTabId(newId);
    setEditingTabId(newId);
    setEditingTitle('Новый документ');
    saveDocuments(updatedDocs);
  }, [documents, saveDocuments]);

  // Rename tab
  const handleRenameTab = useCallback(
    (tabId: string) => {
      if (!editingTitle.trim()) {
        setEditingTabId(null);
        return;
      }

      const updatedDocs: EntityDocuments = {
        tabs: documents.tabs.map((tab) =>
          tab.id === tabId ? { ...tab, title: editingTitle.trim() } : tab
        ),
      };

      setDocuments(updatedDocs);
      setEditingTabId(null);
      saveDocuments(updatedDocs);
    },
    [documents, editingTitle, saveDocuments]
  );

  // Delete custom tab
  const handleDeleteTab = useCallback(
    (tabId: string) => {
      const tab = documents.tabs.find((t) => t.id === tabId);
      if (!tab || tab.isDefault) return;

      const updatedTabs = documents.tabs.filter((t) => t.id !== tabId);
      const updatedDocs: EntityDocuments = { tabs: updatedTabs };

      setDocuments(updatedDocs);

      if (activeTabId === tabId) {
        setActiveTabId(updatedTabs[0]?.id || 'content');
      }

      saveDocuments(updatedDocs);
    },
    [documents, activeTabId, saveDocuments]
  );

  const getPlaceholder = () => {
    return TAB_PLACEHOLDERS[activeTabId] || 'Начните писать...';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tabs header - styled like DocumentTabs */}
      <div className="flex items-center bg-surface border-b border-border overflow-x-auto">
        {documents.tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={activeTabId === tab.id}
            isEditing={editingTabId === tab.id}
            editingTitle={editingTitle}
            onSelect={() => setActiveTabId(tab.id)}
            onStartEdit={() => {
              if (!tab.isDefault) {
                setEditingTabId(tab.id);
                setEditingTitle(tab.title);
              }
            }}
            onEditChange={setEditingTitle}
            onEditSubmit={() => handleRenameTab(tab.id)}
            onEditCancel={() => setEditingTabId(null)}
            onDelete={() => handleDeleteTab(tab.id)}
          />
        ))}

        {/* Add tab button */}
        <button
          onClick={handleAddTab}
          className="flex items-center justify-center px-3 py-1.5 text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors border-r border-border"
          title="Добавить документ"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Save status */}
        <div className="flex items-center gap-1.5 text-sm text-fg-muted px-3 py-1.5 shrink-0">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Сохранение...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Сохранено</span>
            </>
          )}
        </div>

        {/* Overflow menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center px-2 py-1.5 text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {documents.tabs.map((tab) => (
              <DropdownMenuItem
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(activeTabId === tab.id && 'bg-accent/20')}
              >
                <FileText className="w-4 h-4 mr-2 text-fg-muted" />
                {tab.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleAddTab}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить документ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Editor content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-3xl mx-auto">
          <MinimalEditor
            key={activeTabId}
            content={activeTab?.content ?? undefined}
            onUpdate={handleContentUpdate}
            placeholder={getPlaceholder()}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================================================
// Tab Item Component - styled like DocumentTabs
// ============================================================================

interface TabItemProps {
  tab: EntityDocument;
  isActive: boolean;
  isEditing: boolean;
  editingTitle: string;
  onSelect: () => void;
  onStartEdit: () => void;
  onEditChange: (value: string) => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
}

function TabItem({
  tab,
  isActive,
  isEditing,
  editingTitle,
  onSelect,
  onStartEdit,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onDelete,
}: TabItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete();
    },
    [onDelete]
  );

  if (isEditing) {
    return (
      <div className="flex items-center px-2 py-1 border-r border-border bg-canvas">
        <input
          ref={inputRef}
          type="text"
          value={editingTitle}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEditSubmit();
            if (e.key === 'Escape') onEditCancel();
          }}
          onBlur={onEditSubmit}
          className="h-6 px-2 text-sm bg-surface border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent w-32"
        />
      </div>
    );
  }

  return (
    <div
      role="tab"
      aria-selected={isActive}
      className={cn(
        'group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer',
        'border-r border-border select-none',
        'hover:bg-surface-hover transition-colors',
        isActive
          ? 'bg-canvas border-b-2 border-b-accent'
          : 'bg-surface border-b border-b-transparent'
      )}
      onClick={onSelect}
      onDoubleClick={onStartEdit}
    >
      <FileText className="w-4 h-4 flex-shrink-0 text-fg-muted" />

      <span
        className={cn(
          'text-sm truncate max-w-[120px]',
          isActive ? 'text-fg' : 'text-fg-muted'
        )}
      >
        {tab.title}
      </span>

      {/* Close button for custom tabs */}
      {!tab.isDefault && (
        <button
          type="button"
          className={cn(
            'ml-1 p-0.5 rounded hover:bg-overlay transition-colors flex-shrink-0',
            'opacity-0 group-hover:opacity-100',
            isActive && 'opacity-100'
          )}
          onClick={handleClose}
          aria-label={`Закрыть ${tab.title}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
