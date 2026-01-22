'use server';

import { revalidatePath } from 'next/cache';
import { 
  createClient,
  getProjectsTable, 
  getEntitiesTable, 
  getDocumentsTable, 
  getEntityRelationsTable,
  getEntityTypeDefinitionsTable,
} from '@/lib/supabase/tables';
import { seedDefaultEntityTypesAction } from './entity-type-actions';
import type { Project } from '@/types/supabase';

export type ProjectWithCounts = Project & {
  entities_count: number;
  documents_count: number;
};

// Get all projects for current user
export async function getProjects(): Promise<{
  data: ProjectWithCounts[] | null;
  error: string | null;
}> {
  // Create single client for all operations
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  // Reuse the same client for all table accesses
  const projectsTable = await getProjectsTable(supabase);
  const { data: projects, error } = await projectsTable
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  // Reuse same client for counts
  const entitiesTable = await getEntitiesTable(supabase);
  const documentsTable = await getDocumentsTable(supabase);

  // Get counts for each project in parallel
  const projectsWithCounts = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (projects as any[]).map(async (project: any) => {
      const [entitiesResult, documentsResult] = await Promise.all([
        entitiesTable
          .select('id', { count: 'exact', head: true })
          .eq('project_id', project.id),
        documentsTable
          .select('id', { count: 'exact', head: true })
          .eq('project_id', project.id)
          .neq('type', 'FOLDER'), // Don't count folders as documents
      ]);

      return {
        ...project,
        entities_count: entitiesResult.count || 0,
        documents_count: documentsResult.count || 0,
      };
    })
  );

  return { data: projectsWithCounts as ProjectWithCounts[], error: null };
}

// Get single project by ID
export async function getProject(
  projectId: string
): Promise<{ data: Project | null; error: string | null }> {
  const table = await getProjectsTable();

  const { data, error } = await table
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Project, error: null };
}

// Create project input
interface CreateProjectInput {
  title: string;
  description?: string | null;
  settings?: unknown;
}

// Create new project
export async function createProject(
  input: CreateProjectInput
): Promise<{ data: Project | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  const table = await getProjectsTable();
  const { data, error } = await table
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  // Seed default entity types for new project
  await seedDefaultEntityTypesAction(data.id);

  revalidatePath('/projects');
  return { data: data as Project, error: null };
}

// Update project input
interface UpdateProjectInput {
  title?: string;
  description?: string | null;
  settings?: unknown;
}

// Update project
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<{ data: Project | null; error: string | null }> {
  const table = await getProjectsTable();

  const { data, error } = await table
    .update(input)
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${projectId}`);
  return { data: data as Project, error: null };
}

// Delete project
export async function deleteProject(
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const table = await getProjectsTable();

  const { error } = await table
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
  // Create single client for all operations
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Not authenticated' };
  }

  // Reuse same client for all table accesses
  const projectsTable = await getProjectsTable(supabase);
  const entitiesTable = await getEntitiesTable(supabase);
  const documentsTable = await getDocumentsTable(supabase);
  const relationsTable = await getEntityRelationsTable(supabase);

  // Get original project
  const { data: original, error: fetchError } = await projectsTable
    .select('*')
    .eq('id', projectId)
    .single();

  if (fetchError || !original) {
    return { data: null, error: fetchError?.message || 'Project not found' };
  }

  // Create new project
  const { data: newProject, error: createError } = await projectsTable
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

  // Copy entity type definitions (reuse client)
  const entityTypesTable = await getEntityTypeDefinitionsTable(supabase);
  const { data: entityTypes } = await entityTypesTable
    .select('*')
    .eq('project_id', projectId);

  if (entityTypes && entityTypes.length > 0) {
    await entityTypesTable.insert(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (entityTypes as any[]).map((et: any, index: number) => ({
        project_id: newProject.id,
        name: et.name,
        label: et.label,
        icon: et.icon,
        color: et.color,
        order: index,
        is_default: et.is_default,
      }))
    );
  } else {
    // If no types exist, seed defaults
    await seedDefaultEntityTypesAction(newProject.id);
  }

  // Copy entities
  const { data: entities } = await entitiesTable
    .select('*')
    .eq('project_id', projectId);

  if (entities && entities.length > 0) {
    const entityIdMap = new Map<string, string>();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const entity of entities as any[]) {
      const { data: newEntity } = await entitiesTable
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
    const { data: relations } = await relationsTable
      .select('*')
      .in('source_id', Array.from(entityIdMap.keys()));

    if (relations && relations.length > 0) {
      await relationsTable.insert(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (relations as any[]).map((rel: any) => ({
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
  const { data: documents } = await documentsTable
    .select('*')
    .eq('project_id', projectId)
    .order('order');

  if (documents && documents.length > 0) {
    const docIdMap = new Map<string, string>();

    // First pass: create all documents without parent_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const doc of documents as any[]) {
      const { data: newDoc } = await documentsTable
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const doc of documents as any[]) {
      if (doc.parent_id && docIdMap.has(doc.parent_id)) {
        const newDocId = docIdMap.get(doc.id);
        const newParentId = docIdMap.get(doc.parent_id);
        
        if (newDocId && newParentId) {
          await documentsTable
            .update({ parent_id: newParentId })
            .eq('id', newDocId);
        }
      }
    }
  }

  revalidatePath('/projects');
  return { data: newProject as Project, error: null };
}
