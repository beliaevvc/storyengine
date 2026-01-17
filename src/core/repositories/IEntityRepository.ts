import type { Entity, EntityType, CreateEntityInput, UpdateEntityInput } from '../entities/entity';

export interface IEntityRepository {
  findById(id: string): Promise<Entity | null>;
  findByProject(projectId: string): Promise<Entity[]>;
  findByProjectAndType(projectId: string, type: EntityType): Promise<Entity[]>;
  findByName(projectId: string, name: string): Promise<Entity[]>;
  search(projectId: string, query: string): Promise<Entity[]>;
  create(data: CreateEntityInput): Promise<Entity>;
  update(id: string, data: UpdateEntityInput): Promise<Entity>;
  delete(id: string): Promise<void>;
  addToScene(entityId: string, sceneId: string, role?: string): Promise<void>;
  removeFromScene(entityId: string, sceneId: string): Promise<void>;
}
