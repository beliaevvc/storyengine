/**
 * Mapper layer type utilities
 * 
 * This module provides type-safe mapping between Supabase (snake_case)
 * and Domain (camelCase) data structures.
 */

import type { Database, Json } from '@/types/supabase';

// ============================================================================
// Supabase Table Types (snake_case)
// ============================================================================

export type SupabaseEntity = Database['public']['Tables']['entities']['Row'];
export type SupabaseEntityInsert = Database['public']['Tables']['entities']['Insert'];
export type SupabaseEntityUpdate = Database['public']['Tables']['entities']['Update'];

export type SupabaseProject = Database['public']['Tables']['projects']['Row'];
export type SupabaseProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type SupabaseProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type SupabaseDocument = Database['public']['Tables']['documents']['Row'];
export type SupabaseDocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type SupabaseDocumentUpdate = Database['public']['Tables']['documents']['Update'];

// ============================================================================
// JSON Casting Utilities
// ============================================================================

/**
 * Safely cast Json to a specific type.
 * Use for fields like `attributes`, `content`, `settings` that are stored as JSONB.
 */
export function castJson<T>(json: Json | null | undefined, fallback: T): T {
  if (json === null || json === undefined) {
    return fallback;
  }
  return json as unknown as T;
}

/**
 * Convert a value to Json type for Supabase insert/update.
 */
export function toJson<T>(value: T | null | undefined): Json | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value as unknown as Json;
}
