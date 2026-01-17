# АРХИВ: STORY-002 — Entity as Document System

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| Task ID | STORY-002 |
| Название | Entity as Document System |
| Уровень | 3 (Intermediate Feature) |
| Статус | ✅ COMPLETE |
| Дата начала | 2026-01-17 |
| Дата завершения | 2026-01-17 |
| Рефлексия | `reflection/reflection-STORY-002.md` |

---

## КРАТКОЕ ОПИСАНИЕ

Переработка системы entities (персонажи, локации, предметы и т.д.) для работы как полноценных документов с Tiptap редактором, структурированными шаблонами и системой вкладок в центральном workspace.

---

## ТРЕБОВАНИЯ

### Функциональные
- [x] Entities открываются в центральном редакторе (не только в sidebar)
- [x] Каждый тип entity имеет свой шаблон с секциями
- [x] Система вкладок для переключения между документами и entities
- [x] Auto-save при редактировании

### Технические
- [x] Поле `content` в таблице entities для хранения Tiptap JSON
- [x] WorkspaceStore для управления открытыми вкладками
- [x] Persist состояния вкладок между сессиями

---

## РЕАЛИЗАЦИЯ

### Созданные файлы

| Файл | Описание |
|------|----------|
| `supabase/migrations/00004_add_entity_content.sql` | SQL миграция для content column |
| `src/presentation/stores/useWorkspaceStore.ts` | Zustand store для tabs |
| `src/presentation/components/editor/templates/entityTemplates.ts` | Шаблоны для 7 типов entities |
| `src/presentation/components/editor/templates/index.ts` | Экспорты шаблонов |
| `src/presentation/components/editor/EntityEditor.tsx` | Редактор для entities |
| `src/presentation/components/workspace/DocumentTabs.tsx` | Панель вкладок |

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `src/types/supabase.ts` | Добавлено поле content в Entity |
| `prisma/schema.prisma` | Добавлено content, обновлён EntityType enum |
| `src/core/entities/entity.ts` | TiptapContent type, content field |
| `src/presentation/stores/index.ts` | Export WorkspaceStore |
| `src/presentation/components/editor/index.ts` | Export EntityEditor, templates |
| `src/presentation/components/workspace/index.ts` | Export DocumentTabs, WorkspaceMode |
| `src/presentation/components/workspace/WorkspacePanel.tsx` | Интеграция tabs, activeMode как prop |
| `src/presentation/components/explorer/EntityListItem.tsx` | Открытие entity в tab |
| `src/presentation/components/explorer/FilesTab.tsx` | Открытие document в tab |
| `src/app/actions/supabase/entity-actions.ts` | updateEntityContent action |

### Архитектура

```
User clicks entity → openTab() → WorkspaceStore
                                      ↓
                              DocumentTabs renders tabs
                                      ↓
                              WorkspacePanel checks activeTab.type
                                      ↓
                    type === 'entity' → EntityEditor
                    type === 'document' → StoryEditor
                                      ↓
                              Auto-save to Supabase
```

### Шаблоны Entities

| Тип | Секции |
|-----|--------|
| CHARACTER | Биография, Внешность, Характер, Мотивация, Отношения, Заметки |
| LOCATION | Обзор, География, История, Атмосфера, Значимые объекты, Заметки |
| ITEM | Описание, Происхождение, История, Свойства, Текущий владелец, Заметки |
| EVENT | Краткое описание, Предпосылки, Ход событий, Участники, Последствия, Заметки |
| FACTION | Обзор, История, Цели и мотивация, Структура, Ключевые фигуры, Отношения, Заметки |
| WORLDBUILDING | Концепция, Правила, История, Влияние на мир, Примеры, Заметки |
| NOTE | Заметка, Связанные элементы, Идеи |

---

## ТЕСТИРОВАНИЕ

### Проверено
- [x] Клик на entity открывает в редакторе
- [x] Шаблон загружается для нового entity
- [x] Auto-save сохраняет изменения
- [x] Вкладки можно закрывать
- [x] Context menu работает (закрыть, закрыть другие)
- [x] Состояние сохраняется между сессиями

### Исправленные баги
- Конфликт имён `selectActiveTab` между UIStore и WorkspaceStore → переименовано в `selectActiveWorkspaceTab`

---

## УРОКИ

### Что работает хорошо
- Переиспользование существующего Tiptap для новых типов документов
- Zustand persist для сохранения UI состояния
- Структурированные шаблоны улучшают UX

### Что улучшить в будущем
- Проверять уникальность имён exports при создании новых stores
- Инкрементальная интеграция с проверкой компиляции

### Идеи для развития
- Кастомизируемые шаблоны
- Drag & drop для вкладок
- Split view
- Keyboard shortcuts (Cmd+1, Cmd+2)

---

## СВЯЗАННЫЕ ДОКУМЕНТЫ

| Документ | Путь |
|----------|------|
| План | `.cursor/plans/entity_as_document_system_44ce7ac6.plan.md` |
| Рефлексия | `memory-bank/reflection/reflection-STORY-002.md` |
| Tasks | `memory-bank/tasks.md` |

---

## МИГРАЦИЯ

Для применения изменений в Supabase:

```sql
-- 00004_add_entity_content.sql
ALTER TABLE entities ADD COLUMN content JSONB;
COMMENT ON COLUMN entities.content IS 'Tiptap JSON content for entity document';
```
