'use server';

import { revalidatePath } from 'next/cache';
import { repositories } from '@/infrastructure/database/repositories';
import type { Document, CreateDocumentInput, UpdateDocumentInput } from '@/core/entities/document';
import { DomainError, NotFoundError, ValidationError } from '@/core/errors';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export async function createDocumentAction(
  input: CreateDocumentInput
): Promise<ActionResult<Document>> {
  try {
    // Validation
    if (!input.title?.trim()) {
      throw new ValidationError('Document title is required', 'title');
    }
    if (input.title.length > 255) {
      throw new ValidationError('Document title must be less than 255 characters', 'title');
    }

    const document = await repositories.documentRepository.create({
      ...input,
      title: input.title.trim(),
    });

    revalidatePath(`/projects/${input.projectId}`);
    return { success: true, data: document };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('createDocumentAction error:', error);
    return { success: false, error: 'Failed to create document' };
  }
}

export async function getDocumentAction(
  id: string
): Promise<ActionResult<Document>> {
  try {
    const document = await repositories.documentRepository.findById(id);
    if (!document) {
      throw new NotFoundError('Document', id);
    }
    return { success: true, data: document };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('getDocumentAction error:', error);
    return { success: false, error: 'Failed to get document' };
  }
}

export async function listDocumentsByProjectAction(
  projectId: string
): Promise<ActionResult<Document[]>> {
  try {
    const documents = await repositories.documentRepository.findByProject(projectId);
    return { success: true, data: documents };
  } catch (error) {
    console.error('listDocumentsByProjectAction error:', error);
    return { success: false, error: 'Failed to list documents' };
  }
}

export async function updateDocumentAction(
  id: string,
  input: UpdateDocumentInput
): Promise<ActionResult<Document>> {
  try {
    const existing = await repositories.documentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Document', id);
    }

    // Validation
    if (input.title !== undefined) {
      if (!input.title.trim()) {
        throw new ValidationError('Document title cannot be empty', 'title');
      }
      if (input.title.length > 255) {
        throw new ValidationError('Document title must be less than 255 characters', 'title');
      }
    }

    const document = await repositories.documentRepository.update(id, {
      ...input,
      ...(input.title !== undefined && { title: input.title.trim() }),
    });

    revalidatePath(`/projects/${existing.projectId}`);
    revalidatePath(`/projects/${existing.projectId}/documents/${id}`);
    return { success: true, data: document };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('updateDocumentAction error:', error);
    return { success: false, error: 'Failed to update document' };
  }
}

export async function deleteDocumentAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const existing = await repositories.documentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Document', id);
    }

    await repositories.documentRepository.delete(id);
    revalidatePath(`/projects/${existing.projectId}`);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('deleteDocumentAction error:', error);
    return { success: false, error: 'Failed to delete document' };
  }
}

export async function reorderDocumentsAction(
  projectId: string,
  documentIds: string[]
): Promise<ActionResult<void>> {
  try {
    await repositories.documentRepository.reorder(projectId, documentIds);
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('reorderDocumentsAction error:', error);
    return { success: false, error: 'Failed to reorder documents' };
  }
}
