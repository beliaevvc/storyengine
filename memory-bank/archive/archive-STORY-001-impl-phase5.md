# АРХИВ: BUILD-06 Tiptap Editor Integration

> **Task ID**: STORY-001
> **Phase**: Implementation Phase 5
> **Build Plan**: BUILD-06
> **Дата начала**: 2026-01-17
> **Дата завершения**: 2026-01-17
> **Статус**: ✅ ARCHIVED

---

## 1. МЕТАДАННЫЕ

| Параметр | Значение |
|----------|----------|
| Task ID | STORY-001 |
| Phase | Implementation Phase 5 |
| Build Plan | BUILD-06-tiptap-editor.md |
| Complexity | Level 4 |
| Files Created | 12 |
| Dependencies Added | 7 |
| Context7 Queries | 3 |

---

## 2. КРАТКОЕ ОПИСАНИЕ

Интеграция Tiptap rich-text редактора с custom EntityMark extension для подсветки entities в тексте. Реализован полноценный редактор с toolbar, breadcrumbs, status bar и AI Scan функциональностью.

---

## 3. ТРЕБОВАНИЯ (из BUILD-06)

### Функциональные
- [x] Rich-text редактор с базовым форматированием
- [x] Custom EntityMark extension для подсветки entities
- [x] Toolbar с кнопками форматирования
- [x] AI Scan кнопка для поиска entities в тексте
- [x] Word/character count в StatusBar
- [x] Breadcrumbs для навигации

### Технические
- [x] Tiptap integration с Next.js App Router
- [x] SSR-safe implementation
- [x] TypeScript типизация
- [x] Zustand store для editor state

---

## 4. РЕАЛИЗАЦИЯ

### 4.1 Созданные файлы

```
src/presentation/
├── stores/
│   └── useEditorStore.ts          # Editor state management
└── components/
    └── editor/
        ├── Editor.tsx              # Main StoryEditor component
        ├── Toolbar.tsx             # Formatting toolbar + AI Scan
        ├── ToolbarButton.tsx       # Reusable toolbar button
        ├── Breadcrumbs.tsx         # Document path display
        ├── StatusBar.tsx           # Word/char count
        ├── index.ts                # Barrel exports
        ├── extensions/
        │   ├── EntityMark.ts       # Custom Tiptap mark
        │   ├── EntityMarkComponent.tsx  # React view component
        │   └── index.ts
        └── utils/
            ├── applyEntityMarks.ts # Mark application utility
            └── index.ts
```

### 4.2 Установленные зависимости

```json
{
  "@tiptap/react": "latest",
  "@tiptap/core": "latest",
  "@tiptap/pm": "latest",
  "@tiptap/starter-kit": "latest",
  "@tiptap/extension-placeholder": "latest",
  "@tiptap/extension-typography": "latest",
  "@tiptap/extension-character-count": "latest"
}
```

### 4.3 Ключевые паттерны

#### SSR-safe Tiptap в Next.js
```typescript
'use client';

const editor = useEditor({
  immediatelyRender: false, // CRITICAL для Next.js
  extensions: [StarterKit, EntityMark, ...],
});
```

#### Custom Mark с React View
```typescript
'use client';

import { ReactMarkViewRenderer, MarkViewContent } from '@tiptap/react';

export const EntityMark = Mark.create({
  addMarkView() {
    return ReactMarkViewRenderer(EntityMarkComponent);
  },
});

export function EntityMarkComponent(props: MarkViewRendererProps) {
  return <span><MarkViewContent /></span>;
}
```

#### Type-safe mark attributes
```typescript
const mark = props.mark as unknown as { attrs: EntityMarkAttrs };
const { entityId, entityType, entityName } = mark.attrs;
```

---

## 5. ПРОБЛЕМЫ И РЕШЕНИЯ

### 5.1 SSR Error (КРИТИЧНАЯ)

**Проблема**: `TypeError: Class extends value undefined is not a constructor or null`

**Причина**: Tiptap модули импортировались в Server Component

**Решение**: Добавить `'use client'` во все файлы editor модуля:
- `extensions/EntityMark.ts`
- `extensions/index.ts`
- `editor/index.ts`

### 5.2 Duplicate selector names

**Проблема**: `selectCurrentDocumentId` экспортировался из двух stores

**Решение**: Переименовать в `selectEditorDocumentId` в useEditorStore

### 5.3 Mark attribute typing

**Проблема**: TypeScript ошибка при доступе к mark.attrs

**Решение**: Двойной casting `as unknown as { attrs: T }`

---

## 6. ТЕСТИРОВАНИЕ

### Ручное тестирование
- [x] Editor рендерится без SSR ошибок
- [x] Форматирование (bold, italic, headings) работает
- [x] Placeholder отображается в пустом редакторе
- [x] Word/character count обновляется
- [x] Breadcrumbs отображают путь документа
- [x] TypeScript компиляция проходит

### Интеграция
- [x] StoryEditor интегрирован в project page
- [x] Stores подключены (Entity, UI, Editor)
- [x] Tooltip компоненты работают

---

## 7. УРОКИ

### 7.1 Context7 верификация
- Проверка API **ДО** имплементации предотвратила использование устаревших паттернов
- `MarkViewContent` vs `children` — критичное отличие найдено через Context7

### 7.2 Next.js + Browser-only libraries
- `'use client'` нужен во ВСЕХ файлах цепочки импорта
- Не только в React компонентах, но и в utility/extension файлах

### 7.3 Tiptap специфика
- `immediatelyRender: false` — обязательно для Next.js
- `ReactMarkViewRenderer` для React компонентов в marks

---

## 8. СВЯЗАННЫЕ ДОКУМЕНТЫ

| Документ | Путь |
|----------|------|
| Build Plan | `memory-bank/build-plans/BUILD-06-tiptap-editor.md` |
| Creative Phase | `memory-bank/creative/creative-CP4-editor-extensions.md` |
| Reflection | `memory-bank/reflection/reflection-STORY-001-impl-phase5.md` |
| System Patterns | `memory-bank/systemPatterns.md` (Tiptap паттерны добавлены) |

---

## 9. СЛЕДУЮЩИЕ ШАГИ

1. **BUILD-07**: Context Inspector panel
2. **BUILD-08**: State Management completion
3. **BUILD-09**: Two-Way Binding

---

## 10. ИЗМЕНЕНИЯ В CODEBASE

### Новые файлы (12)
```
src/presentation/stores/useEditorStore.ts
src/presentation/components/editor/Editor.tsx
src/presentation/components/editor/Toolbar.tsx
src/presentation/components/editor/ToolbarButton.tsx
src/presentation/components/editor/Breadcrumbs.tsx
src/presentation/components/editor/StatusBar.tsx
src/presentation/components/editor/index.ts
src/presentation/components/editor/extensions/EntityMark.ts
src/presentation/components/editor/extensions/EntityMarkComponent.tsx
src/presentation/components/editor/extensions/index.ts
src/presentation/components/editor/utils/applyEntityMarks.ts
src/presentation/components/editor/utils/index.ts
```

### Изменённые файлы (4)
```
src/presentation/stores/index.ts (добавлен export EditorStore)
src/app/(dashboard)/projects/[projectId]/page.tsx (интеграция StoryEditor)
src/app/globals.css (entity mark стили)
package.json (Tiptap dependencies)
```

---

*Архивировано: 2026-01-17*
