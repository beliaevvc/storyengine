'use client';

import { useEffect, useCallback } from 'react';
import { getDocuments } from '@/app/actions/supabase/document-actions';
import { useDocumentStore } from '@/presentation/stores';
import type { Document } from '@/core/entities/document';

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
          // DEBUG: Log raw data from Supabase
          console.log('[useDocumentsLoader] Raw data from Supabase:', data.map(d => ({
            id: d.id,
            title: d.title,
            hasContent: !!d.content,
            contentType: d.content ? (d.content as any).type : null,
            sceneCount: d.content && (d.content as any).content 
              ? (d.content as any).content.filter((n: any) => n.type === 'scene').length 
              : 0,
          })));

          // Map Supabase data to domain documents
          const mappedDocuments: Document[] = data.map((d) => ({
            id: d.id,
            projectId: d.project_id,
            parentId: d.parent_id || null,
            title: d.title,
            type: d.type as any,
            content: (d.content || { type: 'doc', content: [] }) as any,
            order: d.order,
            createdAt: new Date(d.created_at),
            updatedAt: new Date(d.updated_at),
          }));

          // DEBUG: Log mapped documents
          console.log('[useDocumentsLoader] Mapped documents:', mappedDocuments.map(d => ({
            id: d.id,
            title: d.title,
            sceneCount: d.content?.content?.filter((n: any) => n.type === 'scene').length || 0,
          })));

          setDocuments(mappedDocuments);
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
