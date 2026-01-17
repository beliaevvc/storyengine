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
