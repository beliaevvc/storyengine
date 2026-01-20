'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Entity, InsertTables, UpdateTables, EntityType } from '@/types/supabase';

// Get all entities for a project
export async function getEntities(
  projectId: string
): Promise<{ data: Entity[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Get entities by type
export async function getEntitiesByType(
  projectId: string,
  type: EntityType
): Promise<{ data: Entity[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('project_id', projectId)
    .eq('type', type)
    .order('name');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Get single entity
export async function getEntity(
  entityId: string
): Promise<{ data: Entity | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('id', entityId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Create entity
export async function createEntity(
  input: InsertTables<'entities'>
): Promise<{ data: Entity | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('entities')
    .insert(input)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath(`/projects/${input.project_id}`);
  return { data, error: null };
}

// Update entity
export async function updateEntity(
  entityId: string,
  input: UpdateTables<'entities'>
): Promise<{ data: Entity | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('entities')
    .update(input)
    .eq('id', entityId)
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

// Delete entity
export async function deleteEntity(
  entityId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('entities')
    .delete()
    .eq('id', entityId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}

// Search entities by name
export async function searchEntities(
  projectId: string,
  query: string
): Promise<{ data: Entity[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('project_id', projectId)
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(20);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Get entity relations
export async function getEntityRelations(
  entityId: string
): Promise<{ 
  data: { 
    outgoing: Array<{ relation: any; target: Entity }>;
    incoming: Array<{ relation: any; source: Entity }>;
  } | null; 
  error: string | null 
}> {
  const supabase = await createClient();

  // Get outgoing relations
  const { data: outgoing, error: outError } = await supabase
    .from('entity_relations')
    .select(`
      *,
      target:target_id(*)
    `)
    .eq('source_id', entityId);

  if (outError) {
    return { data: null, error: outError.message };
  }

  // Get incoming relations
  const { data: incoming, error: inError } = await supabase
    .from('entity_relations')
    .select(`
      *,
      source:source_id(*)
    `)
    .eq('target_id', entityId);

  if (inError) {
    return { data: null, error: inError.message };
  }

  return {
    data: {
      outgoing: outgoing?.map(r => ({ relation: r, target: r.target as Entity })) || [],
      incoming: incoming?.map(r => ({ relation: r, source: r.source as Entity })) || [],
    },
    error: null,
  };
}

// Create entity relation
export async function createEntityRelation(
  input: InsertTables<'entity_relations'>
): Promise<{ data: any | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('entity_relations')
    .insert(input)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Delete entity relation
export async function deleteEntityRelation(
  relationId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('entity_relations')
    .delete()
    .eq('id', relationId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Update entity content (Tiptap document)
export async function updateEntityContent(
  entityId: string,
  content: object
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('entities')
    .update({ content })
    .eq('id', entityId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Update entity attributes (custom schema values)
export async function updateEntityAttributes(
  entityId: string,
  attributes: Record<string, unknown>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('entities')
    .update({ attributes })
    .eq('id', entityId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Update entity documents (multi-tab content)
export async function updateEntityDocuments(
  entityId: string,
  documents: object
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('entities')
    .update({ documents })
    .eq('id', entityId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ============================================================================
// Bidirectional Relationships
// ============================================================================

interface Relationship {
  entityId: string;
  typeId: string;
  typeName: string;
  description?: string;
  isReverse?: boolean; // For asymmetric: true if current entity has the "reverse" role
}

interface DbRelationshipType {
  id: string;
  name: string;
  reverse_name: string | null;
}

/**
 * Update relationships for an entity with bidirectional sync.
 * When A adds relationship to B, B also gets relationship to A.
 * For asymmetric relationships (e.g., Mentor -> Student), the reverse uses reverse_name.
 */
export async function updateEntityRelationships(
  entityId: string,
  projectId: string,
  newRelationships: Relationship[],
  previousRelationships: Relationship[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Load relationship types to get reverse names
  const { data: relationshipTypes } = await supabase
    .from('relationship_types')
    .select('id, name, reverse_name')
    .eq('project_id', projectId);

  const typeMap = new Map<string, DbRelationshipType>(
    (relationshipTypes || []).map((t) => [t.id, t])
  );

  // Also create a map by name for legacy support
  const typeByNameMap = new Map<string, DbRelationshipType>(
    (relationshipTypes || []).map((t) => [t.name, t])
  );

  // Helper to get reverse type info
  const getReverseType = (rel: Relationship): { typeId: string; typeName: string } => {
    // Try to find by typeId first
    let type = typeMap.get(rel.typeId);
    
    // If not found by ID, try by name (legacy support)
    if (!type && rel.typeName) {
      type = typeByNameMap.get(rel.typeName);
    }
    
    if (type && type.reverse_name) {
      // Asymmetric relationship
      if (rel.isReverse) {
        // Current entity has reverse role (e.g., "Ученик")
        // Other entity should get the direct role (e.g., "Наставник")
        return { typeId: type.id, typeName: type.name };
      } else {
        // Current entity has direct role (e.g., "Наставник")
        // Other entity should get reverse role (e.g., "Ученик")
        return { typeId: type.id, typeName: type.reverse_name };
      }
    }
    // Symmetric or unknown: use same name
    return { typeId: rel.typeId || type?.id || '', typeName: rel.typeName };
  };

  // Find added and removed relationships
  const previousIds = new Set(previousRelationships.map((r) => r.entityId));
  const newIds = new Set(newRelationships.map((r) => r.entityId));

  const added = newRelationships.filter((r) => !previousIds.has(r.entityId));
  const removed = previousRelationships.filter((r) => !newIds.has(r.entityId));
  const updated = newRelationships.filter((r) => {
    const prev = previousRelationships.find((p) => p.entityId === r.entityId);
    return prev && (
      prev.typeId !== r.typeId ||
      prev.typeName !== r.typeName ||
      prev.description !== r.description
    );
  });

  // 1. Update current entity
  const { data: currentEntity, error: fetchError } = await supabase
    .from('entities')
    .select('attributes')
    .eq('id', entityId)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  const currentAttrs = (currentEntity?.attributes || {}) as Record<string, unknown>;
  const { error: updateError } = await supabase
    .from('entities')
    .update({ attributes: { ...currentAttrs, relationships: newRelationships } })
    .eq('id', entityId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 2. Add reverse relationships for newly added
  for (const rel of added) {
    const { data: targetEntity, error: targetFetchError } = await supabase
      .from('entities')
      .select('attributes')
      .eq('id', rel.entityId)
      .single();

    if (targetFetchError) continue;

    const targetAttrs = (targetEntity?.attributes || {}) as Record<string, unknown>;
    const targetRels = (targetAttrs.relationships || []) as Relationship[];

    // Check if reverse relationship already exists
    if (!targetRels.some((r) => r.entityId === entityId)) {
      const reverseType = getReverseType(rel);
      
      targetRels.push({
        entityId: entityId,
        typeId: reverseType.typeId,
        typeName: reverseType.typeName,
        description: rel.description,
      });

      await supabase
        .from('entities')
        .update({ attributes: { ...targetAttrs, relationships: targetRels } })
        .eq('id', rel.entityId);
    }
  }

  // 3. Remove reverse relationships for removed
  for (const rel of removed) {
    const { data: targetEntity, error: targetFetchError } = await supabase
      .from('entities')
      .select('attributes')
      .eq('id', rel.entityId)
      .single();

    if (targetFetchError) continue;

    const targetAttrs = (targetEntity?.attributes || {}) as Record<string, unknown>;
    const targetRels = (targetAttrs.relationships || []) as Relationship[];

    const filteredRels = targetRels.filter((r) => r.entityId !== entityId);

    if (filteredRels.length !== targetRels.length) {
      await supabase
        .from('entities')
        .update({ attributes: { ...targetAttrs, relationships: filteredRels } })
        .eq('id', rel.entityId);
    }
  }

  // 4. Update reverse relationships for updated (type/description changes)
  for (const rel of updated) {
    const { data: targetEntity, error: targetFetchError } = await supabase
      .from('entities')
      .select('attributes')
      .eq('id', rel.entityId)
      .single();

    if (targetFetchError) continue;

    const targetAttrs = (targetEntity?.attributes || {}) as Record<string, unknown>;
    const targetRels = (targetAttrs.relationships || []) as Relationship[];

    const targetRelIndex = targetRels.findIndex((r) => r.entityId === entityId);
    if (targetRelIndex !== -1) {
      const reverseType = getReverseType(rel);
      targetRels[targetRelIndex] = {
        entityId: entityId,
        typeId: reverseType.typeId,
        typeName: reverseType.typeName,
        description: rel.description,
      };

      await supabase
        .from('entities')
        .update({ attributes: { ...targetAttrs, relationships: targetRels } })
        .eq('id', rel.entityId);
    }
  }

  // Revalidate entity pages
  revalidatePath(`/projects/${projectId}/entity/${entityId}`);
  for (const rel of [...added, ...removed, ...updated]) {
    revalidatePath(`/projects/${projectId}/entity/${rel.entityId}`);
  }

  return { success: true, error: null };
}
