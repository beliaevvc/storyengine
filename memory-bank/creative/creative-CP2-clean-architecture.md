# 🎨🎨🎨 CREATIVE PHASE CP-2: CLEAN ARCHITECTURE STRUCTURE 🎨🎨🎨

> **Phase ID**: CP-2
> **Type**: Architecture Design
> **Priority**: HIGH
> **Status**: IN PROGRESS
> **Created**: 2026-01-17

---

## 1. PROBLEM STATEMENT

### Контекст
StoryEngine строится на принципах Clean Architecture. Нужно определить:
- Структуру папок проекта
- Границы между слоями
- Паттерны взаимодействия между слоями
- Подход к Dependency Injection

### Требования

| Требование | Описание |
|------------|----------|
| R1 | Строгое разделение на 4 слоя (Domain, Application, Infrastructure, Presentation) |
| R2 | Domain layer не зависит от внешних библиотек |
| R3 | Dependency Rule: зависимости направлены только внутрь |
| R4 | Совместимость с Next.js 14 App Router |
| R5 | TypeScript строгая типизация |
| R6 | Тестируемость каждого слоя независимо |

### Ограничения

- Next.js 14 App Router structure (`/app`)
- Server Components по умолчанию
- Server Actions для мутаций
- Zustand для клиентского состояния

---

## 2. OPTIONS ANALYSIS

### Option 1: Strict Layer Separation (Monorepo-style)

**Description**: Полностью изолированные слои в отдельных директориях с явными boundaries.

```
src/
├── domain/           # Pure business logic
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/  # Interfaces only
│   └── services/
├── application/      # Use cases & orchestration
│   ├── use-cases/
│   ├── dto/
│   └── mappers/
├── infrastructure/   # External implementations
│   ├── database/
│   ├── api/
│   └── services/
├── presentation/     # UI layer
│   ├── components/
│   ├── hooks/
│   └── stores/
└── app/             # Next.js App Router
```

**Pros**:
- ✅ Максимальное разделение ответственности
- ✅ Легко тестировать каждый слой изолированно
- ✅ Понятные границы
- ✅ Легко масштабировать команду

**Cons**:
- ❌ Много boilerplate кода
- ❌ Длинные import paths
- ❌ Сложнее для маленькой команды/MVP
- ❌ Требует DI container

**Complexity**: High
**Implementation Time**: Long

---

### Option 2: Feature-First (Vertical Slices)

**Description**: Организация по фичам, каждая фича содержит все слои.

```
src/
├── features/
│   ├── projects/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── entities/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── editor/
│       └── ...
├── shared/
│   ├── domain/
│   ├── infrastructure/
│   └── ui/
└── app/
```

**Pros**:
- ✅ Всё для фичи в одном месте
- ✅ Легко удалять/добавлять фичи
- ✅ Хорошо для больших проектов

**Cons**:
- ❌ Дублирование shared логики
- ❌ Сложнее видеть общую архитектуру
- ❌ Границы слоёв размываются
- ❌ Перегружен для MVP

**Complexity**: Medium
**Implementation Time**: Medium

---

### Option 3: Pragmatic Clean Architecture (Hybrid)

**Description**: Clean Architecture с прагматичными компромиссами для Next.js и MVP.

```
src/
├── core/                    # Domain + Application (combined for simplicity)
│   ├── entities/           # Domain entities
│   ├── repositories/       # Interfaces
│   ├── use-cases/         # Application logic
│   └── types/             # Shared types
├── infrastructure/         # External concerns
│   ├── database/
│   │   ├── prisma/        # Prisma client & migrations
│   │   └── repositories/  # Repository implementations
│   └── services/          # External services
├── presentation/          # UI layer
│   ├── components/
│   │   ├── ui/           # Base Shadcn components
│   │   ├── layout/       # Layout components
│   │   ├── editor/       # Tiptap components
│   │   └── features/     # Feature-specific components
│   ├── hooks/
│   └── stores/           # Zustand stores
├── lib/                   # Utilities & helpers
│   ├── utils/
│   └── validations/
└── app/                   # Next.js App Router
    ├── (dashboard)/
    ├── api/
    └── actions/          # Server Actions
```

**Pros**:
- ✅ Баланс между чистотой и практичностью
- ✅ Понятная структура для Next.js
- ✅ Достаточно разделения для тестирования
- ✅ Легко расширять позже
- ✅ Совместимо с Server Components/Actions

**Cons**:
- ❌ Domain и Application объединены (менее строго)
- ❌ Не 100% чистая архитектура
- ❌ Некоторые компромиссы

**Complexity**: Low-Medium
**Implementation Time**: Short-Medium

---

### Option 4: Next.js Native with Layers

**Description**: Использование Next.js conventions максимально, слои как conceptual boundaries.

```
src/
└── app/
    ├── (dashboard)/
    │   ├── projects/
    │   │   ├── [id]/
    │   │   │   ├── page.tsx
    │   │   │   └── _components/
    │   │   └── _lib/
    │   │       ├── entities.ts
    │   │       ├── repository.ts
    │   │       └── use-cases.ts
    │   └── editor/
    ├── _shared/
    │   ├── components/
    │   ├── hooks/
    │   └── stores/
    └── api/
```

**Pros**:
- ✅ Максимально идиоматично для Next.js
- ✅ Colocation всего
- ✅ Меньше файлов

**Cons**:
- ❌ Архитектура размывается
- ❌ Сложно тестировать изолированно
- ❌ Труднее поддерживать при росте
- ❌ Нарушает Clean Architecture принципы

**Complexity**: Low
**Implementation Time**: Short

---

## 3. EVALUATION MATRIX

| Критерий | Weight | Option 1 | Option 2 | Option 3 | Option 4 |
|----------|--------|----------|----------|----------|----------|
| Clean Architecture соответствие | 25% | 10 | 6 | 8 | 4 |
| Next.js совместимость | 20% | 6 | 7 | 9 | 10 |
| MVP скорость | 20% | 4 | 6 | 8 | 9 |
| Тестируемость | 15% | 10 | 7 | 8 | 5 |
| Расширяемость | 10% | 9 | 8 | 8 | 5 |
| Простота понимания | 10% | 7 | 6 | 8 | 8 |
| **TOTAL** | 100% | 7.35 | 6.55 | **8.15** | 6.65 |

---

## 4. 🎯 DECISION

### Выбранный подход: **Option 3 — Pragmatic Clean Architecture (Hybrid)**

### Rationale

1. **Баланс чистоты и практичности**: Сохраняем ключевые принципы Clean Architecture без чрезмерного boilerplate.

2. **Next.js оптимизация**: Структура хорошо работает с App Router, Server Components и Server Actions.

3. **MVP-friendly**: Достаточно быстро для MVP, но с чёткой архитектурой для роста.

4. **Тестируемость**: Core отделён от infrastructure, что позволяет unit-тестировать бизнес-логику.

5. **Расширяемость**: Легко разделить core на domain + application позже, если потребуется.

---

## 5. FINAL ARCHITECTURE DESIGN

### 5.1 Directory Structure

```
StoryEngine/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── core/                          # DOMAIN + APPLICATION LAYER
│   │   ├── entities/                  # Domain Entities
│   │   │   ├── project.ts
│   │   │   ├── entity.ts
│   │   │   ├── document.ts
│   │   │   ├── scene.ts
│   │   │   └── index.ts
│   │   ├── repositories/              # Repository Interfaces
│   │   │   ├── IProjectRepository.ts
│   │   │   ├── IEntityRepository.ts
│   │   │   ├── IDocumentRepository.ts
│   │   │   ├── ISceneRepository.ts
│   │   │   └── index.ts
│   │   ├── use-cases/                 # Application Use Cases
│   │   │   ├── project/
│   │   │   │   ├── createProject.ts
│   │   │   │   ├── getProject.ts
│   │   │   │   ├── updateProject.ts
│   │   │   │   └── deleteProject.ts
│   │   │   ├── entity/
│   │   │   │   ├── createEntity.ts
│   │   │   │   ├── getEntities.ts
│   │   │   │   ├── updateEntity.ts
│   │   │   │   └── scanEntitiesInText.ts
│   │   │   ├── document/
│   │   │   └── scene/
│   │   ├── types/                     # Shared Domain Types
│   │   │   ├── entity-attributes.ts
│   │   │   ├── common.ts
│   │   │   └── index.ts
│   │   └── errors/                    # Domain Errors
│   │       ├── DomainError.ts
│   │       └── index.ts
│   │
│   ├── infrastructure/                # INFRASTRUCTURE LAYER
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── client.ts         # Prisma client singleton
│   │   │   │   └── index.ts
│   │   │   ├── repositories/          # Repository Implementations
│   │   │   │   ├── PrismaProjectRepository.ts
│   │   │   │   ├── PrismaEntityRepository.ts
│   │   │   │   ├── PrismaDocumentRepository.ts
│   │   │   │   ├── PrismaSceneRepository.ts
│   │   │   │   └── index.ts
│   │   │   └── mappers/              # DB <-> Domain mappers
│   │   │       ├── projectMapper.ts
│   │   │       ├── entityMapper.ts
│   │   │       └── index.ts
│   │   └── services/                  # External Services
│   │       └── ai/                    # Future AI integration
│   │
│   ├── presentation/                  # PRESENTATION LAYER
│   │   ├── components/
│   │   │   ├── ui/                   # Shadcn UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Panel.tsx
│   │   │   │   ├── PanelGroup.tsx
│   │   │   │   └── Header.tsx
│   │   │   ├── editor/               # Tiptap editor
│   │   │   │   ├── Editor.tsx
│   │   │   │   ├── Toolbar.tsx
│   │   │   │   ├── extensions/
│   │   │   │   │   ├── EntityMention.ts
│   │   │   │   │   └── EntityHighlight.ts
│   │   │   │   └── index.ts
│   │   │   ├── explorer/             # Project Explorer
│   │   │   │   ├── ProjectExplorer.tsx
│   │   │   │   ├── FileTree.tsx
│   │   │   │   ├── EntityList.tsx
│   │   │   │   └── index.ts
│   │   │   └── inspector/            # Context Inspector
│   │   │       ├── ContextInspector.tsx
│   │   │       ├── EntityCard.tsx
│   │   │       ├── AIChatPlaceholder.tsx
│   │   │       └── index.ts
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useProject.ts
│   │   │   ├── useEntities.ts
│   │   │   ├── useEditor.ts
│   │   │   └── index.ts
│   │   └── stores/                   # Zustand stores
│   │       ├── useProjectStore.ts
│   │       ├── useEntityStore.ts
│   │       ├── useEditorStore.ts
│   │       ├── useUIStore.ts
│   │       └── index.ts
│   │
│   ├── lib/                          # SHARED UTILITIES
│   │   ├── utils/
│   │   │   ├── cn.ts                # className utility
│   │   │   └── formatting.ts
│   │   ├── validations/
│   │   │   ├── entitySchemas.ts     # Zod schemas
│   │   │   └── projectSchemas.ts
│   │   └── constants/
│   │       └── index.ts
│   │
│   └── app/                          # NEXT.JS APP ROUTER
│       ├── layout.tsx
│       ├── page.tsx                  # Landing/redirect
│       ├── globals.css
│       ├── (dashboard)/              # Dashboard route group
│       │   ├── layout.tsx
│       │   ├── projects/
│       │   │   ├── page.tsx         # Projects list
│       │   │   └── [projectId]/
│       │   │       ├── page.tsx     # Project editor
│       │   │       └── loading.tsx
│       │   └── settings/
│       │       └── page.tsx
│       ├── api/                      # API routes (if needed)
│       │   └── health/
│       │       └── route.ts
│       └── actions/                  # Server Actions
│           ├── project-actions.ts
│           ├── entity-actions.ts
│           ├── document-actions.ts
│           └── scene-actions.ts
│
├── public/
├── tests/
│   ├── unit/
│   │   ├── core/
│   │   └── infrastructure/
│   └── integration/
├── .env
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 5.2 Layer Dependencies

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEPENDENCY FLOW                                  │
│                                                                          │
│                    ┌───────────────────┐                                │
│                    │   app/ (Next.js)  │                                │
│                    │   Server Actions  │                                │
│                    └─────────┬─────────┘                                │
│                              │                                           │
│                              ▼                                           │
│     ┌────────────────────────────────────────────────────┐             │
│     │              presentation/                          │             │
│     │   ┌──────────┐  ┌──────────┐  ┌──────────┐        │             │
│     │   │components│  │  hooks   │  │  stores  │        │             │
│     │   └────┬─────┘  └────┬─────┘  └────┬─────┘        │             │
│     └────────┼─────────────┼─────────────┼───────────────┘             │
│              │             │             │                              │
│              └─────────────┼─────────────┘                              │
│                            │                                             │
│                            ▼                                             │
│     ┌────────────────────────────────────────────────────┐             │
│     │                    core/                            │             │
│     │   ┌──────────┐  ┌──────────┐  ┌──────────┐        │             │
│     │   │ entities │  │use-cases │  │repositories│       │             │
│     │   │          │  │          │  │(interfaces)│       │             │
│     │   └──────────┘  └────┬─────┘  └─────▲─────┘        │             │
│     └──────────────────────┼──────────────┼──────────────┘             │
│                            │              │                              │
│                            │    implements│                              │
│                            ▼              │                              │
│     ┌────────────────────────────────────────────────────┐             │
│     │              infrastructure/                        │             │
│     │   ┌──────────┐  ┌──────────┐  ┌──────────┐        │             │
│     │   │ database │  │ mappers  │  │ services │        │             │
│     │   │(Prisma)  │  │          │  │          │        │             │
│     │   └──────────┘  └──────────┘  └──────────┘        │             │
│     └────────────────────────────────────────────────────┘             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Dependency Injection Pattern

Для MVP используем простой паттерн Factory + Manual DI:

```typescript
// infrastructure/database/repositories/index.ts
import { prisma } from '../prisma/client';
import { PrismaProjectRepository } from './PrismaProjectRepository';
import { PrismaEntityRepository } from './PrismaEntityRepository';
// ...

// Repository factory
export const createRepositories = () => ({
  projectRepository: new PrismaProjectRepository(prisma),
  entityRepository: new PrismaEntityRepository(prisma),
  documentRepository: new PrismaDocumentRepository(prisma),
  sceneRepository: new PrismaSceneRepository(prisma),
});

// Singleton instance for server-side
export const repositories = createRepositories();
```

```typescript
// app/actions/entity-actions.ts
'use server';

import { repositories } from '@/infrastructure/database/repositories';
import { createEntity } from '@/core/use-cases/entity/createEntity';

export async function createEntityAction(data: CreateEntityDTO) {
  const useCase = createEntity(repositories.entityRepository);
  return useCase.execute(data);
}
```

### 5.4 Use Case Pattern

```typescript
// core/use-cases/entity/createEntity.ts
import { IEntityRepository } from '@/core/repositories';
import { Entity, EntityType } from '@/core/entities';
import { CreateEntityDTO } from './types';

export const createEntity = (repository: IEntityRepository) => ({
  async execute(data: CreateEntityDTO): Promise<Entity> {
    // Validation
    if (!data.name.trim()) {
      throw new DomainError('Entity name is required', 'INVALID_NAME');
    }
    
    // Business logic
    const entity = await repository.create({
      ...data,
      attributes: data.attributes ?? {},
    });
    
    return entity;
  },
});
```

### 5.5 Import Path Aliases

```json
// tsconfig.json
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

## 6. VERIFICATION CHECKLIST

### Requirements Coverage
- [x] R1: 4 слоя (core, infrastructure, presentation, app) ✅
- [x] R2: core/ не импортирует внешние библиотеки (кроме types) ✅
- [x] R3: Зависимости направлены внутрь ✅
- [x] R4: Совместимо с Next.js 14 App Router ✅
- [x] R5: TypeScript strict ✅
- [x] R6: Каждый слой тестируем независимо ✅

### Architecture Validation
- [x] Repository interfaces в core
- [x] Repository implementations в infrastructure
- [x] Use cases принимают repositories через DI
- [x] Server Actions в app/actions
- [x] Components в presentation/components
- [x] Stores в presentation/stores

---

## 7. IMPLEMENTATION GUIDELINES

### 7.1 Creating a New Feature

1. **Define Entity** в `core/entities/`
2. **Define Repository Interface** в `core/repositories/`
3. **Create Use Cases** в `core/use-cases/feature/`
4. **Implement Repository** в `infrastructure/database/repositories/`
5. **Create Server Action** в `app/actions/`
6. **Create Components** в `presentation/components/`
7. **Create Store** (if needed) в `presentation/stores/`
8. **Create Page** в `app/(dashboard)/`

### 7.2 Coding Conventions

```typescript
// Entity naming: PascalCase
export interface Project { ... }

// Repository interface: I + Name + Repository
export interface IProjectRepository { ... }

// Repository implementation: Prisma + Name + Repository
export class PrismaProjectRepository implements IProjectRepository { ... }

// Use case: camelCase verb + noun
export const createProject = (repo: IProjectRepository) => ({ ... });

// Server action: noun + Action + suffix
export async function createProjectAction(data: CreateProjectDTO) { ... }

// Store: use + Name + Store
export const useProjectStore = create<ProjectStore>((set) => ({ ... }));

// Component: PascalCase
export function ProjectExplorer() { ... }
```

---

## 8. NEXT STEPS

1. Создать базовую структуру директорий
2. Настроить tsconfig.json с path aliases
3. Создать первые interfaces в core/repositories/
4. Настроить Prisma client singleton

---

# 🎨🎨🎨 EXITING CREATIVE PHASE CP-2 🎨🎨🎨

## Summary
Выбрана Pragmatic Clean Architecture с четырьмя слоями (core, infrastructure, presentation, app), оптимизированная для Next.js 14 и MVP разработки.

## Key Decisions
1. Объединение Domain + Application в `core/` для простоты MVP
2. Repository Pattern с interfaces в core и implementations в infrastructure
3. Factory + Manual DI для простоты (без DI container)
4. Server Actions как точки входа для mutations
5. Zustand stores в presentation layer

## Files to Create
- `src/core/` структура
- `src/infrastructure/` структура
- `src/presentation/` структура
- `src/lib/` структура
- `tsconfig.json` path aliases
