# 🎨🎨🎨 CREATIVE PHASE CP-1: DATABASE SCHEMA DESIGN 🎨🎨🎨

> **Phase ID**: CP-1
> **Type**: Data Model Design
> **Priority**: HIGH
> **Status**: IN PROGRESS
> **Created**: 2026-01-17

---

## 1. PROBLEM STATEMENT

### Контекст
StoryEngine — IDE для писателей, где "сюжет — это код". Нам нужна схема базы данных, которая:

1. **Single Source of Truth**: Информация о персонажах, локациях и предметах хранится централизованно
2. **Гибкость**: Атрибуты сущностей могут варьироваться (персонаж может иметь "здоровье", "инвентарь", "отношения")
3. **Связи со сценами**: Сущности связаны со сценами, в которых они участвуют
4. **AI-Ready**: Структура готова к AI-анализу и модификации

### Требования

| Требование | Описание |
|------------|----------|
| R1 | Project содержит множество Documents (главы) |
| R2 | Project содержит множество Entities (персонажи, локации, предметы) |
| R3 | Documents содержат Scenes/Beats |
| R4 | Scenes связаны с Entities (many-to-many) |
| R5 | Entities имеют гибкие атрибуты (JSONB) |
| R6 | Документы содержат rich text content |
| R7 | Поддержка версионирования (future) |

### Ограничения

- PostgreSQL 14+
- Prisma ORM 5.x
- TypeScript strict mode
- Максимум 6 основных моделей для MVP

---

## 2. CORE ENTITIES ANALYSIS

### 2.1 Project (Книга/Сценарий)

```
Project
├── id: String (UUID)
├── title: String
├── description: String?
├── settings: Json (project-level settings)
├── createdAt: DateTime
├── updatedAt: DateTime
└── Relations:
    ├── documents: Document[]
    └── entities: Entity[]
```

### 2.2 Entity (Персонаж/Локация/Предмет)

```
Entity
├── id: String (UUID)
├── projectId: String (FK)
├── type: EntityType (enum)
├── name: String
├── description: String?
├── attributes: Json (JSONB - гибкие данные)
├── createdAt: DateTime
├── updatedAt: DateTime
└── Relations:
    ├── project: Project
    └── scenes: Scene[] (many-to-many)
```

### 2.3 Document (Глава)

```
Document
├── id: String (UUID)
├── projectId: String (FK)
├── title: String
├── content: Json (Tiptap JSON content)
├── order: Int (порядок в проекте)
├── createdAt: DateTime
├── updatedAt: DateTime
└── Relations:
    ├── project: Project
    └── scenes: Scene[]
```

### 2.4 Scene (Сцена/Beat)

```
Scene
├── id: String (UUID)
├── documentId: String (FK)
├── title: String?
├── summary: String?
├── startOffset: Int? (позиция в документе)
├── endOffset: Int?
├── metadata: Json
├── order: Int
├── createdAt: DateTime
├── updatedAt: DateTime
└── Relations:
    ├── document: Document
    └── entities: Entity[] (many-to-many)
```

---

## 3. OPTIONS ANALYSIS

### Option 1: Polymorphic Entity с JSONB атрибутами

**Description**: Единая модель Entity с полем `type` (enum) и гибкими `attributes` (JSONB).

```prisma
enum EntityType {
  CHARACTER
  LOCATION
  ITEM
  EVENT
  CONCEPT
}

model Entity {
  id          String     @id @default(uuid())
  projectId   String
  type        EntityType
  name        String
  description String?
  attributes  Json       @default("{}")
  
  project     Project    @relation(fields: [projectId], references: [id])
  scenes      Scene[]    @relation("EntityScenes")
}
```

**Pros**:
- ✅ Максимальная гибкость атрибутов
- ✅ Единый API для всех типов сущностей
- ✅ Легко добавлять новые типы сущностей
- ✅ AI может динамически добавлять атрибуты
- ✅ Простые запросы без JOINs для получения сущности

**Cons**:
- ❌ Нет строгой типизации атрибутов на уровне БД
- ❌ Сложнее валидировать структуру атрибутов
- ❌ Индексация JSONB менее эффективна

**Complexity**: Low
**Implementation Time**: Short

---

### Option 2: Separate Tables (Character, Location, Item)

**Description**: Отдельная таблица для каждого типа сущности с фиксированными полями + JSONB для расширений.

```prisma
model Character {
  id          String  @id @default(uuid())
  projectId   String
  name        String
  age         Int?
  occupation  String?
  backstory   String?
  attributes  Json    @default("{}")
  
  project     Project @relation(fields: [projectId], references: [id])
  scenes      Scene[] @relation("CharacterScenes")
}

model Location {
  id          String  @id @default(uuid())
  projectId   String
  name        String
  description String?
  attributes  Json    @default("{}")
  
  project     Project @relation(fields: [projectId], references: [id])
  scenes      Scene[] @relation("LocationScenes")
}
```

**Pros**:
- ✅ Строгая типизация для общих полей
- ✅ Лучше для аналитики по типам
- ✅ Более явная структура БД

**Cons**:
- ❌ Дублирование логики для каждого типа
- ❌ Сложнее добавлять новые типы
- ❌ Множественные relations к Scene
- ❌ UI должен обрабатывать разные типы

**Complexity**: High
**Implementation Time**: Long

---

### Option 3: Entity + EntityAttribute (EAV Pattern)

**Description**: Entity с отдельной таблицей атрибутов (Entity-Attribute-Value).

```prisma
model Entity {
  id          String            @id @default(uuid())
  projectId   String
  type        EntityType
  name        String
  description String?
  
  attributes  EntityAttribute[]
}

model EntityAttribute {
  id        String @id @default(uuid())
  entityId  String
  key       String
  value     String
  valueType String // "string", "number", "boolean", "json"
  
  entity    Entity @relation(fields: [entityId], references: [id])
  
  @@unique([entityId, key])
}
```

**Pros**:
- ✅ Максимально гибкая структура
- ✅ Можно индексировать отдельные атрибуты
- ✅ Легко отслеживать изменения атрибутов

**Cons**:
- ❌ Много JOINs для получения полной сущности
- ❌ Сложные запросы
- ❌ Performance issues при большом количестве атрибутов
- ❌ Сложность в TypeScript типизации

**Complexity**: High
**Implementation Time**: Long

---

### Option 4: Hybrid (Entity + Type-specific JSONB schemas)

**Description**: Единая Entity модель с JSONB, но с TypeScript интерфейсами для валидации по типам.

```prisma
model Entity {
  id          String     @id @default(uuid())
  projectId   String
  type        EntityType
  name        String
  description String?
  attributes  Json       @default("{}")
  
  project     Project    @relation(fields: [projectId], references: [id])
  scenes      Scene[]    @relation("EntityScenes")
  
  @@index([projectId, type])
  @@index([name])
}
```

С TypeScript интерфейсами:
```typescript
interface CharacterAttributes {
  age?: number;
  occupation?: string;
  traits?: string[];
  relationships?: Record<string, string>;
  status?: 'alive' | 'dead' | 'unknown';
}

interface LocationAttributes {
  coordinates?: { lat: number; lng: number };
  climate?: string;
  population?: number;
}
```

**Pros**:
- ✅ Гибкость JSONB
- ✅ TypeScript валидация на уровне приложения
- ✅ Единый API
- ✅ Легко эволюционировать схему
- ✅ AI-friendly

**Cons**:
- ❌ Валидация только на уровне приложения, не БД
- ❌ Требует Zod или подобную библиотеку

**Complexity**: Medium
**Implementation Time**: Medium

---

## 4. EVALUATION MATRIX

| Критерий | Weight | Option 1 | Option 2 | Option 3 | Option 4 |
|----------|--------|----------|----------|----------|----------|
| Гибкость | 25% | 9 | 5 | 10 | 9 |
| Простота | 20% | 9 | 4 | 3 | 8 |
| Performance | 15% | 7 | 8 | 4 | 7 |
| Type Safety | 15% | 5 | 9 | 6 | 8 |
| AI-Ready | 15% | 9 | 5 | 7 | 9 |
| Расширяемость | 10% | 9 | 4 | 8 | 9 |
| **TOTAL** | 100% | **7.95** | 5.65 | 6.15 | **8.25** |

---

## 5. 🎯 DECISION

### Выбранный подход: **Option 4 — Hybrid (Entity + Type-specific JSONB schemas)**

### Rationale

1. **Баланс гибкости и типизации**: JSONB даёт гибкость для AI и будущих атрибутов, TypeScript интерфейсы обеспечивают type safety на уровне приложения.

2. **AI-Ready**: AI может легко добавлять новые атрибуты без миграций БД.

3. **Простота MVP**: Единый Entity API упрощает UI и state management.

4. **Эволюция**: Если позже понадобится строгая схема для определенных атрибутов — можно добавить поля без переписывания всей системы.

5. **Zod интеграция**: Используем Zod для runtime валидации атрибутов по типу сущности.

---

## 6. FINAL SCHEMA DESIGN

### 6.1 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum EntityType {
  CHARACTER
  LOCATION
  ITEM
  EVENT
  CONCEPT
}

// ============================================
// MODELS
// ============================================

model Project {
  id          String   @id @default(uuid())
  title       String
  description String?
  settings    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  documents   Document[]
  entities    Entity[]

  @@index([title])
}

model Entity {
  id          String     @id @default(uuid())
  projectId   String
  type        EntityType
  name        String
  description String?
  attributes  Json       @default("{}")
  imageUrl    String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Relations
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)
  scenes      SceneEntity[]

  @@index([projectId, type])
  @@index([name])
}

model Document {
  id        String   @id @default(uuid())
  projectId String
  title     String
  content   Json     @default("{}") // Tiptap JSON content
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  scenes    Scene[]

  @@index([projectId, order])
}

model Scene {
  id          String   @id @default(uuid())
  documentId  String
  title       String?
  summary     String?
  startOffset Int?     // Character offset in document
  endOffset   Int?
  metadata    Json     @default("{}")
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  document    Document      @relation(fields: [documentId], references: [id], onDelete: Cascade)
  entities    SceneEntity[]

  @@index([documentId, order])
}

// Junction table for Scene <-> Entity many-to-many
model SceneEntity {
  id        String   @id @default(uuid())
  sceneId   String
  entityId  String
  role      String?  // "protagonist", "mentioned", "setting", etc.
  notes     String?
  createdAt DateTime @default(now())

  // Relations
  scene     Scene    @relation(fields: [sceneId], references: [id], onDelete: Cascade)
  entity    Entity   @relation(fields: [entityId], references: [id], onDelete: Cascade)

  @@unique([sceneId, entityId])
  @@index([sceneId])
  @@index([entityId])
}
```

### 6.2 TypeScript Attribute Interfaces

```typescript
// domain/entities/entity-attributes.ts

// Base attributes all entities have
interface BaseAttributes {
  tags?: string[];
  aliases?: string[];
  notes?: string;
}

// Character-specific attributes
export interface CharacterAttributes extends BaseAttributes {
  age?: number;
  gender?: string;
  occupation?: string;
  appearance?: string;
  personality?: string[];
  backstory?: string;
  goals?: string[];
  fears?: string[];
  relationships?: Record<string, {
    type: 'family' | 'friend' | 'enemy' | 'romantic' | 'professional' | 'other';
    description?: string;
  }>;
  status?: 'alive' | 'dead' | 'unknown';
  health?: number; // 0-100
  inventory?: string[];
}

// Location-specific attributes
export interface LocationAttributes extends BaseAttributes {
  locationType?: 'city' | 'building' | 'room' | 'outdoor' | 'virtual' | 'other';
  address?: string;
  climate?: string;
  population?: number;
  features?: string[];
  atmosphere?: string;
  connectedLocations?: string[]; // Entity IDs
}

// Item-specific attributes  
export interface ItemAttributes extends BaseAttributes {
  itemType?: 'weapon' | 'tool' | 'clothing' | 'document' | 'vehicle' | 'other';
  value?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  owner?: string; // Entity ID
  location?: string; // Entity ID
  properties?: string[];
}

// Event-specific attributes
export interface EventAttributes extends BaseAttributes {
  date?: string;
  duration?: string;
  impact?: 'minor' | 'moderate' | 'major' | 'catastrophic';
  participants?: string[]; // Entity IDs
  consequences?: string[];
}

// Concept-specific attributes
export interface ConceptAttributes extends BaseAttributes {
  domain?: string;
  definition?: string;
  examples?: string[];
  relatedConcepts?: string[];
}

// Union type for all attributes
export type EntityAttributes = 
  | CharacterAttributes 
  | LocationAttributes 
  | ItemAttributes 
  | EventAttributes 
  | ConceptAttributes;
```

### 6.3 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐    │
│  │   Project    │         │   Document   │         │    Scene     │    │
│  ├──────────────┤         ├──────────────┤         ├──────────────┤    │
│  │ id           │◄────────│ projectId    │         │ id           │    │
│  │ title        │    1:N  │ id           │◄────────│ documentId   │    │
│  │ description  │         │ title        │    1:N  │ title        │    │
│  │ settings     │         │ content      │         │ summary      │    │
│  │ createdAt    │         │ order        │         │ startOffset  │    │
│  │ updatedAt    │         │ createdAt    │         │ endOffset    │    │
│  └──────────────┘         │ updatedAt    │         │ metadata     │    │
│         │                 └──────────────┘         │ order        │    │
│         │ 1:N                                      └──────┬───────┘    │
│         ▼                                                 │            │
│  ┌──────────────┐                                        │            │
│  │    Entity    │                                        │            │
│  ├──────────────┤         ┌──────────────┐               │            │
│  │ id           │◄────────│ SceneEntity  │───────────────┘            │
│  │ projectId    │    M:N  ├──────────────┤                            │
│  │ type         │         │ id           │                            │
│  │ name         │         │ sceneId      │                            │
│  │ description  │         │ entityId     │                            │
│  │ attributes   │ (JSONB) │ role         │                            │
│  │ imageUrl     │         │ notes        │                            │
│  │ createdAt    │         │ createdAt    │                            │
│  │ updatedAt    │         └──────────────┘                            │
│  └──────────────┘                                                      │
│                                                                          │
│  EntityType enum:                                                        │
│  [CHARACTER, LOCATION, ITEM, EVENT, CONCEPT]                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. IMPLEMENTATION GUIDELINES

### 7.1 Migration Strategy

1. Создать `prisma/schema.prisma` с полной схемой
2. Запустить `npx prisma migrate dev --name init`
3. Сгенерировать клиент `npx prisma generate`
4. Создать seed данные для тестирования

### 7.2 Zod Schemas для валидации

```typescript
// infrastructure/database/schemas/entity-schemas.ts
import { z } from 'zod';

export const characterAttributesSchema = z.object({
  age: z.number().min(0).max(1000).optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  appearance: z.string().optional(),
  personality: z.array(z.string()).optional(),
  backstory: z.string().optional(),
  goals: z.array(z.string()).optional(),
  fears: z.array(z.string()).optional(),
  relationships: z.record(z.object({
    type: z.enum(['family', 'friend', 'enemy', 'romantic', 'professional', 'other']),
    description: z.string().optional()
  })).optional(),
  status: z.enum(['alive', 'dead', 'unknown']).optional(),
  health: z.number().min(0).max(100).optional(),
  inventory: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),
  notes: z.string().optional()
});

// Similar schemas for other entity types...
```

### 7.3 Repository Interface

```typescript
// domain/repositories/IEntityRepository.ts
import { Entity, EntityType } from '@prisma/client';

export interface IEntityRepository {
  findById(id: string): Promise<Entity | null>;
  findByProject(projectId: string): Promise<Entity[]>;
  findByProjectAndType(projectId: string, type: EntityType): Promise<Entity[]>;
  findByName(projectId: string, name: string): Promise<Entity[]>;
  create(data: CreateEntityDTO): Promise<Entity>;
  update(id: string, data: UpdateEntityDTO): Promise<Entity>;
  delete(id: string): Promise<void>;
  addToScene(entityId: string, sceneId: string, role?: string): Promise<void>;
  removeFromScene(entityId: string, sceneId: string): Promise<void>;
}
```

### 7.4 Indexes Strategy

| Index | Purpose |
|-------|---------|
| `Entity(projectId, type)` | Быстрый поиск по типу в проекте |
| `Entity(name)` | Поиск по имени для entity detection |
| `Document(projectId, order)` | Сортировка документов |
| `Scene(documentId, order)` | Сортировка сцен |
| `SceneEntity(sceneId)` | Получение entities сцены |
| `SceneEntity(entityId)` | Получение сцен entity |

---

## 8. VERIFICATION CHECKLIST

### Requirements Coverage
- [x] R1: Project → Documents (1:N) ✅
- [x] R2: Project → Entities (1:N) ✅
- [x] R3: Document → Scenes (1:N) ✅
- [x] R4: Scene ↔ Entity (M:N via SceneEntity) ✅
- [x] R5: Entity.attributes (JSONB) ✅
- [x] R6: Document.content (JSONB for Tiptap) ✅
- [x] R7: Structure supports versioning (future) ✅

### Technical Validation
- [x] PostgreSQL compatible
- [x] Prisma 5.x syntax
- [x] TypeScript strict compatible
- [x] ≤6 models for MVP (5 models)
- [x] Proper cascading deletes
- [x] Appropriate indexes

---

## 9. NEXT STEPS

1. **BUILD Phase**: Создать детальный план BUILD-01 (Database Schema Plan)
2. **Implementation**: Создать `prisma/schema.prisma`
3. **Migration**: Запустить первую миграцию
4. **Seed**: Создать тестовые данные
5. **Repository**: Имплементировать PrismaEntityRepository

---

# 🎨🎨🎨 EXITING CREATIVE PHASE CP-1 🎨🎨🎨

## Summary
Выбран Hybrid подход с единой Entity моделью и JSONB атрибутами, валидируемыми через TypeScript интерфейсы и Zod schemas.

## Key Decisions
1. Единая Entity модель с EntityType enum
2. JSONB для гибких атрибутов
3. SceneEntity junction table для M:N связи
4. TypeScript интерфейсы + Zod для валидации
5. Каскадное удаление для целостности данных

## Files to Create
- `prisma/schema.prisma`
- `src/domain/entities/entity-attributes.ts`
- `src/infrastructure/database/schemas/entity-schemas.ts`
- `src/domain/repositories/IEntityRepository.ts`
