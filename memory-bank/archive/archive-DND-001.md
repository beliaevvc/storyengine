# АРХИВ ЗАДАЧИ: DND-001 — Drag & Drop файлов в sidebar

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| **Task ID** | DND-001 |
| **Название** | Исправление Drag & Drop файлов в sidebar |
| **Уровень** | 2 (Bug fix + Enhancement) |
| **Дата начала** | 2026-01-18 |
| **Дата завершения** | 2026-01-18 |
| **Статус** | ✅ ARCHIVED |

---

## КРАТКОЕ ОПИСАНИЕ

Исправлена проблема, при которой файлы (документы) в левой панели File Explorer не перемещались через drag & drop, хотя папки работали корректно. Дополнительно реализована возможность изменения порядка документов внутри папки и улучшены стили UI.

---

## ТРЕБОВАНИЯ

### Исходная проблема
- Файлы в sidebar не перемещались при drag & drop
- Папки перемещались корректно
- Ожидалось: документы должны перемещаться между папками и менять порядок внутри папки

### Дополнительные улучшения (выявлены в процессе)
- Reorder документов внутри одной папки
- Улучшение стилей input при переименовании

---

## РЕАЛИЗАЦИЯ

### 1. Исправление перемещения между папками

**Файл:** `src/presentation/components/explorer/FileTree.tsx`

**Проблема:** Условие `!newParentId || newParentId === currentParentId` блокировало перемещение когда target находился в корне (parentId = null).

**Решение:**
```typescript
// Было:
if (!newParentId || newParentId === currentParentId) {
  return;
}

// Стало:
if (newParentId === currentParentId && !targetIsFolder) {
  // Reorder logic...
}
```

### 2. Reorder документов внутри папки

**Проблема:** При попытке использовать дробные значения order (0.5, 1.5) ничего не происходило — поле `order` в Prisma/PostgreSQL имеет тип `Int`.

**Решение:** Полный пересчёт order для всех siblings:
```typescript
// 1. Находим индексы
const targetIndex = siblings.findIndex(d => d.id === targetId);
const dragIndex = siblings.findIndex(d => d.id === dragId);

// 2. Переставляем в массиве
const [draggedItem] = siblings.splice(dragIndex, 1);
siblings.splice(insertIndex, 0, draggedItem);

// 3. Обновляем order для всех (0, 1, 2, ...)
for (let i = 0; i < siblings.length; i++) {
  if (doc.order !== i) {
    await supabase.from('documents').update({ order: i }).eq('id', doc.id);
    updateDoc(doc.id, { order: i });
  }
}
```

### 3. Улучшение стилей input

**Файл:** `src/presentation/components/explorer/FileTreeItem.tsx`

**Было:**
```tsx
className="flex-1 text-sm bg-input border border-accent rounded px-1 py-0 outline-none"
```

**Стало:**
```tsx
className="flex-1 min-w-0 text-sm bg-overlay text-fg border border-border-muted rounded px-1.5 py-0.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
```

---

## ТЕСТИРОВАНИЕ

### Ручное тестирование
- [x] Перетаскивание документа в папку
- [x] Перетаскивание документа из папки в корень
- [x] Перетаскивание документа между папками
- [x] Изменение порядка документов внутри папки
- [x] Переименование папки/документа — стили input

---

## УРОКИ

1. **Проверять типы данных в БД** — дробные значения для Int округляются
2. **Использовать токены дизайн-системы** — смотреть в `tailwind.config.ts`, не изобретать цвета
3. **Логирование помогает** — console.log на каждом шаге выявляет где код не работает
4. **Итеративный подход** — исправлять по одной проблеме, тестировать, двигаться дальше

---

## РЕКОМЕНДАЦИИ

| Улучшение | Описание |
|-----------|----------|
| Batch updates | При reorder обновлять все siblings одним запросом |
| Optimistic UI | Показывать результат сразу, откатывать при ошибке |
| Нормализация order | Периодически пересчитывать order чтобы избежать дыр |

---

## ИЗМЕНЁННЫЕ ФАЙЛЫ

| Файл | Изменения |
|------|-----------|
| `src/presentation/components/explorer/FileTree.tsx` | Логика handleDrop, reorder документов |
| `src/presentation/components/explorer/FileTreeItem.tsx` | Стили input переименования |

---

## ССЫЛКИ

- **Рефлексия:** `reflection/reflection-DND-001.md`
