# АРХИВ: NAV-002 — Автопереключение в редактор при клике на документ

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| **Task ID** | NAV-002 |
| **Дата начала** | 2026-01-22 |
| **Дата завершения** | 2026-01-22 |
| **Уровень сложности** | 2 (Basic Enhancement) |
| **Статус** | ✅ ARCHIVED |

---

## КРАТКОЕ ОПИСАНИЕ

Реализовано автоматическое переключение workspace в режим "Редактор" при клике на документ в левой панели из любого режима (Связи, Таймлайн). Дополнительно добавлено сохранение режима просмотра редактора (Синтаксис/Чистый) в localStorage.

---

## ТРЕБОВАНИЯ

### Исходная проблема
- При клике на документ в режиме "Связи" или "Таймлайн" редактор не открывался
- Пользователю приходилось вручную переключать режим
- Режим просмотра (syntax/clean) сбрасывался при перезагрузке

### Ожидаемое поведение
1. Клик на документ → автопереключение в режим "Редактор"
2. Режим просмотра сохраняется между сессиями
3. Режим workspace сохраняется в localStorage

---

## РЕАЛИЗАЦИЯ

### Архитектурное решение
Вынос `workspaceMode` из локального state компонента в глобальный Zustand store с persist middleware.

### Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `src/presentation/stores/useUIStore.ts` | +`workspaceMode`, +`setWorkspaceMode`, +persist |
| `src/presentation/stores/useEditorStore.ts` | +persist для `viewMode` |
| `src/presentation/stores/index.ts` | +export `selectWorkspaceMode`, `WorkspaceMode` |
| `src/presentation/components/explorer/FilesTab.tsx` | +`setWorkspaceMode('editor')` в `handleSelectDocument` |
| `src/app/(dashboard)/projects/[projectId]/page.tsx` | Использует store вместо локального state |

### Ключевые изменения кода

#### useUIStore.ts
```typescript
export type WorkspaceMode = 'editor' | 'plot' | 'timeline';

interface UIState {
  // ...
  workspaceMode: WorkspaceMode;
  actions: {
    setWorkspaceMode: (mode: WorkspaceMode) => void;
    // ...
  };
}

// persist middleware с partialize
partialize: (state) => ({
  workspaceMode: state.workspaceMode,
  // ...
}),
```

#### FilesTab.tsx
```typescript
const setWorkspaceMode = useUIStore((s) => s.actions.setWorkspaceMode);

const handleSelectDocument = useCallback((docId: string, title?: string) => {
  // ... открытие документа
  setWorkspaceMode('editor'); // Автопереключение
}, [setCurrentDocument, openTab, documents, setWorkspaceMode]);
```

#### useEditorStore.ts
```typescript
export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set) => ({ ... }),
      {
        name: 'storyengine-editor',
        partialize: (state) => ({
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: 'EditorStore' }
  )
);
```

---

## ТЕСТИРОВАНИЕ

### Ручное тестирование
1. ✅ Открыть режим "Связи" → кликнуть на документ → переключается в "Редактор"
2. ✅ Открыть режим "Таймлайн" → кликнуть на документ → переключается в "Редактор"
3. ✅ Переключить viewMode на "Чистый" → перезагрузить → режим сохранён
4. ✅ TypeScript компиляция без ошибок
5. ✅ Нет ошибок линтера

---

## УРОКИ

1. **Глобальный store vs props** — когда состояние нужно менять из разных частей приложения, лучше сразу выносить в глобальный store
2. **Zustand persist + partialize** — эффективный паттерн для выборочного сохранения состояния
3. **Уточнение требований** — при неоднозначной формулировке лучше сразу уточнить

---

## ССЫЛКИ

| Документ | Путь |
|----------|------|
| Рефлексия | `memory-bank/reflection/reflection-NAV-002.md` |
| Связанная задача | NAV-001 (Навигация и сохранение состояния) |

---

## КОММИТЫ

```
077c9db feat(editor): persist viewMode (syntax/clean) in localStorage
2549c8c feat(workspace): auto-switch to editor mode when clicking document
```
