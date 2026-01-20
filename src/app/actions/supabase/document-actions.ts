'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Document, InsertTables, UpdateTables } from '@/types/supabase';

// Helper to get untyped table access (workaround for type issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('documents');
}

// Get all documents for a project (flat list)
export async function getDocuments(
  projectId: string
): Promise<{ data: Document[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .order('order');

  if (error) {
    console.error('[getDocuments] Supabase error:', error);
    return { data: null, error: error.message };
  }

  // DEBUG: Log what we're loading
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log('[getDocuments] Loaded from Supabase:', (data as any[])?.map((d: any) => ({
    id: d.id,
    title: d.title,
    hasContent: !!d.content,
    sceneCount: d.content?.content?.filter((n: any) => n.type === 'scene').length || 0,
  })));

  return { data, error: null };
}

// Get documents tree (with parent-child hierarchy)
export async function getDocumentsTree(
  projectId: string
): Promise<{ data: Document[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .is('parent_id', null)
    .order('order');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Get children of a document
export async function getDocumentChildren(
  parentId: string
): Promise<{ data: Document[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('parent_id', parentId)
    .order('order');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Get single document
export async function getDocument(
  documentId: string
): Promise<{ data: Document | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Create document
export async function createDocument(
  input: InsertTables<'documents'>
): Promise<{ data: Document | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .insert(input)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath(`/projects/${input.project_id}`);
  return { data, error: null };
}

// Update document
export async function updateDocument(
  documentId: string,
  input: UpdateTables<'documents'>
): Promise<{ data: Document | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('documents')
    .update(input)
    .eq('id', documentId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  if (data) {
    revalidatePath(`/projects/${data.project_id}`);
  }

  return { data, error: null };
}

// Update document content (for autosave)
export async function updateDocumentContent(
  documentId: string,
  content: any
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // DEBUG: Log what we're saving
  const sceneCount = content?.content?.filter((n: any) => n.type === 'scene').length || 0;
  console.log('[updateDocumentContent] Saving:', {
    documentId,
    contentType: content?.type,
    totalNodes: content?.content?.length || 0,
    sceneCount,
  });

  // Use .select() to verify the update actually happened
  const { data, error } = await supabase
    .from('documents')
    .update({ content })
    .eq('id', documentId)
    .select('id, content');

  if (error) {
    console.error('[updateDocumentContent] Supabase error:', error);
    return { success: false, error: error.message };
  }

  // Check if update actually happened (RLS might silently block it)
  if (!data || data.length === 0) {
    console.error('[updateDocumentContent] Update failed: no rows affected (possible RLS issue)');
    return { success: false, error: 'Document not found or update blocked by RLS' };
  }

  // Verify content was saved correctly
  const savedSceneCount = data[0]?.content?.content?.filter((n: any) => n.type === 'scene').length || 0;
  console.log('[updateDocumentContent] Save verified:', {
    savedSceneCount,
    savedContentType: data[0]?.content?.type,
  });

  return { success: true, error: null };
}

// Delete document
export async function deleteDocument(
  documentId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}

// Reorder documents
export async function reorderDocuments(
  projectId: string,
  documentIds: string[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Update order for each document
  const updates = documentIds.map((id, index) =>
    supabase
      .from('documents')
      .update({ order: index })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some((r) => r.error);

  if (hasError) {
    return { success: false, error: 'Failed to reorder some documents' };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}

// Move document to new parent
export async function moveDocument(
  documentId: string,
  newParentId: string | null,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Get max order in new parent
  const { data: maxOrderDoc } = await supabase
    .from('documents')
    .select('order')
    .eq('project_id', projectId)
    .eq('parent_id', newParentId)
    .order('order', { ascending: false })
    .limit(1)
    .single();

  const newOrder = (maxOrderDoc?.order ?? -1) + 1;

  const { error } = await supabase
    .from('documents')
    .update({
      parent_id: newParentId,
      order: newOrder,
    })
    .eq('id', documentId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}
