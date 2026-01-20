'use client';

import { useEffect, useCallback } from 'react';
import { getDocuments } from '@/app/actions/supabase/document-actions';
import { useDocumentStore } from '@/presentation/stores';
import { mapSupabaseToDocuments } from '@/lib/mappers';

interface UseDocumentsLoaderOptions {
  /** Auto-load on mount */
  autoLoad?: boolean;
}

interface UseDocumentsLoaderResult {
  /** Manually trigger documents load */
  loadDocuments: (projectId: string) => Promise<void>;
  /** Loading state from store */
  isLoading: boolean;
  /** Error state from store */
  error: string | null;
}

/**
 * Hook for loading documents data from Supabase into the DocumentStore.
 */
export function useDocumentsLoader(
  projectId: string | null,
  options: UseDocumentsLoaderOptions = {}
): UseDocumentsLoaderResult {
  const { autoLoad = true } = options;

  const isLoading = useDocumentStore((s) => s.isLoading);
  const error = useDocumentStore((s) => s.error);
  const { setDocuments, setLoading, setError } = useDocumentStore((s) => s.actions);

  const loadDocuments = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await getDocuments(id);

        if (supabaseError) {
          setError(supabaseError);
        } else if (data) {
          setDocuments(mapSupabaseToDocuments(data));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    },
    [setDocuments, setLoading, setError]
  );

  // Auto-load on mount if projectId provided
  useEffect(() => {
    if (autoLoad && projectId) {
      loadDocuments(projectId);
    }
  }, [autoLoad, projectId, loadDocuments]);

  return {
    loadDocuments,
    isLoading,
    error,
  };
}
