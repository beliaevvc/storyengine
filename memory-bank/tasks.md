# Tasks

## Current Task

### UI-002: Улучшения UX интерфейса
- **Status**: ✅ ARCHIVED
- **Level**: 2 (Multiple UI Enhancements)
- **Date**: 2026-01-22
- **Reflection**: `reflection/reflection-UI-002.md` ✅
- **Archive**: `archive/archive-UI-002.md` ✅

---

### BLOCK-001: Улучшение UX семантических блоков
- **Status**: ✅ COMPLETE
- **Level**: 2 (Basic Enhancement)
- **Date**: 2026-01-22

#### Описание
Улучшение интерактивности семантических блоков в редакторе: drag & drop, смена типа в шапке, удаление лишнего UI.

#### Выполнено
- ✅ Убран `BlockHandle` (плюсик слева от курсора) — `/` slash commands остаются доступны
- ✅ Убран плюсик внизу блока между блоками
- ✅ Добавлен dropdown для смены типа блока в шапке размеченных блоков
- ✅ Проверен Drag & Drop — работает через GripVertical слева от блока

#### Изменённые файлы
```
src/presentation/components/editor/Editor.tsx              # Удалён BlockHandle
src/presentation/components/editor/extensions/SemanticBlockView.tsx  # Type picker, удалён плюсик
```

#### Как использовать
- **Drag & Drop**: наведите на блок → появится иконка ⋮⋮ слева → перетащите блок
- **Смена типа**: кликните на тип блока (Диалог/Описание/Действие/Мысли) → выберите новый тип
- **Добавить блок**: используйте `/` в любом месте для вызова slash commands

---

---

### TYPES-001: Рефакторинг системы типизации
- **Status**: ✅ ARCHIVED
- **Level**: 4 (Architectural Refactoring)
- **Date**: 2026-01-20 (завершён 2026-01-21)
- **Reflection**: `reflection/reflection-TYPES-001.md` ✅
- **Archive**: `archive/archive-TYPES-001.md` ✅

#### Описание
Комплексный рефакторинг системы типизации для успешного билда и улучшения maintainability.

#### Выполнено
- ✅ Диагностика — собраны все ошибки билда
- ✅ Скрипт автогенерации типов Supabase (`npm run types:generate`)
- ✅ Расширение типов TipTap (`src/types/tiptap.d.ts`)
- ✅ Исправлены критические ошибки типов (20+ файлов)
- ✅ Next.js Suspense для useSearchParams
- ✅ ReactFlow v12 типы для nodes/edges
- ✅ Слой маппинга snake_case ↔ camelCase (`src/lib/mappers/`)
- ✅ Централизованные table helpers (`src/lib/supabase/tables.ts`)
- ✅ Билд проходит успешно

#### Результаты
| Метрика | До | После |
|---------|-----|-------|
| Билд | Падает | Проходит |
| `as any` | 44 | 38 (централизованы) |

#### Оставшиеся `as any` (38 вхождений)
- `tables.ts` (10) — централизованные helper для Supabase
- AI/embeddings (8) — OpenAI API типы
- FileTree (6) — Supabase client-side calls
- project-actions (5) — Supabase RPC/auth calls
- FilesTab (4) — DnD типы
- Прочее (5) — мелкие кейсы

#### Новые файлы
```
src/types/tiptap.d.ts                   # TipTap type extensions
src/lib/mappers/index.ts                # Mapper layer
src/lib/mappers/types.ts
src/lib/mappers/entityMapper.ts
src/lib/mappers/projectMapper.ts
src/lib/mappers/documentMapper.ts
src/lib/supabase/tables.ts              # Centralized table accessors
```

#### Изменённые файлы
```
package.json                            # + types:generate script
src/app/(auth)/login/page.tsx           # Suspense wrapper
src/presentation/components/editor/Editor.tsx
src/presentation/components/editor/extensions/SemanticBlock.ts
src/presentation/components/editor/extensions/SemanticBlockView.tsx
src/presentation/components/entities/KnowledgeBasePanel.tsx
src/presentation/components/entity-profile/AttributesEditor.tsx
src/presentation/components/entity-profile/RelationshipsEditor.tsx
src/presentation/components/explorer/DatabaseTab.tsx
src/presentation/components/explorer/FileTree.tsx
src/presentation/components/flow/edges/RelationEdge.tsx
src/presentation/components/flow/nodes/SceneNode.tsx
src/presentation/components/flow/nodes/CharacterNode.tsx
src/presentation/components/flow/nodes/LocationNode.tsx
src/presentation/components/flow/FlowCanvas.tsx
src/presentation/components/settings/AttributeSchemaForm.tsx
src/presentation/components/settings/RelationshipTypesEditor.tsx
src/presentation/components/workspace/DocumentTabs.tsx
src/presentation/components/workspace/WorkspacePanel.tsx
src/presentation/hooks/useEntitiesLoader.ts
src/presentation/hooks/useProjectLoader.ts
src/presentation/hooks/useDocumentsLoader.ts
src/app/actions/supabase/entity-actions.ts
src/app/actions/supabase/project-actions.ts
src/app/actions/supabase/document-actions.ts
src/app/actions/supabase/timeline-actions.ts
src/app/actions/supabase/relationship-type-actions.ts
src/app/actions/supabase/attribute-actions.ts
```

#### Использование автогенерации типов
```bash
supabase login
SUPABASE_PROJECT_ID=your_id npm run types:generate
```

---

### PROFILE-001: Страница профиля сущности (Entity Profile)
- **Status**: ✅ COMPLETE
- **Level**: 3 (Intermediate Feature)
- **Date**: 2026-01-19

#### Описание
Универсальная страница профиля сущности с 3-колоночным layout: Паспорт (левая), Контент с Tiptap (центральная), Timeline событий (правая). Интеграция с кастомными атрибутами и реальными данными SceneEntity.

#### URL
`/projects/[projectId]/entity/[entityId]`

#### Реализовано
- ✅ UI компоненты: Avatar, ScrollArea, Separator
- ✅ Server Action `getScenesByEntityAction` для Timeline
- ✅ 3-колоночный layout `EntityProfileLayout`
- ✅ Левая колонка `EntityPassport` (аватар, мета, атрибуты, связи)
- ✅ Центральная колонка `EntityContent` (Tabs + MinimalEditor)
- ✅ Правая колонка `EntityTimeline` (хронология сцен)
- ✅ `MinimalEditor` — упрощённый Tiptap без сцен/блоков
- ✅ Навигация: двойной клик, контекстное меню, клик по имени

#### Структура файлов
```
src/presentation/components/ui/
├── avatar.tsx
├── scroll-area.tsx
└── separator.tsx

src/presentation/components/entity-profile/
├── index.ts
├── EntityProfileLayout.tsx
├── EntityPassport.tsx
├── EntityContent.tsx
├── EntityTimeline.tsx
├── AttributesList.tsx
├── RelationshipsList.tsx
├── TimelineItem.tsx
└── MinimalEditor.tsx

src/app/(dashboard)/projects/[projectId]/entity/[entityId]/page.tsx
src/app/actions/scene-actions.ts  # + getScenesByEntityAction
```

---

### SCHEMA-001: Схема Мира (Project Schema Editor)
- **Status**: ✅ COMPLETE
- **Level**: 3 (Intermediate Feature)
- **Date**: 2026-01-19

#### Описание
Модуль для определения кастомных атрибутов сущностей. Пользователь сам создаёт характеристики (HP, Фракция, Инвентарь и т.д.), не зависит от хардкода.

#### Типы данных
- **Number** — число со шкалой (min, max, default)
- **Text** — строка (default, maxLength)
- **Boolean** — флаг (default)
- **Enum** — выбор из списка (options, default)
- **List** — коллекция строк (default)

#### Реализовано
- ✅ Prisma модель `AttributeDefinition` с relation к `Project`
- ✅ TypeScript типы в `src/core/types/attribute-schema.ts`
- ✅ Zod-схемы валидации в `src/lib/validations/attributeSchemas.ts`
- ✅ Server Actions (CRUD) в `src/app/actions/attribute-actions.ts`
- ✅ Страница настроек `/project/[id]/settings`
- ✅ UI компоненты: `AttributeSchemaList`, `AttributeSchemaCard`, `AttributeSchemaForm`, `TypeConfigFields`
- ✅ Навигация: кнопка Settings в Header ведёт на страницу настроек

#### Структура файлов
```
prisma/schema.prisma                           # + AttributeDefinition model
src/core/types/attribute-schema.ts             # TypeScript типы
src/lib/validations/attributeSchemas.ts        # Zod схемы
src/app/actions/attribute-actions.ts           # Server Actions
src/app/(dashboard)/projects/[projectId]/settings/page.tsx
src/presentation/components/settings/
├── index.ts
├── AttributeSchemaList.tsx
├── AttributeSchemaCard.tsx
├── AttributeSchemaForm.tsx
└── TypeConfigFields.tsx
```

#### Следующие шаги (отдельные задачи)
- [ ] Интеграция кастомных атрибутов в `EntityForm`
- [ ] Drag & drop для изменения порядка атрибутов
- [ ] Миграция БД для production

## Completed Tasks

### MARKUP-001: Система ручной разметки блоков
- **Status**: ✅ ARCHIVED
- **Level**: 3 (Intermediate Feature)
- **Date**: 2026-01-18
- **Reflection**: `reflection/reflection-MARKUP-001.md` ✅
- **Archive**: `archive/archive-MARKUP-001.md` ✅

---

### EDITOR-001: Улучшения блочной архитектуры редактора
- **Status**: ✅ ARCHIVED
- **Level**: 3 (Intermediate Feature)
- **Date**: 2026-01-18
- **Reflection**: `reflection/reflection-EDITOR-001.md` ✅
- **Archive**: `archive/archive-EDITOR-001.md` ✅

---

### VIEW-001: Режим просмотра "Чистый текст"
- **Status**: ✅ COMPLETE
- **Level**: 2 (Basic Enhancement)
- **Date**: 2026-01-18

#### Описание
Добавлен переключатель режимов просмотра в редакторе:
- **Синтаксис** — полный UI с лейблами блоков, спикерами, метаданными
- **Чистый** — минималистичный режим для чтения, только текст и заголовки сцен

#### Реализовано
- ✅ `useEditorStore` — добавлен `viewMode: 'syntax' | 'clean'`
- ✅ `Toolbar` — переключатель по центру (две кнопки-табы)
- ✅ `SemanticBlockView` — скрыты лейблы, спикеры, границы, кнопки в clean режиме
- ✅ `SceneView` — скрыты локация, персонажи, мета, кнопки (заголовок оставлен)
- ✅ `EntityMentionComponent` — @упоминания показаны как обычный текст

#### Что скрывается в "Чистом" режиме
- `[DLG]`, `[DSC]`, `[ACT]`, `[THT]` лейблы
- Спикеры (`>Мира ×`)
- Локация в заголовке сцены
- Полоса персонажей (`chars:`)
- `[meta]` секция
- @упоминания (подчёркивание)
- Границы блоков
- Кнопки управления (`[×]`, `[-]`, `[+]`)

#### Что сохраняется
- Название сцены
- Структура абзацев
- Редактирование текста

---

## Completed Tasks

### SCENE-003: Scene-Centric Document Architecture
- **Status**: ✅ COMPLETE
- **Level**: 4 (Architectural Refactor)
- **Date**: 2026-01-18

#### Описание
Переработка архитектуры документа — сцены стали обязательными top-level контейнерами. 
Документ теперь может содержать только сцены, весь контент внутри них.

#### Реализовано
- ✅ `DocumentExtension` — doc с `content: 'scene*'`
- ✅ Refactor `SceneExtension` — убран `group: 'block'`, контент `(block | semanticBlock)+`
- ✅ `SlashCommands` extension — Notion-style меню по `/`
- ✅ `SlashCommandList` — UI компонент для slash menu
- ✅ `migrateDocument` — автоматическая миграция старых документов
- ✅ `SemanticBlock` extension — dialogue/description/action/thought
- ✅ `SemanticBlockView` — минималистичный UI с цветовыми пометками
- ✅ Интеграция в `Editor.tsx`
- ✅ Обновление `Toolbar` — подсказка про slash commands

#### Новые файлы
```
src/presentation/components/editor/extensions/
├── DocumentExtension.ts
├── SlashCommands.ts
├── slashCommandSuggestion.tsx
├── SemanticBlock.ts
├── SemanticBlockView.tsx

src/presentation/components/editor/
├── SlashCommandList.tsx

src/presentation/utils/
├── migrateDocument.ts
```

#### Slash Commands
- `/scene` — новая сцена
- `/dialogue` — блок диалога
- `/description` — блок описания
- `/action` — блок действия
- `/thought` — блок мыслей
- `/h1`, `/h2`, `/h3` — заголовки
- `/bullet`, `/ordered`, `/quote` — списки и цитаты

---

## Completed Tasks

### GIT-001: Подключение GitHub репозитория
- **Status**: ✅ ARCHIVED
- **Level**: 1 (Quick Task)
- **Date**: 2026-01-18
- **Reflection**: `reflection/reflection-GIT-001.md` ✅
- **Archive**: `archive/archive-GIT-001.md` ✅

---

### DND-001: Исправление drag & drop файлов в sidebar
- **Status**: ✅ ARCHIVED
- **Level**: 2 (Bug fix + Enhancement)
- **Date**: 2026-01-18
- **Reflection**: `reflection/reflection-DND-001.md` ✅
- **Archive**: `archive/archive-DND-001.md` ✅

---

### SCENE-002: Исчезновение сцен после обновления страницы
- **Status**: ✅ ARCHIVED
- **Level**: 2 (Bug fix)
- **Date**: 2026-01-18
- **Reflection**: `reflection/reflection-SCENE-002.md` ✅
- **Archive**: `archive/archive-SCENE-002.md` ✅

---

### DB-001: Переименование и удаление сущностей
- **Status**: ✅ ARCHIVED
- **Level**: 2 (Basic Enhancement)
- **Date**: 2026-01-18
- **Reflection**: `reflection/reflection-DB-001.md` ✅
- **Archive**: `archive/archive-DB-001.md` ✅

---

### SCENE-001: Доработка блока сцены
- **Status**: ✅ ARCHIVED
- **Level**: 2 (Basic Enhancement)
- **Date**: 2026-01-17
- **Reflection**: `reflection/reflection-SCENE-001.md` ✅
- **Archive**: `archive/archive-SCENE-001.md` ✅

---

### UI-001: Перенос табов в хедер
- **Status**: ✅ COMPLETE
- **Level**: 2 (Basic Enhancement)
- **Date**: 2026-01-17
- **Archive**: `archive/archive-UI-001-header-tabs.md`

### STORY-002: Entity as Document System
- **Status**: ✅ ARCHIVED
- **Level**: 3 (Intermediate Feature)
- **Date**: 2026-01-17
- **Archive**: `archive/archive-STORY-002.md`
