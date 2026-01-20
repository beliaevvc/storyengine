'use server';

import { createClient } from '@/lib/supabase/server';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Helper to get untyped table access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getEventsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('events');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDocumentsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('documents');
}

export interface TimelineEvent {
  id: string;
  name: string;
  description: string | null;
  position: number;
  timelineId: string | null;
  timelineName: string | null;
  timelineColor: string | null;
}

/**
 * Получить все события, в которых участвует entity
 */
export async function getEventsByEntityAction(
  entityId: string,
  projectId: string
): Promise<ActionResult<TimelineEvent[]>> {
  try {
    const table = await getEventsTable();

    const { data: events, error } = await table
      .select(`
        id,
        name,
        description,
        position,
        timeline_id,
        linked_entity_ids,
        timelines:timeline_id (
          id,
          name,
          color
        )
      `)
      .eq('project_id', projectId)
      .contains('linked_entity_ids', [entityId])
      .order('position', { ascending: true });

    if (error) {
      console.warn('getEventsByEntityAction error:', error);
      return { success: true, data: [] };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: TimelineEvent[] = (events || []).map((e: any) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      position: e.position,
      timelineId: e.timeline_id,
      timelineName: e.timelines?.name ?? null,
      timelineColor: e.timelines?.color ?? null,
    }));

    return { success: true, data: result };
  } catch (error) {
    console.error('getEventsByEntityAction error:', error);
    return { success: false, error: 'Не удалось получить события' };
  }
}

export interface BlockReference {
  type: 'scene' | 'block' | 'mention';
  sceneSlug: string | null;
  sceneStatus: string | null;
  blockType: string | null;
  speakerRole: string | null;
  textPreview: string | null;
}

export interface SceneReference {
  documentId: string;
  documentTitle: string;
  documentOrder: number;
  parentTitle: string | null;
  references: BlockReference[];
}

/**
 * Получить все документы и сцены, где entity упоминается
 */
export async function getSceneDocumentsByEntityAction(
  entityId: string,
  projectId: string
): Promise<ActionResult<SceneReference[]>> {
  try {
    const table = await getDocumentsTable();

    const { data: documents, error } = await table
      .select(`
        id,
        title,
        order,
        parent_id,
        content,
        type
      `)
      .eq('project_id', projectId)
      .order('order', { ascending: true });

    if (error) {
      console.warn('getSceneDocumentsByEntityAction error:', error);
      return { success: true, data: [] };
    }

    // Get parent titles for context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allParentIds = [...new Set((documents || []).map((d: any) => d.parent_id).filter(Boolean))];
    let parentMap: Record<string, string> = {};
    if (allParentIds.length > 0) {
      const { data: parents } = await table
        .select('id, title')
        .in('id', allParentIds);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parentMap = (parents || []).reduce((acc: Record<string, string>, p: any) => {
        acc[p.id] = p.title;
        return acc;
      }, {});
    }

    const results: SceneReference[] = [];

    for (const doc of documents || []) {
      if (!doc.content) continue;

      const refs = findAllEntityReferences(doc.content, entityId);
      
      if (refs.length > 0) {
        results.push({
          documentId: doc.id,
          documentTitle: doc.title,
          documentOrder: doc.order,
          parentTitle: doc.parent_id ? parentMap[doc.parent_id] ?? null : null,
          references: refs,
        });
      }
    }

    return { success: true, data: results };
  } catch (error) {
    console.error('getSceneDocumentsByEntityAction error:', error);
    return { success: false, error: 'Не удалось получить сцены' };
  }
}

function extractTextPreview(content: unknown, maxLength: number): string | null {
  if (!content) return null;
  
  let text = '';
  
  function traverse(node: unknown) {
    if (text.length >= maxLength) return;
    if (!node || typeof node !== 'object') return;
    
    const n = node as Record<string, unknown>;
    
    if (n.type === 'text' && typeof n.text === 'string') {
      text += n.text;
      return;
    }
    
    if (n.type === 'paragraph' && text.length > 0) {
      text += ' ';
    }
    
    if (Array.isArray(n.content)) {
      for (const child of n.content) {
        traverse(child);
        if (text.length >= maxLength) break;
      }
    }
  }
  
  if (Array.isArray(content)) {
    for (const item of content) {
      traverse(item);
    }
  } else {
    traverse(content);
  }
  
  text = text.trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + '...';
  }
  
  return text || null;
}

function findAllEntityReferences(
  content: unknown,
  entityId: string
): BlockReference[] {
  const results: BlockReference[] = [];
  let currentScene: { slug: string; status: string } | null = null;
  
  function traverse(node: unknown) {
    if (!node || typeof node !== 'object') return;

    const n = node as Record<string, unknown>;
    const attrs = n.attrs as Record<string, unknown> | undefined;

    if (n.type === 'scene' && attrs) {
      currentScene = {
        slug: (attrs.slug as string) || 'Сцена',
        status: (attrs.status as string) || 'draft',
      };
      
      const characters = attrs.characters as string[] | undefined;
      const locationId = attrs.locationId as string | undefined;
      
      if (
        (Array.isArray(characters) && characters.includes(entityId)) ||
        locationId === entityId
      ) {
        results.push({
          type: 'scene',
          sceneSlug: currentScene.slug,
          sceneStatus: currentScene.status,
          blockType: null,
          speakerRole: null,
          textPreview: null,
        });
      }
    }

    if (n.type === 'semanticBlock') {
      const blockType = attrs?.blockType as string | undefined;
      const speakers = attrs?.speakers as Array<{ id: string; name: string }> | undefined;
      
      if (Array.isArray(speakers) && speakers.length > 0) {
        const speaker = speakers.find(s => s.id === entityId);
        if (speaker) {
          const textPreview = extractTextPreview(n.content, 100);
          
          results.push({
            type: 'block',
            sceneSlug: currentScene?.slug ?? null,
            sceneStatus: currentScene?.status ?? null,
            blockType: blockType || 'dialogue',
            speakerRole: speaker.name,
            textPreview,
          });
        }
      }
    }

    if (n.type === 'entityMention' && attrs) {
      if (attrs.id === entityId) {
        results.push({
          type: 'mention',
          sceneSlug: currentScene?.slug ?? null,
          sceneStatus: currentScene?.status ?? null,
          blockType: null,
          speakerRole: null,
          textPreview: null,
        });
      }
    }

    if (Array.isArray(n.content)) {
      for (const child of n.content) {
        traverse(child);
      }
    }
    
    if (n.type === 'scene') {
      currentScene = null;
    }
  }

  traverse(content);
  return results;
}
