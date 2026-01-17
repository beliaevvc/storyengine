'use client';

import { useEffect, useCallback } from 'react';
import { getProject } from '@/app/actions/supabase/project-actions';
import { useProjectStore } from '@/presentation/stores';

interface UseProjectLoaderOptions {
  /** Auto-load on mount */
  autoLoad?: boolean;
}

interface UseProjectLoaderResult {
  /** Manually trigger project load */
  loadProject: (projectId: string) => Promise<void>;
  /** Loading state from store */
  isLoading: boolean;
  /** Error state from store */
  error: string | null;
}

/**
 * Hook for loading project data from Supabase into the ProjectStore.
 */
export function useProjectLoader(
  projectId: string | null,
  options: UseProjectLoaderOptions = {}
): UseProjectLoaderResult {
  const { autoLoad = true } = options;

  const isLoading = useProjectStore((s) => s.isLoading);
  const error = useProjectStore((s) => s.error);
  const { setProject, setLoading, setError } = useProjectStore((s) => s.actions);

  const loadProject = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await getProject(id);

        if (supabaseError) {
          setError(supabaseError);
        } else if (data) {
          // Map Supabase data to domain entity
          setProject({
            id: data.id,
            title: data.title,
            description: data.description || undefined,
            settings: data.settings || {},
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    },
    [setProject, setLoading, setError]
  );

  // Auto-load on mount if projectId provided
  useEffect(() => {
    if (autoLoad && projectId) {
      loadProject(projectId);
    }
  }, [autoLoad, projectId, loadProject]);

  return {
    loadProject,
    isLoading,
    error,
  };
}
