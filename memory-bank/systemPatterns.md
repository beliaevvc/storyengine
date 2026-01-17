# System Patterns

## Project: StoryEngine

---

## 🚨 CRITICAL: Context7 Verification Rule

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️  ALWAYS VERIFY LIBRARIES WITH CONTEXT7 BEFORE IMPLEMENTATION │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ STEP 1: resolve-library-id(libraryName, query)                  │
│         → Get the correct Context7 library ID                   │
│                                                                  │
│ STEP 2: query-docs(libraryId, "specific API question")          │
│         → Get CURRENT documentation (not outdated!)             │
│                                                                  │
│ STEP 3: Compare with existing plan                              │
│         → If API changed: UPDATE THE PLAN                       │
│                                                                  │
│ STEP 4: Implement with LATEST API patterns                      │
│         → npm install package@latest (not pinned versions)      │
│                                                                  │
│ ❌ NEVER use outdated patterns from old plans                   │
│ ✅ ALWAYS verify current API before coding                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Example: Prisma 5 → Prisma 7 migration discovered via Context7**

---

### Architecture Pattern: Clean Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  (Next.js Pages, React Components, Tiptap Editor)               │
├─────────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                            │
│  (Use Cases, Services, State Management - Zustand)              │
├─────────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                               │
│  (Entities, Value Objects, Domain Services, Interfaces)         │
├─────────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                          │
│  (Prisma ORM, PostgreSQL, External APIs, AI Integrations)       │
└─────────────────────────────────────────────────────────────────┘
```

### Dependency Rule
Зависимости направлены ТОЛЬКО внутрь. Внутренние слои не знают о внешних.

```
Presentation → Application → Domain ← Infrastructure
                    ↓           ↑
              (depends on)  (implements)
```

---

## Design Patterns

### 1. Repository Pattern
- Абстракция доступа к данным
- Domain layer определяет интерфейсы
- Infrastructure layer реализует через Prisma

```typescript
// Domain Layer - Interface
interface IEntityRepository {
  findById(id: string): Promise<Entity | null>;
  findByProject(projectId: string): Promise<Entity[]>;
  save(entity: Entity): Promise<Entity>;
}

// Infrastructure Layer - Implementation
class PrismaEntityRepository implements IEntityRepository {
  // Prisma implementation
}
```

### 2. Use Case Pattern
- Каждый use case — отдельный класс
- Единая ответственность
- Легко тестируемый

```typescript
// Application Layer
class GetEntityByIdUseCase {
  constructor(private entityRepository: IEntityRepository) {}
  
  async execute(id: string): Promise<Entity | null> {
    return this.entityRepository.findById(id);
  }
}
```

### 3. State Management Pattern (Zustand)
- Отдельные stores для разных доменов
- Селекторы для производительности
- Actions для мутаций

```typescript
// Stores structure
stores/
├── useProjectStore.ts    // Project state
├── useEntityStore.ts     // Entities state
├── useEditorStore.ts     // Editor state
└── useUIStore.ts         // UI state (panels, modals)
```

### 4. Component Pattern (Composition)
- Презентационные компоненты (UI)
- Контейнерные компоненты (логика)
- Составные компоненты (compound pattern)

---

## Directory Structure Pattern

```
src/
├── domain/                    # Domain Layer
│   ├── entities/             # Domain entities
│   │   ├── Project.ts
│   │   ├── Entity.ts
│   │   ├── Scene.ts
│   │   └── Document.ts
│   ├── value-objects/        # Value objects
│   ├── services/             # Domain services
│   └── repositories/         # Repository interfaces
│
├── application/              # Application Layer
│   ├── use-cases/           # Use cases
│   │   ├── project/
│   │   ├── entity/
│   │   └── document/
│   ├── services/            # Application services
│   └── dto/                 # Data Transfer Objects
│
├── infrastructure/          # Infrastructure Layer
│   ├── database/           # Prisma setup
│   │   ├── prisma/
│   │   └── repositories/   # Repository implementations
│   ├── api/                # API clients
│   └── ai/                 # AI integrations (future)
│
├── presentation/           # Presentation Layer
│   ├── components/        # React components
│   │   ├── ui/           # Shadcn/UI components
│   │   ├── layout/       # Layout components
│   │   ├── editor/       # Tiptap components
│   │   └── panels/       # IDE panels
│   ├── hooks/            # Custom hooks
│   ├── stores/           # Zustand stores
│   └── styles/           # Global styles
│
└── app/                   # Next.js App Router
    ├── (dashboard)/      # Dashboard routes
    ├── api/              # API routes
    └── layout.tsx
```

---

## Code Conventions

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProjectExplorer.tsx` |
| Hooks | camelCase, use prefix | `useEntityStore.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase | `EntityType.ts` |
| Constants | SCREAMING_SNAKE | `API_ENDPOINTS.ts` |

### File Naming
- Components: `ComponentName.tsx`
- Styles: `ComponentName.module.css` (если нужны локальные стили)
- Tests: `ComponentName.test.tsx`
- Types: `types.ts` или `ComponentName.types.ts`

### Import Order
1. React/Next.js
2. Third-party libraries
3. Internal modules (absolute paths)
4. Relative imports
5. Styles
6. Types

---

## API Patterns

### Server Actions (Next.js 14)
Предпочтительный способ для мутаций данных.

```typescript
// app/actions/entity.ts
'use server'

export async function createEntity(data: CreateEntityDTO) {
  // Use case execution
}
```

### API Routes
Для сложных операций и внешних интеграций.

```typescript
// app/api/entities/route.ts
export async function GET(request: Request) {
  // Handler
}
```

---

## State Patterns

### Zustand Store Structure
```typescript
interface StoreState {
  // State
  data: DataType[];
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  actions: {
    fetch: () => Promise<void>;
    add: (item: DataType) => void;
    update: (id: string, data: Partial<DataType>) => void;
    remove: (id: string) => void;
  };
}
```

### Selectors
```typescript
// Для оптимизации ре-рендеров
const entities = useEntityStore((state) => state.entities);
const selectedEntity = useEntityStore((state) => 
  state.entities.find(e => e.id === state.selectedId)
);
```

---

## Error Handling Pattern

### Domain Errors
```typescript
class DomainError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

class EntityNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Entity with id ${id} not found`, 'ENTITY_NOT_FOUND');
  }
}
```

### Result Pattern
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

---

## Tiptap Editor Patterns

### SSR в Next.js App Router
```typescript
// ОБЯЗАТЕЛЬНО для предотвращения hydration mismatch
const editor = useEditor({
  immediatelyRender: false,
  extensions: [...],
});
```

### Custom Mark Extensions
```typescript
'use client'; // ОБЯЗАТЕЛЬНО для всех файлов цепочки импорта

import { Mark } from '@tiptap/core';
import { ReactMarkViewRenderer, MarkViewContent } from '@tiptap/react';

// Extension
export const CustomMark = Mark.create({
  name: 'customMark',
  addMarkView() {
    return ReactMarkViewRenderer(CustomMarkComponent);
  },
});

// Component — использовать MarkViewContent, НЕ children
export function CustomMarkComponent(props: MarkViewRendererProps) {
  const attrs = (props.mark as unknown as { attrs: CustomAttrs }).attrs;
  return <span><MarkViewContent /></span>;
}
```

### Типизация mark attributes
```typescript
// Двойной casting через unknown для кастомных атрибутов
const mark = props.mark as unknown as { attrs: EntityMarkAttrs };
```

---

## Testing Patterns

### Unit Tests
- Domain entities
- Use cases
- Utility functions

### Integration Tests
- Repository implementations
- API routes
- Server actions

### Component Tests
- React Testing Library
- User interaction flows

---

## Documentation Requirements

### Component Documentation
Каждый компонент должен иметь:
- Props interface с JSDoc
- Usage examples
- Edge cases

### API Documentation
- Endpoint description
- Request/Response schemas
- Error codes
