# Reflection: BUILD-03-04 UI Layout System

> **Task ID**: STORY-001-impl-phase3
> **Phase**: Implementation Phase 3
> **Date**: 2026-01-17
> **Status**: PARTIAL SUCCESS (требует доработки)

---

## 1. SUMMARY

Фаза BUILD-03-04 включала настройку UI Component Library (Tailwind + Shadcn-style компоненты) и Layout System (three-panel IDE layout).

**Что было сделано:**
- ✅ Установлены все зависимости
- ✅ Настроен Tailwind с GitHub Dark Dimmed темой
- ✅ Созданы UI компоненты (Button, Card, Input, Badge, Tooltip)
- ✅ Создан Header и базовая структура layout
- ⚠️ react-resizable-panels НЕ РАБОТАЕТ корректно
- ✅ Временный fallback на CSS flex layout

---

## 2. CRITICAL ISSUE: react-resizable-panels

### Проблема
Библиотека `react-resizable-panels` после установки через `npm install react-resizable-panels@latest` **не работает корректно**:
- Панели отображаются экстремально узкими
- `defaultSize` prop игнорируется
- На секунду показывается корректный layout, затем схлопывается

### Context7 API Verification — ПРОВАЛ
Context7 показал новый API:
- `Group` вместо `PanelGroup`
- `Separator` вместо `PanelResizeHandle`  
- `orientation` вместо `direction`

**НО:** Даже с правильным API панели не работают.

### Попытки исправления (все неудачные)
1. Смена API names (Group/Separator) — не помогло
2. Удаление `autoSaveId` — не помогло
3. Очистка localStorage — не помогло
4. Смена `id` layout — не помогло
5. Перезапуск сервера с очисткой `.next` — не помогло
6. Explicit `defaultSize` values (20 + 58 + 22 = 100) — не помогло

### Временное решение
Заменил react-resizable-panels на простой CSS flex layout:
```tsx
<div className="h-full flex">
  <div className="w-[250px] ...">Left</div>
  <div className="flex-1 ...">Center</div>
  <div className="w-[280px] ...">Right</div>
</div>
```

---

## 3. WHAT WENT WELL

### Tailwind Configuration
- GitHub Dark Dimmed тема настроена правильно
- Все цвета отображаются корректно
- Entity type colors работают (character=purple, location=green, etc.)

### UI Components
- Button с 5 вариантами работает
- Badge с entity variants работает
- Card компоненты работают
- Tooltip (Radix UI unified API) работает

### Fonts
- Google Fonts (Inter, JetBrains Mono, Merriweather) загружаются
- CSS variables настроены правильно

### Build & TypeScript
- `npm run build` проходит
- `npx tsc --noEmit` проходит
- Нет linter ошибок

---

## 4. CHALLENGES

### Challenge 1: Context7 API Mismatch
**Проблема:** Context7 показал API который теоретически правильный, но на практике не работает.
**Урок:** Context7 показывает документацию, но не гарантирует что код будет работать в конкретном окружении.

### Challenge 2: Library Version Issues
**Проблема:** `react-resizable-panels@latest` возможно имеет баги или несовместимости.
**Урок:** Нужно проверять конкретные версии и читать issues на GitHub.

### Challenge 3: Debugging Client-Side Issues
**Проблема:** Сложно дебажить почему панели схлопываются — нет явных ошибок в консоли.
**Урок:** Нужен доступ к browser console для полноценной отладки.

---

## 5. LESSONS LEARNED

### Lesson 1: Context7 — Trust But Verify
```
Context7 verification ≠ Working code
API documentation ≠ Bug-free implementation
```
**Action:** После Context7 verification нужно тестировать минимальный пример ПЕРЕД интеграцией.

### Lesson 2: Fallback Strategy
```
Всегда иметь fallback план для third-party libraries
CSS flex/grid layout — надёжная альтернатива
```
**Action:** Сначала делать working version, потом добавлять features (resizable).

### Lesson 3: Incremental Integration
```
Не интегрировать сложную библиотеку сразу во всё приложение
Сначала — изолированный тест
```
**Action:** Создавать `/test` страницу для проверки новых библиотек.

### Lesson 4: Version Pinning
```
@latest может привести к неожиданным проблемам
Фиксировать версии после успешного теста
```
**Action:** После успешной интеграции — pin version в package.json.

---

## 6. PROCESS IMPROVEMENTS

### Improvement 1: Library Testing Protocol
```
1. npm install package@latest
2. Create /test/[library] page
3. Test minimal example
4. If works → integrate
5. If fails → try previous version or alternative
```

### Improvement 2: Context7 Workflow Update
```
OLD: Context7 → Implement → Test
NEW: Context7 → Minimal Test → Verify → Implement
```

### Improvement 3: Fallback-First Development
```
1. Implement basic version (CSS only)
2. Verify it works
3. Enhance with library (resizable, etc.)
4. If library fails → keep basic version
```

---

## 7. TECHNICAL DEBT

| Item | Priority | Notes |
|------|----------|-------|
| Fix react-resizable-panels | HIGH | Investigate GitHub issues, try older version |
| Add resize functionality | MEDIUM | After fixing panels or use alternative |
| Panel persistence | LOW | localStorage save/restore |

---

## 8. NEXT STEPS

### Immediate
1. Продолжить с текущим CSS flex layout
2. BUILD-05 Project Explorer можно делать без resizable
3. Вернуться к resizable panels позже

### Investigation Needed
1. Check react-resizable-panels GitHub issues
2. Try version 2.x instead of 3.x
3. Consider alternatives: `allotment`, `react-split-pane`

---

## 9. FILES CREATED/MODIFIED

### Created (15 files)
- `src/presentation/components/ui/button.tsx`
- `src/presentation/components/ui/card.tsx`
- `src/presentation/components/ui/input.tsx`
- `src/presentation/components/ui/badge.tsx`
- `src/presentation/components/ui/tooltip.tsx`
- `src/presentation/components/ui/index.ts`
- `src/presentation/components/layout/AppLayout.tsx`
- `src/presentation/components/layout/Header.tsx`
- `src/presentation/components/layout/PanelLayout.tsx`
- `src/presentation/components/layout/PanelHeader.tsx`
- `src/presentation/components/layout/index.ts`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/projects/[projectId]/page.tsx`

### Modified (4 files)
- `tailwind.config.ts` — GitHub Dark Dimmed theme
- `src/app/globals.css` — Dark theme styles
- `src/app/layout.tsx` — Google Fonts + TooltipProvider
- `tsconfig.json` — Added @/presentation/* path

### Removed (temporary components)
- `LeftPanel.tsx`, `CenterPanel.tsx`, `RightPanel.tsx`, `ResizeHandle.tsx` — объединены в PanelLayout

---

## 10. HONEST ASSESSMENT

**Успешность фазы: 70%**

- UI компоненты: 100% ✅
- Tailwind/Theme: 100% ✅
- Layout structure: 100% ✅
- Resizable panels: 0% ❌ (fallback to CSS)

**Причина неполного успеха:**
react-resizable-panels@3.x имеет проблемы которые не удалось решить в рамках текущей сессии. Требуется дополнительное исследование.

**Рекомендация:**
Продолжить разработку с CSS flex layout. Resizable — не blocker для MVP.
