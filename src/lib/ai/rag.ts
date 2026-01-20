import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from './embeddings';
import type { Entity, Document, EntityType } from '@/types/supabase';

export interface RAGContext {
  entities: Array<{
    id: string;
    name: string;
    type: EntityType;
    description: string | null;
    similarity: number;
  }>;
  documents: Array<{
    id: string;
    title: string;
    content: string;
    similarity: number;
  }>;
}

export interface RAGOptions {
  projectId: string;
  query: string;
  maxEntities?: number;
  maxDocuments?: number;
  minSimilarity?: number;
}

// Search for relevant context using RAG
export async function searchContext({
  projectId,
  query,
  maxEntities = 5,
  maxDocuments = 3,
  minSimilarity = 0.5,
}: RAGOptions): Promise<RAGContext> {
  const supabase = await createClient();

  // Generate embedding for query
  const queryEmbedding = await generateEmbedding(query);
  const embeddingString = `[${queryEmbedding.join(',')}]`;

  // Search entities using vector similarity
  const { data: matchedEntities } = await (supabase as any).rpc('match_entities', {
    query_embedding: embeddingString,
    match_count: maxEntities,
    filter_project_id: projectId,
  });

  // Search documents using vector similarity
  const { data: matchedDocuments } = await (supabase as any).rpc('match_documents', {
    query_embedding: embeddingString,
    match_count: maxDocuments,
    filter_project_id: projectId,
  });

  // Filter by minimum similarity
  const entities = (matchedEntities || [])
    .filter((e: any) => e.similarity >= minSimilarity)
    .map((e: any) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      description: e.description,
      similarity: e.similarity,
    }));

  const documents = (matchedDocuments || [])
    .filter((d: any) => d.similarity >= minSimilarity)
    .map((d: any) => ({
      id: d.id,
      title: d.title || 'Untitled',
      content: extractTextFromContent(d.content),
      similarity: d.similarity,
    }));

  return { entities, documents };
}

// Build context string for AI prompt
export function buildContextPrompt(context: RAGContext): string {
  const parts: string[] = [];

  if (context.entities.length > 0) {
    parts.push('## Персонажи и сущности из истории:\n');
    for (const entity of context.entities) {
      parts.push(`### ${entity.name} (${getTypeLabel(entity.type)})`);
      if (entity.description) {
        parts.push(entity.description);
      }
      parts.push('');
    }
  }

  if (context.documents.length > 0) {
    parts.push('\n## Релевантные фрагменты из истории:\n');
    for (const doc of context.documents) {
      parts.push(`### ${doc.title}`);
      parts.push(truncateText(doc.content, 500));
      parts.push('');
    }
  }

  return parts.join('\n');
}

// Get all entities for a project (without embeddings, for context)
export async function getProjectEntities(projectId: string): Promise<Entity[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('entities')
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  return data || [];
}

// Get recent documents for a project
export async function getRecentDocuments(
  projectId: string,
  limit: number = 5
): Promise<Document[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  return data || [];
}

// Helper functions
function extractTextFromContent(content: any): string {
  if (!content) return '';

  const extractFromNode = (node: any): string => {
    if (!node) return '';

    if (node.type === 'text') {
      return node.text || '';
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join(' ');
    }

    return '';
  };

  return extractFromNode(content);
}

function getTypeLabel(type: EntityType): string {
  const labels: Record<EntityType, string> = {
    CHARACTER: 'персонаж',
    LOCATION: 'локация',
    ITEM: 'предмет',
    EVENT: 'событие',
    FACTION: 'фракция',
    WORLDBUILDING: 'мир',
    NOTE: 'заметка',
  };
  return labels[type] || type;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
