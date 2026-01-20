/**
 * Document Mapper
 * 
 * Maps between Supabase documents (snake_case) and Domain documents (camelCase).
 */

import type { 
  Document, 
  TiptapContent, 
  CreateDocumentInput, 
  UpdateDocumentInput,
  emptyTiptapContent 
} from '@/core/entities/document';
import type { SupabaseDocument, SupabaseDocumentInsert, SupabaseDocumentUpdate } from './types';
import { castJson, toJson } from './types';

// Default empty content for new documents
const DEFAULT_CONTENT: TiptapContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

// ============================================================================
// Supabase → Domain
// ============================================================================

/**
 * Map a Supabase document row to a Domain document.
 */
export function mapSupabaseToDocument(data: SupabaseDocument): Document {
  return {
    id: data.id,
    projectId: data.project_id,
    parentId: data.parent_id,
    title: data.title,
    type: data.type,
    content: castJson<TiptapContent>(data.content, DEFAULT_CONTENT),
    order: data.order,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Map an array of Supabase document rows to Domain documents.
 */
export function mapSupabaseToDocuments(data: SupabaseDocument[]): Document[] {
  return data.map(mapSupabaseToDocument);
}

// ============================================================================
// Domain → Supabase
// ============================================================================

/**
 * Map a CreateDocumentInput to a Supabase insert payload.
 */
export function mapCreateDocumentToSupabase(
  input: CreateDocumentInput & { type: Document['type']; parentId?: string | null }
): SupabaseDocumentInsert {
  return {
    project_id: input.projectId,
    parent_id: input.parentId ?? null,
    title: input.title,
    type: input.type,
    content: toJson(input.content ?? DEFAULT_CONTENT),
    order: input.order ?? 0,
  };
}

/**
 * Map an UpdateDocumentInput to a Supabase update payload.
 */
export function mapUpdateDocumentToSupabase(input: UpdateDocumentInput): SupabaseDocumentUpdate {
  const update: SupabaseDocumentUpdate = {};

  if (input.title !== undefined) {
    update.title = input.title;
  }
  if (input.content !== undefined) {
    update.content = toJson(input.content);
  }
  if (input.order !== undefined) {
    update.order = input.order;
  }

  return update;
}

/**
 * Map a partial Domain document to a Supabase update payload.
 */
export function mapDocumentToSupabaseUpdate(doc: Partial<Document>): SupabaseDocumentUpdate {
  const update: SupabaseDocumentUpdate = {};

  if (doc.parentId !== undefined) {
    update.parent_id = doc.parentId;
  }
  if (doc.title !== undefined) {
    update.title = doc.title;
  }
  if (doc.type !== undefined) {
    update.type = doc.type;
  }
  if (doc.content !== undefined) {
    update.content = toJson(doc.content);
  }
  if (doc.order !== undefined) {
    update.order = doc.order;
  }

  return update;
}

/**
 * Map a Domain document to a full Supabase row format.
 * Useful when components expect Supabase format.
 */
export function mapDocumentToSupabase(doc: Document): SupabaseDocument {
  return {
    id: doc.id,
    project_id: doc.projectId,
    parent_id: doc.parentId,
    title: doc.title,
    type: doc.type,
    content: toJson(doc.content),
    order: doc.order,
    embedding: null,
    created_at: doc.createdAt.toISOString(),
    updated_at: doc.updatedAt.toISOString(),
  };
}

/**
 * Map an array of Domain documents to Supabase format.
 */
export function mapDocumentsToSupabase(docs: Document[]): SupabaseDocument[] {
  return docs.map(mapDocumentToSupabase);
}
