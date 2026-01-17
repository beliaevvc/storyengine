import type { IProjectRepository } from '../../repositories';
import type { Project } from '../../entities/project';
import { NotFoundError } from '../../errors';

export const getProject = (repository: IProjectRepository) => ({
  async execute(id: string): Promise<Project> {
    const project = await repository.findById(id);

    if (!project) {
      throw new NotFoundError('Project', id);
    }

    return project;
  },
});
