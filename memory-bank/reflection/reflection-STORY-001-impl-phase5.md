# Рефлексия: BUILD-06 Tiptap Editor Integration

> **Task ID**: STORY-001
> **Phase**: Implementation Phase 5 (BUILD-06)
> **Дата**: 2026-01-17
> **Статус**: ✅ COMPLETE

---

## 1. Резюме

BUILD-06 успешно реализовал интеграцию Tiptap редактора с custom EntityMark extension для подсветки entities в тексте. Фаза включала создание 12 файлов, установку 7 Tiptap пакетов и решение критической проблемы с Next.js SSR.

---

## 2. План vs Реализация

### Планировалось (BUILD-06-tiptap-editor.md)
| Компонент | План | Результат |
|-----------|------|-----------|
| Editor.tsx | ✅ | Создан как StoryEditor |
| EditorContent.tsx | ❌ | Не нужен отдельно (встроен в Editor) |
| Toolbar.tsx | ✅ | Создан |
| ToolbarButton.tsx | ✅ | Создан |
| Breadcrumbs.tsx | ✅ | Создан |
| StatusBar.tsx | ✅ | Создан |
| EntityMark.ts | ✅ | Создан с `'use client'` |
| EntityMarkComponent.tsx | ✅ | Создан с MarkViewContent |
| applyEntityMarks.ts | ✅ | Создан |
| useEditorStore | ✅ | Добавлен (не был в плане) |

### Отклонения от плана
1. **EditorContent.tsx** — не понадобился, Tiptap EditorContent используется напрямую
2. **useEditorStore** — добавлен для управления состоянием редактора (не был в плане BUILD-06, но логически необходим)
3. **`'use client'` директивы** — добавлены во все файлы editor модуля (критично для Next.js)

---

## 3. Что прошло хорошо

### 3.1 Context7 верификация
- **Заблаговременная проверка API** предотвратила использование устаревших паттернов
- Обнаружено: `immediatelyRender: false` — обязательно для Next.js
- Обнаружено: `MarkViewContent` — правильный компонент для mark views (не `children`)

### 3.2 Структурированный подход
- Чёткое разделение на extensions, utils, components
- Barrel exports для удобного импорта
- Типизация с TypeScript работает корректно

### 3.3 Переиспользование существующих компонентов
- Tooltip, Button из UI library использованы без модификаций
- cn() utility для className composition

---

## 4. Проблемы и решения

### 4.1 КРИТИЧНАЯ: SSR Error в Next.js

**Проблема:**
```
TypeError: Class extends value undefined is not a constructor or null
```
Tiptap модули импортировались на сервере (React Server Component), что вызывало ошибку.

**Причина:**
- `EntityMark.ts` и `index.ts` не имели `'use client'` директивы
- Next.js App Router по умолчанию рендерит компоненты на сервере
- Tiptap использует browser-only APIs

**Решение:**
Добавить `'use client'` в:
- `src/presentation/components/editor/extensions/EntityMark.ts`
- `src/presentation/components/editor/extensions/index.ts`
- `src/presentation/components/editor/index.ts`

**Урок:**
> При работе с browser-only библиотеками в Next.js App Router — ВСЕГДА добавлять `'use client'` в файлы, даже если они не содержат React компоненты, но экспортируют код, зависящий от browser APIs.

### 4.2 Типизация MarkViewRendererProps

**Проблема:**
```typescript
// Ошибка: Type 'Mark' is missing properties from EntityMarkAttrs
const mark = props.mark as { attrs: EntityMarkAttrs };
```

**Решение:**
```typescript
const mark = props.mark as unknown as { attrs: EntityMarkAttrs };
```

**Урок:**
> Tiptap использует generic типы, которые требуют двойного casting через `unknown` для кастомных атрибутов.

### 4.3 Дублирование selector имён

**Проблема:**
```
Duplicate identifier 'selectCurrentDocumentId'
```
useDocumentStore и useEditorStore оба экспортировали selector с одинаковым именем.

**Решение:**
Переименовать в useEditorStore: `selectEditorDocumentId`

**Урок:**
> При добавлении новых stores — проверять уникальность имён экспортируемых selectors в barrel файле.

---

## 5. Технические открытия

### 5.1 Tiptap + Next.js SSR
```typescript
// ОБЯЗАТЕЛЬНО для Next.js App Router
const editor = useEditor({
  immediatelyRender: false, // ← Предотвращает hydration mismatch
  extensions: [...],
});
```

### 5.2 Custom Mark Views в Tiptap
```typescript
// Правильно (2026)
import { MarkViewContent, MarkViewRendererProps } from '@tiptap/react';

export function EntityMarkComponent(props: MarkViewRendererProps) {
  return (
    <span>
      <MarkViewContent /> {/* ← Рендерит содержимое mark */}
    </span>
  );
}

// НЕПРАВИЛЬНО (устаревший паттерн)
export function EntityMarkComponent({ children }) {
  return <span>{children}</span>; // ← НЕ работает для marks!
}
```

### 5.3 ReactMarkViewRenderer регистрация
```typescript
// В extension файле
addMarkView() {
  return ReactMarkViewRenderer(EntityMarkComponent);
}
```

---

## 6. Улучшения процесса

### 6.1 Добавить в чеклист Context7 верификации
```
[ ] Проверить SSR/hydration requirements
[ ] Проверить 'use client' необходимость
[ ] Проверить типы для custom extensions
```

### 6.2 Шаблон для Tiptap extensions
При создании custom extensions:
1. Файл extension: добавить `'use client'`
2. Файл component: добавить `'use client'`
3. Barrel export: добавить `'use client'`
4. Использовать `MarkViewContent` для mark views
5. Использовать `as unknown as Type` для типизации attrs

### 6.3 Next.js + Browser-only libraries checklist
```
При интеграции browser-only библиотек:
1. Добавить 'use client' в ВСЕ файлы цепочки импорта
2. Использовать dynamic import если нужна условная загрузка
3. Проверить SSR режимы библиотеки (immediatelyRender, ssr: false, etc.)
```

---

## 7. Метрики

| Метрика | Значение |
|---------|----------|
| Файлов создано | 12 |
| Зависимостей установлено | 7 |
| Критических багов | 1 (SSR error) |
| Время на исправление бага | ~5 минут |
| Context7 запросов | 3 |

---

## 8. Следующие шаги

1. **BUILD-07: Context Inspector** — правая панель с ActiveEntities
2. Рассмотреть добавление BubbleMenu для inline entity editing
3. Добавить keyboard shortcuts для форматирования
4. Интегрировать редактор с реальными данными из stores

---

## 9. Ключевые выводы

1. **Context7 спас от устаревших паттернов** — `MarkViewContent` vs `children`
2. **Next.js App Router требует явных `'use client'`** — даже для non-component файлов
3. **Tiptap + Next.js = `immediatelyRender: false`** — обязательно
4. **Планы BUILD нуждаются в проверке SSR требований** — добавить в шаблон

---

*Рефлексия завершена: 2026-01-17*
