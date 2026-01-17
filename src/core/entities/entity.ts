import type { EntityAttributes } from '../types/entity-attributes';

export type EntityType = 
  | 'CHARACTER' 
  | 'LOCATION' 
  | 'ITEM' 
  | 'EVENT' 
  | 'FACTION' 
  | 'WORLDBUILDING' 
  | 'NOTE';

// Tiptap content type
export interface TiptapContent {
  type: 'doc';
  content: Array<{
    type: string;
    attrs?: Record<string, unknown>;
    content?: Array<{
      type: string;
      text?: string;
      attrs?: Record<string, unknown>;
    }>;
  }>;
}

export interface Entity {
  id: string;
  projectId: string;
  type: EntityType;
  name: string;
  description?: string;
  attributes: EntityAttributes;
  content?: TiptapContent | null; // Tiptap JSON content for entity document
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityInput {
  projectId: string;
  type: EntityType;
  name: string;
  description?: string;
  attributes?: EntityAttributes;
  imageUrl?: string;
}

export interface UpdateEntityInput {
  type?: EntityType;
  name?: string;
  description?: string | null;
  attributes?: EntityAttributes;
  imageUrl?: string | null;
}
