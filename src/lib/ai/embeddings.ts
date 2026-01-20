import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate embedding for text
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536,
  });

  return response.data[0].embedding;
}

// Generate embeddings for multiple texts
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
    dimensions: 1536,
  });

  return response.data.map((item) => item.embedding);
}

// Update entity embedding
export async function updateEntityEmbedding(entityId: string): Promise<void> {
  const supabase = await createClient();

  // Get entity (use type assertion for untyped table)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entity, error: fetchError } = await (supabase as any)
    .from('entities')
    .select('name, description, attributes')
    .eq('id', entityId)
    .single();

  if (fetchError || !entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  // Create text for embedding
  const text = [
    entity.name,
    entity.description || '',
    JSON.stringify(entity.attributes || {}),
  ]
    .filter(Boolean)
    .join('\n');

  // Generate embedding
  const embedding = await generateEmbedding(text);

  // Update entity (use type assertion)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('entities')
    .update({ embedding: `[${embedding.join(',')}]` })
    .eq('id', entityId);

  if (updateError) {
    throw new Error(`Failed to update entity embedding: ${updateError.message}`);
  }
}

// Update document embedding
export async function updateDocumentEmbedding(documentId: string): Promise<void> {
  const supabase = await createClient();

  // Get document (use type assertion for untyped table)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: document, error: fetchError } = await (supabase as any)
    .from('documents')
    .select('title, content')
    .eq('id', documentId)
    .single();

  if (fetchError || !document) {
    throw new Error(`Document not found: ${documentId}`);
  }

  // Extract text from Tiptap JSON content
  const contentText = extractTextFromTiptap(document.content);

  // Create text for embedding
  const text = [document.title, contentText].filter(Boolean).join('\n');

  if (!text.trim()) {
    return; // Skip empty documents
  }

  // Generate embedding
  const embedding = await generateEmbedding(text);

  // Update document (use type assertion)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('documents')
    .update({ embedding: `[${embedding.join(',')}]` })
    .eq('id', documentId);

  if (updateError) {
    throw new Error(`Failed to update document embedding: ${updateError.message}`);
  }
}

// Extract plain text from Tiptap JSON content
function extractTextFromTiptap(content: any): string {
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

// Batch update embeddings for a project
export async function updateProjectEmbeddings(projectId: string): Promise<{
  entitiesUpdated: number;
  documentsUpdated: number;
}> {
  const supabase = await createClient();

  // Get all entities (use type assertion)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities } = await (supabase as any)
    .from('entities')
    .select('id')
    .eq('project_id', projectId);

  // Get all documents (use type assertion)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: documents } = await (supabase as any)
    .from('documents')
    .select('id')
    .eq('project_id', projectId);

  let entitiesUpdated = 0;
  let documentsUpdated = 0;

  // Update entity embeddings
  if (entities) {
    for (const entity of entities) {
      try {
        await updateEntityEmbedding(entity.id);
        entitiesUpdated++;
      } catch (error) {
        console.error(`Failed to update entity ${entity.id}:`, error);
      }
    }
  }

  // Update document embeddings
  if (documents) {
    for (const document of documents) {
      try {
        await updateDocumentEmbedding(document.id);
        documentsUpdated++;
      } catch (error) {
        console.error(`Failed to update document ${document.id}:`, error);
      }
    }
  }

  return { entitiesUpdated, documentsUpdated };
}
