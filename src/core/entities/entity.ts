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

// Entity document (tab) for profile page
export interface EntityDocument {
  id: string;
  title: string;
  content: TiptapContent | null;
  isDefault: boolean; // true for built-in tabs (biography, etc.)
  order: number;
}

// All entity documents organized by tabs
export interface EntityDocuments {
  tabs: EntityDocument[];
}

export interface Entity {
  id: string;
  projectId: string;
  type: EntityType;
  name: string;
  description?: string;
  attributes: EntityAttributes;
  content?: TiptapContent | null; // Legacy single document (deprecated)
  documents?: EntityDocuments | null; // New multi-document structure
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityInput {
  projectId: string;
  type: EntityType;
  name: string;
  description?: string;
  attributes?: EntityAttributes;
}

export interface UpdateEntityInput {
  type?: EntityType;
  name?: string;
  description?: string | null;
  attributes?: EntityAttributes;
}
