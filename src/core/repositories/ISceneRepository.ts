import type { Scene, SceneWithEntities, CreateSceneInput, UpdateSceneInput } from '../entities/scene';

export interface ISceneRepository {
  findById(id: string): Promise<Scene | null>;
  findByIdWithEntities(id: string): Promise<SceneWithEntities | null>;
  findByDocument(documentId: string): Promise<Scene[]>;
  findByDocumentWithEntities(documentId: string): Promise<SceneWithEntities[]>;
  create(data: CreateSceneInput): Promise<Scene>;
  update(id: string, data: UpdateSceneInput): Promise<Scene>;
  delete(id: string): Promise<void>;
  reorder(documentId: string, sceneIds: string[]): Promise<void>;
}
