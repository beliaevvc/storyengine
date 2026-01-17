import type { TiptapContent, TiptapNode, SceneInfo } from '@/core/entities/document';

/**
 * Extract scene information from Tiptap document content
 * Used for plot visualization and scene management
 */
export function extractScenesFromContent(
  documentId: string,
  content: TiptapContent | null
): SceneInfo[] {
  if (!content || !content.content) {
    return [];
  }

  const scenes: SceneInfo[] = [];
  let order = 0;

  for (const node of content.content) {
    if (node.type === 'scene') {
      const attrs = node.attrs || {};
      
      // Extract text preview from scene content
      let textPreview = '';
      if (node.content) {
        textPreview = extractTextFromNodes(node.content).slice(0, 150);
      }

      scenes.push({
        id: attrs.id as string || `scene-${order}`,
        documentId,
        slug: attrs.slug as string || `Сцена ${order + 1}`,
        location: attrs.location as string || '',
        status: (attrs.status as 'draft' | 'review' | 'final') || 'draft',
        textPreview,
        order,
      });

      order++;
    }
  }

  return scenes;
}

/**
 * Extract plain text from Tiptap nodes recursively
 */
function extractTextFromNodes(nodes: TiptapNode[]): string {
  let text = '';

  for (const node of nodes) {
    if (node.text) {
      text += node.text;
    }
    if (node.content) {
      text += extractTextFromNodes(node.content);
    }
    // Add space after block elements
    if (['paragraph', 'heading', 'blockquote'].includes(node.type)) {
      text += ' ';
    }
  }

  return text.trim();
}

/**
 * Get all scenes from multiple documents
 */
export function extractAllScenes(
  documents: Array<{ id: string; content: TiptapContent | null }>
): SceneInfo[] {
  const allScenes: SceneInfo[] = [];

  for (const doc of documents) {
    const docScenes = extractScenesFromContent(doc.id, doc.content);
    allScenes.push(...docScenes);
  }

  return allScenes;
}

/**
 * Count scenes in a document
 */
export function countScenes(content: TiptapContent | null): number {
  if (!content || !content.content) {
    return 0;
  }

  return content.content.filter((node) => node.type === 'scene').length;
}
