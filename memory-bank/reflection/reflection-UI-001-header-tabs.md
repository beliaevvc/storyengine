# Рефлексия: UI-001 — Перенос табов в хедер

**Task ID**: UI-001
**Дата**: 2026-01-17
**Уровень**: 2 (Basic Enhancement)
**Статус**: ✅ Завершено

---

## Краткое описание

Перенос навигационных табов (Редактор, Сюжет, Персонажи, Таймлайн) из WorkspacePanel в центр хедера, удаление breadcrumbs и исправление визуальных артефактов.

---

## Что было сделано

### 1. Перенос табов в хедер
- **Header.tsx**: Добавлены MODE_TABS с иконками и стилизацией
- **AppLayout.tsx**: Добавлены props `activeMode` и `onModeChange` для передачи в Header
- **WorkspacePanel.tsx**: Убран Mode Tab Bar, теперь принимает `activeMode` как prop
- **page.tsx**: Добавлен useState для управления режимом workspace

### 2. Удаление breadcrumbs
- **Editor.tsx**: Убран компонент `<Breadcrumbs />` из рендера
- **Editor.tsx**: Удалены неиспользуемые props `projectName` и `documentName`

### 3. Исправление визуальных артефактов
- **DocumentTabs.tsx**: Убран `border-b` из spacer'а, который создавал лишнюю линию

---

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `src/presentation/components/layout/Header.tsx` | Добавлены MODE_TABS, стилизованные табы по центру |
| `src/presentation/components/layout/AppLayout.tsx` | Props для режима workspace |
| `src/presentation/components/workspace/WorkspacePanel.tsx` | Убран tab bar, activeMode как prop |
| `src/presentation/components/workspace/index.ts` | Экспорт WorkspaceMode |
| `src/app/(dashboard)/projects/[projectId]/page.tsx` | State management для режима |
| `src/presentation/components/editor/Editor.tsx` | Убраны breadcrumbs и связанные props |
| `src/presentation/components/workspace/DocumentTabs.tsx` | Убрана лишняя линия |

---

## Что получилось хорошо

1. **Чистый хедер** — табы красиво центрированы между логотипом и кнопками действий
2. **State lifting** — правильный подъём состояния режима на уровень страницы
3. **Минимальные изменения** — задача выполнена точечными правками без лишнего рефакторинга
4. **Адаптивность** — на маленьких экранах скрываются текстовые лейблы табов (только иконки)

---

## Трудности

1. **Проброс props через несколько уровней** — пришлось обновить AppLayout для передачи режима в Header
2. **TypeScript exports** — нужно было корректно экспортировать WorkspaceMode тип

---

## Уроки

### Паттерн: State Lifting для общего UI состояния
Когда несколько компонентов должны синхронизировать состояние (Header показывает активный таб, WorkspacePanel рендерит контент), state должен находиться в общем родителе (page.tsx).

### Паттерн: Минимальный Layout Props
AppLayout принимает только то, что нужно для рендера — `activeMode` и `onModeChange` опциональны, показываются только при наличии `projectTitle`.

---

## Итог

Простые UI улучшения, которые значительно улучшают визуальную иерархию интерфейса. Табы режимов теперь на видном месте в хедере, что соответствует паттернам IDE-подобных приложений (VS Code, Figma).
