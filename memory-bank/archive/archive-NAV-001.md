# АРХИВ ЗАДАЧИ: NAV-001 — Навигация и сохранение состояния

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| **ID задачи** | NAV-001 |
| **Название** | Навигация и сохранение состояния workspace |
| **Уровень сложности** | 2 (Basic Enhancement) |
| **Дата начала** | 2026-01-22 |
| **Дата завершения** | 2026-01-22 |
| **Статус** | ✅ ARCHIVED |

---

## КРАТКОЕ ОПИСАНИЕ

Исправление навигации "Назад" при возврате со страницы профиля сущности:
- Двойной клик на узле FlowCanvas открывает профиль сущности
- Кнопка "Назад" возвращает на ту же вкладку, откуда перешли
- Активный режим workspace сохраняется в localStorage

---

## ТРЕБОВАНИЯ

### Исходный запрос
> "если мы перешли в карточку сущности из раздела сюжет — то по кнопке назад в том случае должны туда же возвращаться"

### Функциональные требования
1. Двойной клик на узле → переход на страницу профиля сущности
2. Удалить кнопку "Персонажи" из Header (функционал перенесён в FlowCanvas)
3. При возврате на страницу проекта — восстановить активный режим (Сюжет/Связи)

---

## РЕАЛИЗАЦИЯ

### Проблема

При переходе на страницу профиля и возврате:
```typescript
// page.tsx — всегда инициализировалось в 'editor'
const [activeMode, setActiveMode] = useState<WorkspaceMode>('editor');
```

### Итеративное решение

**Попытка 1:** `router.back()` — не работает (remount сбрасывает state)

**Попытка 2:** `window.history.back()` — не работает (та же проблема)

**Попытка 3:** localStorage ✅

```typescript
const getStorageKey = (projectId: string) => `workspace-mode-${projectId}`;

const getInitialMode = (projectId: string): WorkspaceMode => {
  if (typeof window === 'undefined') return 'editor';
  const stored = localStorage.getItem(getStorageKey(projectId));
  if (stored === 'plot' || stored === 'timeline' || stored === 'editor') {
    return stored;
  }
  return 'editor';
};

// Lazy initializer
const [activeMode, setActiveMode] = useState<WorkspaceMode>(() => 
  getInitialMode(params.projectId)
);

// Persist on change
useEffect(() => {
  localStorage.setItem(getStorageKey(params.projectId), activeMode);
}, [activeMode, params.projectId]);
```

---

## ИЗМЕНЁННЫЕ ФАЙЛЫ

| Файл | Изменения |
|------|-----------|
| `src/app/(dashboard)/projects/[projectId]/page.tsx` | localStorage для activeMode |
| `src/presentation/components/entity-profile/EntityPassport.tsx` | window.history.back() |
| `src/presentation/components/layout/Header.tsx` | Удалена вкладка "Персонажи" |
| `src/presentation/components/flow/FlowCanvas.tsx` | onNodeDoubleClick |

---

## КОММИТЫ

| Hash | Сообщение |
|------|-----------|
| `accde10` | feat(flow): open entity page on double-click |
| `f4820c1` | refactor: remove Characters tab from top navigation |
| `0c6b425` | fix(entity): use router.back() for back navigation |
| `183a784` | fix(entity): use window.history.back() for reliable navigation |
| `1ce6982` | fix(navigation): persist workspace mode in localStorage |

---

## ТЕСТИРОВАНИЕ

### Ручная проверка
- [x] Двойной клик на узле открывает профиль сущности
- [x] Кнопка "Назад" возвращает на страницу проекта
- [x] Активный режим (Сюжет) сохраняется после возврата
- [x] Разные проекты имеют независимые режимы

---

## УРОКИ

### Паттерн: Персистентный useState

```typescript
// SSR-safe инициализация
const getInitial = () => {
  if (typeof window === 'undefined') return DEFAULT;
  return localStorage.getItem(KEY) ?? DEFAULT;
};

// Lazy initializer (вызывается только один раз)
const [state, setState] = useState(() => getInitial());

// Persist on change
useEffect(() => {
  localStorage.setItem(KEY, state);
}, [state]);
```

### Router vs History vs localStorage

| Подход | Когда использовать |
|--------|-------------------|
| `router.back()` | SPA навигация без сохранения state |
| `window.history.back()` | Настоящий browser back |
| `localStorage` | Когда state должен пережить remount |

---

## ССЫЛКИ

- Рефлексия: `memory-bank/reflection/reflection-NAV-001.md`
- Связанные задачи: FLOW-001, FLOW-002
