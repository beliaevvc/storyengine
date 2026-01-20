/**
 * Entity Mapper
 * 
 * Maps between Supabase entities (snake_case) and Domain entities (camelCase).
 */

import type { Entity, CreateEntityInput, UpdateEntityInput, TiptapContent, EntityDocuments } from '@/core/entities/entity';
import type { EntityAttributes } from '@/core/types/entity-attributes';
import type { SupabaseEntity, SupabaseEntityInsert, SupabaseEntityUpdate } from './types';
import { castJson, toJson } from './types';

// ============================================================================
// Supabase → Domain
// ============================================================================

/**
 * Map a Supabase entity row to a Domain entity.
 */
export function mapSupabaseToEntity(data: SupabaseEntity): Entity {
  return {
    id: data.id,
    projectId: data.project_id,
    type: data.type,
    name: data.name,
    description: data.description ?? undefined,
    attributes: castJson<EntityAttributes>(data.attributes, {}),
    content: castJson<TiptapContent | null>(data.content, null),
    // documents field is stored in content as part of the JSON structure
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

/**
 * Map an array of Supabase entity rows to Domain entities.
 */
export function mapSupabaseToEntities(data: SupabaseEntity[]): Entity[] {
  return data.map(mapSupabaseToEntity);
}

// ============================================================================
// Domain → Supabase
// ============================================================================

/**
 * Map a CreateEntityInput to a Supabase insert payload.
 */
export function mapCreateEntityToSupabase(input: CreateEntityInput): SupabaseEntityInsert {
  return {
    project_id: input.projectId,
    type: input.type,
    name: input.name,
    description: input.description ?? null,
    attributes: toJson(input.attributes ?? {}),
  };
}

/**
 * Map an UpdateEntityInput to a Supabase update payload.
 */
export function mapUpdateEntityToSupabase(input: UpdateEntityInput): SupabaseEntityUpdate {
  const update: SupabaseEntityUpdate = {};

  if (input.type !== undefined) {
    update.type = input.type;
  }
  if (input.name !== undefined) {
    update.name = input.name;
  }
  if (input.description !== undefined) {
    update.description = input.description;
  }
  if (input.attributes !== undefined) {
    update.attributes = toJson(input.attributes);
  }

  return update;
}

/**
 * Map a partial Domain entity to a Supabase update payload.
 */
export function mapEntityToSupabaseUpdate(entity: Partial<Entity>): SupabaseEntityUpdate {
  const update: SupabaseEntityUpdate = {};

  if (entity.type !== undefined) {
    update.type = entity.type;
  }
  if (entity.name !== undefined) {
    update.name = entity.name;
  }
  if (entity.description !== undefined) {
    update.description = entity.description ?? null;
  }
  if (entity.attributes !== undefined) {
    update.attributes = toJson(entity.attributes);
  }
  if (entity.content !== undefined) {
    update.content = toJson(entity.content);
  }

  return update;
}

/**
 * Map a Domain entity to a full Supabase row format.
 * Useful when components expect Supabase format.
 */
export function mapEntityToSupabase(entity: Entity): SupabaseEntity {
  return {
    id: entity.id,
    project_id: entity.projectId,
    type: entity.type,
    name: entity.name,
    description: entity.description ?? null,
    attributes: toJson(entity.attributes) ?? {},
    content: toJson(entity.content),
    embedding: null,
    created_at: entity.createdAt.toISOString(),
    updated_at: entity.updatedAt.toISOString(),
  };
}

/**
 * Map an array of Domain entities to Supabase format.
 */
export function mapEntitiesToSupabase(entities: Entity[]): SupabaseEntity[] {
  return entities.map(mapEntityToSupabase);
}
