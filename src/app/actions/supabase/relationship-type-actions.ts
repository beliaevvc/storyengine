'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type {
  RelationshipType,
  CreateRelationshipTypeData,
  UpdateRelationshipTypeData,
} from '@/core/types/relationship-types';

// ============================================================================
// Type mapping helpers
// ============================================================================

interface DbRelationshipType {
  id: string;
  project_id: string;
  name: string;
  reverse_name: string | null;
  source_entity_types: string[] | null;
  target_entity_types: string[] | null;
  color: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

function mapDbToRelationshipType(db: DbRelationshipType): RelationshipType {
  return {
    id: db.id,
    projectId: db.project_id,
    name: db.name,
    reverseName: db.reverse_name,
    sourceEntityTypes: db.source_entity_types as RelationshipType['sourceEntityTypes'],
    targetEntityTypes: db.target_entity_types as RelationshipType['targetEntityTypes'],
    color: db.color,
    order: db.order,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Get all relationship types for a project
 */
export async function getRelationshipTypesAction(
  projectId: string
): Promise<{ success: true; data: RelationshipType[] } | { success: false; error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('relationship_types')
    .select('*')
    .eq('project_id', projectId)
    .order('order', { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: (data as DbRelationshipType[]).map(mapDbToRelationshipType),
  };
}

/**
 * Get a single relationship type by ID
 */
export async function getRelationshipTypeAction(
  typeId: string
): Promise<{ success: true; data: RelationshipType } | { success: false; error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('relationship_types')
    .select('*')
    .eq('id', typeId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: mapDbToRelationshipType(data as DbRelationshipType),
  };
}

/**
 * Create a new relationship type
 */
export async function createRelationshipTypeAction(
  data: CreateRelationshipTypeData
): Promise<{ success: true; data: RelationshipType } | { success: false; error: string }> {
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from('relationship_types')
    .insert({
      project_id: data.projectId,
      name: data.name,
      reverse_name: data.reverseName ?? null,
      source_entity_types: data.sourceEntityTypes ?? null,
      target_entity_types: data.targetEntityTypes ?? null,
      color: data.color ?? null,
      order: data.order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${data.projectId}/settings`);

  return {
    success: true,
    data: mapDbToRelationshipType(created as DbRelationshipType),
  };
}

/**
 * Update an existing relationship type
 */
export async function updateRelationshipTypeAction(
  typeId: string,
  projectId: string,
  data: UpdateRelationshipTypeData
): Promise<{ success: true; data: RelationshipType } | { success: false; error: string }> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.reverseName !== undefined) updateData.reverse_name = data.reverseName;
  if (data.sourceEntityTypes !== undefined) updateData.source_entity_types = data.sourceEntityTypes;
  if (data.targetEntityTypes !== undefined) updateData.target_entity_types = data.targetEntityTypes;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.order !== undefined) updateData.order = data.order;

  const { data: updated, error } = await supabase
    .from('relationship_types')
    .update(updateData)
    .eq('id', typeId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}/settings`);

  return {
    success: true,
    data: mapDbToRelationshipType(updated as DbRelationshipType),
  };
}

/**
 * Delete a relationship type
 */
export async function deleteRelationshipTypeAction(
  typeId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('relationship_types')
    .delete()
    .eq('id', typeId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}/settings`);

  return { success: true, error: null };
}

/**
 * Reorder relationship types
 */
export async function reorderRelationshipTypesAction(
  projectId: string,
  orderedIds: string[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Update order for each type
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('relationship_types')
      .update({ order: index })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error);

  if (firstError?.error) {
    return { success: false, error: firstError.error.message };
  }

  revalidatePath(`/projects/${projectId}/settings`);

  return { success: true, error: null };
}

/**
 * Seed default relationship types for a new project
 */
export async function seedDefaultRelationshipTypesAction(
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Check if types already exist
  const { data: existing } = await supabase
    .from('relationship_types')
    .select('id')
    .eq('project_id', projectId)
    .limit(1);

  if (existing && existing.length > 0) {
    return { success: true, error: null }; // Already seeded
  }

  // Call the database function to seed defaults
  const { error } = await supabase.rpc('seed_default_relationship_types', {
    p_project_id: projectId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
