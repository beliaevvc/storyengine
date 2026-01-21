# Active Context

## Current Status
**Готов к новой задаче**

## Последняя завершённая задача

| Задача | Описание | Статус |
|--------|----------|--------|
| BLOCK-001 | Улучшение UX семантических блоков (D&D, смена типа, убран плюсик) | ✅ COMPLETE |

## Последние завершённые задачи

| Задача | Описание | Архив |
|--------|----------|-------|
| PROFILE-001 | Страница профиля сущности (3-колоночный layout) | ✅ COMPLETE |
| SCHEMA-001 | Схема Мира (Project Schema Editor) | ✅ COMPLETE |
| MARKUP-001 | Система ручной разметки блоков | `archive/archive-MARKUP-001.md` ✅ |
| EDITOR-001 | Улучшения блочной архитектуры | `archive/archive-EDITOR-001.md` ✅ |
| VIEW-001 | Режим "Чистый текст" | (pending archive) |
| SCENE-003 | Scene-Centric Architecture | (pending archive) |

## Recent Completions

| Task | Description | Archive |
|------|-------------|---------|
| SCENE-003 | Scene-Centric Architecture | (pending archive) |
| GIT-001 | Подключение GitHub репозитория | `archive/archive-GIT-001.md` ✅ |
| DND-001 | Drag & Drop файлов в sidebar | `archive/archive-DND-001.md` ✅ |
| SCENE-002 | Исчезновение сцен после обновления | `archive/archive-SCENE-002.md` ✅ |
| DB-001 | Переименование и удаление сущностей | `archive/archive-DB-001.md` ✅ |
| SCENE-001 | Доработка блока сцены | `archive/archive-SCENE-001.md` ✅ |
| UI-001 | Перенос табов в хедер | `archive/archive-UI-001-header-tabs.md` |
| STORY-002 | Entity as Document System | `archive/archive-STORY-002.md` ✅ |

---

## Quick Start

```bash
cd "/Users/sergejbelaev/Desktop/Project Cursor/StoryEngine"
npm run dev
# http://localhost:3000
```

---

## Suggested Next Tasks

1. **Исправление создания документов** — SQL миграция для типа DOCUMENT в Supabase
2. **Сохранение сцен** — отладка autosave для Tiptap Scene nodes
3. **Batch updates для reorder** — оптимизация drag & drop (один запрос вместо цикла)

---

## Archives
| Phase | Archive | Reflection |
|-------|---------|------------|
| Planning | `archive-STORY-001-planning.md` | `reflection-STORY-001-planning.md` |
| Impl 0-1 | `archive-STORY-001-impl-phase1.md` | `reflection-STORY-001-impl-phase1.md` |
| Impl 2 | `archive-STORY-001-impl-phase2.md` | `reflection-STORY-001-impl-phase2.md` |
| Impl 3 | `archive-STORY-001-impl-phase3.md` | `reflection-STORY-001-impl-phase3.md` |
| Impl 4 | `archive-STORY-001-impl-phase4.md` | `reflection-STORY-001-impl-phase4.md` |
| Impl 5 | `archive-STORY-001-impl-phase5.md` | `reflection-STORY-001-impl-phase5.md` |
| Impl 6 | `archive-STORY-001-impl-phase6.md` | `reflection-STORY-001-impl-phase6.md` |
| Impl 7 | `archive-STORY-001-impl-phase7.md` | `reflection-STORY-001-impl-phase7.md` |
| **Final** | `archive-STORY-001-impl-final.md` ✅ | `reflection-STORY-001-impl-final.md` ✅ |

---

## MVP Summary

### Реализовано
- ✅ 3-panel IDE layout
- ✅ Tiptap rich text editor
- ✅ **Scene-centric document architecture** (NEW)
- ✅ **Slash commands** — Notion-style `/` menu (NEW)
- ✅ **Semantic blocks** — dialogue/description/action/thought (NEW)
- ✅ Entity management (CRUD)
- ✅ Mock AI Scan (regex-based)
- ✅ Two-way binding (entity ↔ text)
- ✅ PostgreSQL + Prisma 7
- ✅ Clean Architecture

### Не реализовано (Post-MVP)
- ❌ Supabase интеграция
- ❌ Реальный AI (LLM)
- ❌ Авторизация
- ❌ Облачное хранение

---

## Technology Stack (Verified)

| Technology | Version | Status |
|------------|---------|--------|
| Next.js | 14.x | ✅ |
| TypeScript | 5.x | ✅ |
| Prisma | 7.x | ✅ |
| PostgreSQL | 16.x | ✅ |
| Tailwind CSS | 3.x | ✅ |
| Zustand | 5.x | ✅ |
| Tiptap | 2.x | ✅ |
| Radix UI | latest | ✅ |

---

## Context7 Library IDs (Verified)

| Library | ID |
|---------|-----|
| Next.js | `/vercel/next.js` |
| Zustand | `/websites/zustand_pmnd_rs` |
| Tiptap | `/ueberdosis/tiptap-docs` |
| Prisma | `/prisma/docs` |
| react-resizable-panels | `/bvaughn/react-resizable-panels` |
| Radix UI | `/websites/radix-ui-primitives` |

---

## Next Task Suggestions

Для продолжения разработки StoryEngine:

```
/van STORY-002 — Supabase Integration
```
- Миграция с локального PostgreSQL на Supabase
- Настройка Supabase Auth
- Cloud storage для проектов

```
/van STORY-003 — Real AI Integration
```
- Интеграция LLM (GPT/Claude) для entity extraction
- Автоматическое создание entities из текста
- Relationship extraction

---

## Quick Start (для следующей задачи)

```bash
# Запуск dev сервера
cd "/Users/sergejbelaev/Desktop/Project Cursor/StoryEngine"
npm run dev

# URL
http://localhost:3003/projects/13b54d6d-56dc-4785-a3d5-cbe2aef9559d
```
