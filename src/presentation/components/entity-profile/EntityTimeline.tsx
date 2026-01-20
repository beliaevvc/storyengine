'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock, Loader2, Calendar, FileText, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { 
  getEventsByEntityAction, 
  getSceneDocumentsByEntityAction,
  type TimelineEvent,
  type SceneReference,
  type BlockReference,
} from '@/app/actions/supabase/timeline-actions';

// ============================================================================
// Local Storage helpers
// ============================================================================

interface TimelineState {
  expandedDocs: string[];
  expandedScenes: string[];
}

function getStorageKey(entityId: string) {
  return `timeline-state-${entityId}`;
}

function loadTimelineState(entityId: string): TimelineState {
  if (typeof window === 'undefined') return { expandedDocs: [], expandedScenes: [] };
  try {
    const stored = localStorage.getItem(getStorageKey(entityId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load timeline state:', e);
  }
  return { expandedDocs: [], expandedScenes: [] };
}

function saveTimelineState(entityId: string, state: TimelineState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(entityId), JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save timeline state:', e);
  }
}

// ============================================================================
// Main Component
// ============================================================================

interface EntityTimelineProps {
  entityId: string;
  projectId: string;
}

export function EntityTimeline({ entityId, projectId }: EntityTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [scenes, setScenes] = useState<SceneReference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Persisted expansion state
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set());
  const [stateLoaded, setStateLoaded] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const state = loadTimelineState(entityId);
    setExpandedDocs(new Set(state.expandedDocs));
    setExpandedScenes(new Set(state.expandedScenes));
    setStateLoaded(true);
  }, [entityId]);

  // Save state when it changes
  useEffect(() => {
    if (stateLoaded) {
      saveTimelineState(entityId, {
        expandedDocs: Array.from(expandedDocs),
        expandedScenes: Array.from(expandedScenes),
      });
    }
  }, [entityId, expandedDocs, expandedScenes, stateLoaded]);

  const toggleDoc = useCallback((docId: string) => {
    setExpandedDocs(prev => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  }, []);

  const toggleScene = useCallback((sceneKey: string) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      if (next.has(sceneKey)) {
        next.delete(sceneKey);
      } else {
        next.add(sceneKey);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        // Load both events and scenes in parallel
        const [eventsResult, scenesResult] = await Promise.all([
          getEventsByEntityAction(entityId, projectId),
          getSceneDocumentsByEntityAction(entityId, projectId),
        ]);

        if (eventsResult.success) {
          setEvents(eventsResult.data);
        }
        if (scenesResult.success) {
          setScenes(scenesResult.data);
        }
      } catch (err) {
        console.warn('Failed to load timeline data:', err);
      }

      setIsLoading(false);
    }

    loadData();
  }, [entityId, projectId]);

  const hasData = events.length > 0 || scenes.length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-fg-muted" />
          <h2 className="text-sm font-semibold text-fg">Хронология событий</h2>
        </div>
        <p className="text-xs text-fg-muted mt-1">
          События и сцены с участием персонажа
        </p>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-fg-muted" />
          </div>
        ) : !hasData ? (
          <EmptyTimeline />
        ) : (
          <div className="space-y-6">
            {/* Events section */}
            {events.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-fg-secondary mb-3 uppercase tracking-wider">
                  <Calendar className="w-3 h-3" />
                  События ({events.length})
                </div>
                <div className="space-y-2">
                  {events.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Scenes section */}
            {scenes.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-fg-secondary mb-3 uppercase tracking-wider">
                  <FileText className="w-3 h-3" />
                  Сцены ({scenes.length})
                </div>
                <div className="space-y-2">
                  {scenes.map((scene) => (
                    <SceneItem 
                      key={scene.documentId} 
                      scene={scene} 
                      projectId={projectId}
                      isExpanded={expandedDocs.has(scene.documentId)}
                      expandedScenes={expandedScenes}
                      onToggleDoc={() => toggleDoc(scene.documentId)}
                      onToggleScene={toggleScene}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function EmptyTimeline() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Clock className="w-10 h-10 text-fg-muted mb-3" />
      <h3 className="text-sm font-medium text-fg mb-1">Нет событий</h3>
      <p className="text-xs text-fg-muted max-w-[200px]">
        Персонаж пока не связан с событиями или сценами
      </p>
    </div>
  );
}

function EventItem({ event }: { event: TimelineEvent }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded hover:bg-overlay transition-colors">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div 
          className="w-3 h-3 rounded-full border-2" 
          style={{ 
            borderColor: event.timelineColor || '#539bf5',
            backgroundColor: `${event.timelineColor || '#539bf5'}40`
          }}
        />
        <div className="w-0.5 h-full bg-border mt-1" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="text-sm font-medium text-fg">{event.name}</div>
        {event.description && (
          <p className="text-xs text-fg-muted mt-0.5 line-clamp-2">
            {event.description}
          </p>
        )}
        {event.timelineName && (
          <span 
            className="inline-block text-xs px-1.5 py-0.5 rounded mt-1"
            style={{ 
              backgroundColor: `${event.timelineColor || '#539bf5'}20`,
              color: event.timelineColor || '#539bf5'
            }}
          >
            {event.timelineName}
          </span>
        )}
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  draft: '#71717a',
  review: '#f59e0b', 
  final: '#10b981',
};

const BLOCK_TYPE_LABELS: Record<string, string> = {
  dialogue: 'Диалог',
  description: 'Описание',
  action: 'Действие',
  thought: 'Мысли',
};

interface SceneItemProps {
  scene: SceneReference;
  projectId: string;
  isExpanded: boolean;
  expandedScenes: Set<string>;
  onToggleDoc: () => void;
  onToggleScene: (sceneKey: string) => void;
}

function SceneItem({ 
  scene, 
  projectId, 
  isExpanded, 
  expandedScenes,
  onToggleDoc,
  onToggleScene,
}: SceneItemProps) {
  // Group references by scene
  const sceneRefs = scene.references.filter(r => r.type === 'scene');
  const blockRefs = scene.references.filter(r => r.type === 'block');
  const mentionRefs = scene.references.filter(r => r.type === 'mention');
  
  // Group blocks/mentions by scene
  const refsByScene = new Map<string, BlockReference[]>();
  for (const ref of [...blockRefs, ...mentionRefs]) {
    const key = ref.sceneSlug || '_root';
    if (!refsByScene.has(key)) {
      refsByScene.set(key, []);
    }
    refsByScene.get(key)!.push(ref);
  }
  
  // Get unique scenes
  const uniqueScenes = new Map<string, BlockReference>();
  for (const ref of sceneRefs) {
    if (ref.sceneSlug && !uniqueScenes.has(ref.sceneSlug)) {
      uniqueScenes.set(ref.sceneSlug, ref);
    }
  }
  
  // Create unique key for scene within this document
  const getSceneKey = (slug: string) => `${scene.documentId}:${slug}`;
  
  const totalRefs = scene.references.length;
  
  return (
    <div className="mb-3">
      {/* Document header - collapsible */}
      <button
        onClick={onToggleDoc}
        className="w-full flex items-center gap-2 text-sm font-medium text-fg hover:text-accent-primary transition-colors mb-1 text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-fg-muted" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-fg-muted" />
        )}
        <FileText className="w-3.5 h-3.5" />
        <span className="flex-1 truncate">{scene.documentTitle}</span>
        <span className="text-xs text-fg-muted font-normal">
          {totalRefs}
        </span>
      </button>
      
      {scene.parentTitle && (
        <div className="text-xs text-fg-muted ml-7 mb-1">{scene.parentTitle}</div>
      )}
      
      {/* References - collapsible */}
      {isExpanded && (
        <div className="ml-4 border-l-2 border-border pl-3 space-y-1 mt-2">
          {/* Scenes with their nested content */}
          {Array.from(uniqueScenes.entries()).map(([slug, ref]) => {
            const sceneBlocks = refsByScene.get(slug) || [];
            const sceneKey = getSceneKey(slug);
            const isSceneExpanded = expandedScenes.has(sceneKey);
            
            return (
              <div key={slug} className="py-1">
                {/* Scene header */}
                <button
                  onClick={() => sceneBlocks.length > 0 && onToggleScene(sceneKey)}
                  className="w-full flex items-center gap-2 text-left hover:bg-overlay rounded px-1 -mx-1"
                >
                  {sceneBlocks.length > 0 ? (
                    isSceneExpanded ? (
                      <ChevronDown className="w-3 h-3 text-fg-muted" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-fg-muted" />
                    )
                  ) : (
                    <div className="w-3" />
                  )}
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[ref.sceneStatus || 'draft'] }}
                  />
                  <span className="text-sm text-fg flex-1">{slug}</span>
                  {sceneBlocks.length > 0 && (
                    <span className="text-xs text-fg-muted">{sceneBlocks.length}</span>
                  )}
                </button>
                
                {/* Nested blocks */}
                {isSceneExpanded && sceneBlocks.length > 0 && (
                  <div className="ml-5 mt-1 space-y-1">
                    {sceneBlocks.map((block, i) => (
                      <BlockItem key={i} block={block} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Blocks/mentions without scene */}
          {refsByScene.has('_root') && (
            <div className="space-y-1">
              {refsByScene.get('_root')!.map((block, i) => (
                <BlockItem key={i} block={block} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BlockItem({ block }: { block: BlockReference }) {
  if (block.type === 'mention') {
    return (
      <div className="flex items-center gap-2 py-0.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span className="text-xs text-fg-muted">Упоминание</span>
      </div>
    );
  }
  
  return (
    <div className="py-1">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-3 h-3 text-purple-400" />
        <span className="text-xs text-fg">
          {BLOCK_TYPE_LABELS[block.blockType || ''] || block.blockType}
          {block.speakerRole && (
            <span className="text-fg-muted"> — {block.speakerRole}</span>
          )}
        </span>
      </div>
      {block.textPreview && (
        <p className="text-xs text-fg-muted mt-0.5 ml-5 italic line-clamp-2">
          «{block.textPreview}»
        </p>
      )}
    </div>
  );
}
