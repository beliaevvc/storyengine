# Рефлексия: NAV-002 — Автопереключение в редактор при клике на документ

**Дата**: 2026-01-22  
**Уровень**: 2 (Basic Enhancement)  
**Статус**: ✅ COMPLETE

---

## Описание задачи

При клике на документ в левой панели (FileTree) пользователь должен автоматически переключаться в режим "Редактор" из любого другого режима (Связи, Таймлайн). Дополнительно режим просмотра редактора (Синтаксис/Чистый) должен сохраняться между сессиями.

---

## Что было сделано

### 1. Перенос workspaceMode в глобальный store
- `workspaceMode` перенесён из локального state `page.tsx` в `useUIStore`
- Добавлен `persist` middleware для сохранения в localStorage
- Экспортированы `selectWorkspaceMode` и тип `WorkspaceMode`

### 2. Автопереключение режима
- В `FilesTab.handleSelectDocument` добавлен вызов `setWorkspaceMode('editor')`
- Теперь при клике на документ из режима "Связи" или "Таймлайн" автоматически переключается на "Редактор"

### 3. Сохранение viewMode редактора
- В `useEditorStore` добавлен `persist` middleware
- `viewMode` (syntax/clean) сохраняется в localStorage под ключом `storyengine-editor`
- При перезагрузке страницы режим восстанавливается

---

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `src/presentation/stores/useUIStore.ts` | +workspaceMode, +setWorkspaceMode, +persist |
| `src/presentation/stores/index.ts` | +export selectWorkspaceMode, WorkspaceMode |
| `src/presentation/stores/useEditorStore.ts` | +persist для viewMode |
| `src/presentation/components/explorer/FilesTab.tsx` | +setWorkspaceMode('editor') |
| `src/app/(dashboard)/projects/[projectId]/page.tsx` | Использует store вместо локального state |

---

## Что прошло хорошо

1. **Чистое решение** — вынос состояния в глобальный store вместо prop drilling
2. **Минимальные изменения** — всего 4 файла, ~25 строк кода
3. **Консистентность** — оба режима (workspace и viewMode) теперь используют одинаковый паттерн persist

---

## Сложности

1. **Первоначальное непонимание задачи** — сначала реализовал только сохранение viewMode, не поняв что нужно автопереключение режима workspace
2. **Дублирование типа WorkspaceMode** — тип определён в 3 местах (useUIStore, Header, WorkspacePanel), но это не критично, т.к. все определения идентичны

---

## Уроки

1. **Уточнять требования** — при неоднозначной формулировке лучше сразу уточнить у пользователя
2. **Глобальный store vs props** — когда состояние нужно менять из разных частей приложения, лучше сразу выносить в глобальный store
3. **Zustand persist** — простой и эффективный способ сохранения состояния, `partialize` позволяет выбрать только нужные поля

---

## Технические заметки

### Паттерн persist в Zustand

```typescript
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({ ... }),
      {
        name: 'storyengine-ui',
        partialize: (state) => ({
          workspaceMode: state.workspaceMode,
          // другие поля для сохранения
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
```

### Ключи localStorage

| Ключ | Содержимое |
|------|------------|
| `storyengine-ui` | workspaceMode, panelSizes, activeTab, etc. |
| `storyengine-editor` | viewMode (syntax/clean) |
| `storyengine-workspace` | openTabs, activeTabId |

---

## Следующие шаги

- Можно объединить дублирующиеся типы `WorkspaceMode` в одном месте
- Рассмотреть добавление анимации при переключении режимов
