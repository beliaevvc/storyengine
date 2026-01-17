import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateProjectEmbeddings, updateEntityEmbedding, updateDocumentEmbedding } from '@/lib/ai/embeddings';

export const runtime = 'nodejs';

// Update all embeddings for a project
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, entityId, documentId } = body;

    // Update single entity
    if (entityId) {
      await updateEntityEmbedding(entityId);
      return NextResponse.json({ success: true, updated: 'entity' });
    }

    // Update single document
    if (documentId) {
      await updateDocumentEmbedding(documentId);
      return NextResponse.json({ success: true, updated: 'document' });
    }

    // Update all project embeddings
    if (projectId) {
      const result = await updateProjectEmbeddings(projectId);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json(
      { error: 'Missing projectId, entityId, or documentId' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Embeddings Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
