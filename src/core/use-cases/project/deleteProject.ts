import type { IProjectRepository } from '../../repositories';
import { NotFoundError } from '../../errors';

export const deleteProject = (repository: IProjectRepository) => ({
  async execute(id: string): Promise<void> {
    // Check if project exists
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Project', id);
    }

    // Delete (cascades to documents, entities, etc.)
    await repository.delete(id);
  },
});
