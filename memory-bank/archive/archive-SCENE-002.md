# TASK ARCHIVE: SCENE-002

## METADATA

| Поле | Значение |
|------|----------|
| **Task ID** | SCENE-002 |
| **Название** | Исчезновение сцен после обновления страницы |
| **Уровень** | 2 (Bug fix) |
| **Дата начала** | 2026-01-18 |
| **Дата завершения** | 2026-01-18 |
| **Статус** | ✅ ARCHIVED |

---

## SUMMARY

Критический баг персистентности: созданные пользователем сцены в документе исчезали после обновления страницы (F5). Причиной оказалась несовместимость объектов, возвращаемых `editor.getJSON()` Tiptap, с требованиями Next.js Server Actions к сериализуемости данных.

---

## REQUIREMENTS

### Проблема
- Пользователь создаёт сцену через Cmd+Shift+S
- Видит индикатор "Сохранение..." → "Сохранено"
- После обновления страницы сцена отсутствует

### Ожидаемое поведение
- Сцены должны сохраняться в Supabase
- После обновления страницы сцены должны восстанавливаться

---

## IMPLEMENTATION

### Анализ архитектуры

```
Создание сцены (Cmd+Shift+S)
       ↓
SceneExtension.insertScene() — создаёт Tiptap node
       ↓
Editor.onUpdate() — вызывается при изменении
       ↓
WorkspacePanel.handleContentUpdate() — debounce 1сек
       ↓
updateDocumentContent() — Server Action → Supabase
       ↓
[ОШИБКА] Server Action отклоняет объект
```

### Обнаруженная проблема

```
Error: Only plain objects, and a few built-ins, can be passed to Server Actions. 
Classes or null prototypes are not supported.
```

`editor.getJSON()` возвращает объекты с null prototype, которые Next.js Server Actions не могут сериализовать.

### Решение

**Файл:** `src/presentation/components/workspace/WorkspacePanel.tsx`

```typescript
// БЫЛО (не работало)
const { success, error } = await updateDocumentContent(
  activeDocument.id,
  content  // объект с null prototype
);

// СТАЛО (работает)
const plainContent = JSON.parse(JSON.stringify(content));
const { success, error } = await updateDocumentContent(
  activeDocument.id,
  plainContent  // plain object
);
```

### Диагностика (добавлена для отладки)

| Файл | Логирование |
|------|-------------|
| `WorkspacePanel.tsx` | `[WorkspacePanel]` — контент, статус сохранения |
| `document-actions.ts` | `[updateDocumentContent]` — серверная сторона |
| `document-actions.ts` | `[getDocuments]` — загрузка из Supabase |
| `useDocumentsLoader.ts` | `[useDocumentsLoader]` — маппинг данных |
| `Editor.tsx` | `[StoryEditor]` — инициализация редактора |

---

## TESTING

### Тест-кейс
1. Открыть проект в браузере
2. Открыть DevTools → Console
3. Создать сцену (Cmd+Shift+S)
4. Дождаться "Сохранено"
5. Проверить лог `[WorkspacePanel] Save SUCCESS`
6. Обновить страницу (F5)
7. Убедиться что сцена отображается

### Результат
✅ Сцены сохраняются и восстанавливаются после обновления страницы

---

## LESSONS LEARNED

### 1. Server Actions требуют plain objects
Next.js Server Actions имеют строгие требования к сериализуемости. Всегда использовать:
```typescript
JSON.parse(JSON.stringify(data))
```

### 2. Логирование критично
Добавление console.log на каждом этапе flow позволило быстро найти ошибку.

### 3. Проверять консоль при отладке персистентности
Ошибка была видна сразу в консоли браузера.

---

## REFERENCES

| Документ | Путь |
|----------|------|
| Рефлексия | `memory-bank/reflection/reflection-SCENE-002.md` |
| Предыдущая задача | `memory-bank/archive/archive-SCENE-001.md` |

---

## ИЗМЕНЁННЫЕ ФАЙЛЫ

| Файл | Тип изменения |
|------|---------------|
| `src/presentation/components/workspace/WorkspacePanel.tsx` | Исправление + диагностика |
| `src/presentation/components/editor/Editor.tsx` | Диагностика |
| `src/presentation/hooks/useDocumentsLoader.ts` | Диагностика |
| `src/app/actions/supabase/document-actions.ts` | Диагностика + улучшение проверки |

---

## ТЕХНИЧЕСКИЙ ДОЛГ

- [ ] Убрать debug логи после стабилизации (или вынести под флаг)
- [ ] Добавить toast notification при ошибках сохранения
- [ ] Проверить аналогичную проблему в EntityEditor
