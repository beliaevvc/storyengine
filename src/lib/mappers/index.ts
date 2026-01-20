/**
 * Mapper Layer
 * 
 * This module provides type-safe mapping between Supabase (snake_case)
 * and Domain (camelCase) data structures.
 * 
 * Usage:
 * ```ts
 * import { mapSupabaseToEntity, mapSupabaseToEntities } from '@/lib/mappers';
 * 
 * const entity = mapSupabaseToEntity(supabaseRow);
 * const entities = mapSupabaseToEntities(supabaseRows);
 * ```
 */

// Type utilities
export { castJson, toJson } from './types';
export type {
  SupabaseEntity,
  SupabaseEntityInsert,
  SupabaseEntityUpdate,
  SupabaseProject,
  SupabaseProjectInsert,
  SupabaseProjectUpdate,
  SupabaseDocument,
  SupabaseDocumentInsert,
  SupabaseDocumentUpdate,
} from './types';

// Entity mappers
export {
  mapSupabaseToEntity,
  mapSupabaseToEntities,
  mapCreateEntityToSupabase,
  mapUpdateEntityToSupabase,
  mapEntityToSupabaseUpdate,
  mapEntityToSupabase,
  mapEntitiesToSupabase,
} from './entityMapper';

// Project mappers
export {
  mapSupabaseToProject,
  mapSupabaseToProjects,
  mapCreateProjectToSupabase,
  mapUpdateProjectToSupabase,
} from './projectMapper';

// Document mappers
export {
  mapSupabaseToDocument,
  mapSupabaseToDocuments,
  mapCreateDocumentToSupabase,
  mapUpdateDocumentToSupabase,
  mapDocumentToSupabaseUpdate,
  mapDocumentToSupabase,
  mapDocumentsToSupabase,
} from './documentMapper';
