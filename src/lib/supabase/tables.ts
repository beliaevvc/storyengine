/**
 * Typed table accessors for Supabase
 * 
 * These helpers provide centralized access to Supabase tables.
 * The `as any` casts are necessary due to Supabase SDK type inference limitations.
 * 
 * OPTIMIZATION: Functions now accept optional client parameter to reuse connections.
 * Pass an existing client to avoid creating multiple connections per request.
 * 
 * TODO: Replace with proper types when Supabase CLI generates types from schema.
 */

import { createClient } from './server';
import type { SupabaseClient } from '@supabase/supabase-js';

// Type alias for the client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any, any, any>;

// ============================================================================
// Helper to get or create client
// ============================================================================

async function getClient(client?: Client): Promise<Client> {
  if (client) return client;
  return await createClient();
}

// ============================================================================
// Table accessors (optimized - accept optional client)
// ============================================================================

/**
 * Get access to the entities table.
 */
export async function getEntitiesTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('entities');
}

/**
 * Get access to the projects table.
 */
export async function getProjectsTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('projects');
}

/**
 * Get access to the documents table.
 */
export async function getDocumentsTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('documents');
}

/**
 * Get access to the entity_relations table.
 */
export async function getEntityRelationsTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('entity_relations');
}

/**
 * Get access to the relationship_types table.
 */
export async function getRelationshipTypesTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('relationship_types');
}

/**
 * Get access to the attribute_definitions table.
 */
export async function getAttributeDefinitionsTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('attribute_definitions');
}

/**
 * Get access to the entity_type_definitions table.
 */
export async function getEntityTypeDefinitionsTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('entity_type_definitions');
}

/**
 * Get access to the timelines table.
 */
export async function getTimelinesTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('timelines');
}

/**
 * Get access to the events table.
 */
export async function getEventsTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('events');
}

/**
 * Get access to the profiles table.
 */
export async function getProfilesTable(client?: Client) {
  const supabase = await getClient(client);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('profiles');
}

// ============================================================================
// Re-export createClient for backward compatibility
// ============================================================================

export { createClient };
