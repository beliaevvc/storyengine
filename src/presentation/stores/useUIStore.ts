import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type PanelId = 'left' | 'right';
type TabId = 'files' | 'database';
type ModalId = 'createEntity' | 'createDocument' | 'editEntity' | 'settings' | 'projectInfo';
export type WorkspaceMode = 'editor' | 'plot' | 'timeline';

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
  workspaceMode: WorkspaceMode;
  // Entity Profile Modal
  entityProfileId: string | null;

  actions: {
    setPanelSize: (panel: PanelId, size: number) => void;
    togglePanel: (panel: PanelId) => void;
    setActiveTab: (tab: TabId) => void;
    openModal: (modal: ModalId) => void;
    closeModal: (modal: ModalId) => void;
    closeAllModals: () => void;
    selectEntity: (id: string | null) => void;
    toggleSidebar: () => void;
    setWorkspaceMode: (mode: WorkspaceMode) => void;
    // Entity Profile Modal
    openEntityProfile: (entityId: string) => void;
    closeEntityProfile: () => void;
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
  workspaceMode: 'editor' as WorkspaceMode,
  entityProfileId: null as string | null,
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

          setWorkspaceMode: (mode) =>
            set({ workspaceMode: mode }, false, 'setWorkspaceMode'),

          openEntityProfile: (entityId) =>
            set({ entityProfileId: entityId }, false, 'openEntityProfile'),

          closeEntityProfile: () =>
            set({ entityProfileId: null }, false, 'closeEntityProfile'),

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
          workspaceMode: state.workspaceMode,
          // entityProfileId не сохраняем - модал должен закрываться при reload
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
export const selectWorkspaceMode = (state: UIState) => state.workspaceMode;
export const selectEntityProfileId = (state: UIState) => state.entityProfileId;
