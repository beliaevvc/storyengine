import type { IProjectRepository } from '../../repositories';
import type { Project, UpdateProjectInput } from '../../entities/project';
import { NotFoundError, ValidationError } from '../../errors';

export const updateProject = (repository: IProjectRepository) => ({
  async execute(id: string, input: UpdateProjectInput): Promise<Project> {
    // Check if project exists
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Project', id);
    }

    // Validation
    if (input.title !== undefined) {
      if (!input.title.trim()) {
        throw new ValidationError('Project title cannot be empty', 'title');
      }
      if (input.title.length > 255) {
        throw new ValidationError('Project title must be less than 255 characters', 'title');
      }
    }

    // Update
    const project = await repository.update(id, {
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.description !== undefined && { description: input.description?.trim() ?? null }),
      ...(input.settings !== undefined && { settings: input.settings }),
    });

    return project;
  },
});
