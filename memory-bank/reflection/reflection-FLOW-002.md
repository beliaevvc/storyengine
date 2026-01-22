# Рефлексия: FLOW-002 — Интерактивная работа со связями

**Дата:** 2026-01-22  
**Уровень сложности:** 3 (Intermediate Feature)  
**Статус:** ✅ COMPLETE

---

## Описание задачи

Реализация интерактивного управления связями на FlowCanvas:
1. Создание связей через drag & drop линий между узлами
2. Контекстное меню при клике на связь (Редактировать / Удалить)
3. Модальные окна для выбора типа связи

---

## Что было сделано

### 1. ConnectionModal — создание связей

**Функциональность:**
- Открывается при соединении двух узлов линией
- Показывает доступные типы связей для выбранной пары сущностей
- Фильтрует типы по совместимости (source_type → target_type)
- Позволяет создать новый тип связи, если подходящего нет

**Техническая реализация:**
```typescript
interface PendingConnection {
  source: string;  // entityId
  target: string;  // entityId
}

const onConnect = useCallback((connection: Connection) => {
  if (mode === 'relations') {
    setPendingConnection({
      source: connection.source!,
      target: connection.target!,
    });
  }
}, [mode]);
```

### 2. EditConnectionModal — редактирование связей

**Функциональность:**
- Открывается через контекстное меню → "Редактировать"
- Предвыбран текущий тип связи
- Позволяет изменить тип на другой совместимый

### 3. Контекстное меню связей

**Функциональность:**
- Появляется при клике на линию связи
- Два пункта: "Изменить" и "Удалить"
- Позиционируется точно под курсором

**Исправление позиционирования:**
```typescript
// До — некорректная позиция
className="absolute"
style={{ left: selectedEdge.x, top: selectedEdge.y }}

// После — точная позиция под курсором
className="fixed"
style={{ 
  left: selectedEdge.x, 
  top: selectedEdge.y,
  transform: 'translate(-50%, -100%)'
}}
```

### 4. Удаление связей

**Техническая реализация:**
- Вызов `updateEntityRelationships` для обеих сторон связи
- Удаление из `attributes.relationships` у source
- Удаление обратной записи у target (bidirectional)

---

## Коммиты

| Hash | Описание |
|------|----------|
| `8e3d91d` | feat(flow): add connection modal for creating relations by dragging edges |
| `47c0d6f` | feat(flow): add ability to delete relations by clicking on edges |
| `4562e0f` | feat(flow): improve edge interaction with context menu |
| `3186b01` | fix(flow): correct edge context menu positioning |

---

## Что получилось хорошо

### ✅ Интуитивный UX
- Drag & drop для создания связей — стандартный паттерн для графовых редакторов
- Контекстное меню — ожидаемое поведение при работе с элементами

### ✅ Переиспользование серверных действий
- `updateEntityRelationships` уже поддерживал bidirectional обновления
- Не потребовалось создавать новые server actions

### ✅ Обновление данных в реальном времени
- После создания/удаления связи → `onEntitiesUpdated()` → `loadEntities()`
- Canvas автоматически перерисовывается с новыми данными

---

## Сложности и решения

### ⚠️ Позиционирование контекстного меню
**Проблема:** Меню появлялось "где-то сбоку", а не над линией связи.

**Причина:** Использование `position: absolute` с координатами относительно ReactFlow viewport, а не экрана.

**Решение:** 
```typescript
// Сохраняем clientX/clientY из события клика
onEdgeClick={(event, edge) => {
  setSelectedEdge({
    ...edge,
    x: event.clientX,
    y: event.clientY,
  });
}}

// Используем position: fixed с этими координатами
```

### ⚠️ Фильтрация типов связей
**Проблема:** Показывались все типы связей, даже несовместимые с выбранными сущностями.

**Решение:** Фильтрация в модальном окне по `source_type` и `target_type`:
```typescript
const compatibleTypes = relationshipTypes.filter(type => {
  const sourceMatch = type.source_type === sourceEntity.type || type.source_type === 'any';
  const targetMatch = type.target_type === targetEntity.type || type.target_type === 'any';
  return sourceMatch && targetMatch;
});
```

### ⚠️ Bidirectional удаление
**Проблема:** При удалении связи нужно обновить обе сущности.

**Решение:** `updateEntityRelationships` уже реализует это:
1. Обновляет `relationships` у source entity
2. Находит target entity и обновляет обратную связь
3. Использует транзакцию для атомарности

---

## Новые компоненты

### ConnectionModal
```
src/presentation/components/flow/ConnectionModal.tsx
```
- Props: `sourceEntity`, `targetEntity`, `projectId`, `onConnectionCreated`, `onClose`
- Загружает типы связей через `getRelationshipTypesAction`
- Создаёт связь через `updateEntityRelationships`

### EditConnectionModal
```
src/presentation/components/flow/EditConnectionModal.tsx
```
- Props: аналогичные + `existingRelationType`
- Позволяет изменить тип связи

---

## Архитектурные решения

### Почему модальные окна, а не inline редактирование?
1. **Список типов может быть длинным** — модальное окно даёт больше места
2. **Возможность создать новый тип** — требует форму с несколькими полями
3. **Consistency** — такой же паттерн используется в панели сущностей

### Почему контекстное меню, а не immediate delete?
1. **Защита от случайного удаления** — клик легко сделать случайно
2. **Возможность редактирования** — меню позволяет добавить другие действия
3. **Ожидаемый UX** — пользователи ожидают меню при клике на элемент

---

## Метрики

| Метрика | Значение |
|---------|----------|
| Коммитов | 4 |
| Новых файлов | 2 (ConnectionModal, EditConnectionModal) |
| Файлов изменено | 3 |
| Строк добавлено | ~400 |

---

## Известные ограничения

1. **Нет undo** — удалённую связь можно только создать заново
2. **Нет batch operations** — нельзя удалить несколько связей разом
3. **Нет валидации циклов** — можно создать A→B→A

---

## Следующие шаги

- [ ] Добавить подтверждение перед удалением связи
- [ ] Показывать тип связи на линии (label)
- [ ] Анимация при создании/удалении связи

---

## Связанные документы

- Рефлексия: `reflection-FLOW-001.md` — Рефакторинг FlowCanvas
- Рефлексия: `reflection-NAV-001.md` — Навигация и сохранение состояния
