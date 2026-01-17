'use server';

import { revalidatePath } from 'next/cache';
import { repositories } from '@/infrastructure/database/repositories';
import { createProject as createProjectUseCase } from '@/core/use-cases/project/createProject';
import { getProject as getProjectUseCase } from '@/core/use-cases/project/getProject';
import { updateProject as updateProjectUseCase } from '@/core/use-cases/project/updateProject';
import { deleteProject as deleteProjectUseCase } from '@/core/use-cases/project/deleteProject';
import type { CreateProjectInput, UpdateProjectInput, Project } from '@/core/entities/project';
import { DomainError } from '@/core/errors';

// Action result types for better error handling
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export async function createProjectAction(
  input: CreateProjectInput
): Promise<ActionResult<Project>> {
  try {
    const useCase = createProjectUseCase(repositories.projectRepository);
    const project = await useCase.execute(input);
    revalidatePath('/projects');
    return { success: true, data: project };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('createProjectAction error:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function getProjectAction(
  id: string
): Promise<ActionResult<Project>> {
  try {
    const useCase = getProjectUseCase(repositories.projectRepository);
    const project = await useCase.execute(id);
    return { success: true, data: project };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('getProjectAction error:', error);
    return { success: false, error: 'Failed to get project' };
  }
}

export async function listProjectsAction(): Promise<ActionResult<Project[]>> {
  try {
    const projects = await repositories.projectRepository.findAll();
    return { success: true, data: projects };
  } catch (error) {
    console.error('listProjectsAction error:', error);
    return { success: false, error: 'Failed to list projects' };
  }
}

export async function updateProjectAction(
  id: string,
  input: UpdateProjectInput
): Promise<ActionResult<Project>> {
  try {
    const useCase = updateProjectUseCase(repositories.projectRepository);
    const project = await useCase.execute(id, input);
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    return { success: true, data: project };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('updateProjectAction error:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProjectAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const useCase = deleteProjectUseCase(repositories.projectRepository);
    await useCase.execute(id);
    revalidatePath('/projects');
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('deleteProjectAction error:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}
