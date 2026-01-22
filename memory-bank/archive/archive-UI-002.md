# АРХИВ ЗАДАЧИ: UI-002 — Улучшения UX интерфейса

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| Task ID | UI-002 |
| Дата | 2026-01-22 |
| Уровень | 2 (Multiple UI Enhancements) |
| Статус | ✅ ARCHIVED |
| Reflection | `reflection/reflection-UI-002.md` |

---

## РЕЗЮМЕ

Серия UI/UX улучшений, направленных на повышение удобства работы с приложением:
- Компактный фильтр типов сущностей
- Улучшенная работа с вкладками документов
- Переименование проектов
- Цветовая индикация семантических блоков

---

## ТРЕБОВАНИЯ

1. Сделать фильтр сущностей компактнее (был громоздкий grid)
2. Переместить кнопки режимов ("Синтаксис"/"Чистый") ближе к контенту
3. Убрать неиспользуемую кнопку "AI Scan"
4. Синхронизировать название вкладки при переименовании документа
5. Добавить переименование по двойному клику на вкладку
6. Показывать пустое состояние при закрытии всех вкладок
7. Добавить возможность переименовать проект на главной странице
8. Исправить обрезание контекстного меню проекта
9. Не считать папки в счётчике документов
10. Добавить цветовое выделение семантических блоков по типу

---

## РЕАЛИЗАЦИЯ

### 1. Фильтр типов сущностей (`EntityTypeFilter.tsx`)

**Было**: 2-колоночный grid с иконками, метками и счётчиками  
**Стало**: Горизонтальная строка иконок с бейджами

```tsx
// Компактная строка вместо grid
<div className="flex items-center gap-1 px-2 py-1.5 border-b overflow-x-auto">
  <button>Все</button>
  {allTypes.map((type) => (
    <button className="w-7 h-7 rounded-md">
      <DynamicIcon name={iconName} />
      {count > 0 && <span className="badge">{count}</span>}
    </button>
  ))}
</div>
```

### 2. Тулбар редактора (`Toolbar.tsx`)

- Убрана кнопка "AI Scan" и связанный код
- Кнопки undo/redo — слева
- Переключатель режимов — внутри `max-w-5xl` контейнера для выравнивания со сценами

### 3. Вкладки документов (`DocumentTabs.tsx`)

**Новые возможности**:
- Двойной клик → inline редактирование названия
- `handleRename` — сохраняет в БД и синхронизирует с store
- Улучшена кнопка закрытия (stopPropagation на всех уровнях)

**Синхронизация** (`FileTree.tsx`):
```tsx
const handleRename = (docId: string, newTitle: string) => {
  await updateDocument(docId, { title: newTitle });
  updateDoc(docId, { title: newTitle });
  updateTabTitle(docId, newTitle); // Sync with tabs
};
```

### 4. Пустое состояние (`WorkspacePanel.tsx`)

Убран автооткрывающий useEffect, добавлено пустое состояние:
```tsx
if (openTabs.length === 0) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-6xl">✨</div>
      <h2>Откройте документ и творите!</h2>
    </div>
  );
}
```

### 5. Страница проектов (`ProjectsList.tsx`)

**Новые возможности**:
- Inline переименование проекта
- Fixed позиционирование контекстного меню
- "Редактировать" → "Настройки"

```tsx
const handleOpenMenu = (e, projectId) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setMenuPosition({ x: rect.right - 160, y: rect.bottom + 4 });
  setOpenMenu(projectId);
};
```

### 6. Счётчик документов (`project-actions.ts`)

```tsx
documentsTable
  .select('id', { count: 'exact', head: true })
  .eq('project_id', project.id)
  .neq('type', 'FOLDER') // Не считать папки
```

### 7. Семантические блоки (`SemanticBlockView.tsx`)

Цветные полоски слева по типу:
```tsx
const BLOCK_TYPE_CONFIG = {
  dialogue:    { borderColor: '#58a6ff' }, // синий
  description: { borderColor: '#3fb950' }, // зелёный
  action:      { borderColor: '#d29922' }, // оранжевый
  thought:     { borderColor: '#a371f7' }, // фиолетовый
};

<NodeViewWrapper
  style={{
    borderLeftWidth: isTyped ? '3px' : '1px',
    borderLeftColor: accentColor,
  }}
/>
```

---

## ИЗМЕНЁННЫЕ ФАЙЛЫ

```
src/presentation/components/explorer/EntityTypeFilter.tsx
src/presentation/components/explorer/EntityListItem.tsx
src/presentation/components/explorer/DatabaseTab.tsx
src/presentation/components/explorer/FileTree.tsx
src/presentation/components/workspace/DocumentTabs.tsx
src/presentation/components/workspace/WorkspacePanel.tsx
src/presentation/components/projects/ProjectsList.tsx
src/presentation/components/editor/Toolbar.tsx
src/presentation/components/editor/extensions/SemanticBlockView.tsx
src/app/actions/supabase/project-actions.ts
```

---

## ТЕСТИРОВАНИЕ

| Функция | Проверка | Статус |
|---------|----------|--------|
| Фильтр сущностей | Иконки в строку, бейджи с числами | ✅ |
| Тулбар | Режимы выровнены по сценам | ✅ |
| Переименование слева | Название во вкладке обновляется | ✅ |
| Двойной клик на вкладку | Inline редактирование | ✅ |
| Закрытие всех вкладок | Пустое состояние | ✅ |
| Переименование проекта | Работает из меню | ✅ |
| Контекстное меню | Не обрезается | ✅ |
| Счётчик документов | Папки не считаются | ✅ |
| Цветные блоки | Полоски по типу | ✅ |

---

## УРОКИ

1. **Простота важнее функциональности** — компактный фильтр удобнее развёрнутого
2. **Fixed позиционирование для меню** — не зависит от overflow контейнера
3. **Синхронизация состояния** — обновлять все связанные места (store, tab, sidebar)
4. **Цвет без перегрузки** — тонкая полоска слева достаточна для индикации типа

---

## КОММИТЫ

```
dbf3644 refactor: make entity type filter more compact - single row of icons
4117477 refactor: remove AI Scan button, move mode toggle left
683fb6a style: align toolbar buttons with editor content (max-w-5xl)
dcf4dc3 style: keep undo/redo left, align mode toggle with scene content
c2e1999 feat: sync tab names with file tree, add double-click rename on tabs
e6bf62d fix: improve tab close button click handling
bdb0776 fix: allow closing all tabs to show empty state
fee4bc5 feat: add rename project, fix menu position, rename Edit to Settings
d0b9655 fix: use fixed positioning for project context menu
6d7679b fix: exclude folders from documents count
e17dbb8 style: add colored left border to semantic blocks by type
```

---

## СВЯЗАННЫЕ ДОКУМЕНТЫ

- Reflection: `memory-bank/reflection/reflection-UI-002.md`
