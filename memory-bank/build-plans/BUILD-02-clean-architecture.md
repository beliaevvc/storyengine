# BUILD-02: Clean Architecture Plan

> **Plan ID**: BUILD-02
> **Component**: Application Architecture
> **Dependencies**: CP-2 (Clean Architecture Structure), BUILD-01
> **Priority**: HIGH
> **Estimated Effort**: Phase 2 of Implementation

---

## 1. OBJECTIVE

Создать полную структуру директорий согласно Clean Architecture, включая domain entities, repository interfaces, use cases и DI setup.

---

## 2. DIRECTORY STRUCTURE TO CREATE

```
src/
├── core/                          # DOMAIN + APPLICATION LAYER
│   ├── entities/                  # Domain Entities
│   │   ├── project.ts
│   │   ├── entity.ts
│   │   ├── document.ts
│   │   ├── scene.ts
│   │   └── index.ts
│   ├── repositories/              # Repository Interfaces
│   │   ├── IProjectRepository.ts
│   │   ├── IEntityRepository.ts
│   │   ├── IDocumentRepository.ts
│   │   ├── ISceneRepository.ts
│   │   └── index.ts
│   ├── use-cases/                 # Application Use Cases
│   │   ├── project/
│   │   │   ├── createProject.ts
│   │   │   ├── getProject.ts
│   │   │   ├── updateProject.ts
│   │   │   ├── deleteProject.ts
│   │   │   ├── listProjects.ts
│   │   │   └── index.ts
│   │   ├── entity/
│   │   │   ├── createEntity.ts
│   │   │   ├── getEntity.ts
│   │   │   ├── updateEntity.ts
│   │   │   ├── deleteEntity.ts
│   │   │   ├── listEntities.ts
│   │   │   ├── scanEntitiesInText.ts
│   │   │   └── index.ts
│   │   ├── document/
│   │   │   └── ...
│   │   └── scene/
│   │       └── ...
│   ├── types/                     # Shared Domain Types
│   │   ├── entity-attributes.ts
│   │   ├── common.ts
│   │   └── index.ts
│   └── errors/                    # Domain Errors
│       ├── DomainError.ts
│       ├── NotFoundError.ts
│       ├── ValidationError.ts
│       └── index.ts
│
├── infrastructure/                # INFRASTRUCTURE LAYER
│   └── database/
│       ├── prisma/
│       │   ├── client.ts
│       │   └── index.ts
│       ├── repositories/
│       │   ├── PrismaProjectRepository.ts
│       │   ├── PrismaEntityRepository.ts
│       │   ├── PrismaDocumentRepository.ts
│       │   ├── PrismaSceneRepository.ts
│       │   └── index.ts
│       └── mappers/
│           └── index.ts
│
├── lib/                          # SHARED UTILITIES
│   ├── utils/
│   │   ├── cn.ts
│   │   └── index.ts
│   └── validations/
│       ├── entitySchemas.ts
│       ├── projectSchemas.ts
│       └── index.ts
│
└── app/                          # NEXT.JS APP ROUTER
    └── actions/                  # Server Actions
        ├── project-actions.ts
        ├── entity-actions.ts
        ├── document-actions.ts
        └── scene-actions.ts
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Create Domain Entities

**File**: `src/core/entities/project.ts`

```typescript
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
```

**File**: `src/core/entities/entity.ts`

```typescript
import { EntityAttributes } from '../types/entity-attributes';

export type EntityType = 'CHARACTER' | 'LOCATION' | 'ITEM' | 'EVENT' | 'CONCEPT';

export interface Entity {
  id: string;
  projectId: string;
  type: EntityType;
  name: string;
  description: string | null;
  attributes: EntityAttributes;
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
```

**File**: `src/core/entities/document.ts`

```typescript
export interface Document {
  id: string;
  projectId: string;
  title: string;
  content: TiptapContent;
  order: number;
  createdAt: Date;
  updatedAt: Date;
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
```

**File**: `src/core/entities/scene.ts`

```typescript
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
```

**File**: `src/core/entities/index.ts`

```typescript
export * from './project';
export * from './entity';
export * from './document';
export * from './scene';
```

### Step 2: Create Repository Interfaces

**File**: `src/core/repositories/IProjectRepository.ts`

```typescript
import { Project, CreateProjectInput, UpdateProjectInput } from '../entities/project';

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  create(data: CreateProjectInput): Promise<Project>;
  update(id: string, data: UpdateProjectInput): Promise<Project>;
  delete(id: string): Promise<void>;
}
```

**File**: `src/core/repositories/IEntityRepository.ts`

```typescript
import { Entity, EntityType, CreateEntityInput, UpdateEntityInput } from '../entities/entity';

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
```

**File**: `src/core/repositories/IDocumentRepository.ts`

```typescript
import { Document, CreateDocumentInput, UpdateDocumentInput } from '../entities/document';

export interface IDocumentRepository {
  findById(id: string): Promise<Document | null>;
  findByProject(projectId: string): Promise<Document[]>;
  create(data: CreateDocumentInput): Promise<Document>;
  update(id: string, data: UpdateDocumentInput): Promise<Document>;
  delete(id: string): Promise<void>;
  reorder(projectId: string, documentIds: string[]): Promise<void>;
}
```

**File**: `src/core/repositories/ISceneRepository.ts`

```typescript
import { Scene, SceneWithEntities, CreateSceneInput, UpdateSceneInput } from '../entities/scene';

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
```

**File**: `src/core/repositories/index.ts`

```typescript
export type { IProjectRepository } from './IProjectRepository';
export type { IEntityRepository } from './IEntityRepository';
export type { IDocumentRepository } from './IDocumentRepository';
export type { ISceneRepository } from './ISceneRepository';
```

### Step 3: Create Domain Errors

**File**: `src/core/errors/DomainError.ts`

```typescript
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
```

**File**: `src/core/errors/NotFoundError.ts`

```typescript
import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}
```

**File**: `src/core/errors/ValidationError.ts`

```typescript
import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}
```

**File**: `src/core/errors/index.ts`

```typescript
export { DomainError } from './DomainError';
export { NotFoundError } from './NotFoundError';
export { ValidationError } from './ValidationError';
```

### Step 4: Create Use Cases

**File**: `src/core/use-cases/project/createProject.ts`

```typescript
import { IProjectRepository } from '../../repositories';
import { Project, CreateProjectInput } from '../../entities/project';
import { ValidationError } from '../../errors';

export const createProject = (repository: IProjectRepository) => ({
  async execute(input: CreateProjectInput): Promise<Project> {
    // Validation
    if (!input.title?.trim()) {
      throw new ValidationError('Project title is required', 'title');
    }

    if (input.title.length > 255) {
      throw new ValidationError('Project title must be less than 255 characters', 'title');
    }

    // Create
    const project = await repository.create({
      title: input.title.trim(),
      description: input.description?.trim(),
      settings: input.settings ?? {},
    });

    return project;
  },
});
```

**File**: `src/core/use-cases/project/getProject.ts`

```typescript
import { IProjectRepository } from '../../repositories';
import { Project } from '../../entities/project';
import { NotFoundError } from '../../errors';

export const getProject = (repository: IProjectRepository) => ({
  async execute(id: string): Promise<Project> {
    const project = await repository.findById(id);

    if (!project) {
      throw new NotFoundError('Project', id);
    }

    return project;
  },
});
```

**File**: `src/core/use-cases/entity/scanEntitiesInText.ts`

```typescript
import { Entity, EntityType } from '../../entities/entity';

export interface ScanResult {
  entityId: string;
  entityName: string;
  entityType: EntityType;
  startIndex: number;
  endIndex: number;
}

export const scanEntitiesInText = (entities: Entity[]) => ({
  execute(text: string): ScanResult[] {
    const results: ScanResult[] = [];

    // Sort by name length (longer first) to avoid partial matches
    const sortedEntities = [...entities].sort(
      (a, b) => b.name.length - a.name.length
    );

    for (const entity of sortedEntities) {
      const namesToSearch = [
        entity.name,
        ...((entity.attributes as { aliases?: string[] })?.aliases || []),
      ];

      for (const name of namesToSearch) {
        if (!name) continue;

        const regex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
          const isOverlapping = results.some(
            (r) => match!.index >= r.startIndex && match!.index < r.endIndex
          );

          if (!isOverlapping) {
            results.push({
              entityId: entity.id,
              entityName: entity.name,
              entityType: entity.type,
              startIndex: match.index,
              endIndex: match.index + match[0].length,
            });
          }
        }
      }
    }

    return results.sort((a, b) => a.startIndex - b.startIndex);
  },
});

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

### Step 5: Create Repository Implementations

**File**: `src/infrastructure/database/repositories/PrismaProjectRepository.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { IProjectRepository } from '@/core/repositories';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/core/entities/project';

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    return project ? this.mapToEntity(project) : null;
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return projects.map(this.mapToEntity);
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        settings: data.settings ?? {},
      },
    });
    return this.mapToEntity(project);
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.settings !== undefined && { settings: data.settings }),
      },
    });
    return this.mapToEntity(project);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }

  private mapToEntity(data: any): Project {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      settings: data.settings as Project['settings'],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
```

**File**: `src/infrastructure/database/repositories/index.ts`

```typescript
import { prisma } from '../prisma/client';
import { PrismaProjectRepository } from './PrismaProjectRepository';
import { PrismaEntityRepository } from './PrismaEntityRepository';
import { PrismaDocumentRepository } from './PrismaDocumentRepository';
import { PrismaSceneRepository } from './PrismaSceneRepository';

export const repositories = {
  projectRepository: new PrismaProjectRepository(prisma),
  entityRepository: new PrismaEntityRepository(prisma),
  documentRepository: new PrismaDocumentRepository(prisma),
  sceneRepository: new PrismaSceneRepository(prisma),
};

export { PrismaProjectRepository };
export { PrismaEntityRepository };
export { PrismaDocumentRepository };
export { PrismaSceneRepository };
```

### Step 6: Create Server Actions

**File**: `src/app/actions/project-actions.ts`

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { repositories } from '@/infrastructure/database/repositories';
import { createProject as createProjectUseCase } from '@/core/use-cases/project/createProject';
import { getProject as getProjectUseCase } from '@/core/use-cases/project/getProject';
import { CreateProjectInput, UpdateProjectInput } from '@/core/entities/project';

export async function createProjectAction(input: CreateProjectInput) {
  const useCase = createProjectUseCase(repositories.projectRepository);
  const project = await useCase.execute(input);
  revalidatePath('/projects');
  return project;
}

export async function getProjectAction(id: string) {
  const useCase = getProjectUseCase(repositories.projectRepository);
  return useCase.execute(id);
}

export async function listProjectsAction() {
  return repositories.projectRepository.findAll();
}

export async function updateProjectAction(id: string, input: UpdateProjectInput) {
  const project = await repositories.projectRepository.update(id, input);
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  return project;
}

export async function deleteProjectAction(id: string) {
  await repositories.projectRepository.delete(id);
  revalidatePath('/projects');
}
```

### Step 7: Configure TypeScript Paths

**File**: `tsconfig.json` (add paths)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/core/*": ["./src/core/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/presentation/*": ["./src/presentation/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

---

## 4. SUCCESS CRITERIA

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | All directories created | File system check |
| 2 | TypeScript compiles | `npm run build` passes |
| 3 | Path aliases work | Import resolution succeeds |
| 4 | Entities defined | All 4 entity types with interfaces |
| 5 | Repositories interfaces | All 4 repository interfaces |
| 6 | Use cases work | createProject test passes |
| 7 | Server actions work | createProjectAction callable |
| 8 | DI pattern works | Repositories injectable |

---

## 5. COMMANDS TO EXECUTE

```bash
# Create directories
mkdir -p src/core/{entities,repositories,use-cases/{project,entity,document,scene},types,errors}
mkdir -p src/infrastructure/database/{prisma,repositories,mappers}
mkdir -p src/lib/{utils,validations}
mkdir -p src/app/actions

# Verify structure
find src -type d | sort
```

---

## 6. NOTES

- Server Actions require `'use server'` directive
- Use path aliases for clean imports
- All repository methods should be async
- Use cases are factory functions for DI
- Mappers convert Prisma types to domain types
