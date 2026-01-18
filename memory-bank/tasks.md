# Tasks

## Current Task

## Completed Tasks

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
