import type { Document, CreateDocumentInput, UpdateDocumentInput } from '../entities/document';

export interface IDocumentRepository {
  findById(id: string): Promise<Document | null>;
  findByProject(projectId: string): Promise<Document[]>;
  create(data: CreateDocumentInput): Promise<Document>;
  update(id: string, data: UpdateDocumentInput): Promise<Document>;
  delete(id: string): Promise<void>;
  reorder(projectId: string, documentIds: string[]): Promise<void>;
}
