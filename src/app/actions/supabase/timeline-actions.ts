'use server';

import { createClient } from '@/lib/supabase/server';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

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
 * Для отображения в Timeline на странице профиля сущности
 */
export async function getEventsByEntityAction(
  entityId: string,
  projectId: string
): Promise<ActionResult<TimelineEvent[]>> {
  try {
    const supabase = await createClient();

    // Get all events where this entity is linked
    const { data: events, error } = await supabase
      .from('events')
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
      // Table might not exist or other error
      console.warn('getEventsByEntityAction error:', error);
      return { success: true, data: [] };
    }

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
  blockType: string | null;  // dialogue, description, action, thought
  speakerRole: string | null;  // For dialogue blocks
  textPreview: string | null;  // First ~100 chars of block text
}

export interface SceneReference {
  documentId: string;
  documentTitle: string;
  documentOrder: number;
  parentTitle: string | null;
  // Nested references within document
  references: BlockReference[];
}

/**
 * Получить все документы и сцены, где entity упоминается
 * Ищет:
 * 1. scene ноды с characters массивом или locationId
 * 2. semanticBlock ноды с speakers
 * 3. entityMention ноды (inline @mentions)
 */
export async function getSceneDocumentsByEntityAction(
  entityId: string,
  projectId: string
): Promise<ActionResult<SceneReference[]>> {
  try {
    const supabase = await createClient();

    // Get all documents for the project
    const { data: documents, error } = await supabase
      .from('documents')
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
    const allParentIds = [...new Set((documents || []).map((d: any) => d.parent_id).filter(Boolean))];
    let parentMap: Record<string, string> = {};
    if (allParentIds.length > 0) {
      const { data: parents } = await supabase
        .from('documents')
        .select('id, title')
        .in('id', allParentIds);
      
      parentMap = (parents || []).reduce((acc: Record<string, string>, p: any) => {
        acc[p.id] = p.title;
        return acc;
      }, {});
    }

    // Find all references to this entity
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

/**
 * Extract plain text from Tiptap content, limited to maxLength
 */
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

/**
 * Find all references to entity in document content
 * Returns structured list of where entity appears
 */
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

    // Track current scene context
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

    // Check semanticBlock for speakers
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

    // Check entityMention
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

    // Recursively check content
    if (Array.isArray(n.content)) {
      for (const child of n.content) {
        traverse(child);
      }
    }
    
    // Reset scene context when leaving scene node
    if (n.type === 'scene') {
      currentScene = null;
    }
  }

  traverse(content);
  return results;
}

