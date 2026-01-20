'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Document } from '@/types/supabase';

// Helper to get untyped table access (workaround for Supabase type issues)
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
  const table = await getTable();

  const { data, error } = await table
    .select('*')
    .eq('project_id', projectId)
    .order('order');

  if (error) {
    console.error('[getDocuments] Supabase error:', error);
    return { data: null, error: error.message };
  }

  return { data: data as Document[], error: null };
}

// Get documents tree (with parent-child hierarchy)
export async function getDocumentsTree(
  projectId: string
): Promise<{ data: Document[] | null; error: string | null }> {
  const table = await getTable();

  const { data, error } = await table
    .select('*')
    .eq('project_id', projectId)
    .is('parent_id', null)
    .order('order');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Document[], error: null };
}

// Get children of a document
export async function getDocumentChildren(
  parentId: string
): Promise<{ data: Document[] | null; error: string | null }> {
  const table = await getTable();

  const { data, error } = await table
    .select('*')
    .eq('parent_id', parentId)
    .order('order');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Document[], error: null };
}

// Get single document
export async function getDocument(
  documentId: string
): Promise<{ data: Document | null; error: string | null }> {
  const table = await getTable();

  const { data, error } = await table
    .select('*')
    .eq('id', documentId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Document, error: null };
}

// Create document input type
interface CreateDocumentInput {
  project_id: string;
  title: string;
  type: 'FOLDER' | 'DOCUMENT' | 'NOTE';
  parent_id?: string | null;
  content?: unknown;
  order?: number;
}

// Create document
export async function createDocument(
  input: CreateDocumentInput
): Promise<{ data: Document | null; error: string | null }> {
  const table = await getTable();

  const { data, error } = await table
    .insert(input)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath(`/projects/${input.project_id}`);
  return { data: data as Document, error: null };
}

// Update document input type
interface UpdateDocumentInput {
  title?: string;
  content?: unknown;
  parent_id?: string | null;
  order?: number;
  type?: 'FOLDER' | 'DOCUMENT' | 'NOTE';
}

// Update document
export async function updateDocument(
  documentId: string,
  input: UpdateDocumentInput
): Promise<{ data: Document | null; error: string | null }> {
  const table = await getTable();

  const { data, error } = await table
    .update(input)
    .eq('id', documentId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  if (data) {
    revalidatePath(`/projects/${(data as Document).project_id}`);
  }

  return { data: data as Document, error: null };
}

// Update document content (for autosave)
export async function updateDocumentContent(
  documentId: string,
  content: unknown
): Promise<{ success: boolean; error: string | null }> {
  const table = await getTable();

  const { data, error } = await table
    .update({ content })
    .eq('id', documentId)
    .select('id, content');

  if (error) {
    console.error('[updateDocumentContent] Supabase error:', error);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    console.error('[updateDocumentContent] Update failed: no rows affected');
    return { success: false, error: 'Document not found or update blocked by RLS' };
  }

  return { success: true, error: null };
}

// Delete document
export async function deleteDocument(
  documentId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const table = await getTable();

  const { error } = await table
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
  const table = await getTable();

  for (let i = 0; i < documentIds.length; i++) {
    const { error } = await table
      .update({ order: i })
      .eq('id', documentIds[i]);

    if (error) {
      return { success: false, error: error.message };
    }
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
  const table = await getTable();

  // Get max order in new parent
  const { data: siblings } = await table
    .select('order')
    .eq('project_id', projectId)
    .eq('parent_id', newParentId)
    .order('order', { ascending: false })
    .limit(1);

  const newOrder = (siblings?.[0]?.order ?? -1) + 1;

  const { error } = await table
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
