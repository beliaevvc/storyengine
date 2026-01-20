import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { EntityType } from '@/core/entities/entity';

// ============================================================================
// Types
// ============================================================================

export type TabType = 'document' | 'entity';

export interface Tab {
  id: string;
  type: TabType;
  title: string;
  entityType?: EntityType; // Only for entity tabs
  isDirty?: boolean;
}

interface WorkspaceState {
  openTabs: Tab[];
  activeTabId: string | null;

  actions: {
    openTab: (tab: Omit<Tab, 'isDirty'>) => void;
    closeTab: (id: string) => void;
    setActiveTab: (id: string | null) => void;
    updateTabTitle: (id: string, title: string) => void;
    setTabDirty: (id: string, isDirty: boolean) => void;
    closeOtherTabs: (id: string) => void;
    closeAllTabs: () => void;
    reorderTabs: (fromIndex: number, toIndex: number) => void;
  };
}

// ============================================================================
// Store
// ============================================================================

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set, get) => ({
        openTabs: [],
        activeTabId: null,

        actions: {
          openTab: (tab) =>
            set(
              (state) => {
                // Entity tabs are no longer supported - redirect to profile page
                if (tab.type === 'entity') {
                  return state;
                }

                // Check if tab already exists
                const existingTab = state.openTabs.find((t) => t.id === tab.id);
                if (existingTab) {
                  // Just switch to existing tab
                  return { activeTabId: tab.id };
                }

                // Add new tab and make it active
                return {
                  openTabs: [...state.openTabs, { ...tab, isDirty: false }],
                  activeTabId: tab.id,
                };
              },
              false,
              'openTab'
            ),

          closeTab: (id) =>
            set(
              (state) => {
                const tabIndex = state.openTabs.findIndex((t) => t.id === id);
                if (tabIndex === -1) return state;

                const newTabs = state.openTabs.filter((t) => t.id !== id);

                // Determine new active tab
                let newActiveTabId = state.activeTabId;
                if (state.activeTabId === id) {
                  if (newTabs.length === 0) {
                    newActiveTabId = null;
                  } else if (tabIndex >= newTabs.length) {
                    // Was last tab, select new last
                    newActiveTabId = newTabs[newTabs.length - 1].id;
                  } else {
                    // Select tab at same position
                    newActiveTabId = newTabs[tabIndex].id;
                  }
                }

                return {
                  openTabs: newTabs,
                  activeTabId: newActiveTabId,
                };
              },
              false,
              'closeTab'
            ),

          setActiveTab: (id) =>
            set({ activeTabId: id }, false, 'setActiveTab'),

          updateTabTitle: (id, title) =>
            set(
              (state) => ({
                openTabs: state.openTabs.map((t) =>
                  t.id === id ? { ...t, title } : t
                ),
              }),
              false,
              'updateTabTitle'
            ),

          setTabDirty: (id, isDirty) =>
            set(
              (state) => ({
                openTabs: state.openTabs.map((t) =>
                  t.id === id ? { ...t, isDirty } : t
                ),
              }),
              false,
              'setTabDirty'
            ),

          closeOtherTabs: (id) =>
            set(
              (state) => ({
                openTabs: state.openTabs.filter((t) => t.id === id),
                activeTabId: id,
              }),
              false,
              'closeOtherTabs'
            ),

          closeAllTabs: () =>
            set(
              { openTabs: [], activeTabId: null },
              false,
              'closeAllTabs'
            ),

          reorderTabs: (fromIndex, toIndex) =>
            set(
              (state) => {
                const newTabs = [...state.openTabs];
                const [removed] = newTabs.splice(fromIndex, 1);
                newTabs.splice(toIndex, 0, removed);
                return { openTabs: newTabs };
              },
              false,
              'reorderTabs'
            ),
        },
      }),
      {
        name: 'storyengine-workspace',
        partialize: (state) => ({
          // Filter out entity tabs - they use profile pages now
          openTabs: state.openTabs.filter((t) => t.type !== 'entity'),
          activeTabId: state.activeTabId,
        }),
        // Migration to remove existing entity tabs from storage
        migrate: (persistedState: unknown) => {
          const state = persistedState as { openTabs?: Tab[]; activeTabId?: string | null };
          if (state?.openTabs) {
            const filteredTabs = state.openTabs.filter((t) => t.type !== 'entity');
            const activeTabExists = filteredTabs.some((t) => t.id === state.activeTabId);
            return {
              openTabs: filteredTabs,
              activeTabId: activeTabExists ? state.activeTabId : (filteredTabs[0]?.id ?? null),
            };
          }
          return state;
        },
        version: 1,
      }
    ),
    { name: 'WorkspaceStore' }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectOpenTabs = (state: WorkspaceState) => state.openTabs;
export const selectActiveTabId = (state: WorkspaceState) => state.activeTabId;
export const selectActiveWorkspaceTab = (state: WorkspaceState) =>
  state.openTabs.find((t) => t.id === state.activeTabId) ?? null;
export const selectTabById = (id: string) => (state: WorkspaceState) =>
  state.openTabs.find((t) => t.id === id) ?? null;
export const selectIsTabOpen = (id: string) => (state: WorkspaceState) =>
  state.openTabs.some((t) => t.id === id);
export const selectHasOpenTabs = (state: WorkspaceState) =>
  state.openTabs.length > 0;
