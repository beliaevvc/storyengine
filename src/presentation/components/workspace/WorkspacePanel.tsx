'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FileText, Users, Loader2, Check } from 'lucide-react';
import { StoryEditor, EntityEditor } from '@/presentation/components/editor';
import { FlowCanvas } from '@/presentation/components/flow';
import { Timeline } from '@/presentation/components/timeline';
import { DocumentTabs } from './DocumentTabs';
import {
  useDocumentStore,
  useEntityStore,
  useWorkspaceStore,
  selectActiveWorkspaceTab,
  selectOpenTabs,
} from '@/presentation/stores';
import { updateDocumentContent } from '@/app/actions/supabase/document-actions';
import type { TiptapContent, Document } from '@/core/entities/document';
import type { Entity as SupabaseEntity } from '@/types/supabase';
import type { Entity as DomainEntity } from '@/core/entities/entity';

// ============================================================================
// Types & Constants
// ============================================================================

export type WorkspaceMode = 'editor' | 'plot' | 'characters' | 'timeline';

interface WorkspacePanelProps {
  projectId: string;
  projectTitle: string;
  currentDocument: Document | null;
  activeMode: WorkspaceMode;
}

const EMPTY_CONTENT: TiptapContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '' }],
    },
  ],
};

// ============================================================================
// Component
// ============================================================================

export function WorkspacePanel({
  projectId,
  projectTitle,
  currentDocument,
  activeMode,
}: WorkspacePanelProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Store hooks
  const documents = useDocumentStore((s) => s.documents);
  const entities = useEntityStore((s) => s.entities);
  const updateDocument = useDocumentStore((s) => s.actions.updateDocument);

  // Workspace tabs
  const activeTab = useWorkspaceStore(selectActiveWorkspaceTab);
  const openTabs = useWorkspaceStore(selectOpenTabs);
  const { openTab, setActiveTab: setActiveWorkspaceTab } = useWorkspaceStore(
    (s) => s.actions
  );

  // Debounced save refs
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>('');

  // Get entity for active tab if it's an entity tab
  const activeEntity: DomainEntity | null = useMemo(() => {
    if (!activeTab || activeTab.type !== 'entity') return null;
    return entities.find((e) => e.id === activeTab.id) ?? null;
  }, [activeTab, entities]);

  // Get document for active tab if it's a document tab
  const activeDocument: Document | null = useMemo(() => {
    if (!activeTab || activeTab.type !== 'document') return null;
    return documents.find((d) => d.id === activeTab.id) ?? null;
  }, [activeTab, documents]);

  // When currentDocument changes and no tab is open, open it as a tab
  useEffect(() => {
    if (currentDocument && openTabs.length === 0) {
      openTab({
        id: currentDocument.id,
        type: 'document',
        title: currentDocument.title,
      });
    }
  }, [currentDocument, openTabs.length, openTab]);

  // Clear timeout on unmount and reset on document change
  useEffect(() => {
    if (activeDocument) {
      lastSavedContentRef.current = activeDocument.content
        ? JSON.stringify(activeDocument.content)
        : '';
    }
    setSaveStatus('idle');

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [activeDocument?.id]);

  const handleContentUpdate = useCallback(
    (content: object) => {
      if (!activeDocument?.id) return;

      // CRITICAL: Serialize content to plain object for Server Actions
      // editor.getJSON() may return objects with null prototypes that Server Actions reject
      const plainContent = JSON.parse(JSON.stringify(content));
      const contentStr = JSON.stringify(plainContent);

      // DEBUG: Log content being saved
      const sceneNodes = plainContent.content?.filter((n: any) => n.type === 'scene') || [];
      console.log('[WorkspacePanel] Content update:', {
        documentId: activeDocument.id,
        hasScenes: sceneNodes.length > 0,
        sceneCount: sceneNodes.length,
        scenes: sceneNodes.map((s: any) => ({ id: s.attrs?.id, slug: s.attrs?.slug })),
      });

      // Skip if content hasn't changed
      if (contentStr === lastSavedContentRef.current) return;

      // Update local state immediately
      updateDocument(activeDocument.id, { content: plainContent as TiptapContent });

      // Debounce save to server
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setSaveStatus('saving');

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('[WorkspacePanel] Saving to Supabase...', { documentId: activeDocument.id });
          const { success, error } = await updateDocumentContent(
            activeDocument.id,
            plainContent
          );

          if (success) {
            console.log('[WorkspacePanel] Save SUCCESS', { documentId: activeDocument.id, sceneCount: sceneNodes.length });
            lastSavedContentRef.current = contentStr;
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
          } else {
            console.error('[WorkspacePanel] Save FAILED:', error);
            setSaveStatus('idle');
          }
        } catch (err) {
          console.error('[WorkspacePanel] Save ERROR:', err);
          setSaveStatus('idle');
        }
      }, 1000);
    },
    [activeDocument?.id, updateDocument]
  );

  // Convert domain entities to Supabase format for components
  const supabaseEntities: SupabaseEntity[] = entities.map((e) => ({
    id: e.id,
    project_id: e.projectId,
    type: e.type,
    name: e.name,
    description: e.description || null,
    attributes: e.attributes || {},
    content: e.content || null,
    embedding: null,
    created_at: e.createdAt.toISOString(),
    updated_at: e.updatedAt.toISOString(),
  }));

  const supabaseDocuments = documents.map((d) => ({
    id: d.id,
    project_id: d.projectId,
    parent_id: d.parentId || null,
    title: d.title,
    content: d.content || null,
    type: d.type,
    order: d.order,
    embedding: null,
    created_at: d.createdAt.toISOString(),
    updated_at: d.updatedAt.toISOString(),
  }));

  // Determine what to show in editor mode
  const renderEditorContent = () => {
    // If we have an active entity tab, show EntityEditor
    if (activeTab?.type === 'entity' && activeEntity) {
      return <EntityEditor key={activeEntity.id} entity={activeEntity} />;
    }

    // If we have an active document tab, show StoryEditor
    if (activeTab?.type === 'document' && activeDocument) {
      const documentTitle = activeDocument.title ?? 'Новый документ';
      const documentContent =
        (activeDocument.content as TiptapContent) ?? EMPTY_CONTENT;

      return (
        <div className="h-full flex flex-col relative">
          {/* Save status indicator */}
          <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 text-xs text-fg-muted">
            {saveStatus === 'saving' && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Сохранение...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">Сохранено</span>
              </>
            )}
          </div>
          <StoryEditor
            key={activeDocument.id}
            projectName={projectTitle}
            documentName={documentTitle}
            content={documentContent}
            onUpdate={handleContentUpdate}
          />
        </div>
      );
    }

    // No tabs open - show empty state
    if (openTabs.length === 0) {
      if (documents.length === 0) {
        return (
          <div className="h-full flex flex-col items-center justify-center text-fg-muted gap-4">
            <div className="text-6xl">📝</div>
            <h2 className="text-xl font-medium text-fg-default">
              Начните писать
            </h2>
            <p className="text-center max-w-md">
              Создайте первый документ в панели слева, чтобы начать работу над
              вашей историей.
            </p>
          </div>
        );
      }

      return (
        <div className="h-full flex flex-col items-center justify-center text-fg-muted gap-4">
          <FileText className="w-16 h-16 opacity-50" />
          <h2 className="text-xl font-medium text-fg-default">
            Выберите документ
          </h2>
          <p className="text-center max-w-md">
            Выберите документ или сущность в панели слева для редактирования.
          </p>
        </div>
      );
    }

    // Tab exists but content not found (edge case)
    return (
      <div className="h-full flex flex-col items-center justify-center text-fg-muted gap-4">
        <FileText className="w-16 h-16 opacity-50" />
        <h2 className="text-xl font-medium text-fg-default">
          Документ не найден
        </h2>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Document Tabs (only in editor mode) */}
      {activeMode === 'editor' && <DocumentTabs />}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeMode === 'editor' && renderEditorContent()}

        {activeMode === 'plot' && (
          <FlowCanvas
            projectId={projectId}
            documents={supabaseDocuments}
            entities={supabaseEntities}
            relations={[]}
          />
        )}

        {activeMode === 'characters' && (
          <div className="h-full flex flex-col items-center justify-center text-fg-muted gap-4">
            <Users className="w-16 h-16 opacity-50" />
            <h2 className="text-xl font-medium text-fg-default">
              Карта персонажей
            </h2>
            <p className="text-center max-w-md">
              Добавьте персонажей в базу знаний (вкладка Database слева), чтобы
              увидеть их здесь.
            </p>
            {supabaseEntities.filter((e) => e.type === 'CHARACTER').length >
              0 && (
              <FlowCanvas
                projectId={projectId}
                documents={[]}
                entities={supabaseEntities.filter(
                  (e) => e.type === 'CHARACTER'
                )}
                relations={[]}
              />
            )}
          </div>
        )}

        {activeMode === 'timeline' && (
          <Timeline
            projectId={projectId}
            timelines={[]}
            events={[]}
            entities={supabaseEntities}
            onCreateTimeline={() => {}}
            onCreateEvent={() => {}}
          />
        )}
      </div>
    </div>
  );
}
