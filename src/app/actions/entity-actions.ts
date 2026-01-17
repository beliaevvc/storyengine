'use server';

import { revalidatePath } from 'next/cache';
import { repositories } from '@/infrastructure/database/repositories';
import type { Entity, EntityType, CreateEntityInput, UpdateEntityInput } from '@/core/entities/entity';
import { DomainError, NotFoundError, ValidationError } from '@/core/errors';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export async function createEntityAction(
  input: CreateEntityInput
): Promise<ActionResult<Entity>> {
  try {
    // Validation
    if (!input.name?.trim()) {
      throw new ValidationError('Entity name is required', 'name');
    }
    if (input.name.length > 255) {
      throw new ValidationError('Entity name must be less than 255 characters', 'name');
    }

    const entity = await repositories.entityRepository.create({
      ...input,
      name: input.name.trim(),
      description: input.description?.trim(),
    });

    revalidatePath(`/projects/${input.projectId}`);
    return { success: true, data: entity };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('createEntityAction error:', error);
    return { success: false, error: 'Failed to create entity' };
  }
}

export async function getEntityAction(
  id: string
): Promise<ActionResult<Entity>> {
  try {
    const entity = await repositories.entityRepository.findById(id);
    if (!entity) {
      throw new NotFoundError('Entity', id);
    }
    return { success: true, data: entity };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('getEntityAction error:', error);
    return { success: false, error: 'Failed to get entity' };
  }
}

export async function listEntitiesByProjectAction(
  projectId: string
): Promise<ActionResult<Entity[]>> {
  try {
    const entities = await repositories.entityRepository.findByProject(projectId);
    return { success: true, data: entities };
  } catch (error) {
    console.error('listEntitiesByProjectAction error:', error);
    return { success: false, error: 'Failed to list entities' };
  }
}

export async function listEntitiesByTypeAction(
  projectId: string,
  type: EntityType
): Promise<ActionResult<Entity[]>> {
  try {
    const entities = await repositories.entityRepository.findByProjectAndType(projectId, type);
    return { success: true, data: entities };
  } catch (error) {
    console.error('listEntitiesByTypeAction error:', error);
    return { success: false, error: 'Failed to list entities' };
  }
}

export async function searchEntitiesAction(
  projectId: string,
  query: string
): Promise<ActionResult<Entity[]>> {
  try {
    const entities = await repositories.entityRepository.search(projectId, query);
    return { success: true, data: entities };
  } catch (error) {
    console.error('searchEntitiesAction error:', error);
    return { success: false, error: 'Failed to search entities' };
  }
}

export async function updateEntityAction(
  id: string,
  input: UpdateEntityInput
): Promise<ActionResult<Entity>> {
  try {
    const existing = await repositories.entityRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Entity', id);
    }

    // Validation
    if (input.name !== undefined) {
      if (!input.name.trim()) {
        throw new ValidationError('Entity name cannot be empty', 'name');
      }
      if (input.name.length > 255) {
        throw new ValidationError('Entity name must be less than 255 characters', 'name');
      }
    }

    const entity = await repositories.entityRepository.update(id, {
      ...input,
      ...(input.name !== undefined && { name: input.name.trim() }),
      ...(input.description !== undefined && { description: input.description?.trim() ?? null }),
    });

    revalidatePath(`/projects/${existing.projectId}`);
    return { success: true, data: entity };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('updateEntityAction error:', error);
    return { success: false, error: 'Failed to update entity' };
  }
}

export async function deleteEntityAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const existing = await repositories.entityRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Entity', id);
    }

    await repositories.entityRepository.delete(id);
    revalidatePath(`/projects/${existing.projectId}`);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('deleteEntityAction error:', error);
    return { success: false, error: 'Failed to delete entity' };
  }
}
