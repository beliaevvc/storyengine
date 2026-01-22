# Рефлексия: NAV-001 — Навигация и сохранение состояния

**Дата:** 2026-01-22  
**Уровень сложности:** 2 (Basic Enhancement)  
**Статус:** ✅ COMPLETE

---

## Описание задачи

Исправление навигации "Назад" при возврате со страницы профиля сущности:
1. Двойной клик на узле → открытие профиля сущности
2. Кнопка "Назад" → возврат на ту же вкладку (Сюжет/Связи), откуда перешли
3. Сохранение активного режима workspace между переходами

---

## Проблема

При переходе на страницу профиля сущности и нажатии "Назад":
- Пользователь всегда возвращался на вкладку "Редактор"
- Режим "Сюжет" или "Связи" терялся

**Причина:** `useState<WorkspaceMode>('editor')` — состояние инициализировалось в `'editor'` при каждом монтировании компонента.

---

## Итеративное решение

### Попытка 1: `router.back()`
```typescript
// EntityPassport.tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
<Button onClick={() => router.back()}>Назад</Button>
```
**Результат:** ❌ Не работает — режим всё равно сбрасывался.

### Попытка 2: `window.history.back()`
```typescript
const handleBack = useCallback(() => {
  window.history.back();
}, []);
```
**Результат:** ❌ Не работает — та же проблема.

### Попытка 3: localStorage для activeMode ✅
```typescript
// page.tsx (ProjectPage)

const getStorageKey = (projectId: string) => `workspace-mode-${projectId}`;

const getInitialMode = (projectId: string): WorkspaceMode => {
  if (typeof window === 'undefined') return 'editor';
  const stored = localStorage.getItem(getStorageKey(projectId));
  if (stored === 'plot' || stored === 'timeline' || stored === 'editor') {
    return stored;
  }
  return 'editor';
};

// Инициализация из localStorage
const [activeMode, setActiveMode] = useState<WorkspaceMode>(() => 
  getInitialMode(params.projectId)
);

// Сохранение при изменении
useEffect(() => {
  localStorage.setItem(getStorageKey(params.projectId), activeMode);
}, [activeMode, params.projectId]);
```
**Результат:** ✅ Работает!

---

## Коммиты

| Hash | Описание |
|------|----------|
| `accde10` | feat(flow): open entity page on double-click |
| `0c6b425` | fix(entity): use router.back() for back navigation |
| `183a784` | fix(entity): use window.history.back() for reliable navigation |
| `1ce6982` | fix(navigation): persist workspace mode in localStorage |

---

## Что получилось хорошо

### ✅ Простое решение
- localStorage надёжен и не требует сложной инфраструктуры
- Lazy initializer в useState избегает SSR проблем

### ✅ Изоляция по проектам
- Ключ `workspace-mode-{projectId}` — разные проекты независимы
- Пользователь может работать с несколькими проектами

### ✅ Минимальные изменения
- Изменён только один файл (`page.tsx`)
- Не затронуты другие компоненты

---

## Уроки и выводы

### 📚 Урок 1: Router vs History vs State
| Подход | Что делает | Когда использовать |
|--------|------------|-------------------|
| `router.back()` | Навигация по истории Next.js | Single page navigation |
| `window.history.back()` | Навигация по истории браузера | Когда нужен "настоящий" back |
| `localStorage` + state | Персистентное состояние | Когда state должен пережить remount |

**Вывод:** Для сохранения UI state между страницами — localStorage, не router.

### 📚 Урок 2: Lazy initializer в useState
```typescript
// ❌ Плохо — вызывается при каждом рендере
const [mode, setMode] = useState(getFromStorage());

// ✅ Хорошо — вызывается только при первом рендере
const [mode, setMode] = useState(() => getFromStorage());
```

### 📚 Урок 3: SSR-safe localStorage
```typescript
const getInitialMode = () => {
  // Проверка на SSR
  if (typeof window === 'undefined') return 'editor';
  return localStorage.getItem('key') ?? 'editor';
};
```

---

## Альтернативные подходы (не реализованы)

### 1. URL Query Parameters
```
/projects/[projectId]?mode=plot
```
**Плюсы:** Shareable URLs  
**Минусы:** Нужно обновлять все Link-компоненты

### 2. Zustand с persist
```typescript
const useWorkspaceStore = create(
  persist(
    (set) => ({ activeMode: 'editor' }),
    { name: 'workspace-storage' }
  )
);
```
**Плюсы:** Единый store  
**Минусы:** Overkill для одного значения

### 3. Context API
```typescript
<WorkspaceModeContext.Provider value={{ mode, setMode }}>
```
**Плюсы:** React-native решение  
**Минусы:** Не переживёт remount без localStorage

---

## Технические детали

### Ключ localStorage
```typescript
`workspace-mode-${projectId}`
// Пример: workspace-mode-13b54d6d-56dc-4785-a3d5-cbe2aef9559d
```

### Валидация значения
```typescript
if (stored === 'plot' || stored === 'timeline' || stored === 'editor') {
  return stored;
}
return 'editor'; // fallback
```

---

## Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `src/app/(dashboard)/projects/[projectId]/page.tsx` | localStorage для activeMode |
| `src/presentation/components/entity-profile/EntityPassport.tsx` | window.history.back() |
| `src/presentation/components/flow/FlowCanvas.tsx` | onNodeDoubleClick |

---

## Метрики

| Метрика | Значение |
|---------|----------|
| Коммитов | 4 |
| Итераций решения | 3 |
| Файлов изменено | 3 |
| Строк добавлено | ~25 |

---

## Паттерн для будущего использования

```typescript
// Шаблон: Персистентный useState с localStorage

const STORAGE_KEY = 'my-feature-state';

const getInitialState = (): MyState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as MyState;
    } catch {
      return DEFAULT_STATE;
    }
  }
  return DEFAULT_STATE;
};

// В компоненте
const [state, setState] = useState<MyState>(() => getInitialState());

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}, [state]);
```

---

## Связанные документы

- Рефлексия: `reflection-FLOW-001.md` — Рефакторинг FlowCanvas
- Рефлексия: `reflection-FLOW-002.md` — Интерактивная работа со связями
