'use client';

import { useEffect, useCallback } from 'react';
import { getEntities } from '@/app/actions/supabase/entity-actions';
import { useEntityStore } from '@/presentation/stores';
import type { Entity } from '@/core/entities';

interface UseEntitiesLoaderOptions {
  /** Auto-load on mount */
  autoLoad?: boolean;
}

interface UseEntitiesLoaderResult {
  /** Manually trigger entities load */
  loadEntities: (projectId: string) => Promise<void>;
  /** Loading state from store */
  isLoading: boolean;
  /** Error state from store */
  error: string | null;
}

/**
 * Hook for loading entities data from Supabase into the EntityStore.
 */
export function useEntitiesLoader(
  projectId: string | null,
  options: UseEntitiesLoaderOptions = {}
): UseEntitiesLoaderResult {
  const { autoLoad = true } = options;

  const isLoading = useEntityStore((s) => s.isLoading);
  const error = useEntityStore((s) => s.error);
  const { setEntities, setLoading, setError } = useEntityStore((s) => s.actions);

  const loadEntities = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await getEntities(id);

        if (supabaseError) {
          setError(supabaseError);
        } else if (data) {
          // Map Supabase data to domain entities
          const mappedEntities: Entity[] = data.map((e) => ({
            id: e.id,
            projectId: e.project_id,
            type: e.type,
            name: e.name,
            description: e.description || undefined,
            attributes: e.attributes || {},
            createdAt: new Date(e.created_at),
            updatedAt: new Date(e.updated_at),
          }));
          setEntities(mappedEntities);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entities');
      } finally {
        setLoading(false);
      }
    },
    [setEntities, setLoading, setError]
  );

  // Auto-load on mount if projectId provided
  useEffect(() => {
    if (autoLoad && projectId) {
      loadEntities(projectId);
    }
  }, [autoLoad, projectId, loadEntities]);

  return {
    loadEntities,
    isLoading,
    error,
  };
}
