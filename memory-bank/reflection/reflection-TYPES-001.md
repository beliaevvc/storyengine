# Рефлексия: TYPES-001 — Рефакторинг системы типизации

**Дата**: 2026-01-21  
**Уровень**: 4 (Architectural Refactoring)  
**Статус**: ✅ COMPLETE + DEPLOYED

---

## Резюме

Комплексный рефакторинг системы типизации TypeScript для достижения успешного билда и деплоя на Vercel. Задача включала диагностику ошибок типов, создание маппинг-слоя для преобразования snake_case ↔ camelCase, централизацию Supabase table accessors, и исправление инициализации OpenAI клиента.

---

## Что прошло хорошо

### 1. Систематический подход к диагностике
- Использование `npm run build` как основного инструмента диагностики
- Итеративное исправление ошибок — одна за другой
- Чёткое понимание каждой ошибки перед исправлением

### 2. Архитектурные решения
- **Mapper Layer** (`src/lib/mappers/`) — чистое разделение между Supabase и Domain типами
- **Centralized Table Helpers** (`src/lib/supabase/tables.ts`) — изоляция `as any` в одном месте
- **TipTap Type Extensions** (`src/types/tiptap.d.ts`) — расширение Storage интерфейса

### 3. Incremental Commits
- Каждый коммит решал конкретную проблему
- Git history читаема и понятна
- Легко откатить при необходимости

### 4. Vercel MCP Integration
- Использование MCP для мониторинга деплоев
- Быстрый доступ к build logs
- Автоматическое отслеживание статуса

---

## Сложности

### 1. Supabase SDK Type Inference
**Проблема**: `supabase.from('table')` возвращает `never` в generic контексте из-за ограничений TypeScript inference.

**Решение**: Централизация `as any` в helper функциях вместо распределения по всему коду.

```typescript
// Централизованный helper
export async function getEntitiesTable() {
  const supabase = await createClient();
  return (supabase as any).from('entities');
}
```

**Урок**: Иногда `as any` — это осознанный компромисс, главное — изолировать его.

### 2. Module-Level Initialization
**Проблема**: OpenAI SDK выбрасывает ошибку при создании клиента без API key. При билде Next.js загружает модули для static analysis, когда env vars недоступны.

**Решение**: Lazy initialization с getter функцией.

```typescript
// ❌ Было — падает при билде
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Стало — работает
let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}
```

**Урок**: В Next.js избегать side effects на уровне модуля, особенно с env vars.

### 3. ReactFlow v12 Breaking Changes
**Проблема**: `NodeProps<T>` и `EdgeProps<T>` изменили сигнатуру в v12.

**Решение**: Использовать `NodeProps` без generic, кастовать `data` внутри компонента.

### 4. DOM Type Conflicts
**Проблема**: Импорт `Document` из domain конфликтует с глобальным DOM `Document`.

**Решение**: Переименование при импорте: `import type { Document as DomainDocument }`.

---

## Уроки

### Технические

1. **Lazy Initialization для SDK клиентов**
   - Всегда использовать getter функции для клиентов, зависящих от env vars
   - Особенно критично для Next.js server components

2. **Изоляция `as any`**
   - Лучше 10 `as any` в одном файле, чем по 1 в 10 файлах
   - Helper функции — идеальное место для централизации

3. **Type Assertion Chains**
   - `as unknown as TargetType` — безопасный способ преобразования несовместимых типов
   - Лучше, чем `as any`, сохраняет type safety на выходе

4. **Domain vs Infrastructure Types**
   - Держать их раздельно с явным mapping layer
   - `snake_case` в DB, `camelCase` в коде — это норма

### Процессные

1. **Build-First Development**
   - Запускать билд после каждого значительного изменения
   - Не накапливать ошибки типов

2. **Vercel MCP для мониторинга**
   - Использовать `list_deployments` и `get_deployment_build_logs`
   - Быстрее, чем открывать dashboard

3. **Commit Message Discipline**
   - `fix:` для исправлений типов
   - Описывать *что* и *почему* в теле коммита

---

## Метрики

| Метрика | До | После |
|---------|-----|-------|
| Build Status | ❌ Error | ✅ Success |
| Vercel Deploy | ❌ Error | ✅ Ready |
| `as any` count | 44 | 38 |
| Type errors | 20+ | 0 |

---

## Рекомендации на будущее

### Краткосрочные
1. [ ] Установить `OPENAI_API_KEY` в Vercel Environment Variables для работы AI функций
2. [ ] Рассмотреть eslint-plugin-@typescript-eslint strict mode

### Среднесрочные
1. [ ] Настроить автогенерацию Supabase типов в CI/CD
2. [ ] Добавить type tests для mapper функций
3. [ ] Исследовать typed Supabase client alternatives

### Долгосрочные
1. [ ] Полная миграция на generated Supabase types
2. [ ] Elimination оставшихся `as any` через proper typing

---

## Файлы созданные/изменённые

### Новые файлы (7)
```
src/types/tiptap.d.ts
src/lib/mappers/index.ts
src/lib/mappers/types.ts
src/lib/mappers/entityMapper.ts
src/lib/mappers/projectMapper.ts
src/lib/mappers/documentMapper.ts
src/lib/supabase/tables.ts
```

### Ключевые изменения
```
src/app/api/ai/markup/route.ts      # Lazy OpenAI init
src/lib/ai/embeddings.ts            # Lazy OpenAI init
package.json                        # types:generate script
src/app/(auth)/login/page.tsx       # Suspense wrapper
20+ presentation components         # Type fixes
6 action files                      # Centralized table accessors
```

---

## Заключение

Рефакторинг типизации — это инвестиция в maintainability. Хотя `as any` не были полностью устранены, они теперь централизованы и задокументированы. Билд проходит, деплой работает, codebase стал более предсказуемым.

Главный урок: **изоляция компромиссов** важнее их полного устранения.
