import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Project, ProjectSettings } from '@/core/entities/project';

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
