'use client';

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, Users, MapPin, Package, Link2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { SceneNode } from './nodes/SceneNode';
import { CharacterNode } from './nodes/CharacterNode';
import { LocationNode } from './nodes/LocationNode';
import { ItemNode } from './nodes/ItemNode';
import { RelationEdge } from './edges/RelationEdge';
import { extractScenesFromContent } from '@/presentation/utils/extractScenes';
import type { Entity, Document } from '@/types/supabase';
import type { TiptapContent } from '@/core/entities/document';

// Filter state interface
interface FlowFilters {
  showCharacters: boolean;
  showItems: boolean;
  showLocations: boolean;
  showRelations: boolean;
}

type FlowMode = 'plot' | 'characters' | 'locations';

// Storage keys
const VIEWPORT_STORAGE_KEY = 'flowcanvas-viewport';
const POSITIONS_STORAGE_KEY = 'flowcanvas-positions';
const FILTERS_STORAGE_KEY = 'flowcanvas-filters';

// Default filters
const DEFAULT_FILTERS: FlowFilters = {
  showCharacters: true,
  showItems: true,
  showLocations: true,
  showRelations: true,
};

// Filters persistence helpers
function getFiltersStorageKey(projectId: string, mode: FlowMode): string {
  return `${FILTERS_STORAGE_KEY}-${projectId}-${mode}`;
}

function saveFilters(projectId: string, mode: FlowMode, filters: FlowFilters): void {
  try {
    const key = getFiltersStorageKey(projectId, mode);
    localStorage.setItem(key, JSON.stringify(filters));
  } catch {
    // localStorage might be unavailable
  }
}

function loadFilters(projectId: string, mode: FlowMode): FlowFilters {
  try {
    const key = getFiltersStorageKey(projectId, mode);
    const stored = localStorage.getItem(key);
    if (stored) {
      return { ...DEFAULT_FILTERS, ...JSON.parse(stored) };
    }
  } catch {
    // localStorage might be unavailable or corrupted
  }
  return DEFAULT_FILTERS;
}

// Viewport persistence helpers
function getViewportStorageKey(projectId: string, mode: FlowMode): string {
  return `${VIEWPORT_STORAGE_KEY}-${projectId}-${mode}`;
}

function saveViewport(projectId: string, mode: FlowMode, viewport: Viewport): void {
  try {
    const key = getViewportStorageKey(projectId, mode);
    localStorage.setItem(key, JSON.stringify(viewport));
  } catch {
    // localStorage might be unavailable
  }
}

function loadViewport(projectId: string, mode: FlowMode): Viewport | null {
  try {
    const key = getViewportStorageKey(projectId, mode);
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as Viewport;
    }
  } catch {
    // localStorage might be unavailable or corrupted
  }
  return null;
}

// Node positions persistence helpers
type NodePositions = Record<string, { x: number; y: number }>;

function getPositionsStorageKey(projectId: string, mode: FlowMode): string {
  return `${POSITIONS_STORAGE_KEY}-${projectId}-${mode}`;
}

function saveNodePositions(projectId: string, mode: FlowMode, nodes: Node[]): void {
  try {
    const key = getPositionsStorageKey(projectId, mode);
    const positions: NodePositions = {};
    nodes.forEach((node) => {
      positions[node.id] = { x: node.position.x, y: node.position.y };
    });
    localStorage.setItem(key, JSON.stringify(positions));
  } catch {
    // localStorage might be unavailable
  }
}

function loadNodePositions(projectId: string, mode: FlowMode): NodePositions | null {
  try {
    const key = getPositionsStorageKey(projectId, mode);
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as NodePositions;
    }
  } catch {
    // localStorage might be unavailable or corrupted
  }
  return null;
}

function applyStoredPositions(nodes: Node[], storedPositions: NodePositions | null): Node[] {
  if (!storedPositions) return nodes;
  return nodes.map((node) => {
    const storedPos = storedPositions[node.id];
    if (storedPos) {
      return { ...node, position: storedPos };
    }
    return node;
  });
}

const nodeTypes = {
  scene: SceneNode,
  character: CharacterNode,
  location: LocationNode,
  item: ItemNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

interface FlowCanvasProps {
  projectId: string;
  documents?: Document[];
  entities?: Entity[];
  relations?: Array<{
    id: string;
    source_id: string;
    target_id: string;
    relation_type: string;
    label?: string;
  }>;
  onNodeClick?: (nodeId: string, type: string) => void;
}

// Main export - wraps inner component with ReactFlowProvider
export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

// Inner component that can use useReactFlow hook
function FlowCanvasInner({
  projectId,
  documents = [],
  entities = [],
  relations = [],
  onNodeClick,
}: FlowCanvasProps) {
  const [mode, setMode] = useState<FlowMode>('plot');
  const [filters, setFilters] = useState<FlowFilters>(() => loadFilters(projectId, 'characters'));
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const { setViewport, getViewport } = useReactFlow();
  
  // Refs to access current state in cleanup function
  const nodesRef = useRef<Node[]>([]);
  const modeRef = useRef<FlowMode>(mode);
  const projectIdRef = useRef(projectId);

  // Update filter
  const updateFilter = useCallback((key: keyof FlowFilters, value: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      saveFilters(projectId, mode, newFilters);
      return newFilters;
    });
  }, [projectId, mode]);

  // Convert data to nodes and edges based on mode, applying stored positions and filters
  const { initialNodes, initialEdges } = useMemo(() => {
    let result;
    if (mode === 'plot') {
      result = convertToPlotFlow(documents);
    } else if (mode === 'characters') {
      result = convertToCharacterMap(entities, relations, filters);
    } else {
      result = convertToLocationMap(entities, relations, filters);
    }
    
    // Apply stored positions
    const storedPositions = loadNodePositions(projectId, mode);
    return {
      initialNodes: applyStoredPositions(result.initialNodes, storedPositions),
      initialEdges: filters.showRelations ? result.initialEdges : [],
    };
  }, [mode, documents, entities, relations, projectId, filters]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep refs updated
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  
  useEffect(() => {
    projectIdRef.current = projectId;
  }, [projectId]);

  // Save state on unmount
  useEffect(() => {
    return () => {
      // Save positions and viewport when component unmounts
      saveNodePositions(projectIdRef.current, modeRef.current, nodesRef.current);
      try {
        const viewport = getViewport();
        saveViewport(projectIdRef.current, modeRef.current, viewport);
      } catch {
        // getViewport might fail if ReactFlow is already unmounted
      }
    };
  }, [getViewport]);

  // Sync nodes and edges when they change (mode switch or data update)
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Load saved viewport on initial mount and mode changes
  useEffect(() => {
    // Small delay to ensure ReactFlow is ready
    const timer = setTimeout(() => {
      const savedViewport = loadViewport(projectId, mode);
      if (savedViewport) {
        setViewport(savedViewport);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [projectId, mode, setViewport]);

  // Save viewport and positions before mode change
  const handleModeChange = useCallback((newMode: FlowMode) => {
    // Save current viewport and positions for current mode
    const currentViewport = getViewport();
    saveViewport(projectId, mode, currentViewport);
    saveNodePositions(projectId, mode, nodes);
    // Load filters for new mode
    setFilters(loadFilters(projectId, newMode));
    // Change mode
    setMode(newMode);
  }, [projectId, mode, getViewport, nodes]);

  // Save viewport on pan/zoom end
  const handleMoveEnd = useCallback(
    (_event: unknown, viewport: Viewport) => {
      saveViewport(projectId, mode, viewport);
    },
    [projectId, mode]
  );

  // Save node positions after drag
  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, _node: Node, updatedNodes: Node[]) => {
      saveNodePositions(projectId, mode, updatedNodes);
    },
    [projectId, mode]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id, node.type || 'unknown');
    },
    [onNodeClick]
  );

  // Get initial viewport from storage or use default
  const defaultViewport = useMemo(() => {
    const saved = loadViewport(projectId, mode);
    return saved || { x: 0, y: 0, zoom: 0.75 };
  }, [projectId, mode]);

  return (
    <div className="h-full w-full bg-[#1c2128]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onMoveEnd={handleMoveEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'relation',
          animated: false,
        }}
      >
        <Background color="#373e47" gap={20} />
        <Controls
          showInteractive={false}
          className="!bg-[#22272e] !border-[#444c56] !rounded-lg [&>button]:!bg-[#22272e] [&>button]:!border-[#444c56] [&>button]:!text-[#768390] [&>button:hover]:!bg-[#2d333b]"
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'scene') return '#539bf5';
            if (node.type === 'character') return '#60a5fa';
            if (node.type === 'location') return '#4ade80';
            if (node.type === 'item') return '#f59e0b';
            return '#768390';
          }}
          maskColor="rgba(28, 33, 40, 0.8)"
          className="!bg-[#22272e] !border-[#444c56] !rounded-lg"
        />

        {/* Mode Switcher */}
        <Panel position="top-left" className="!m-4">
          <div className="flex gap-1 bg-[#22272e] border border-[#444c56] rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeChange('plot')}
              className={mode === 'plot' ? 'bg-[#539bf5]/10 text-[#539bf5]' : ''}
            >
              <GitBranch className="w-4 h-4 mr-1" />
              Сюжет
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeChange('characters')}
              className={mode === 'characters' ? 'bg-[#539bf5]/10 text-[#539bf5]' : ''}
            >
              <Users className="w-4 h-4 mr-1" />
              Персонажи
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeChange('locations')}
              className={mode === 'locations' ? 'bg-[#539bf5]/10 text-[#539bf5]' : ''}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Локации
            </Button>
          </div>
        </Panel>

        {/* Filters Panel - показываем только в режимах characters и locations */}
        {(mode === 'characters' || mode === 'locations') && (
          <Panel position="top-center" className="!m-4">
            <div className="bg-[#22272e] border border-[#444c56] rounded-lg overflow-hidden">
              {/* Кнопка раскрытия/сворачивания */}
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#768390] hover:text-[#adbac7] transition-colors w-full"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Фильтры</span>
                {showFiltersPanel ? (
                  <ChevronUp className="w-3.5 h-3.5 ml-auto" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                )}
              </button>
              
              {/* Панель фильтров */}
              {showFiltersPanel && (
                <div className="px-3 py-2 border-t border-[#444c56] space-y-2">
                  {/* Типы сущностей */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.showCharacters}
                        onChange={(e) => updateFilter('showCharacters', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#444c56] bg-[#2d333b] text-blue-500 focus:ring-blue-500/20"
                      />
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-[#768390] group-hover:text-[#adbac7]">
                        Персонажи
                      </span>
                      <span className="text-[10px] text-[#545d68] ml-auto">
                        {entities.filter((e) => e.type === 'CHARACTER').length}
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.showItems}
                        onChange={(e) => updateFilter('showItems', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#444c56] bg-[#2d333b] text-amber-500 focus:ring-amber-500/20"
                      />
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs text-[#768390] group-hover:text-[#adbac7]">
                        Предметы
                      </span>
                      <span className="text-[10px] text-[#545d68] ml-auto">
                        {entities.filter((e) => e.type === 'ITEM').length}
                      </span>
                    </label>

                    {mode === 'locations' && (
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.showLocations}
                          onChange={(e) => updateFilter('showLocations', e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-[#444c56] bg-[#2d333b] text-green-500 focus:ring-green-500/20"
                        />
                        <MapPin className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs text-[#768390] group-hover:text-[#adbac7]">
                          Локации
                        </span>
                        <span className="text-[10px] text-[#545d68] ml-auto">
                          {entities.filter((e) => e.type === 'LOCATION').length}
                        </span>
                      </label>
                    )}
                  </div>
                  
                  {/* Разделитель */}
                  <div className="border-t border-[#373e47] pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.showRelations}
                        onChange={(e) => updateFilter('showRelations', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#444c56] bg-[#2d333b] text-purple-500 focus:ring-purple-500/20"
                      />
                      <Link2 className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs text-[#768390] group-hover:text-[#adbac7]">
                        Связи
                      </span>
                      <span className="text-[10px] text-[#545d68] ml-auto">
                        {relations.length}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        )}

        {/* Stats */}
        <Panel position="top-right" className="!m-4">
          <div className="text-xs text-[#768390] bg-[#22272e] border border-[#444c56] rounded-lg px-3 py-2">
            {mode === 'plot' && (() => {
              const folders = documents.filter((d) => d.type === 'FOLDER').length;
              const docs = documents.filter((d) => d.type === 'DOCUMENT' || d.type === 'NOTE').length;
              // Count scenes from content
              let sceneCount = 0;
              documents.forEach((doc) => {
                if (doc.content) {
                  const content = doc.content as unknown as TiptapContent;
                  if (content.content) {
                    sceneCount += content.content.filter((n) => n.type === 'scene').length;
                  }
                }
              });
              return `${folders} папок • ${docs} документов • ${sceneCount} сцен`;
            })()}
            {mode === 'characters' && (() => {
              const chars = filters.showCharacters ? entities.filter((e) => e.type === 'CHARACTER').length : 0;
              const items = filters.showItems ? entities.filter((e) => e.type === 'ITEM').length : 0;
              const parts = [];
              if (chars > 0) parts.push(`${chars} персонажей`);
              if (items > 0) parts.push(`${items} предметов`);
              return parts.join(' • ') || 'Нет элементов';
            })()}
            {mode === 'locations' && (() => {
              const locs = filters.showLocations ? entities.filter((e) => e.type === 'LOCATION').length : 0;
              const items = filters.showItems ? entities.filter((e) => e.type === 'ITEM').length : 0;
              const parts = [];
              if (locs > 0) parts.push(`${locs} локаций`);
              if (items > 0) parts.push(`${items} предметов`);
              return parts.join(' • ') || 'Нет элементов';
            })()}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Helper functions to convert data to nodes/edges

function convertToPlotFlow(documents: Document[]): {
  initialNodes: Node[];
  initialEdges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Get folders and documents
  const folders = documents.filter((d) => d.type === 'FOLDER');
  const docs = documents.filter((d) => d.type === 'DOCUMENT' || d.type === 'NOTE');

  // Group documents by folder
  const docsByFolder = new Map<string | null, Document[]>();
  docs.forEach((doc) => {
    const key = doc.parent_id || null;
    const existing = docsByFolder.get(key) || [];
    existing.push(doc);
    docsByFolder.set(key, existing);
  });

  // Sort everything
  folders.sort((a, b) => a.order - b.order);
  docsByFolder.forEach((list) => list.sort((a, b) => a.order - b.order));

  let globalSceneIndex = 0;
  let columnX = 0;
  let prevSceneId: string | null = null;

  // Process folders with their documents
  folders.forEach((folder, folderIndex) => {
    // Add folder as a header node
    nodes.push({
      id: folder.id,
      type: 'scene',
      position: { x: columnX, y: 0 },
      data: {
        title: folder.title,
        order: folder.order,
        type: 'FOLDER',
        isFolder: true,
      },
    });

    // Get documents in this folder
    const folderDocs = docsByFolder.get(folder.id) || [];
    let yOffset = 100;

    folderDocs.forEach((doc) => {
      // Add document node
      const docNodeId = `doc-${doc.id}`;
      nodes.push({
        id: docNodeId,
        type: 'scene',
        position: { x: columnX, y: yOffset },
        data: {
          title: doc.title,
          order: doc.order,
          type: 'DOCUMENT',
          isDocument: true,
        },
      });

      // Connect folder to first doc
      if (yOffset === 100) {
        edges.push({
          id: `e-${folder.id}-${docNodeId}`,
          source: folder.id,
          target: docNodeId,
          type: 'relation',
          animated: true,
        });
      }

      yOffset += 80;

      // Extract scenes from document content
      const content = doc.content as TiptapContent | null;
      const scenes = extractScenesFromContent(doc.id, content);

      scenes.forEach((scene, sceneIndex) => {
        nodes.push({
          id: scene.id,
          type: 'scene',
          position: { x: columnX, y: yOffset },
          data: {
            title: scene.slug,
            location: scene.location,
            status: scene.status,
            preview: scene.textPreview,
            order: globalSceneIndex,
            type: 'SCENE',
            isScene: true,
          },
        });

        // Connect to document or previous scene
        if (sceneIndex === 0) {
          edges.push({
            id: `e-${docNodeId}-${scene.id}`,
            source: docNodeId,
            target: scene.id,
            type: 'relation',
          });
        } else {
          const prevScene = scenes[sceneIndex - 1];
          edges.push({
            id: `e-${prevScene.id}-${scene.id}`,
            source: prevScene.id,
            target: scene.id,
            type: 'relation',
          });
        }

        // Connect to previous scene from different document for narrative flow
        if (prevSceneId && sceneIndex === 0) {
          edges.push({
            id: `e-flow-${prevSceneId}-${scene.id}`,
            source: prevSceneId,
            target: scene.id,
            type: 'relation',
            style: { strokeDasharray: '5,5', opacity: 0.4 },
          });
        }

        prevSceneId = scene.id;
        globalSceneIndex++;
        yOffset += 70;
      });

      yOffset += 20; // Gap between documents
    });

    columnX += 300;
  });

  // Process root-level documents (not in any folder)
  const rootDocs = docsByFolder.get(null) || [];
  if (rootDocs.length > 0) {
    let yOffset = 0;

    rootDocs.forEach((doc) => {
      const docNodeId = `doc-${doc.id}`;
      nodes.push({
        id: docNodeId,
        type: 'scene',
        position: { x: columnX, y: yOffset },
        data: {
          title: doc.title,
          order: doc.order,
          type: 'DOCUMENT',
          isDocument: true,
        },
      });

      yOffset += 80;

      // Extract scenes
      const content = doc.content as TiptapContent | null;
      const scenes = extractScenesFromContent(doc.id, content);

      scenes.forEach((scene, sceneIndex) => {
        nodes.push({
          id: scene.id,
          type: 'scene',
          position: { x: columnX, y: yOffset },
          data: {
            title: scene.slug,
            location: scene.location,
            status: scene.status,
            preview: scene.textPreview,
            order: globalSceneIndex,
            type: 'SCENE',
            isScene: true,
          },
        });

        if (sceneIndex === 0) {
          edges.push({
            id: `e-${docNodeId}-${scene.id}`,
            source: docNodeId,
            target: scene.id,
            type: 'relation',
          });
        } else {
          const prevScene = scenes[sceneIndex - 1];
          edges.push({
            id: `e-${prevScene.id}-${scene.id}`,
            source: prevScene.id,
            target: scene.id,
            type: 'relation',
          });
        }

        if (prevSceneId && sceneIndex === 0) {
          edges.push({
            id: `e-flow-${prevSceneId}-${scene.id}`,
            source: prevSceneId,
            target: scene.id,
            type: 'relation',
            style: { strokeDasharray: '5,5', opacity: 0.4 },
          });
        }

        prevSceneId = scene.id;
        globalSceneIndex++;
        yOffset += 70;
      });
    });
  }

  return { initialNodes: nodes, initialEdges: edges };
}

function convertToCharacterMap(
  entities: Entity[],
  relations: Array<{
    id: string;
    source_id: string;
    target_id: string;
    relation_type: string;
    label?: string;
  }>,
  filters: FlowFilters
): { initialNodes: Node[]; initialEdges: Edge[] } {
  const nodes: Node[] = [];
  const nodeIds = new Set<string>();

  // Фильтруем персонажей
  const characters = filters.showCharacters 
    ? entities.filter((e) => e.type === 'CHARACTER')
    : [];
  
  // Фильтруем предметы
  const items = filters.showItems 
    ? entities.filter((e) => e.type === 'ITEM')
    : [];

  // Общее количество элементов для расчета позиций
  const totalEntities = characters.length + items.length;
  
  // Arrange in a circle
  const centerX = 400;
  const centerY = 300;
  const baseRadius = 200;
  // Увеличиваем радиус если много элементов
  const radius = totalEntities > 8 ? baseRadius + (totalEntities - 8) * 15 : baseRadius;

  let currentIndex = 0;

  // Добавляем персонажей
  characters.forEach((char) => {
    const angle = (currentIndex / totalEntities) * 2 * Math.PI - Math.PI / 2; // Начинаем сверху
    const attrs = (char.attributes || {}) as Record<string, unknown>;
    const relationships = (attrs.relationships || []) as Array<unknown>;
    
    nodes.push({
      id: char.id,
      type: 'character',
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      data: {
        name: char.name,
        description: char.description,
        relationCount: relationships.length,
        attributes: attrs,
      },
    });
    nodeIds.add(char.id);
    currentIndex++;
  });

  // Добавляем предметы
  items.forEach((item) => {
    const angle = (currentIndex / totalEntities) * 2 * Math.PI - Math.PI / 2;
    const attrs = (item.attributes || {}) as Record<string, unknown>;
    
    nodes.push({
      id: item.id,
      type: 'item',
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      data: {
        name: item.name,
        description: item.description,
        attributes: attrs,
      },
    });
    nodeIds.add(item.id);
    currentIndex++;
  });

  // Фильтруем связи только между видимыми нодами
  const edges: Edge[] = relations
    .filter((r) => nodeIds.has(r.source_id) && nodeIds.has(r.target_id))
    .map((rel) => ({
      id: rel.id,
      source: rel.source_id,
      target: rel.target_id,
      type: 'relation',
      data: {
        label: rel.label,
        relationType: rel.relation_type,
      },
    }));

  return { initialNodes: nodes, initialEdges: edges };
}

function convertToLocationMap(
  entities: Entity[],
  relations: Array<{
    id: string;
    source_id: string;
    target_id: string;
    relation_type: string;
    label?: string;
  }>,
  filters: FlowFilters
): { initialNodes: Node[]; initialEdges: Edge[] } {
  const nodes: Node[] = [];
  const nodeIds = new Set<string>();

  // Фильтруем локации
  const locations = filters.showLocations 
    ? entities.filter((e) => e.type === 'LOCATION')
    : [];
  
  // Фильтруем предметы
  const items = filters.showItems 
    ? entities.filter((e) => e.type === 'ITEM')
    : [];

  let currentIndex = 0;
  const columnsCount = 4;

  // Добавляем локации
  locations.forEach((loc) => {
    nodes.push({
      id: loc.id,
      type: 'location',
      position: {
        x: (currentIndex % columnsCount) * 220 + 50,
        y: Math.floor(currentIndex / columnsCount) * 180 + 50,
      },
      data: {
        name: loc.name,
        description: loc.description,
        region: (loc.attributes as Record<string, unknown>)?.region,
      },
    });
    nodeIds.add(loc.id);
    currentIndex++;
  });

  // Добавляем предметы (в отдельной области под локациями)
  const itemsStartY = Math.ceil(locations.length / columnsCount) * 180 + 100;
  
  items.forEach((item, index) => {
    const attrs = (item.attributes || {}) as Record<string, unknown>;
    
    nodes.push({
      id: item.id,
      type: 'item',
      position: {
        x: (index % columnsCount) * 200 + 60,
        y: itemsStartY + Math.floor(index / columnsCount) * 150,
      },
      data: {
        name: item.name,
        description: item.description,
        attributes: attrs,
      },
    });
    nodeIds.add(item.id);
  });

  // Фильтруем связи только между видимыми нодами
  const edges: Edge[] = relations
    .filter((r) => nodeIds.has(r.source_id) && nodeIds.has(r.target_id))
    .map((rel) => ({
      id: rel.id,
      source: rel.source_id,
      target: rel.target_id,
      type: 'relation',
      data: {
        label: rel.label || 'путь',
      },
    }));

  return { initialNodes: nodes, initialEdges: edges };
}
