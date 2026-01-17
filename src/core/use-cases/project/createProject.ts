import type { IProjectRepository } from '../../repositories';
import type { Project, CreateProjectInput } from '../../entities/project';
import { ValidationError } from '../../errors';

export const createProject = (repository: IProjectRepository) => ({
  async execute(input: CreateProjectInput): Promise<Project> {
    // Validation
    if (!input.title?.trim()) {
      throw new ValidationError('Project title is required', 'title');
    }

    if (input.title.length > 255) {
      throw new ValidationError('Project title must be less than 255 characters', 'title');
    }

    // Create
    const project = await repository.create({
      title: input.title.trim(),
      description: input.description?.trim(),
      settings: input.settings ?? {},
    });

    return project;
  },
});
