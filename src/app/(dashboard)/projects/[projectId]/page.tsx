'use client';

import { useMemo, useState } from 'react';
import { AppLayout } from '@/presentation/components/layout';
import { ProjectExplorer } from '@/presentation/components/explorer';
import { WorkspacePanel, type WorkspaceMode } from '@/presentation/components/workspace';
import { ContextInspector } from '@/presentation/components/inspector';
import { useProjectStore, useDocumentStore } from '@/presentation/stores';
import { useProjectLoader, useEntitiesLoader, useDocumentsLoader } from '@/presentation/hooks';

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  // Workspace mode state (shared between Header and WorkspacePanel)
  const [activeMode, setActiveMode] = useState<WorkspaceMode>('editor');

  // Load data from Supabase
  const { isLoading: projectLoading } = useProjectLoader(params.projectId);
  const { isLoading: entitiesLoading } = useEntitiesLoader(params.projectId);
  const { isLoading: documentsLoading } = useDocumentsLoader(params.projectId);

  // Get data from stores
  const project = useProjectStore((s) => s.currentProject);
  const documents = useDocumentStore((s) => s.documents);
  const currentDocumentId = useDocumentStore((s) => s.currentDocumentId);

  // Find current document or fallback to first
  const currentDocument = useMemo(() => {
    if (currentDocumentId) {
      return documents.find((d) => d.id === currentDocumentId);
    }
    return documents[0];
  }, [documents, currentDocumentId]);

  // Derive values
  const projectTitle = project?.title ?? 'Загрузка...';

  // Show loading while data is fetching
  const isLoading = projectLoading || entitiesLoading || documentsLoading;

  return (
    <AppLayout
      projectId={params.projectId}
      projectTitle={projectTitle}
      activeMode={activeMode}
      onModeChange={setActiveMode}
      leftPanel={<ProjectExplorer />}
      centerPanel={
        isLoading ? (
          <div className="h-full flex items-center justify-center text-fg-muted">
            Загрузка...
          </div>
        ) : (
          <WorkspacePanel
            projectId={params.projectId}
            projectTitle={projectTitle}
            currentDocument={currentDocument || null}
            activeMode={activeMode}
          />
        )
      }
      rightPanel={<ContextInspector />}
    />
  );
}
