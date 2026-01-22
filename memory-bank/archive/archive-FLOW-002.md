# АРХИВ ЗАДАЧИ: FLOW-002 — Интерактивная работа со связями

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| **ID задачи** | FLOW-002 |
| **Название** | Интерактивная работа со связями |
| **Уровень сложности** | 3 (Intermediate Feature) |
| **Дата начала** | 2026-01-22 |
| **Дата завершения** | 2026-01-22 |
| **Статус** | ✅ ARCHIVED |

---

## КРАТКОЕ ОПИСАНИЕ

Реализация интерактивного управления связями на FlowCanvas:
- Создание связей через drag & drop линий между узлами
- Контекстное меню при клике на связь
- Модальные окна для выбора и редактирования типа связи
- Удаление связей с bidirectional обновлением

---

## ТРЕБОВАНИЯ

### Исходный запрос
> "у нас там есть возможность тянуть линии от блока к блоку — и таким образом мы должны устанавливать связь... тянем нить от одного к другому — присоединяем и появляется окно установки связи"

### Функциональные требования
1. При соединении двух узлов линией — открывать модальное окно выбора типа связи
2. Если подходящего типа нет — предложить создать новый
3. По клику на связь — показать контекстное меню (Изменить / Удалить)
4. Удаление связи должно обновлять обе сущности (bidirectional)

---

## РЕАЛИЗАЦИЯ

### ConnectionModal

Модальное окно для создания новой связи:
- Загружает доступные типы связей через `getRelationshipTypesAction`
- Фильтрует по совместимости source_type → target_type
- Создаёт связь через `updateEntityRelationships`

### EditConnectionModal

Модальное окно для редактирования существующей связи:
- Предвыбран текущий тип связи
- Позволяет изменить на другой совместимый тип

### Контекстное меню

```typescript
interface SelectedEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  x: number;  // clientX from click event
  y: number;  // clientY from click event
}
```

### Исправление позиционирования

```typescript
// Проблема: absolute позиционирование относительно ReactFlow viewport
// Решение: fixed позиционирование с clientX/clientY
className="fixed"
style={{ 
  left: selectedEdge.x, 
  top: selectedEdge.y,
  transform: 'translate(-50%, -100%)'
}}
```

---

## НОВЫЕ ФАЙЛЫ

| Файл | Описание |
|------|----------|
| `src/presentation/components/flow/ConnectionModal.tsx` | Модальное окно создания связи |
| `src/presentation/components/flow/EditConnectionModal.tsx` | Модальное окно редактирования связи |

---

## ИЗМЕНЁННЫЕ ФАЙЛЫ

| Файл | Изменения |
|------|-----------|
| `src/presentation/components/flow/FlowCanvas.tsx` | onConnect, onEdgeClick, context menu, modals |
| `src/presentation/components/flow/index.ts` | Экспорт новых компонентов |
| `src/presentation/components/workspace/WorkspacePanel.tsx` | onEntitiesUpdated callback |

---

## КОММИТЫ

| Hash | Сообщение |
|------|-----------|
| `8e3d91d` | feat(flow): add connection modal for creating relations by dragging edges |
| `47c0d6f` | feat(flow): add ability to delete relations by clicking on edges |
| `4562e0f` | feat(flow): improve edge interaction with context menu |
| `3186b01` | fix(flow): correct edge context menu positioning |

---

## ТЕСТИРОВАНИЕ

### Ручная проверка
- [x] Drag & drop между узлами открывает ConnectionModal
- [x] Выбор типа связи создаёт связь
- [x] Клик на линию связи показывает контекстное меню
- [x] "Изменить" открывает EditConnectionModal
- [x] "Удалить" удаляет связь с обеих сторон
- [x] Canvas обновляется после изменений

---

## УРОКИ

1. **position: fixed vs absolute** — для элементов поверх ReactFlow использовать fixed с clientX/clientY
2. **Bidirectional relationships** — `updateEntityRelationships` уже реализует обновление обеих сторон
3. **onEntitiesUpdated callback** — для обновления данных после изменений

---

## ИЗВЕСТНЫЕ ОГРАНИЧЕНИЯ

- Нет undo для удалённых связей
- Нет batch операций (удаление нескольких связей)
- Нет валидации циклических связей

---

## ССЫЛКИ

- Рефлексия: `memory-bank/reflection/reflection-FLOW-002.md`
- Связанные задачи: FLOW-001, NAV-001
