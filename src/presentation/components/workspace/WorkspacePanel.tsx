'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FileText, Users, Loader2, Check } from 'lucide-react';
import { StoryEditor } from '@/presentation/components/editor';
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
import { useEntitiesLoader } from '@/presentation/hooks';
import { updateDocumentContent } from '@/app/actions/supabase/document-actions';
import type { TiptapContent, Document as DomainDocument } from '@/core/entities/document';
import type { Entity as DomainEntity } from '@/core/entities/entity';
import { mapEntitiesToSupabase, mapDocumentsToSupabase } from '@/lib/mappers';

// ============================================================================
// Types & Constants
// ============================================================================

export type WorkspaceMode = 'editor' | 'plot' | 'characters' | 'timeline';

interface WorkspacePanelProps {
  projectId: string;
  projectTitle: string;
  currentDocument: DomainDocument | null;
  activeMode: WorkspaceMode;
}

// Relationship stored in entity.attributes (supports both old and new format)
interface StoredRelationship {
  entityId: string;
  // New format
  typeId?: string;
  typeName?: string;
  isReverse?: boolean;
  // Old format
  type?: string;
  description?: string;
}

// Relationship format for FlowCanvas
interface FlowRelation {
  id: string;
  source_id: string;
  target_id: string;
  relation_type: string;
  label?: string;
}

// Extract relations from entities' attributes
function extractRelationsFromEntities(entities: DomainEntity[]): FlowRelation[] {
  const relations: FlowRelation[] = [];
  const seenPairs = new Set<string>();
  
  // Build a map of entity relationships for quick lookup
  const entityRelMap = new Map<string, { entity: DomainEntity; relationships: StoredRelationship[] }>();
  entities.forEach((entity) => {
    const attributes = entity.attributes as Record<string, unknown> | null;
    const relationships = (attributes?.relationships || []) as StoredRelationship[];
    entityRelMap.set(entity.id, { entity, relationships });
  });

  entities.forEach((entity) => {
    const attributes = entity.attributes as Record<string, unknown> | null;
    const relationships = (attributes?.relationships || []) as StoredRelationship[];

    relationships.forEach((rel) => {
      // Skip if no target entity
      if (!rel.entityId) return;
      
      // Create a unique key for the pair (sorted to avoid duplicates)
      const pairKey = [entity.id, rel.entityId].sort().join('_');
      
      // Skip if we've already added this pair
      if (seenPairs.has(pairKey)) return;
      seenPairs.add(pairKey);

      // Get label from this side
      const thisLabel = rel.typeName || rel.type || '';
      
      // Try to find the reverse relationship to get the other label
      const targetData = entityRelMap.get(rel.entityId);
      const reverseRel = targetData?.relationships.find(r => r.entityId === entity.id);
      const otherLabel = reverseRel?.typeName || reverseRel?.type || '';
      
      // Create combined label for asymmetric relationships
      let label = thisLabel;
      if (otherLabel && otherLabel !== thisLabel) {
        // Asymmetric: show both sides "Наставник ↔ Ученик"
        label = `${thisLabel} ↔ ${otherLabel}`;
      }

      relations.push({
        id: `rel-${entity.id}-${rel.entityId}`,
        source_id: entity.id,
        target_id: rel.entityId,
        relation_type: thisLabel,
        label: label,
      });
    });
  });

  return relations;
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
  
  // Entities loader for refresh
  const { loadEntities } = useEntitiesLoader(projectId, { autoLoad: false });
  
  // Handler for when entities are updated (e.g., new relation created)
  const handleEntitiesUpdated = useCallback(() => {
    loadEntities(projectId);
  }, [loadEntities, projectId]);

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
  const activeDocument: DomainDocument | null = useMemo(() => {
    if (!activeTab || activeTab.type !== 'document') return null;
    return documents.find((d) => d.id === activeTab.id) ?? null;
  }, [activeTab, documents]);

  // Note: Document tabs are opened via FilesTab.handleSelectDocument when user clicks
  // No auto-open needed here - user explicitly chooses what to open

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

  // Convert domain entities/documents to Supabase format for legacy components
  const supabaseEntities = mapEntitiesToSupabase(entities);
  const supabaseDocuments = mapDocumentsToSupabase(documents);
  
  // Extract relations from entities for FlowCanvas
  const entityRelations = useMemo(() => {
    return extractRelationsFromEntities(entities);
  }, [entities]);

  // Determine what to show in editor mode
  const renderEditorContent = () => {

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
            content={documentContent}
            onUpdate={handleContentUpdate}
          />
        </div>
      );
    }

    // No tabs open - show empty state
    if (openTabs.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-fg-muted gap-6">
          <div className="text-6xl opacity-80">✨</div>
          <div className="text-center">
            <h2 className="text-xl font-medium text-fg mb-2">
              Откройте документ и творите!
            </h2>
            <p className="text-sm max-w-sm">
              Выберите документ в панели слева или создайте новый
            </p>
          </div>
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
            relations={entityRelations}
            onEntitiesUpdated={handleEntitiesUpdated}
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
                relations={entityRelations}
                onEntitiesUpdated={handleEntitiesUpdated}
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
