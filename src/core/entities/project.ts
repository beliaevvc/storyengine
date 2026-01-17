export interface Project {
  id: string;
  title: string;
  description: string | null;
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  genre?: string;
  targetWordCount?: number;
  [key: string]: unknown;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  settings?: ProjectSettings;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string | null;
  settings?: ProjectSettings;
}
