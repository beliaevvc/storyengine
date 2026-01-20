# Промпт для агента по рефакторингу типизации

## Контекст проблемы

Проект StoryEngine имеет системную проблему с типизацией, которая вызывает множество ошибок при билде на Vercel. Основные причины:

1. **Несогласованность snake_case (Supabase) и camelCase (приложение)** — Supabase возвращает `project_id`, `created_at`, а внутренние типы ожидают `projectId`, `createdAt`
2. **Отсутствие автогенерации типов Supabase** — RPC функции не типизированы, приходится использовать `as any`
3. **Множество костылей `as any` по всему коду** — временные фиксы, которые скрывают проблемы
4. **Breaking changes в библиотеках** — AI SDK (`@ai-sdk/react`), TipTap, Zod изменили API

---

## Задача

Провести поэтапный рефакторинг системы типизации. Работать небольшими, безопасными шагами. После каждого этапа — локальный `npm run build` для проверки.

---

## План работы (по порядку)

### Этап 1: Диагностика

1. Запустить `npm run build` локально и собрать ВСЕ ошибки типизации в один список
2. Категоризировать ошибки:
   - Supabase snake_case/camelCase
   - AI SDK
   - TipTap
   - Zod
   - Другие
3. Составить отчёт с количеством ошибок по категориям

### Этап 2: Настройка автогенерации типов Supabase

1. Проверить, установлен ли Supabase CLI
2. Настроить команду:
   ```bash
   supabase gen types typescript --project-id <id> --schema public > src/types/supabase.ts
   ```
3. Добавить скрипт в `package.json`:
   ```json
   "types:generate": "supabase gen types typescript --project-id <PROJECT_ID> --schema public > src/types/supabase.ts"
   ```
4. Сгенерировать актуальные типы

**Важно:** Пользователю нужно будет:
- Выполнить `supabase login` или предоставить `SUPABASE_ACCESS_TOKEN`
- Указать Project ID Supabase

### Этап 3: Создание слоя маппинга данных

1. Создать файл `src/lib/mappers/entityMapper.ts`
2. Реализовать функции:
   ```typescript
   import { Tables, TablesInsert } from '@/types/supabase';
   import { Entity } from '@/core/entities/entity';
   
   export function mapSupabaseToEntity(data: Tables<'entities'>): Entity {
     return {
       id: data.id,
       projectId: data.project_id,
       type: data.type,
       name: data.name,
       description: data.description,
       attributes: data.attributes,
       content: data.content,
       embedding: data.embedding,
       createdAt: data.created_at,
       updatedAt: data.updated_at,
     };
   }
   
   export function mapEntityToSupabase(entity: Partial<Entity>): TablesInsert<'entities'> {
     return {
       id: entity.id,
       project_id: entity.projectId,
       type: entity.type,
       name: entity.name,
       description: entity.description,
       attributes: entity.attributes,
       content: entity.content,
       embedding: entity.embedding,
     };
   }
   ```
3. Аналогично для других сущностей (projects, documents, scenes, etc.)
4. Заменить все `as any` в action-файлах на вызовы маппера

### Этап 4: Исправление типов TipTap

1. Создать файл `src/types/tiptap.d.ts`:
   ```typescript
   import '@tiptap/core';
   
   declare module '@tiptap/core' {
     interface Storage {
       viewMode?: {
         current: 'markup' | 'clean';
       };
     }
   }
   ```
2. Добавить в `tsconfig.json` путь к типам если нужно
3. Убрать все `(editor.storage as any).viewMode` и заменить на `editor.storage.viewMode`

### Этап 5: Исправление AI SDK

Варианты решения:

**Вариант A: Обновить код под новый API**
1. Проверить актуальную документацию AI SDK v3
2. Обновить `AIChat.tsx` и `AIGenerateButton.tsx` под новый API хуков

**Вариант B: Использовать fetch напрямую (уже частично сделано)**
1. Оставить текущую реализацию с `fetch` вместо хуков
2. Удалить неиспользуемые импорты `@ai-sdk/react`

**Вариант C: Зафиксировать рабочую версию**
1. Найти последнюю стабильную версию `@ai-sdk/react` где API работает
2. Зафиксировать в `package.json`

### Этап 6: Исправление Zod

1. Найти все использования `z.record()` с одним аргументом:
   ```bash
   grep -r "z.record(" src/
   ```
2. Заменить `z.record(z.unknown())` на `z.record(z.string(), z.unknown())`
3. Проверить другие deprecated паттерны Zod

### Этап 7: Финальная проверка и очистка

1. Найти все оставшиеся `as any`:
   ```bash
   grep -r "as any" src/
   ```
2. Для каждого `as any`:
   - Либо исправить типизацию
   - Либо задокументировать комментарием, почему необходим
3. Запустить `npm run build` — должен пройти без ошибок
4. Запустить `npm run lint` — исправить warnings

### Этап 8: Настройка CI/CD

1. Добавить проверку билда перед деплоем (если нет)
2. Рассмотреть добавление `npm run build` в pre-push hook

---

## Правила работы

1. **Один этап — один коммит** с понятным сообщением на русском
2. **После каждого изменения** — `npm run build` локально
3. **Не пушить на GitHub** пока локальный билд не проходит
4. **Если нужен ввод пользователя** (токены, ID проекта) — спросить явно
5. **Документировать** изменения в Memory Bank (`memory-bank/tasks.md`)

---

## Что потребуется от пользователя

1. **Supabase Access Token** — для генерации типов
   - Выполнить `supabase login` в терминале
   - Или создать токен в https://supabase.com/dashboard/account/tokens
   
2. **Project ID Supabase** — для команды генерации типов
   - Найти в URL проекта: `https://supabase.com/dashboard/project/<PROJECT_ID>`
   
3. **Решение по AI SDK** — обновлять API или фиксировать версию?

---

## Файлы, которые нужно будет изменить

### Маппинг (создать новые):
- `src/lib/mappers/entityMapper.ts`
- `src/lib/mappers/projectMapper.ts`
- `src/lib/mappers/documentMapper.ts`
- `src/lib/mappers/index.ts`

### Типы (создать/обновить):
- `src/types/supabase.ts` (автогенерация)
- `src/types/tiptap.d.ts` (расширение типов)

### Actions (рефакторинг):
- `src/app/actions/supabase/entity-actions.ts`
- `src/app/actions/supabase/timeline-actions.ts`
- `src/app/actions/scene-actions.ts`
- И другие файлы с `as any`

### Компоненты (рефакторинг):
- `src/presentation/components/editor/Editor.tsx`
- `src/presentation/components/editor/extensions/SemanticBlock.ts`
- `src/presentation/components/editor/extensions/EntityMention.tsx`
- `src/presentation/components/editor/extensions/SceneView.tsx`
- `src/presentation/components/ai/AIChat.tsx`
- `src/presentation/components/ai/AIGenerateButton.tsx`

### Валидации:
- `src/lib/validations/attributeSchemas.ts`
- `src/lib/validations/entitySchemas.ts`

---

## Начни с Этапа 1

Запусти `npm run build` и покажи полный список ошибок с категоризацией.
