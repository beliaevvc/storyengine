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
  selectWorkspaceMode,
  type WorkspaceMode,
} from './useUIStore';

// Editor Store
export {
  useEditorStore,
  selectEditor,
  selectWordCount,
  selectCharacterCount,
  selectEditorDocumentId,
  selectIsDirty,
  selectActiveEntityIds,
  selectCursorPosition,
} from './useEditorStore';

// Workspace Store
export {
  useWorkspaceStore,
  selectOpenTabs,
  selectActiveTabId,
  selectActiveWorkspaceTab,
  selectTabById,
  selectIsTabOpen,
  selectHasOpenTabs,
  type Tab,
  type TabType,
} from './useWorkspaceStore';
