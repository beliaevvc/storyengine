# Архив: EDITOR-001 — Улучшения блочной архитектуры редактора

---

## Метаданные

| Поле | Значение |
|------|----------|
| **Task ID** | EDITOR-001 |
| **Дата начала** | 2026-01-18 |
| **Дата завершения** | 2026-01-18 |
| **Уровень сложности** | 3 (Intermediate Feature) |
| **Статус** | ✅ ARCHIVED |
| **Рефлексия** | `reflection/reflection-EDITOR-001.md` |

---

## Резюме

Комплексное улучшение архитектуры редактора StoryEngine, обеспечивающее строгую блочную структуру документа. Весь контент теперь обязательно находится внутри semantic blocks, что гарантирует консистентность данных для AI-анализа и экспорта.

---

## Требования

### Функциональные
1. Запретить ввод текста вне semantic blocks в syntax режиме
2. Обеспечить правильную структуру для новых документов
3. Улучшить визуальное разделение блоков
4. Обновить BubbleMenu для конвертации текста в блоки

### Нефункциональные
1. Zero-lag поведение UI при скролле
2. Отсутствие layout shift при hover эффектах
3. Консистентность дизайна с остальным приложением

---

## Реализация

### 1. Строгая схема Tiptap

**SceneExtension.ts:**
```typescript
// Было:
content: 'block+'

// Стало:
content: 'semanticBlock+'
```

Это обеспечивает, что внутри сцены могут быть только semantic blocks.

### 2. Миграция документов

**migrateDocument.ts** — обновлены три функции:

```typescript
// createSceneNode - оборачивает контент в semantic block
function createSceneNode(content, slug) {
  const sceneContent = content[0]?.type === 'semanticBlock'
    ? content
    : [createSemanticBlock(content)];
  return { type: 'scene', content: sceneContent, ... };
}

// createEmptyDocument - правильная начальная структура
function createEmptyDocument() {
  return { type: 'doc', content: [createSceneNode([], 'Новая сцена')] };
}

// createDefaultDocumentContent - с semantic block внутри
```

### 3. UI блоков

**SemanticBlockView.tsx:**
- Добавлена разделительная линия: `<div className="border-t border-[#3a3f4b]" />`
- Границы всегда видны: `border border-[#3a3f4b]`
- Тип `'empty'` с UI для выбора типа блока

### 4. BubbleMenu

**BubbleMenu.tsx:**
- Иконки вместо текста (`MessageCircle`, `Mountain`, `Zap`, `Brain`, `FileText`)
- Тёмный контрастный дизайн
- Прямое обновление DOM при скролле для zero-lag

```typescript
// Прямое обновление DOM без React state
const handleScroll = () => {
  if (menuRef.current) {
    menuRef.current.style.top = `${top}px`;
    menuRef.current.style.left = `${left}px`;
  }
};
```

---

## Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `src/presentation/components/editor/extensions/SceneExtension.ts` | `content: 'semanticBlock+'` |
| `src/presentation/components/editor/extensions/SemanticBlockView.tsx` | UI: линия, границы, тип empty |
| `src/presentation/components/editor/extensions/SemanticBlock.ts` | `default: 'empty'` |
| `src/presentation/components/editor/extensions/SlashCommands.ts` | Команда `/block` |
| `src/presentation/components/editor/BubbleMenu.tsx` | Иконки, скролл |
| `src/presentation/utils/migrateDocument.ts` | Создание с semantic blocks |

---

## Тестирование

### Ручное тестирование
1. ✅ Создание нового документа — структура с semantic block
2. ✅ Невозможность писать вне блоков в syntax режиме
3. ✅ Конвертация текста через BubbleMenu
4. ✅ Визуальное разделение блоков
5. ✅ BubbleMenu следует за выделением при скролле

### Известные ограничения
- Старые документы с параграфами вне блоков могут требовать миграции
- BubbleMenu может иметь небольшой лаг при очень быстром скролле

---

## Уроки

### Технические
1. **DOM vs React State** — для zero-lag анимаций обновлять DOM напрямую через refs
2. **Box-shadow vs Border** — для hover эффектов без layout shift использовать box-shadow
3. **Tiptap schema** — строгая схема (`semanticBlock+`) автоматически валидирует структуру

### Процессные
1. **Сначала схема, потом UI** — техническая консистентность важнее визуальной
2. **Тестировать все entry points** — новые документы, slash commands, кнопки добавления
3. **Инкрементальные изменения** — проще отлаживать по частям

---

## Связанные задачи

| Задача | Связь |
|--------|-------|
| SCENE-003 | Базовая архитектура сцен |
| VIEW-001 | Режим просмотра (использует blockType) |

---

## Возможные улучшения (Post-MVP)

1. **5-й тип блока "Нарратив"** — для голоса рассказчика / voice-over
2. **Атрибуты сцены** — флэшбек, сон, временная метка
3. **CSS переменные** — вынести цвета в design tokens
4. **Utility функции** — `createEmptyBlock()` для централизации

---

## Статус архивации

- [x] Архивный документ создан
- [x] Рефлексия завершена
- [x] tasks.md обновлён
- [x] activeContext.md обновлён

**Дата архивации:** 2026-01-18
