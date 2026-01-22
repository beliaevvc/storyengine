# АРХИВ ЗАДАЧИ: FLOW-001 — Рефакторинг FlowCanvas

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| **ID задачи** | FLOW-001 |
| **Название** | Рефакторинг FlowCanvas — объединение вкладок |
| **Уровень сложности** | 3 (Intermediate Feature) |
| **Дата начала** | 2026-01-22 |
| **Дата завершения** | 2026-01-22 |
| **Статус** | ✅ ARCHIVED |

---

## КРАТКОЕ ОПИСАНИЕ

Рефакторинг системы вкладок в компоненте FlowCanvas:
- Объединение вкладок "Персонажи" и "Локации" в единую вкладку "Связи"
- Добавление панели фильтров для управления видимостью типов сущностей
- Сохранение состояния фильтров между сессиями

---

## ТРЕБОВАНИЯ

### Исходный запрос
> "вкладку персонажи надо переименовать в связи, убрать отдельную вкладку локации и добавить на вкладку связи возможность видеть все объекты (также выбор галочками)"

### Функциональные требования
1. Переименовать вкладку "Персонажи" → "Связи"
2. Удалить отдельную вкладку "Локации"
3. На вкладке "Связи" показывать все типы сущностей (персонажи, локации, предметы)
4. Добавить фильтры для выбора отображаемых типов
5. Сохранять состояние фильтров

---

## РЕАЛИЗАЦИЯ

### Изменение типа FlowMode

```typescript
// До
type FlowMode = 'plot' | 'characters' | 'locations';

// После
type FlowMode = 'plot' | 'relations';
```

### Новая функция convertToRelationsMap

Объединяет все типы сущностей в единую карту:
- Персонажи → CharacterNode
- Локации → LocationNode
- Предметы → ItemNode
- Все связи между ними → RelationEdge

### Панель фильтров

```typescript
interface Filters {
  showCharacters: boolean;
  showLocations: boolean;
  showItems: boolean;
  showRelations: boolean;
}
```

### Сохранение в localStorage

Ключ: `flowcanvas-filters-{projectId}-relations`

---

## ИЗМЕНЁННЫЕ ФАЙЛЫ

| Файл | Изменения |
|------|-----------|
| `src/presentation/components/flow/FlowCanvas.tsx` | FlowMode, convertToRelationsMap, filters panel |
| `src/presentation/components/layout/Header.tsx` | Удалена вкладка "Персонажи" |
| `src/presentation/components/workspace/WorkspacePanel.tsx` | Удалён case 'characters' |
| `src/presentation/components/flow/nodes/ItemNode.tsx` | Фильтрация служебных атрибутов |

---

## КОММИТЫ

| Hash | Сообщение |
|------|-----------|
| `44dfb91` | refactor(flow): merge Characters and Locations tabs into unified Relations tab |
| `c30512b` | feat(flow): add filters panel for entities and relations on canvas |
| `cf75f92` | fix(flow): filter out object attributes from ItemNode display |

---

## ТЕСТИРОВАНИЕ

### Ручная проверка
- [x] Вкладка "Связи" отображает все типы сущностей
- [x] Фильтры работают корректно
- [x] Состояние фильтров сохраняется после перезагрузки
- [x] Линии связей отображаются между узлами

---

## УРОКИ

1. **Глобальный поиск при изменении union types** — TypeScript не всегда показывает все места использования
2. **Служебные атрибуты** — нужно фильтровать `owner`, `location`, `quantity` при отображении предметов
3. **localStorage ключи** — включать projectId и mode для изоляции

---

## ССЫЛКИ

- Рефлексия: `memory-bank/reflection/reflection-FLOW-001.md`
- Связанные задачи: FLOW-002, NAV-001
