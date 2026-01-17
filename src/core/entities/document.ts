export type DocumentType = 'FOLDER' | 'DOCUMENT' | 'NOTE';

export interface Document {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  type: DocumentType;
  content: TiptapContent;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Scene extracted from document content for visualization
export interface SceneInfo {
  id: string;
  documentId: string;
  slug: string;
  location: string;
  status: 'draft' | 'review' | 'final';
  textPreview: string;
  order: number;
}

export interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface CreateDocumentInput {
  projectId: string;
  title: string;
  content?: TiptapContent;
  order?: number;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: TiptapContent;
  order?: number;
}

// Default empty Tiptap document
export const emptyTiptapContent: TiptapContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};
