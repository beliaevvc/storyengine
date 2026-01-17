# 🎨🎨🎨 CREATIVE PHASE CP-5: STATE MANAGEMENT ARCHITECTURE 🎨🎨🎨

> **Phase ID**: CP-5
> **Type**: Architecture Design
> **Priority**: MEDIUM
> **Status**: IN PROGRESS
> **Created**: 2026-01-17

---

## 1. PROBLEM STATEMENT

### Контекст
StoryEngine нуждается в client-side state management для:
- Текущего проекта и его данных
- Списка entities и selected entity
- Editor state и metadata
- UI state (панели, модалы, selection)

### Требования

| Требование | Описание |
|------------|----------|
| R1 | Zustand как основной state manager |
| R2 | Отдельные stores по доменам |
| R3 | TypeScript strict typing |
| R4 | Selectors для performance |
| R5 | Persist для UI preferences |
| R6 | DevTools поддержка |

### Ограничения

- Next.js 14 (Server + Client components)
- Zustand stores только для client-side state
- Server state через Server Actions / React Query (future)

---

## 2. STATE DOMAINS ANALYSIS

### 2.1 Project State
- Текущий открытый проект
- Project settings
- Project metadata

### 2.2 Entity State
- Список всех entities проекта
- Selected entity (для Inspector)
- Entity filtering/search

### 2.3 Document State
- Текущий открытый документ
- Document list
- Document content (Tiptap JSON)

### 2.4 Editor State
- Tiptap editor instance reference
- Cursor position
- Selection info
- Active entities в текущем view

### 2.5 UI State
- Panel sizes
- Active tabs
- Modal states
- Sidebar collapse state

---

## 3. OPTIONS ANALYSIS

### Option 1: Single Monolithic Store

**Description**: Один большой store со всем state.

```typescript
interface AppState {
  project: Project | null;
  entities: Entity[];
  documents: Document[];
  currentDocument: Document | null;
  selectedEntityId: string | null;
  ui: UIState;
  // actions...
}
```

**Pros**:
- ✅ Простой setup
- ✅ Легко шарить state между разделами

**Cons**:
- ❌ Большой bundle
- ❌ Re-renders при любом изменении
- ❌ Сложнее тестировать
- ❌ Не масштабируется

**Complexity**: Low
**Implementation Time**: Short

---

### Option 2: Domain-Separated Stores (Recommended)

**Description**: Отдельные stores по доменам с четкими границами.

```typescript
// Separate stores
const useProjectStore = create<ProjectStore>(...);
const useEntityStore = create<EntityStore>(...);
const useDocumentStore = create<DocumentStore>(...);
const useEditorStore = create<EditorStore>(...);
const useUIStore = create<UIStore>(...);
```

**Pros**:
- ✅ Изолированные домены
- ✅ Лучшая performance (selective re-renders)
- ✅ Легко тестировать
- ✅ Масштабируемость
- ✅ Tree-shaking friendly

**Cons**:
- ❌ Нужна координация между stores
- ❌ Больше файлов
- ❌ Cross-store logic сложнее

**Complexity**: Medium
**Implementation Time**: Medium

---

### Option 3: Atomic Stores (Jotai-style)

**Description**: Очень мелкие атомарные stores для каждого piece of state.

```typescript
const projectAtom = atom<Project | null>(null);
const entitiesAtom = atom<Entity[]>([]);
const selectedEntityIdAtom = atom<string | null>(null);
// Many more atoms...
```

**Pros**:
- ✅ Максимальная гранулярность
- ✅ Отличная performance

**Cons**:
- ❌ Слишком много атомов
- ❌ Сложнее отслеживать
- ❌ Не идиоматично для Zustand

**Complexity**: High
**Implementation Time**: Long

---

## 4. 🎯 DECISION

### Выбранный подход: **Option 2 — Domain-Separated Stores**

### Rationale

1. **Чистые границы**: Каждый store отвечает за свой домен.
2. **Performance**: Selective subscriptions предотвращают лишние re-renders.
3. **Testability**: Stores можно тестировать изолированно.
4. **Scalability**: Легко добавить новые stores.

---

## 5. STORE DESIGNS

### 5.1 Project Store

```typescript
// src/presentation/stores/useProjectStore.ts

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface Project {
  id: string;
  title: string;
  description: string | null;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectState {
  // State
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  actions: {
    setProject: (project: Project | null) => void;
    updateProject: (data: Partial<Project>) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}

const initialState = {
  currentProject: null,
  isLoading: false,
  error: null,
};

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      actions: {
        setProject: (project) => 
          set({ currentProject: project }, false, 'setProject'),
          
        updateProject: (data) =>
          set(
            (state) => ({
              currentProject: state.currentProject
                ? { ...state.currentProject, ...data }
                : null,
            }),
            false,
            'updateProject'
          ),
          
        setLoading: (isLoading) => 
          set({ isLoading }, false, 'setLoading'),
          
        setError: (error) => 
          set({ error }, false, 'setError'),
          
        reset: () => 
          set(initialState, false, 'reset'),
      },
    }),
    { name: 'ProjectStore' }
  )
);

// Selectors
export const selectProject = (state: ProjectState) => state.currentProject;
export const selectProjectId = (state: ProjectState) => state.currentProject?.id;
export const selectIsLoading = (state: ProjectState) => state.isLoading;
```

### 5.2 Entity Store

```typescript
// src/presentation/stores/useEntityStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { EntityType } from '@prisma/client';

interface Entity {
  id: string;
  projectId: string;
  type: EntityType;
  name: string;
  description: string | null;
  attributes: Record<string, unknown>;
  imageUrl: string | null;
}

interface EntityState {
  // State
  entities: Entity[];
  selectedEntityId: string | null;
  filterType: EntityType | null;
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  actions: {
    setEntities: (entities: Entity[]) => void;
    addEntity: (entity: Entity) => void;
    updateEntity: (id: string, data: Partial<Entity>) => void;
    removeEntity: (id: string) => void;
    selectEntity: (id: string | null) => void;
    setFilterType: (type: EntityType | null) => void;
    setSearchQuery: (query: string) => void;
    setLoading: (isLoading: boolean) => void;
    reset: () => void;
  };
}

const initialState = {
  entities: [],
  selectedEntityId: null,
  filterType: null,
  searchQuery: '',
  isLoading: false,
};

export const useEntityStore = create<EntityState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      actions: {
        setEntities: (entities) => 
          set({ entities }, false, 'setEntities'),
          
        addEntity: (entity) =>
          set(
            (state) => ({ entities: [...state.entities, entity] }),
            false,
            'addEntity'
          ),
          
        updateEntity: (id, data) =>
          set(
            (state) => ({
              entities: state.entities.map((e) =>
                e.id === id ? { ...e, ...data } : e
              ),
            }),
            false,
            'updateEntity'
          ),
          
        removeEntity: (id) =>
          set(
            (state) => ({
              entities: state.entities.filter((e) => e.id !== id),
              selectedEntityId:
                state.selectedEntityId === id ? null : state.selectedEntityId,
            }),
            false,
            'removeEntity'
          ),
          
        selectEntity: (id) => 
          set({ selectedEntityId: id }, false, 'selectEntity'),
          
        setFilterType: (type) => 
          set({ filterType: type }, false, 'setFilterType'),
          
        setSearchQuery: (query) => 
          set({ searchQuery: query }, false, 'setSearchQuery'),
          
        setLoading: (isLoading) => 
          set({ isLoading }, false, 'setLoading'),
          
        reset: () => 
          set(initialState, false, 'reset'),
      },
    }),
    { name: 'EntityStore' }
  )
);

// Selectors
export const selectEntities = (state: EntityState) => state.entities;

export const selectSelectedEntity = (state: EntityState) =>
  state.entities.find((e) => e.id === state.selectedEntityId) ?? null;

export const selectFilteredEntities = (state: EntityState) => {
  let filtered = state.entities;
  
  if (state.filterType) {
    filtered = filtered.filter((e) => e.type === state.filterType);
  }
  
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
};

export const selectEntitiesByType = (type: EntityType) => (state: EntityState) =>
  state.entities.filter((e) => e.type === type);
```

### 5.3 Document Store

```typescript
// src/presentation/stores/useDocumentStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Document {
  id: string;
  projectId: string;
  title: string;
  content: object; // Tiptap JSON
  order: number;
}

interface DocumentState {
  // State
  documents: Document[];
  currentDocumentId: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  
  // Actions
  actions: {
    setDocuments: (documents: Document[]) => void;
    addDocument: (document: Document) => void;
    updateDocument: (id: string, data: Partial<Document>) => void;
    removeDocument: (id: string) => void;
    setCurrentDocument: (id: string | null) => void;
    updateContent: (content: object) => void;
    setUnsavedChanges: (hasChanges: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    reset: () => void;
  };
}

const initialState = {
  documents: [],
  currentDocumentId: null,
  hasUnsavedChanges: false,
  isLoading: false,
};

export const useDocumentStore = create<DocumentState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      actions: {
        setDocuments: (documents) =>
          set({ documents }, false, 'setDocuments'),
          
        addDocument: (document) =>
          set(
            (state) => ({ documents: [...state.documents, document] }),
            false,
            'addDocument'
          ),
          
        updateDocument: (id, data) =>
          set(
            (state) => ({
              documents: state.documents.map((d) =>
                d.id === id ? { ...d, ...data } : d
              ),
            }),
            false,
            'updateDocument'
          ),
          
        removeDocument: (id) =>
          set(
            (state) => ({
              documents: state.documents.filter((d) => d.id !== id),
              currentDocumentId:
                state.currentDocumentId === id ? null : state.currentDocumentId,
            }),
            false,
            'removeDocument'
          ),
          
        setCurrentDocument: (id) =>
          set({ currentDocumentId: id, hasUnsavedChanges: false }, false, 'setCurrentDocument'),
          
        updateContent: (content) =>
          set(
            (state) => {
              const doc = state.documents.find(
                (d) => d.id === state.currentDocumentId
              );
              if (!doc) return state;
              
              return {
                documents: state.documents.map((d) =>
                  d.id === state.currentDocumentId ? { ...d, content } : d
                ),
                hasUnsavedChanges: true,
              };
            },
            false,
            'updateContent'
          ),
          
        setUnsavedChanges: (hasChanges) =>
          set({ hasUnsavedChanges: hasChanges }, false, 'setUnsavedChanges'),
          
        setLoading: (isLoading) =>
          set({ isLoading }, false, 'setLoading'),
          
        reset: () =>
          set(initialState, false, 'reset'),
      },
    }),
    { name: 'DocumentStore' }
  )
);

// Selectors
export const selectDocuments = (state: DocumentState) => state.documents;

export const selectCurrentDocument = (state: DocumentState) =>
  state.documents.find((d) => d.id === state.currentDocumentId) ?? null;

export const selectSortedDocuments = (state: DocumentState) =>
  [...state.documents].sort((a, b) => a.order - b.order);
```

### 5.4 Editor Store

```typescript
// src/presentation/stores/useEditorStore.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Editor } from '@tiptap/core';

interface CursorPosition {
  from: number;
  to: number;
}

interface EditorState {
  // State
  editor: Editor | null;
  cursorPosition: CursorPosition | null;
  activeEntityIds: string[]; // Entities currently visible/in selection
  wordCount: number;
  characterCount: number;
  
  // Actions
  actions: {
    setEditor: (editor: Editor | null) => void;
    setCursorPosition: (position: CursorPosition | null) => void;
    setActiveEntityIds: (ids: string[]) => void;
    updateCounts: (words: number, characters: number) => void;
    reset: () => void;
  };
}

const initialState = {
  editor: null,
  cursorPosition: null,
  activeEntityIds: [],
  wordCount: 0,
  characterCount: 0,
};

export const useEditorStore = create<EditorState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      actions: {
        setEditor: (editor) =>
          set({ editor }, false, 'setEditor'),
          
        setCursorPosition: (position) =>
          set({ cursorPosition: position }, false, 'setCursorPosition'),
          
        setActiveEntityIds: (ids) =>
          set({ activeEntityIds: ids }, false, 'setActiveEntityIds'),
          
        updateCounts: (words, characters) =>
          set({ wordCount: words, characterCount: characters }, false, 'updateCounts'),
          
        reset: () =>
          set(initialState, false, 'reset'),
      },
    }),
    { name: 'EditorStore' }
  )
);

// Selectors
export const selectEditor = (state: EditorState) => state.editor;
export const selectWordCount = (state: EditorState) => state.wordCount;
export const selectCharacterCount = (state: EditorState) => state.characterCount;
```

### 5.5 UI Store (with Persist)

```typescript
// src/presentation/stores/useUIStore.ts

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type PanelId = 'left' | 'right';
type TabId = 'files' | 'database';
type ModalId = 'createEntity' | 'createDocument' | 'settings' | 'projectInfo';

interface PanelSizes {
  left: number;
  right: number;
}

interface UIState {
  // State
  panelSizes: PanelSizes;
  collapsedPanels: PanelId[];
  activeTab: TabId;
  openModals: ModalId[];
  selectedEntityId: string | null; // For Inspector highlight
  isSidebarCollapsed: boolean;
  
  // Actions
  actions: {
    setPanelSize: (panel: PanelId, size: number) => void;
    togglePanel: (panel: PanelId) => void;
    setActiveTab: (tab: TabId) => void;
    openModal: (modal: ModalId) => void;
    closeModal: (modal: ModalId) => void;
    selectEntity: (id: string | null) => void;
    toggleSidebar: () => void;
    reset: () => void;
  };
}

const initialState = {
  panelSizes: { left: 260, right: 320 },
  collapsedPanels: [] as PanelId[],
  activeTab: 'files' as TabId,
  openModals: [] as ModalId[],
  selectedEntityId: null,
  isSidebarCollapsed: false,
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        actions: {
          setPanelSize: (panel, size) =>
            set(
              (state) => ({
                panelSizes: { ...state.panelSizes, [panel]: size },
              }),
              false,
              'setPanelSize'
            ),
            
          togglePanel: (panel) =>
            set(
              (state) => ({
                collapsedPanels: state.collapsedPanels.includes(panel)
                  ? state.collapsedPanels.filter((p) => p !== panel)
                  : [...state.collapsedPanels, panel],
              }),
              false,
              'togglePanel'
            ),
            
          setActiveTab: (tab) =>
            set({ activeTab: tab }, false, 'setActiveTab'),
            
          openModal: (modal) =>
            set(
              (state) => ({
                openModals: [...state.openModals, modal],
              }),
              false,
              'openModal'
            ),
            
          closeModal: (modal) =>
            set(
              (state) => ({
                openModals: state.openModals.filter((m) => m !== modal),
              }),
              false,
              'closeModal'
            ),
            
          selectEntity: (id) =>
            set({ selectedEntityId: id }, false, 'selectEntity'),
            
          toggleSidebar: () =>
            set(
              (state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }),
              false,
              'toggleSidebar'
            ),
            
          reset: () =>
            set(initialState, false, 'reset'),
        },
      }),
      {
        name: 'storyengine-ui',
        partialize: (state) => ({
          panelSizes: state.panelSizes,
          collapsedPanels: state.collapsedPanels,
          activeTab: state.activeTab,
          isSidebarCollapsed: state.isSidebarCollapsed,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// Selectors
export const selectPanelSizes = (state: UIState) => state.panelSizes;
export const selectIsCollapsed = (panel: PanelId) => (state: UIState) =>
  state.collapsedPanels.includes(panel);
export const selectActiveTab = (state: UIState) => state.activeTab;
export const selectIsModalOpen = (modal: ModalId) => (state: UIState) =>
  state.openModals.includes(modal);
export const selectSelectedEntityId = (state: UIState) => state.selectedEntityId;
```

---

## 6. STORE COORDINATION

### 6.1 Combined Hook for Project Loading

```typescript
// src/presentation/hooks/useLoadProject.ts

import { useCallback } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { useEntityStore } from '../stores/useEntityStore';
import { useDocumentStore } from '../stores/useDocumentStore';

export function useLoadProject() {
  const setProject = useProjectStore((s) => s.actions.setProject);
  const setEntities = useEntityStore((s) => s.actions.setEntities);
  const setDocuments = useDocumentStore((s) => s.actions.setDocuments);
  
  const resetProject = useProjectStore((s) => s.actions.reset);
  const resetEntities = useEntityStore((s) => s.actions.reset);
  const resetDocuments = useDocumentStore((s) => s.actions.reset);
  
  const loadProject = useCallback(
    async (projectId: string) => {
      // Reset all stores
      resetProject();
      resetEntities();
      resetDocuments();
      
      try {
        // Fetch project data (via Server Action or API)
        const data = await fetchProjectData(projectId);
        
        // Populate stores
        setProject(data.project);
        setEntities(data.entities);
        setDocuments(data.documents);
      } catch (error) {
        console.error('Failed to load project:', error);
        throw error;
      }
    },
    [setProject, setEntities, setDocuments, resetProject, resetEntities, resetDocuments]
  );
  
  const unloadProject = useCallback(() => {
    resetProject();
    resetEntities();
    resetDocuments();
  }, [resetProject, resetEntities, resetDocuments]);
  
  return { loadProject, unloadProject };
}
```

### 6.2 Index Export

```typescript
// src/presentation/stores/index.ts

export { useProjectStore, selectProject, selectProjectId } from './useProjectStore';
export { useEntityStore, selectEntities, selectSelectedEntity, selectFilteredEntities } from './useEntityStore';
export { useDocumentStore, selectDocuments, selectCurrentDocument } from './useDocumentStore';
export { useEditorStore, selectEditor, selectWordCount } from './useEditorStore';
export { useUIStore, selectPanelSizes, selectActiveTab, selectSelectedEntityId } from './useUIStore';
```

---

## 7. DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    SERVER (Next.js)                              │   │
│  │  ┌────────────────┐    ┌────────────────┐                       │   │
│  │  │ Server Actions │    │   Database     │                       │   │
│  │  │ (Mutations)    │◀──▶│   (Prisma)     │                       │   │
│  │  └───────┬────────┘    └────────────────┘                       │   │
│  └──────────┼──────────────────────────────────────────────────────┘   │
│             │                                                            │
│             ▼                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    CLIENT (Zustand Stores)                       │   │
│  │                                                                  │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │   │
│  │  │ProjectStore  │ │ EntityStore  │ │DocumentStore │            │   │
│  │  │- project     │ │- entities    │ │- documents   │            │   │
│  │  │- isLoading   │ │- selected    │ │- current     │            │   │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘            │   │
│  │         │                │                │                     │   │
│  │  ┌──────────────┐ ┌──────────────┐                              │   │
│  │  │ EditorStore  │ │   UIStore    │                              │   │
│  │  │- editor ref  │ │- panelSizes  │ ← persisted                  │   │
│  │  │- cursor      │ │- modals      │                              │   │
│  │  └──────┬───────┘ └──────┬───────┘                              │   │
│  └─────────┼────────────────┼──────────────────────────────────────┘   │
│            │                │                                           │
│            ▼                ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                  React Components                                │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│  │  │ Explorer │ │  Editor  │ │Inspector │ │  Layout  │           │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. VERIFICATION CHECKLIST

### Requirements Coverage
- [x] R1: Zustand как основной manager ✅
- [x] R2: 5 отдельных stores ✅
- [x] R3: TypeScript strict typing ✅
- [x] R4: Selectors для каждого store ✅
- [x] R5: Persist middleware для UIStore ✅
- [x] R6: Devtools middleware для всех stores ✅

### Technical Validation
- [x] Actions отделены от state
- [x] Selectors оптимизированы
- [x] Reset функции для cleanup
- [x] Index export для удобства

---

## 9. NEXT STEPS

1. Создать директорию `src/presentation/stores/`
2. Реализовать все 5 stores
3. Создать hooks для координации stores
4. Интегрировать с компонентами

---

# 🎨🎨🎨 EXITING CREATIVE PHASE CP-5 🎨🎨🎨

## Summary
Выбрана архитектура с 5 domain-separated Zustand stores: Project, Entity, Document, Editor, UI.

## Key Decisions
1. Отдельные stores по доменам для изоляции и performance
2. Actions объект внутри store для группировки
3. Devtools middleware для всех stores
4. Persist middleware только для UIStore (preferences)
5. Selectors экспортируются отдельно

## Files to Create
- `src/presentation/stores/useProjectStore.ts`
- `src/presentation/stores/useEntityStore.ts`
- `src/presentation/stores/useDocumentStore.ts`
- `src/presentation/stores/useEditorStore.ts`
- `src/presentation/stores/useUIStore.ts`
- `src/presentation/stores/index.ts`
- `src/presentation/hooks/useLoadProject.ts`
