'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Entity, EntityType } from '@/types/supabase';

// Helper to get untyped table access (workaround for Supabase type issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getEntitiesTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('entities');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRelationsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('entity_relations');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRelationshipTypesTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('relationship_types');
}

// Get all entities for a project
export async function getEntities(
  projectId: string
): Promise<{ data: Entity[] | null; error: string | null }> {
  const table = await getEntitiesTable();

  const { data, error } = await table
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Entity[], error: null };
}

// Get entities by type
export async function getEntitiesByType(
  projectId: string,
  type: EntityType
): Promise<{ data: Entity[] | null; error: string | null }> {
  const table = await getEntitiesTable();

  const { data, error } = await table
    .select('*')
    .eq('project_id', projectId)
    .eq('type', type)
    .order('name');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Entity[], error: null };
}

// Get single entity
export async function getEntity(
  entityId: string
): Promise<{ data: Entity | null; error: string | null }> {
  const table = await getEntitiesTable();

  const { data, error } = await table
    .select('*')
    .eq('id', entityId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Entity, error: null };
}

// Create entity input
interface CreateEntityInput {
  project_id: string;
  name: string;
  type: EntityType;
  description?: string | null;
  attributes?: unknown;
  content?: unknown;
}

// Create entity
export async function createEntity(
  input: CreateEntityInput
): Promise<{ data: Entity | null; error: string | null }> {
  const table = await getEntitiesTable();

  const { data, error } = await table
    .insert(input)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath(`/projects/${input.project_id}`);
  return { data: data as Entity, error: null };
}

// Update entity input
interface UpdateEntityInput {
  name?: string;
  type?: EntityType;
  description?: string | null;
  attributes?: unknown;
  content?: unknown;
}

// Update entity
export async function updateEntity(
  entityId: string,
  input: UpdateEntityInput
): Promise<{ data: Entity | null; error: string | null }> {
  const table = await getEntitiesTable();

  const { data, error } = await table
    .update(input)
    .eq('id', entityId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  if (data) {
    revalidatePath(`/projects/${(data as Entity).project_id}`);
  }

  return { data: data as Entity, error: null };
}

// Delete entity
export async function deleteEntity(
  entityId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const table = await getEntitiesTable();

  const { error } = await table
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
  const table = await getEntitiesTable();

  const { data, error } = await table
    .select('*')
    .eq('project_id', projectId)
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(20);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Entity[], error: null };
}

// Get entity relations
export async function getEntityRelations(
  entityId: string
): Promise<{ 
  data: { 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outgoing: Array<{ relation: any; target: Entity }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    incoming: Array<{ relation: any; source: Entity }>;
  } | null; 
  error: string | null 
}> {
  const table = await getRelationsTable();

  // Get outgoing relations
  const { data: outgoing, error: outError } = await table
    .select(`*, target:target_id(*)`)
    .eq('source_id', entityId);

  if (outError) {
    return { data: null, error: outError.message };
  }

  // Get incoming relations
  const { data: incoming, error: inError } = await table
    .select(`*, source:source_id(*)`)
    .eq('target_id', entityId);

  if (inError) {
    return { data: null, error: inError.message };
  }

  return {
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      outgoing: outgoing?.map((r: any) => ({ relation: r, target: r.target as Entity })) || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      incoming: incoming?.map((r: any) => ({ relation: r, source: r.source as Entity })) || [],
    },
    error: null,
  };
}

// Create entity relation input
interface CreateRelationInput {
  source_id: string;
  target_id: string;
  relation_type: string;
  label?: string | null;
  attributes?: unknown;
}

// Create entity relation
export async function createEntityRelation(
  input: CreateRelationInput
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ data: any | null; error: string | null }> {
  const table = await getRelationsTable();

  const { data, error } = await table
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
  const table = await getRelationsTable();

  const { error } = await table
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
  const table = await getEntitiesTable();

  const { error } = await table
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
  const table = await getEntitiesTable();

  const { error } = await table
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
  const table = await getEntitiesTable();

  const { error } = await table
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
  isReverse?: boolean;
}

interface DbRelationshipType {
  id: string;
  name: string;
  reverse_name: string | null;
}

/**
 * Update relationships for an entity with bidirectional sync.
 */
export async function updateEntityRelationships(
  entityId: string,
  projectId: string,
  newRelationships: Relationship[],
  previousRelationships: Relationship[]
): Promise<{ success: boolean; error: string | null }> {
  const entitiesTable = await getEntitiesTable();
  const typesTable = await getRelationshipTypesTable();

  // Load relationship types to get reverse names
  const { data: relationshipTypes } = await typesTable
    .select('id, name, reverse_name')
    .eq('project_id', projectId);

  const typeMap = new Map<string, DbRelationshipType>(
    (relationshipTypes || []).map((t: DbRelationshipType) => [t.id, t])
  );

  const typeByNameMap = new Map<string, DbRelationshipType>(
    (relationshipTypes || []).map((t: DbRelationshipType) => [t.name, t])
  );

  const getReverseType = (rel: Relationship): { typeId: string; typeName: string } => {
    let type = typeMap.get(rel.typeId);
    if (!type && rel.typeName) {
      type = typeByNameMap.get(rel.typeName);
    }
    if (type && type.reverse_name) {
      if (rel.isReverse) {
        return { typeId: type.id, typeName: type.name };
      } else {
        return { typeId: type.id, typeName: type.reverse_name };
      }
    }
    return { typeId: rel.typeId || type?.id || '', typeName: rel.typeName };
  };

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
  const { data: currentEntity, error: fetchError } = await entitiesTable
    .select('attributes')
    .eq('id', entityId)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  const currentAttrs = (currentEntity?.attributes || {}) as Record<string, unknown>;
  const { error: updateError } = await entitiesTable
    .update({ attributes: { ...currentAttrs, relationships: newRelationships } })
    .eq('id', entityId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 2. Add reverse relationships for newly added
  for (const rel of added) {
    const { data: targetEntity } = await entitiesTable
      .select('attributes')
      .eq('id', rel.entityId)
      .single();

    if (!targetEntity) continue;

    const targetAttrs = (targetEntity?.attributes || {}) as Record<string, unknown>;
    const targetRels = (targetAttrs.relationships || []) as Relationship[];

    if (!targetRels.some((r) => r.entityId === entityId)) {
      const reverseType = getReverseType(rel);
      targetRels.push({
        entityId: entityId,
        typeId: reverseType.typeId,
        typeName: reverseType.typeName,
        description: rel.description,
      });

      await entitiesTable
        .update({ attributes: { ...targetAttrs, relationships: targetRels } })
        .eq('id', rel.entityId);
    }
  }

  // 3. Remove reverse relationships for removed
  for (const rel of removed) {
    const { data: targetEntity } = await entitiesTable
      .select('attributes')
      .eq('id', rel.entityId)
      .single();

    if (!targetEntity) continue;

    const targetAttrs = (targetEntity?.attributes || {}) as Record<string, unknown>;
    const targetRels = (targetAttrs.relationships || []) as Relationship[];

    const filteredRels = targetRels.filter((r) => r.entityId !== entityId);

    if (filteredRels.length !== targetRels.length) {
      await entitiesTable
        .update({ attributes: { ...targetAttrs, relationships: filteredRels } })
        .eq('id', rel.entityId);
    }
  }

  // 4. Update reverse relationships for updated
  for (const rel of updated) {
    const { data: targetEntity } = await entitiesTable
      .select('attributes')
      .eq('id', rel.entityId)
      .single();

    if (!targetEntity) continue;

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

      await entitiesTable
        .update({ attributes: { ...targetAttrs, relationships: targetRels } })
        .eq('id', rel.entityId);
    }
  }

  revalidatePath(`/projects/${projectId}/entity/${entityId}`);
  for (const rel of [...added, ...removed, ...updated]) {
    revalidatePath(`/projects/${projectId}/entity/${rel.entityId}`);
  }

  return { success: true, error: null };
}
