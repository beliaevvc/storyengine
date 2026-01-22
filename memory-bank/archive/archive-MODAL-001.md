# АРХИВ ЗАДАЧИ: MODAL-001 — Профиль сущности в модальном окне

## МЕТАДАННЫЕ

| Поле | Значение |
|------|----------|
| **ID задачи** | MODAL-001 |
| **Дата начала** | 2026-01-22 |
| **Дата завершения** | 2026-01-22 |
| **Уровень сложности** | 3 (Intermediate Feature) |
| **Статус** | ✅ ARCHIVED |
| **Рефлексия** | `reflection/reflection-MODAL-001.md` |

---

## КРАТКОЕ ОПИСАНИЕ

Реализовано открытие профиля сущности в большом модальном окне (95vw × 92vh) вместо перехода на отдельную страницу `/entity/[id]`. Это улучшает UX, позволяя пользователю просматривать и редактировать сущности без потери контекста основного рабочего пространства.

---

## ТРЕБОВАНИЯ

### Исходная проблема
- Профиль сущности открывался как отдельная страница
- Пользователь терял контекст текущей работы
- Требовалось нажимать "Назад" для возврата

### Целевое решение
- Открывать профиль в большом модальном окне
- Сохранять контекст рабочего пространства под модалом
- Закрытие по клику на backdrop, кнопке × или Escape

---

## РЕАЛИЗАЦИЯ

### 1. State Management (`useUIStore.ts`)

```typescript
// Добавлено состояние
entityProfileId: string | null;

// Добавлены действия
openEntityProfile: (entityId: string) => void;
closeEntityProfile: () => void;

// Добавлен селектор
selectEntityProfileId: (state: UIState) => state.entityProfileId;
```

### 2. Компонент модала (`EntityProfileModal.tsx`)

Создан новый компонент с характеристиками:
- Размер: 95vw × 92vh (большой, но не fullscreen)
- 3-колоночный layout: Passport (280px) | Content (1fr) | Timeline (320px)
- Загрузка данных entity внутри модала
- Обработка Escape для закрытия
- Блокировка scroll body при открытии

### 3. Изменения навигации

Заменён `router.push()` на `openEntityProfile()` в 5 файлах:

| Файл | Триггер |
|------|---------|
| `FlowCanvas.tsx` | Двойной клик на ноду |
| `EntityListItem.tsx` | Двойной клик в списке |
| `EntityCard.tsx` | Клик по имени / меню |
| `RelationshipsEditor.tsx` | Клик по связи |
| `RelationshipsList.tsx` | Клик по связи |

### 4. Интеграция

`EntityProfileModal` добавлен в layout страницы проекта:

```tsx
// src/app/(dashboard)/projects/[projectId]/page.tsx
<>
  <AppLayout ... />
  <EntityProfileModal projectId={params.projectId} />
</>
```

---

## ИЗМЕНЁННЫЕ ФАЙЛЫ

### Новые файлы
```
src/presentation/components/entity-profile/EntityProfileModal.tsx
```

### Изменённые файлы
```
src/presentation/stores/useUIStore.ts
src/presentation/components/entity-profile/index.ts
src/presentation/components/flow/FlowCanvas.tsx
src/presentation/components/explorer/EntityListItem.tsx
src/presentation/components/entities/EntityCard.tsx
src/presentation/components/entity-profile/RelationshipsEditor.tsx
src/presentation/components/entity-profile/RelationshipsList.tsx
src/app/(dashboard)/projects/[projectId]/page.tsx
```

---

## ТЕСТИРОВАНИЕ

### Проверки
- [x] TypeScript компиляция (`tsc --noEmit`)
- [x] Открытие модала двойным кликом на ноду в FlowCanvas
- [x] Открытие модала двойным кликом в списке сущностей
- [x] Закрытие по клику на backdrop
- [x] Закрытие по Escape
- [x] Закрытие по кнопке ×
- [x] Переход между сущностями через связи внутри модала

---

## УРОКИ

1. **TypeScript проверка обязательна** — после удаления импортов могут остаться использования (`router.refresh()`)

2. **UX паттерны** — одинарный клик для выделения, двойной для действия (стандарт файловых менеджеров)

3. **Компоненты с контекстом** — лучше параметризировать пропсами (кнопка Назад/Закрыть) изначально

---

## КОММИТЫ

| Hash | Описание |
|------|----------|
| `15515ce` | feat(entity-profile): open entity profile in modal instead of separate page |
| `2ad0274` | fix(entity-list): open profile modal on double-click instead of single-click |

---

## ССЫЛКИ

- **Рефлексия:** `reflection/reflection-MODAL-001.md`
- **Компонент:** `src/presentation/components/entity-profile/EntityProfileModal.tsx`
- **Store:** `src/presentation/stores/useUIStore.ts`
