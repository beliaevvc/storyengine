'use client';

import { useState, useTransition, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Loader2, Folder, FileText } from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { SearchInput } from './SearchInput';
import { FileTree } from './FileTree';
import { useDocumentStore, useWorkspaceStore } from '@/presentation/stores';
import { createDocument } from '@/app/actions/supabase/document-actions';
import { createDefaultDocumentContent } from '@/presentation/utils/migrateDocument';
import type { Document } from '@/core/entities/document';

export function FilesTab() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const documents = useDocumentStore((s) => s.documents);
  const currentDocumentId = useDocumentStore((s) => s.currentDocumentId);
  const setCurrentDocument = useDocumentStore((s) => s.actions.setCurrentDocument);
  const addDocument = useDocumentStore((s) => s.actions.addDocument);
  const openTab = useWorkspaceStore((s) => s.actions.openTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);

  // Count folders and docs for naming
  const foldersCount = documents.filter((d) => d.type === 'FOLDER' && !d.parentId).length;
  const rootDocsCount = documents.filter((d) => d.type === 'DOCUMENT' && !d.parentId).length;

  // Filter documents by search query
  const filteredDocuments = searchQuery
    ? documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : documents;

  const handleCreateFolder = () => {
    setShowMenu(false);
    startTransition(async () => {
      const { data, error } = await createDocument({
        project_id: projectId,
        title: `Папка ${foldersCount + 1}`,
        type: 'FOLDER',
        content: null,
      });

      if (data && !error) {
        const newDoc: Document = {
          id: data.id,
          projectId: data.project_id,
          parentId: data.parent_id || null,
          title: data.title,
          content: data.content as any,
          type: data.type as any,
          order: data.order,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
        addDocument(newDoc);
      }
    });
  };

  const handleCreateDocument = () => {
    setShowMenu(false);
    startTransition(async () => {
      const { data, error } = await createDocument({
        project_id: projectId,
        title: `Документ ${rootDocsCount + 1}`,
        type: 'DOCUMENT',
        content: createDefaultDocumentContent(),
      });

      if (data && !error) {
        const newDoc: Document = {
          id: data.id,
          projectId: data.project_id,
          parentId: data.parent_id || null,
          title: data.title,
          content: data.content as any,
          type: data.type as any,
          order: data.order,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
        addDocument(newDoc);
        handleSelectDocument(data.id, data.title);
      }
    });
  };

  // Handle document selection - updates store and opens tab
  // Only opens documents (not folders) as tabs
  const handleSelectDocument = useCallback((docId: string, title?: string) => {
    const doc = documents.find((d) => d.id === docId);
    
    // Don't open folders in editor - they are just for organization
    if (!doc || doc.type === 'FOLDER') {
      return;
    }
    
    setCurrentDocument(docId);
    
    // Open in workspace tab
    openTab({
      id: docId,
      type: 'document',
      title: title ?? doc.title ?? 'Документ',
    });
  }, [setCurrentDocument, openTab, documents]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-border flex items-center gap-2">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск..."
          className="flex-1"
        />
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 flex-shrink-0"
            onClick={() => setShowMenu(!showMenu)}
            disabled={isPending}
            title="Создать"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-md shadow-lg py-1 z-50 min-w-[140px]">
              <button
                onClick={handleCreateFolder}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-fg-secondary hover:bg-overlay hover:text-fg"
              >
                <Folder className="w-4 h-4" />
                Папка
              </button>
              <button
                onClick={handleCreateDocument}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-fg-secondary hover:bg-overlay hover:text-fg"
              >
                <FileText className="w-4 h-4" />
                Документ
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {filteredDocuments.length === 0 ? (
          <div className="p-4 text-center text-fg-muted text-sm">
            <p>Нет документов</p>
            <div className="flex justify-center gap-2 mt-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleCreateFolder}
                disabled={isPending}
              >
                <Folder className="w-3 h-3 mr-1" />
                Папка
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleCreateDocument}
                disabled={isPending}
              >
                <FileText className="w-3 h-3 mr-1" />
                Документ
              </Button>
            </div>
          </div>
        ) : (
          <FileTree
            documents={filteredDocuments}
            selectedId={currentDocumentId}
            onSelectDocument={(id) => handleSelectDocument(id)}
            onSelectScene={(id) => handleSelectDocument(id)}
          />
        )}
      </div>
    </div>
  );
}
