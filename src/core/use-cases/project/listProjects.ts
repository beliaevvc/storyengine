import type { IProjectRepository } from '../../repositories';
import type { Project } from '../../entities/project';

export const listProjects = (repository: IProjectRepository) => ({
  async execute(): Promise<Project[]> {
    return repository.findAll();
  },
});
