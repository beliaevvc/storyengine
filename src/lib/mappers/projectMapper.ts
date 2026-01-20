/**
 * Project Mapper
 * 
 * Maps between Supabase projects (snake_case) and Domain projects (camelCase).
 */

import type { Project, ProjectSettings, CreateProjectInput, UpdateProjectInput } from '@/core/entities/project';
import type { SupabaseProject, SupabaseProjectInsert, SupabaseProjectUpdate } from './types';
import { castJson, toJson } from './types';

// ============================================================================
// Supabase → Domain
// ============================================================================

/**
 * Map a Supabase project row to a Domain project.
 */
export function mapSupabaseToProject(data: SupabaseProject): Project {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    settings: castJson<ProjectSettings>(data.settings, {}),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Map an array of Supabase project rows to Domain projects.
 */
export function mapSupabaseToProjects(data: SupabaseProject[]): Project[] {
  return data.map(mapSupabaseToProject);
}

// ============================================================================
// Domain → Supabase
// ============================================================================

/**
 * Map a CreateProjectInput to a Supabase insert payload.
 * Note: user_id must be added separately from auth context.
 */
export function mapCreateProjectToSupabase(
  input: CreateProjectInput,
  userId: string
): SupabaseProjectInsert {
  return {
    user_id: userId,
    title: input.title,
    description: input.description ?? null,
    settings: toJson(input.settings ?? {}),
  };
}

/**
 * Map an UpdateProjectInput to a Supabase update payload.
 */
export function mapUpdateProjectToSupabase(input: UpdateProjectInput): SupabaseProjectUpdate {
  const update: SupabaseProjectUpdate = {};

  if (input.title !== undefined) {
    update.title = input.title;
  }
  if (input.description !== undefined) {
    update.description = input.description;
  }
  if (input.settings !== undefined) {
    update.settings = toJson(input.settings);
  }

  return update;
}
