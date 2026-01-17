# BUILD-04: Layout System Plan

> **Plan ID**: BUILD-04
> **Component**: IDE Layout System
> **Dependencies**: CP-3, BUILD-03
> **Priority**: HIGH
> **Status**: ✅ IMPLEMENTED (CSS flex layout)
> **Last Updated**: 2026-01-17

---

## 1. OBJECTIVE

Создать три-панельный layout в стиле IDE с фиксированными размерами панелей.

> **⚠️ UPDATE**: react-resizable-panels v3.x имеет баги (panels collapse). 
> Используем CSS flex layout как рабочее решение для MVP.
> Resizable функциональность — техдолг для post-MVP.

---

## 2. FILES CREATED

```
src/presentation/components/
├── layout/
│   ├── AppLayout.tsx           # Main layout wrapper
│   ├── Header.tsx              # Top header bar
│   ├── PanelLayout.tsx         # Three-panel CSS flex layout
│   ├── PanelHeader.tsx         # Reusable panel header
│   └── index.ts
```

---

## 3. IMPLEMENTATION (ACTUAL)

### PanelLayout.tsx — CSS Flex Layout

```typescript
'use client';

interface PanelLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export function PanelLayout({
  leftPanel,
  centerPanel,
  rightPanel,
}: PanelLayoutProps) {
  return (
    <div className="h-full flex">
      {/* Left Panel - 250px */}
      <div className="w-[250px] min-w-[200px] max-w-[350px] flex-shrink-0 bg-surface border-r border-border overflow-auto">
        {leftPanel}
      </div>

      {/* Center Panel - flexible */}
      <div className="flex-1 min-w-[400px] bg-canvas overflow-hidden flex flex-col">
        {centerPanel}
      </div>

      {/* Right Panel - 280px */}
      <div className="w-[280px] min-w-[200px] max-w-[400px] flex-shrink-0 bg-surface border-l border-border overflow-auto">
        {rightPanel}
      </div>
    </div>
  );
}
```

### Header.tsx

```typescript
'use client';

import { Settings, User, BookOpen } from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

interface HeaderProps {
  projectTitle?: string;
  className?: string;
}

export function Header({ projectTitle, className }: HeaderProps) {
  return (
    <header className={cn(
      'h-12 bg-surface border-b border-border flex items-center justify-between px-4',
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          <span className="font-semibold text-fg">StoryEngine</span>
        </div>
        {projectTitle && (
          <>
            <span className="text-fg-muted">/</span>
            <span className="text-fg-secondary text-sm">{projectTitle}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
```

### AppLayout.tsx

```typescript
'use client';

import { Header } from './Header';
import { PanelLayout } from './PanelLayout';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  projectTitle?: string;
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

export function AppLayout({
  projectTitle,
  leftPanel,
  centerPanel,
  rightPanel,
  className,
}: AppLayoutProps) {
  return (
    <div className={cn('h-screen flex flex-col bg-canvas', className)}>
      <Header projectTitle={projectTitle} />
      <main className="flex-1 overflow-hidden">
        <PanelLayout
          leftPanel={leftPanel}
          centerPanel={centerPanel}
          rightPanel={rightPanel}
        />
      </main>
    </div>
  );
}
```

---

## 4. LAYOUT SPECIFICATIONS

### Panel Sizes (Fixed for MVP)

| Panel | Width | Min | Max |
|-------|-------|-----|-----|
| Left (Explorer) | 250px | 200px | 350px |
| Center (Editor) | flex-1 | 400px | - |
| Right (Inspector) | 280px | 200px | 400px |

### Height Specifications

| Element | Height |
|---------|--------|
| Header | 48px (h-12) |
| Breadcrumbs | 32px (h-8) |
| Toolbar | 40px (h-10) |
| Panel Header | 40px |

---

## 5. SUCCESS CRITERIA

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Three panels render | ✅ |
| 2 | Header renders | ✅ |
| 3 | No overflow | ✅ |
| 4 | Panels fill height | ✅ |
| 5 | Resize works | ❌ DEFERRED |
| 6 | Layout persists | ❌ DEFERRED |

---

## 6. TECHNICAL DEBT

### TD-001: Resizable Panels
**Priority**: MEDIUM (post-MVP)
**Issue**: react-resizable-panels v3.x panels collapse unexpectedly
**Options**:
1. Investigate GitHub issues for v3.x
2. Try v2.x (older stable version)
3. Use alternative: `allotment`, `react-split-pane`

### TD-002: Layout Persistence
**Priority**: LOW (post-MVP)
**Depends**: TD-001
**Description**: Save/restore panel sizes to localStorage

---

## 7. LESSONS LEARNED

1. **Context7 ≠ Working Code** — API docs verified but library had runtime issues
2. **Fallback Strategy** — CSS flex layout is reliable backup
3. **MVP First** — Fixed layout is acceptable for MVP, resizable is enhancement

---

## 8. FUTURE ENHANCEMENT (Post-MVP)

When revisiting resizable panels:

```typescript
// Option 1: Try react-resizable-panels v2.x
npm install react-resizable-panels@2

// Option 2: Try allotment
npm install allotment

// Option 3: Custom CSS resize
// Use CSS resize property with custom handles
```
