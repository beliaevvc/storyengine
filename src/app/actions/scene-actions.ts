'use server';

import { revalidatePath } from 'next/cache';
import { repositories } from '@/infrastructure/database/repositories';
import { prisma } from '@/infrastructure/database/prisma/client';
import type { Scene, SceneWithEntities, CreateSceneInput, UpdateSceneInput } from '@/core/entities/scene';
import { DomainError, NotFoundError } from '@/core/errors';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export async function createSceneAction(
  input: CreateSceneInput
): Promise<ActionResult<Scene>> {
  try {
    const scene = await repositories.sceneRepository.create(input);

    // Get document to find project ID for revalidation
    const document = await repositories.documentRepository.findById(input.documentId);
    if (document) {
      revalidatePath(`/projects/${document.projectId}`);
    }

    return { success: true, data: scene };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('createSceneAction error:', error);
    return { success: false, error: 'Failed to create scene' };
  }
}

export async function getSceneAction(
  id: string
): Promise<ActionResult<Scene>> {
  try {
    const scene = await repositories.sceneRepository.findById(id);
    if (!scene) {
      throw new NotFoundError('Scene', id);
    }
    return { success: true, data: scene };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('getSceneAction error:', error);
    return { success: false, error: 'Failed to get scene' };
  }
}

export async function getSceneWithEntitiesAction(
  id: string
): Promise<ActionResult<SceneWithEntities>> {
  try {
    const scene = await repositories.sceneRepository.findByIdWithEntities(id);
    if (!scene) {
      throw new NotFoundError('Scene', id);
    }
    return { success: true, data: scene };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('getSceneWithEntitiesAction error:', error);
    return { success: false, error: 'Failed to get scene' };
  }
}

export async function listScenesByDocumentAction(
  documentId: string
): Promise<ActionResult<Scene[]>> {
  try {
    const scenes = await repositories.sceneRepository.findByDocument(documentId);
    return { success: true, data: scenes };
  } catch (error) {
    console.error('listScenesByDocumentAction error:', error);
    return { success: false, error: 'Failed to list scenes' };
  }
}

export async function listScenesWithEntitiesByDocumentAction(
  documentId: string
): Promise<ActionResult<SceneWithEntities[]>> {
  try {
    const scenes = await repositories.sceneRepository.findByDocumentWithEntities(documentId);
    return { success: true, data: scenes };
  } catch (error) {
    console.error('listScenesWithEntitiesByDocumentAction error:', error);
    return { success: false, error: 'Failed to list scenes' };
  }
}

export async function updateSceneAction(
  id: string,
  input: UpdateSceneInput
): Promise<ActionResult<Scene>> {
  try {
    const existing = await repositories.sceneRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Scene', id);
    }

    const scene = await repositories.sceneRepository.update(id, input);

    // Get document to find project ID for revalidation
    const document = await repositories.documentRepository.findById(existing.documentId);
    if (document) {
      revalidatePath(`/projects/${document.projectId}`);
    }

    return { success: true, data: scene };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('updateSceneAction error:', error);
    return { success: false, error: 'Failed to update scene' };
  }
}

export async function deleteSceneAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const existing = await repositories.sceneRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Scene', id);
    }

    await repositories.sceneRepository.delete(id);

    // Get document to find project ID for revalidation
    const document = await repositories.documentRepository.findById(existing.documentId);
    if (document) {
      revalidatePath(`/projects/${document.projectId}`);
    }

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('deleteSceneAction error:', error);
    return { success: false, error: 'Failed to delete scene' };
  }
}

export async function reorderScenesAction(
  documentId: string,
  sceneIds: string[]
): Promise<ActionResult<void>> {
  try {
    await repositories.sceneRepository.reorder(documentId, sceneIds);

    // Get document to find project ID for revalidation
    const document = await repositories.documentRepository.findById(documentId);
    if (document) {
      revalidatePath(`/projects/${document.projectId}`);
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error('reorderScenesAction error:', error);
    return { success: false, error: 'Failed to reorder scenes' };
  }
}

export async function addEntityToSceneAction(
  entityId: string,
  sceneId: string,
  role?: string
): Promise<ActionResult<void>> {
  try {
    await repositories.entityRepository.addToScene(entityId, sceneId, role);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('addEntityToSceneAction error:', error);
    return { success: false, error: 'Failed to add entity to scene' };
  }
}

export async function removeEntityFromSceneAction(
  entityId: string,
  sceneId: string
): Promise<ActionResult<void>> {
  try {
    await repositories.entityRepository.removeFromScene(entityId, sceneId);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('removeEntityFromSceneAction error:', error);
    return { success: false, error: 'Failed to remove entity from scene' };
  }
}

// ============================================
// SCENE BY ENTITY (for Entity Profile Timeline)
// ============================================

export interface SceneWithDocument {
  id: string;
  title: string | null;
  order: number;
  documentId: string;
  documentTitle: string;
  documentOrder: number;
  role: string | null;
  notes: string | null;
}

/**
 * Получить все сцены, в которых участвует entity
 * Для отображения в Timeline на странице профиля сущности
 */
export async function getScenesByEntityAction(
  entityId: string
): Promise<ActionResult<SceneWithDocument[]>> {
  try {
    const sceneEntities = await prisma.sceneEntity.findMany({
      where: { entityId },
      include: {
        scene: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                order: true,
              },
            },
          },
        },
      },
      orderBy: [
        { scene: { document: { order: 'asc' } } },
        { scene: { order: 'asc' } },
      ],
    });

    const scenes: SceneWithDocument[] = sceneEntities.map((se) => ({
      id: se.scene.id,
      title: se.scene.title,
      order: se.scene.order,
      documentId: se.scene.document.id,
      documentTitle: se.scene.document.title,
      documentOrder: se.scene.document.order,
      role: se.role,
      notes: se.notes,
    }));

    return { success: true, data: scenes };
  } catch (error) {
    console.error('getScenesByEntityAction error:', error);
    return { success: false, error: 'Не удалось получить сцены' };
  }
}
