# BUILD-08: State Management Plan

> **Plan ID**: BUILD-08
> **Component**: Zustand State Management
> **Dependencies**: CP-5, BUILD-02
> **Priority**: HIGH
> **Estimated Effort**: Phase 7 of Implementation

---

## 1. OBJECTIVE

Создать 5 Zustand stores согласно CP-5: Project, Entity, Document, Editor, UI с devtools и persist middleware.

---

## 2. FILES TO CREATE

```
src/presentation/stores/
├── useProjectStore.ts
├── useEntityStore.ts
├── useDocumentStore.ts
├── useEditorStore.ts
├── useUIStore.ts
└── index.ts
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Install Dependencies

```bash
npm install zustand
```

### Step 2: Create All Stores

**File**: `src/presentation/stores/useProjectStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Project, ProjectSettings } from '@/core/entities/project';

interface ProjectState {
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  actions: {
    setProject: (project: Project | null) => void;
    updateProject: (data: Partial<Project>) => void;
    updateSettings: (settings: Partial<ProjectSettings>) => void;
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
          set({ currentProject: project, error: null }, false, 'setProject'),

        updateProject: (data) =>
          set(
            (state) => ({
              currentProject: state.currentProject
                ? { ...state.currentProject, ...data, updatedAt: new Date() }
                : null,
            }),
            false,
            'updateProject'
          ),

        updateSettings: (settings) =>
          set(
            (state) => ({
              currentProject: state.currentProject
                ? {
                    ...state.currentProject,
                    settings: { ...state.currentProject.settings, ...settings },
                    updatedAt: new Date(),
                  }
                : null,
            }),
            false,
            'updateSettings'
          ),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'setLoading'),

        setError: (error) =>
          set({ error, isLoading: false }, false, 'setError'),

        reset: () =>
          set(initialState, false, 'resetProject'),
      },
    }),
    { name: 'ProjectStore' }
  )
);

// Selectors
export const selectProject = (state: ProjectState) => state.currentProject;
export const selectProjectId = (state: ProjectState) => state.currentProject?.id ?? null;
export const selectProjectTitle = (state: ProjectState) => state.currentProject?.title ?? '';
export const selectIsLoading = (state: ProjectState) => state.isLoading;
export const selectError = (state: ProjectState) => state.error;
```

**File**: `src/presentation/stores/useEntityStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Entity, EntityType } from '@/core/entities/entity';

interface EntityState {
  entities: Entity[];
  isLoading: boolean;
  error: string | null;

  actions: {
    setEntities: (entities: Entity[]) => void;
    addEntity: (entity: Entity) => void;
    updateEntity: (id: string, data: Partial<Entity>) => void;
    removeEntity: (id: string) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}

const initialState = {
  entities: [],
  isLoading: false,
  error: null,
};

export const useEntityStore = create<EntityState>()(
  devtools(
    (set) => ({
      ...initialState,

      actions: {
        setEntities: (entities) =>
          set({ entities, error: null }, false, 'setEntities'),

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
                e.id === id ? { ...e, ...data, updatedAt: new Date() } : e
              ),
            }),
            false,
            'updateEntity'
          ),

        removeEntity: (id) =>
          set(
            (state) => ({
              entities: state.entities.filter((e) => e.id !== id),
            }),
            false,
            'removeEntity'
          ),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'setLoading'),

        setError: (error) =>
          set({ error, isLoading: false }, false, 'setError'),

        reset: () =>
          set(initialState, false, 'resetEntities'),
      },
    }),
    { name: 'EntityStore' }
  )
);

// Selectors
export const selectEntities = (state: EntityState) => state.entities;

export const selectEntitiesByType = (type: EntityType) => (state: EntityState) =>
  state.entities.filter((e) => e.type === type);

export const selectEntityById = (id: string) => (state: EntityState) =>
  state.entities.find((e) => e.id === id) ?? null;

export const selectEntityByName = (name: string) => (state: EntityState) =>
  state.entities.find((e) => e.name.toLowerCase() === name.toLowerCase()) ?? null;
```

**File**: `src/presentation/stores/useDocumentStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Document, TiptapContent } from '@/core/entities/document';

interface DocumentState {
  documents: Document[];
  currentDocumentId: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;

  actions: {
    setDocuments: (documents: Document[]) => void;
    addDocument: (document: Document) => void;
    updateDocument: (id: string, data: Partial<Document>) => void;
    removeDocument: (id: string) => void;
    setCurrentDocument: (id: string | null) => void;
    updateContent: (content: TiptapContent) => void;
    setUnsavedChanges: (hasChanges: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}

const initialState = {
  documents: [],
  currentDocumentId: null,
  hasUnsavedChanges: false,
  isLoading: false,
  error: null,
};

export const useDocumentStore = create<DocumentState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      actions: {
        setDocuments: (documents) =>
          set({ documents, error: null }, false, 'setDocuments'),

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
                d.id === id ? { ...d, ...data, updatedAt: new Date() } : d
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
          set(
            { currentDocumentId: id, hasUnsavedChanges: false },
            false,
            'setCurrentDocument'
          ),

        updateContent: (content) => {
          const { currentDocumentId } = get();
          if (!currentDocumentId) return;

          set(
            (state) => ({
              documents: state.documents.map((d) =>
                d.id === currentDocumentId
                  ? { ...d, content, updatedAt: new Date() }
                  : d
              ),
              hasUnsavedChanges: true,
            }),
            false,
            'updateContent'
          );
        },

        setUnsavedChanges: (hasChanges) =>
          set({ hasUnsavedChanges: hasChanges }, false, 'setUnsavedChanges'),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'setLoading'),

        setError: (error) =>
          set({ error, isLoading: false }, false, 'setError'),

        reset: () =>
          set(initialState, false, 'resetDocuments'),
      },
    }),
    { name: 'DocumentStore' }
  )
);

// Selectors
export const selectDocuments = (state: DocumentState) => state.documents;

export const selectSortedDocuments = (state: DocumentState) =>
  [...state.documents].sort((a, b) => a.order - b.order);

export const selectCurrentDocument = (state: DocumentState) =>
  state.documents.find((d) => d.id === state.currentDocumentId) ?? null;

export const selectCurrentDocumentId = (state: DocumentState) =>
  state.currentDocumentId;

export const selectHasUnsavedChanges = (state: DocumentState) =>
  state.hasUnsavedChanges;
```

**File**: `src/presentation/stores/useEditorStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Editor } from '@tiptap/core';

interface CursorPosition {
  from: number;
  to: number;
}

interface EditorState {
  editor: Editor | null;
  cursorPosition: CursorPosition | null;
  activeEntityIds: string[];
  wordCount: number;
  characterCount: number;

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
          set(initialState, false, 'resetEditor'),
      },
    }),
    { name: 'EditorStore' }
  )
);

// Selectors
export const selectEditor = (state: EditorState) => state.editor;
export const selectCursorPosition = (state: EditorState) => state.cursorPosition;
export const selectActiveEntityIds = (state: EditorState) => state.activeEntityIds;
export const selectWordCount = (state: EditorState) => state.wordCount;
export const selectCharacterCount = (state: EditorState) => state.characterCount;
```

**File**: `src/presentation/stores/useUIStore.ts`

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type PanelId = 'left' | 'right';
type TabId = 'files' | 'database';
type ModalId = 'createEntity' | 'createDocument' | 'editEntity' | 'settings' | 'projectInfo';

interface PanelSizes {
  left: number;
  right: number;
}

interface UIState {
  panelSizes: PanelSizes;
  collapsedPanels: PanelId[];
  activeTab: TabId;
  openModals: ModalId[];
  selectedEntityId: string | null;
  isSidebarCollapsed: boolean;

  actions: {
    setPanelSize: (panel: PanelId, size: number) => void;
    togglePanel: (panel: PanelId) => void;
    setActiveTab: (tab: TabId) => void;
    openModal: (modal: ModalId) => void;
    closeModal: (modal: ModalId) => void;
    closeAllModals: () => void;
    selectEntity: (id: string | null) => void;
    toggleSidebar: () => void;
    reset: () => void;
  };
}

const initialState = {
  panelSizes: { left: 20, right: 25 },
  collapsedPanels: [] as PanelId[],
  activeTab: 'files' as TabId,
  openModals: [] as ModalId[],
  selectedEntityId: null,
  isSidebarCollapsed: false,
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
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
                openModals: state.openModals.includes(modal)
                  ? state.openModals
                  : [...state.openModals, modal],
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

          closeAllModals: () =>
            set({ openModals: [] }, false, 'closeAllModals'),

          selectEntity: (id) =>
            set({ selectedEntityId: id }, false, 'selectEntity'),

          toggleSidebar: () =>
            set(
              (state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }),
              false,
              'toggleSidebar'
            ),

          reset: () =>
            set(initialState, false, 'resetUI'),
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
export const selectCollapsedPanels = (state: UIState) => state.collapsedPanels;
export const selectIsCollapsed = (panel: PanelId) => (state: UIState) =>
  state.collapsedPanels.includes(panel);
export const selectActiveTab = (state: UIState) => state.activeTab;
export const selectOpenModals = (state: UIState) => state.openModals;
export const selectIsModalOpen = (modal: ModalId) => (state: UIState) =>
  state.openModals.includes(modal);
export const selectSelectedEntityId = (state: UIState) => state.selectedEntityId;
export const selectIsSidebarCollapsed = (state: UIState) => state.isSidebarCollapsed;
```

**File**: `src/presentation/stores/index.ts`

```typescript
// Project Store
export {
  useProjectStore,
  selectProject,
  selectProjectId,
  selectProjectTitle,
} from './useProjectStore';

// Entity Store
export {
  useEntityStore,
  selectEntities,
  selectEntitiesByType,
  selectEntityById,
  selectEntityByName,
} from './useEntityStore';

// Document Store
export {
  useDocumentStore,
  selectDocuments,
  selectSortedDocuments,
  selectCurrentDocument,
  selectCurrentDocumentId,
  selectHasUnsavedChanges,
} from './useDocumentStore';

// Editor Store
export {
  useEditorStore,
  selectEditor,
  selectCursorPosition,
  selectActiveEntityIds,
  selectWordCount,
  selectCharacterCount,
} from './useEditorStore';

// UI Store
export {
  useUIStore,
  selectPanelSizes,
  selectCollapsedPanels,
  selectIsCollapsed,
  selectActiveTab,
  selectOpenModals,
  selectIsModalOpen,
  selectSelectedEntityId,
  selectIsSidebarCollapsed,
} from './useUIStore';
```

---

## 4. SUCCESS CRITERIA

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | All stores created | 5 store files exist |
| 2 | TypeScript compiles | No type errors |
| 3 | Devtools work | Redux DevTools shows actions |
| 4 | UIStore persists | Refresh preserves panel sizes |
| 5 | Actions work | State updates correctly |
| 6 | Selectors work | Data selected correctly |
| 7 | Reset works | Stores clear on reset |
| 8 | Index exports | All stores importable |

---

## 5. COMMANDS TO EXECUTE

```bash
# Install Zustand
npm install zustand

# Create directory
mkdir -p src/presentation/stores
```

---

## 6. USAGE EXAMPLE

```typescript
// In a component
import { useProjectStore, useEntityStore, useUIStore } from '@/presentation/stores';

function MyComponent() {
  // Select state
  const project = useProjectStore((s) => s.currentProject);
  const entities = useEntityStore((s) => s.entities);
  const selectedEntityId = useUIStore((s) => s.selectedEntityId);
  
  // Get actions
  const { selectEntity } = useUIStore((s) => s.actions);
  
  // Use actions
  const handleClick = (id: string) => {
    selectEntity(id);
  };
  
  return <div>...</div>;
}
```

---

## 7. NOTES

- Only UIStore has persist middleware
- All stores have devtools for debugging
- Actions are grouped in `actions` object
- Selectors are exported separately for reuse
- Editor store holds Tiptap editor reference
