/**
 * Typed table accessors for Supabase
 * 
 * These helpers provide centralized access to Supabase tables.
 * The `as any` casts are necessary due to Supabase SDK type inference limitations.
 * 
 * TODO: Replace with proper types when Supabase CLI generates types from schema.
 */

import { createClient } from './server';

// ============================================================================
// Table accessors
// ============================================================================

/**
 * Get access to the entities table.
 */
export async function getEntitiesTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('entities');
}

/**
 * Get access to the projects table.
 */
export async function getProjectsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('projects');
}

/**
 * Get access to the documents table.
 */
export async function getDocumentsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('documents');
}

/**
 * Get access to the entity_relations table.
 */
export async function getEntityRelationsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('entity_relations');
}

/**
 * Get access to the relationship_types table.
 */
export async function getRelationshipTypesTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('relationship_types');
}

/**
 * Get access to the attribute_definitions table.
 */
export async function getAttributeDefinitionsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('attribute_definitions');
}

/**
 * Get access to the timelines table.
 */
export async function getTimelinesTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('timelines');
}

/**
 * Get access to the events table.
 */
export async function getEventsTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('events');
}

/**
 * Get access to the profiles table.
 */
export async function getProfilesTable() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('profiles');
}

// ============================================================================
// Re-export createClient for backward compatibility
// ============================================================================

export { createClient };
