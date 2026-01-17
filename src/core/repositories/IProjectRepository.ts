import type { Project, CreateProjectInput, UpdateProjectInput } from '../entities/project';

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  create(data: CreateProjectInput): Promise<Project>;
  update(id: string, data: UpdateProjectInput): Promise<Project>;
  delete(id: string): Promise<void>;
}
