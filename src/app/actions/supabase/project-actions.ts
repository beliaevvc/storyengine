'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { InsertTables, UpdateTables, Project } from '@/types/supabase';

export type ProjectWithCounts = Project & {
  entities_count: number;
  documents_count: number;
};

// Get all projects for current user
export async function getProjects(): Promise<{
  data: ProjectWithCounts[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  // Get counts for each project
  const projectsWithCounts = await Promise.all(
    projects.map(async (project) => {
      const [entitiesResult, documentsResult] = await Promise.all([
        supabase
          .from('entities')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', project.id),
        supabase
          .from('documents')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', project.id),
      ]);

      return {
        ...project,
        entities_count: entitiesResult.count || 0,
        documents_count: documentsResult.count || 0,
      };
    })
  );

  return { data: projectsWithCounts, error: null };
}

// Get single project by ID
export async function getProject(
  projectId: string
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Create new project
export async function createProject(
  input: Omit<InsertTables<'projects'>, 'user_id'>
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath('/projects');
  return { data, error: null };
}

// Update project
export async function updateProject(
  projectId: string,
  input: UpdateTables<'projects'>
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${projectId}`);
  return { data, error: null };
}

// Delete project
export async function deleteProject(
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/projects');
  return { success: true, error: null };
}

// Duplicate project (with all entities and documents)
export async function duplicateProject(
  projectId: string
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  // Get original project
  const { data: original, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (fetchError || !original) {
    return { data: null, error: fetchError?.message || 'Project not found' };
  }

  // Create new project
  const { data: newProject, error: createError } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      title: `${original.title} (копия)`,
      description: original.description,
      settings: original.settings,
    })
    .select()
    .single();

  if (createError || !newProject) {
    return { data: null, error: createError?.message || 'Failed to create project' };
  }

  // Copy entities
  const { data: entities } = await supabase
    .from('entities')
    .select('*')
    .eq('project_id', projectId);

  if (entities && entities.length > 0) {
    const entityIdMap = new Map<string, string>();
    
    for (const entity of entities) {
      const { data: newEntity } = await supabase
        .from('entities')
        .insert({
          project_id: newProject.id,
          type: entity.type,
          name: entity.name,
          description: entity.description,
          attributes: entity.attributes,
        })
        .select()
        .single();

      if (newEntity) {
        entityIdMap.set(entity.id, newEntity.id);
      }
    }

    // Copy entity relations with new IDs
    const { data: relations } = await supabase
      .from('entity_relations')
      .select('*')
      .in('source_id', Array.from(entityIdMap.keys()));

    if (relations && relations.length > 0) {
      await supabase.from('entity_relations').insert(
        relations.map((rel) => ({
          source_id: entityIdMap.get(rel.source_id)!,
          target_id: entityIdMap.get(rel.target_id)!,
          relation_type: rel.relation_type,
          label: rel.label,
          attributes: rel.attributes,
        }))
      );
    }
  }

  // Copy documents (handling parent-child relationships)
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .order('order');

  if (documents && documents.length > 0) {
    const docIdMap = new Map<string, string>();

    // First pass: create all documents without parent_id
    for (const doc of documents) {
      const { data: newDoc } = await supabase
        .from('documents')
        .insert({
          project_id: newProject.id,
          title: doc.title,
          content: doc.content,
          type: doc.type,
          order: doc.order,
        })
        .select()
        .single();

      if (newDoc) {
        docIdMap.set(doc.id, newDoc.id);
      }
    }

    // Second pass: update parent_id references
    for (const doc of documents) {
      if (doc.parent_id && docIdMap.has(doc.parent_id)) {
        const newDocId = docIdMap.get(doc.id);
        const newParentId = docIdMap.get(doc.parent_id);
        
        if (newDocId && newParentId) {
          await supabase
            .from('documents')
            .update({ parent_id: newParentId })
            .eq('id', newDocId);
        }
      }
    }
  }

  revalidatePath('/projects');
  return { data: newProject, error: null };
}
