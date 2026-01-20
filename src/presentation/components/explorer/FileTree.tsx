'use client';

import { useState, useMemo, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { FileTreeItem } from './FileTreeItem';
import { useDocumentStore } from '@/presentation/stores';
import { createDocument, updateDocument, deleteDocument } from '@/app/actions/supabase/document-actions';
import { createDefaultDocumentContent } from '@/presentation/utils/migrateDocument';
import { createClient } from '@/lib/supabase/client';
import type { Document } from '@/core/entities/document';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  documents: Document[];
  selectedId: string | null;
  onSelectDocument: (id: string) => void;
  onSelectScene: (id: string) => void;
}

export function FileTree({
  documents,
  selectedId,
  onSelectDocument,
}: FileTreeProps) {
  const params = useParams();
  const projectId = params.projectId as string;
  const addDocument = useDocumentStore((s) => s.actions.addDocument);
  const updateDoc = useDocumentStore((s) => s.actions.updateDocument);
  const removeDocument = useDocumentStore((s) => s.actions.removeDocument);
  const setDocuments = useDocumentStore((s) => s.actions.setDocuments);
  
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'inside' | 'after' | null>(null);

  // Build tree structure from flat documents array
  const { rootDocuments, childrenMap, documentMap } = useMemo(() => {
    const roots: Document[] = [];
    const children: Map<string, Document[]> = new Map();
    const docMap: Map<string, Document> = new Map();

    documents.forEach((doc) => {
      docMap.set(doc.id, doc);
      if (!doc.parentId) {
        roots.push(doc);
      } else {
        const siblings = children.get(doc.parentId) || [];
        siblings.push(doc);
        children.set(doc.parentId, siblings);
      }
    });

    // Sort by order
    roots.sort((a, b) => a.order - b.order);
    children.forEach((list) => list.sort((a, b) => a.order - b.order));

    return { rootDocuments: roots, childrenMap: children, documentMap: docMap };
  }, [documents]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Add document inside a folder
  const handleAddDocument = (parentId: string) => {
    startTransition(async () => {
      const parentChildren = childrenMap.get(parentId) || [];
      const { data, error } = await createDocument({
        project_id: projectId,
        parent_id: parentId,
        title: `Документ ${parentChildren.length + 1}`,
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
        setExpandedIds((prev) => new Set(prev).add(parentId));
        onSelectDocument(data.id);
      }
    });
  };

  const handleRename = (docId: string, newTitle: string) => {
    startTransition(async () => {
      const { data, error } = await updateDocument(docId, { title: newTitle });
      if (data && !error) {
        updateDoc(docId, { title: newTitle });
      }
    });
  };

  const handleDelete = (docId: string) => {
    if (!confirm('Удалить этот документ?')) return;
    
    startTransition(async () => {
      const { error } = await deleteDocument(docId, projectId);
      if (!error) {
        removeDocument(docId);
        // Also remove children from store
        const children = childrenMap.get(docId) || [];
        children.forEach((child) => removeDocument(child.id));
      }
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, docId: string) => {
    setDraggedId(docId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', docId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string, isFolder: boolean) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedId === targetId) {
      setDropTargetId(null);
      setDropPosition(null);
      return;
    }
    
    const draggedDoc = documentMap.get(draggedId || '');
    if (!draggedDoc) return;

    const isDocument = draggedDoc.type === 'DOCUMENT' || draggedDoc.type === 'NOTE';
    const isDraggingFolder = draggedDoc.type === 'FOLDER';

    if (isDocument) {
      // Documents can be dropped inside folders or after other documents
      setDropPosition(isFolder ? 'inside' : 'after');
      setDropTargetId(targetId);
    } else if (isDraggingFolder && isFolder) {
      // Folders can be reordered (drop after another folder)
      setDropPosition('after');
      setDropTargetId(targetId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the container, not entering a child
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDropTargetId(null);
      setDropPosition(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetId: string, targetIsFolder: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragId = draggedId;
    resetDragState();
    
    console.log('handleDrop called', { dragId, targetId, targetIsFolder });
    
    if (!dragId || dragId === targetId) {
      console.log('Early return: same id or no dragId');
      return;
    }

    const draggedDoc = documentMap.get(dragId);
    const targetDoc = documentMap.get(targetId);
    
    console.log('Documents', { 
      draggedDoc: draggedDoc ? { id: draggedDoc.id, type: draggedDoc.type, parentId: draggedDoc.parentId, order: draggedDoc.order } : null,
      targetDoc: targetDoc ? { id: targetDoc.id, type: targetDoc.type, parentId: targetDoc.parentId, order: targetDoc.order } : null
    });
    
    if (!draggedDoc || !targetDoc) {
      console.log('Early return: missing doc');
      return;
    }

    const supabase = createClient();
    const isDocument = draggedDoc.type === 'DOCUMENT' || draggedDoc.type === 'NOTE';
    const isDraggingFolder = draggedDoc.type === 'FOLDER';
    
    console.log('Doc types', { isDocument, isDraggingFolder });

    try {
      if (isDocument) {
        // Moving a document
        let newParentId: string | null = null;

        if (targetIsFolder) {
          // Drop on folder → move inside folder
          newParentId = targetId;
        } else {
          // Drop on document → move to same parent as target document
          newParentId = targetDoc.parentId;
        }

        const currentParentId = draggedDoc.parentId;
        
        console.log('Parent check', { newParentId, currentParentId, sameParent: newParentId === currentParentId });
        
        // Same parent = reorder within folder/root
        if (newParentId === currentParentId && !targetIsFolder) {
          // Reorder documents within the same parent
          const siblings = currentParentId 
            ? [...(childrenMap.get(currentParentId) || [])]
            : rootDocuments.filter(d => d.type !== 'FOLDER');
          
          const targetIndex = siblings.findIndex(d => d.id === targetId);
          const dragIndex = siblings.findIndex(d => d.id === dragId);
          
          console.log('Reorder check', { targetIndex, dragIndex, siblingsCount: siblings.length });
          
          if (targetIndex === -1 || dragIndex === -1 || targetIndex === dragIndex) {
            console.log('Invalid indices, skipping');
            return;
          }
          
          console.log('Reordering document', { dragId, targetId, dragIndex, targetIndex });
          
          // Remove dragged item and insert after target
          const [draggedItem] = siblings.splice(dragIndex, 1);
          const insertIndex = dragIndex < targetIndex ? targetIndex : targetIndex + 1;
          siblings.splice(insertIndex, 0, draggedItem);
          
          // Update all siblings with new order (0, 1, 2, ...)
          console.log('Updating order for all siblings...');
          
          for (let i = 0; i < siblings.length; i++) {
            const doc = siblings[i];
            if (doc.order !== i) {
              // TODO: Fix Supabase client typing - move to server action
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { error } = await (supabase as any)
                .from('documents')
                .update({ order: i })
                .eq('id', doc.id);
              
              if (error) {
                console.error(`Reorder failed for ${doc.id}:`, error.message);
                continue;
              }
              
              updateDoc(doc.id, { order: i });
            }
          }
          
          console.log('Document reorder successful');
          return;
        }

        // Different parent = move to new folder
        console.log('Moving document', { dragId, newParentId, currentParentId });

        // TODO: Fix Supabase client typing - move to server action
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('documents')
          .update({ parent_id: newParentId })
          .eq('id', dragId);
        
        if (error) {
          console.error('Move failed:', error.message);
          return;
        }
        
        updateDoc(dragId, { parentId: newParentId });
        
        // Expand target folder if moving into a folder
        if (newParentId) {
          setExpandedIds((prev) => new Set(prev).add(newParentId));
        }

      } else if (isDraggingFolder && targetIsFolder) {
        // Reordering folders - swap orders
        const dragOrder = draggedDoc.order;
        const targetOrder = targetDoc.order;

        console.log('Reordering folders', { dragId, targetId, dragOrder, targetOrder });

        // Update dragged folder to be after target
        const newOrder = targetOrder + 1;

        // First, shift all folders after target
        const foldersToShift = rootDocuments.filter(
          (d) => d.order > targetOrder && d.id !== dragId
        );

        for (const folder of foldersToShift) {
          // TODO: Fix Supabase client typing - move to server action
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('documents')
            .update({ order: folder.order + 1 })
            .eq('id', folder.id);
          updateDoc(folder.id, { order: folder.order + 1 });
        }

        // Then update dragged folder
        // TODO: Fix Supabase client typing - move to server action
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('documents')
          .update({ order: newOrder })
          .eq('id', dragId);
        
        if (error) {
          console.error('Reorder failed:', error.message);
          return;
        }

        updateDoc(dragId, { order: newOrder });
        console.log('Reorder successful');
      }
    } catch (err) {
      console.error('Drop exception:', err);
    }
  };

  const resetDragState = () => {
    setDraggedId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    resetDragState();
  };

  if (rootDocuments.length === 0) {
    return (
      <div className="p-4 text-center text-fg-muted text-sm">
        Нет документов
      </div>
    );
  }

  return (
    <div className="py-1" role="tree">
      {rootDocuments.map((doc) => {
        const children = childrenMap.get(doc.id) || [];
        const hasChildren = children.length > 0;
        const isFolder = doc.type === 'FOLDER';
        const isDropTarget = dropTargetId === doc.id;
        
        return (
          <div key={doc.id} role="group">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, doc.id)}
              onDragOver={(e) => handleDragOver(e, doc.id, isFolder)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, doc.id, isFolder)}
              onDragEnd={handleDragEnd}
              className={cn(
                'transition-all',
                draggedId === doc.id && 'opacity-50',
                isDropTarget && dropPosition === 'inside' && 'ring-2 ring-accent ring-inset rounded',
                isDropTarget && dropPosition === 'after' && 'border-b-2 border-accent'
              )}
            >
              <FileTreeItem
                id={doc.id}
                title={doc.title}
                type={isFolder ? 'folder' : 'document'}
                isExpanded={expandedIds.has(doc.id)}
                isSelected={selectedId === doc.id}
                hasChildren={hasChildren}
                isFolder={isFolder}
                onToggle={() => toggleExpanded(doc.id)}
                onSelect={() => !isFolder && onSelectDocument(doc.id)}
                onRename={(newTitle) => handleRename(doc.id, newTitle)}
                onDelete={() => handleDelete(doc.id)}
                onAddDocument={isFolder ? () => handleAddDocument(doc.id) : undefined}
              />
            </div>
            
            {expandedIds.has(doc.id) && children.map((child) => {
              const isChildDropTarget = dropTargetId === child.id;
              
              return (
                <div
                  key={child.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, child.id)}
                  onDragOver={(e) => handleDragOver(e, child.id, false)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, child.id, false)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'transition-all',
                    draggedId === child.id && 'opacity-50',
                    isChildDropTarget && 'border-b-2 border-accent'
                  )}
                >
                  <FileTreeItem
                    id={child.id}
                    title={child.title}
                    type="document"
                    level={1}
                    isSelected={selectedId === child.id}
                    onSelect={() => onSelectDocument(child.id)}
                    onRename={(newTitle) => handleRename(child.id, newTitle)}
                    onDelete={() => handleDelete(child.id)}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
