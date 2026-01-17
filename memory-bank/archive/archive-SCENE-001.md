# АРХИВ: SCENE-001 — Доработка блока сцены

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| Task ID | SCENE-001 |
| Название | Доработка блока сцены |
| Уровень | 2 (Basic Enhancement) |
| Дата начала | 2026-01-17 |
| Дата завершения | 2026-01-17 |
| Статус | ✅ ARCHIVED |

---

## РЕЗЮМЕ

Расширена функциональность блока сцены (Scene node) в Tiptap редакторе. Добавлены:
- Возможность удаления сцены с подтверждением
- Управление персонажами в сцене (добавление/удаление из списка entities)
- Выбор локации из базы данных с возможностью создания новой
- Метаданные сцены (цель, событие, изменение) для планирования и анализа

---

## ТРЕБОВАНИЯ

### Исходный запрос
1. Возможность удалить сцену
2. Добавление персонажей в сцену
3. Скрытые/полускрытые поля: цель сцены, событие, изменение

### Дополнительные требования (в процессе)
4. Выбор локации из базы данных (вместо текстового ввода)
5. Создание новой локации прямо из picker

---

## РЕАЛИЗАЦИЯ

### Изменённые файлы

| Файл | Тип изменения | Описание |
|------|---------------|----------|
| `src/presentation/components/editor/extensions/SceneExtension.ts` | Modified | Новые атрибуты и команды |
| `src/presentation/components/editor/extensions/SceneView.tsx` | Modified | Переработанный UI |

### Новые атрибуты сцены (SceneExtension.ts)

```typescript
interface SceneAttributes {
  // Существующие
  id: string;
  slug: string;
  location: string;
  status: SceneStatus;
  collapsed: boolean;
  
  // Новые
  locationId: string | null;  // ID локации из базы
  characters: string[];       // Массив ID персонажей
  goal: string;               // Цель сцены
  event: string;              // Ключевое событие
  change: string;             // Изменение в результате
  metaExpanded: boolean;      // Развёрнуты ли метаданные
}
```

### Новые команды (SceneExtension.ts)

- `deleteScene(id)` — удаление сцены
- `addCharacterToScene(sceneId, characterId)` — добавление персонажа
- `removeCharacterFromScene(sceneId, characterId)` — удаление персонажа

### UI компоненты (SceneView.tsx)

1. **Кнопка удаления** — с подтверждением "Удалить? Да/Нет"
2. **Character Picker** — dropdown со списком персонажей, теги выбранных
3. **Location Picker** — dropdown с локациями + создание новой
4. **Meta Section** — сворачиваемая секция с полями цель/событие/изменение

### Интеграции

- `useEntityStore` — получение персонажей и локаций
- `useProjectStore` — ID проекта для создания новых локаций
- `createEntity` — server action для создания локации

---

## ПРОБЛЕМЫ И РЕШЕНИЯ

### 1. Maximum update depth exceeded
**Причина:** Нестабильный Zustand селектор создавал новый массив на каждом рендере.

**Решение:**
```typescript
// Было (неправильно)
const allCharacters = useEntityStore(selectEntitiesByType('CHARACTER'));

// Стало (правильно)
const allEntities = useEntityStore((state) => state.entities);
const allCharacters = useMemo(
  () => allEntities.filter((e) => e.type === 'CHARACTER'),
  [allEntities]
);
```

### 2. Старые сцены ломались
**Причина:** Новые атрибуты были `undefined` в существующих данных.

**Решение:** Дефолтные значения при деструктуризации:
```typescript
const {
  characters = [],
  locationId = null,
  goal = '',
  // ...
} = node.attrs;
```

### 3. Именование
**Проблема:** "AI-поля" — некорректное название.

**Решение:** Переименовано в "Метаданные сцены".

---

## УРОКИ

1. **Zustand селекторы** — использовать стабильные inline функции, фильтрацию выносить в useMemo
2. **Tiptap атрибуты** — всегда добавлять default значения и защиту от undefined
3. **Обратная совместимость** — проверять влияние на существующие данные
4. **Именование** — называть по сути, не по будущему использованию

---

## ССЫЛКИ

| Документ | Путь |
|----------|------|
| Рефлексия | `memory-bank/reflection/reflection-SCENE-001.md` |
| SceneExtension | `src/presentation/components/editor/extensions/SceneExtension.ts` |
| SceneView | `src/presentation/components/editor/extensions/SceneView.tsx` |

---

## МЕТРИКИ

- Время реализации: ~1 сессия
- Итераций исправлений: 2
- Новый код: ~300 строк
- Изменённые файлы: 2
