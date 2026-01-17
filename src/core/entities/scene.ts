export interface Scene {
  id: string;
  documentId: string;
  title: string | null;
  summary: string | null;
  startOffset: number | null;
  endOffset: number | null;
  metadata: SceneMetadata;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SceneMetadata {
  mood?: string;
  timeOfDay?: string;
  [key: string]: unknown;
}

export interface SceneWithEntities extends Scene {
  entities: SceneEntityLink[];
}

export interface SceneEntityLink {
  entityId: string;
  role: string | null;
  notes: string | null;
}

export interface CreateSceneInput {
  documentId: string;
  title?: string;
  summary?: string;
  order?: number;
  metadata?: SceneMetadata;
}

export interface UpdateSceneInput {
  title?: string | null;
  summary?: string | null;
  startOffset?: number | null;
  endOffset?: number | null;
  metadata?: SceneMetadata;
  order?: number;
}
