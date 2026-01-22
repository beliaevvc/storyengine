# Рефлексия: MODAL-001 — Профиль сущности в модальном окне

**Дата:** 2026-01-22  
**Уровень:** 3 (Intermediate Feature)  
**Статус:** ✅ Завершено

---

## Краткое описание

Реализовано открытие профиля сущности в большом модальном окне вместо отдельной страницы. Это улучшает UX, позволяя пользователю быстро просматривать и редактировать сущности без потери контекста основного рабочего пространства.

---

## Что было сделано

### Новые компоненты
- `EntityProfileModal.tsx` — большой модал (95vw × 92vh) с 3-колоночным layout

### Изменения в state management
- `useUIStore.ts` — добавлено состояние `entityProfileId` и действия:
  - `openEntityProfile(entityId)` — открыть модал
  - `closeEntityProfile()` — закрыть модал

### Изменения навигации
Заменена навигация `router.push()` на `openEntityProfile()` в 5 файлах:
- `FlowCanvas.tsx` — двойной клик на ноду
- `EntityListItem.tsx` — двойной клик в списке (изначально одинарный, потом исправлено)
- `EntityCard.tsx` — открытие профиля из карточки
- `RelationshipsEditor.tsx` — клик по связанной сущности
- `RelationshipsList.tsx` — клик по связанной сущности

### Интеграция
- `EntityProfileModal` добавлен в layout страницы проекта

---

## Что прошло хорошо

1. **Переиспользование существующих компонентов** — `EntityPassport`, `EntityContent`, `EntityTimeline` использованы без изменений в модале

2. **Централизованное управление состоянием** — `useUIStore` уже имел паттерн для модалов, легко расширился

3. **TypeScript проверка** — помогла найти забытое использование `router` в `RelationshipsEditor`

4. **Быстрая итерация** — исправление одинарный→двойной клик заняло минуту

---

## Сложности

1. **Дублирование кода** — пришлось создать `EntityPassportForModal` с кнопкой "Закрыть" вместо "Назад". В будущем можно вынести это в пропс.

2. **Забытый `router.refresh()`** — после удаления импорта `useRouter` остался вызов `router.refresh()`, обнаружен только при TypeScript проверке.

---

## Уроки

1. **Всегда запускать `tsc --noEmit`** после удаления импортов — могут остаться использования

2. **Компоненты с контекстно-зависимым поведением** (кнопка Назад/Закрыть) лучше параметризировать пропсами изначально

3. **Одинарный vs двойной клик** — важно думать о UX заранее. Одинарный клик для выделения, двойной для действия — стандартный паттерн файловых менеджеров

---

## Технические улучшения на будущее

1. **Рефакторинг `EntityPassport`** — добавить пропс `onBack?: () => void` чтобы не дублировать компонент

2. **URL синхронизация** — можно добавить `?entity=<id>` в URL для возможности шаринга ссылки на открытый модал

3. **Анимация** — добавить плавное появление/исчезновение модала

---

## Файлы изменены

```
src/presentation/components/entity-profile/EntityProfileModal.tsx  # NEW
src/presentation/components/entity-profile/index.ts
src/presentation/stores/useUIStore.ts
src/presentation/components/flow/FlowCanvas.tsx
src/presentation/components/explorer/EntityListItem.tsx
src/presentation/components/entities/EntityCard.tsx
src/presentation/components/entity-profile/RelationshipsEditor.tsx
src/presentation/components/entity-profile/RelationshipsList.tsx
src/app/(dashboard)/projects/[projectId]/page.tsx
```

---

## Коммиты

1. `15515ce` — feat(entity-profile): open entity profile in modal instead of separate page
2. `2ad0274` — fix(entity-list): open profile modal on double-click instead of single-click
