# 🎨🎨🎨 CREATIVE PHASE CP-3: UI/UX DESIGN SYSTEM 🎨🎨🎨

> **Phase ID**: CP-3
> **Type**: UI/UX Design
> **Priority**: HIGH
> **Status**: IN PROGRESS
> **Created**: 2026-01-17

---

## 1. PROBLEM STATEMENT

### Контекст
StoryEngine должен выглядеть и ощущаться как профессиональная IDE. Целевой стиль: "GitHub Dark Dimmed" / "Modern IDE" (VS Code, Linear).

### Требования

| Требование | Описание |
|------------|----------|
| R1 | Dark theme по умолчанию (GitHub Dark Dimmed style) |
| R2 | Плотный, функциональный интерфейс |
| R3 | Минимум анимаций, максимум информации |
| R4 | Три типографических стиля (UI, Data, Content) |
| R5 | Тонкие бордюры (1px), акцентный синий |
| R6 | Совместимость с Shadcn/UI |

### Design References

- **GitHub Dark Dimmed**: Основная палитра
- **VS Code**: Layout и плотность информации
- **Linear**: Минимализм и качество UI
- **Notion**: Подход к редактору

---

## 2. COLOR PALETTE

### 2.1 Core Colors (GitHub Dark Dimmed inspired)

```css
/* Background Tiers */
--bg-canvas:     #1c2128;  /* Main app background */
--bg-surface:    #22272e;  /* Cards, panels */
--bg-overlay:    #2d333b;  /* Dropdowns, modals */
--bg-inset:      #161b22;  /* Inset areas, inputs */

/* Border Colors */
--border-default:  #373e47;  /* Standard borders */
--border-muted:    #30363d;  /* Subtle borders */
--border-emphasis: #444c56;  /* Emphasized borders */

/* Text Colors */
--text-primary:    #adbac7;  /* Primary text */
--text-secondary:  #768390;  /* Secondary text */
--text-muted:      #545d68;  /* Muted/disabled text */
--text-link:       #539bf5;  /* Links */
--text-inverse:    #1c2128;  /* Text on accent backgrounds */

/* Accent Colors */
--accent-primary:   #539bf5;  /* Primary accent (VS Code blue) */
--accent-secondary: #316dca;  /* Darker accent */
--accent-subtle:    #1f3855;  /* Subtle accent background */

/* State Colors */
--success:     #57ab5a;  /* Success states */
--warning:     #c69026;  /* Warning states */
--error:       #e5534b;  /* Error states */
--info:        #539bf5;  /* Info states */

/* Entity Type Colors */
--entity-character: #a371f7;  /* Purple for characters */
--entity-location:  #57ab5a;  /* Green for locations */
--entity-item:      #c69026;  /* Gold for items */
--entity-event:     #e5534b;  /* Red for events */
--entity-concept:   #539bf5;  /* Blue for concepts */
```

### 2.2 Color Usage Guidelines

| Element | Background | Border | Text |
|---------|------------|--------|------|
| App background | `--bg-canvas` | - | - |
| Panels | `--bg-surface` | `--border-default` | `--text-primary` |
| Cards | `--bg-overlay` | `--border-muted` | `--text-primary` |
| Inputs | `--bg-inset` | `--border-default` | `--text-primary` |
| Buttons (primary) | `--accent-primary` | - | `--text-inverse` |
| Buttons (secondary) | `transparent` | `--border-default` | `--text-primary` |
| Hover states | `--bg-overlay` | `--border-emphasis` | `--text-primary` |
| Active states | `--accent-subtle` | `--accent-primary` | `--accent-primary` |

---

## 3. TYPOGRAPHY

### 3.1 Font Stack

```css
/* UI Font - Interface elements */
--font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Mono Font - Code, data, metadata */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;

/* Content Font - Book/story text */
--font-content: 'Merriweather', 'Noto Serif', Georgia, serif;
```

### 3.2 Type Scale

```css
/* UI Typography */
--text-xs:    0.75rem;   /* 12px - Labels, badges */
--text-sm:    0.875rem;  /* 14px - Secondary text, buttons */
--text-base:  1rem;      /* 16px - Body text */
--text-lg:    1.125rem;  /* 18px - Subheadings */
--text-xl:    1.25rem;   /* 20px - Panel titles */
--text-2xl:   1.5rem;    /* 24px - Page titles */

/* Line Heights */
--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;

/* Font Weights */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### 3.3 Typography Usage

| Context | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Panel titles | UI | `--text-sm` | semibold | `--text-primary` |
| Body text | UI | `--text-sm` | normal | `--text-primary` |
| Labels | UI | `--text-xs` | medium | `--text-secondary` |
| Code/Data | Mono | `--text-xs` | normal | `--text-secondary` |
| Entity names | Mono | `--text-sm` | medium | (by type color) |
| Editor content | Content | `--text-base` | normal | `--text-primary` |
| Editor headings | Content | `--text-lg` - `--text-2xl` | semibold | `--text-primary` |

---

## 4. SPACING & LAYOUT

### 4.1 Spacing Scale

```css
--space-0:   0;
--space-1:   0.25rem;   /* 4px */
--space-2:   0.5rem;    /* 8px */
--space-3:   0.75rem;   /* 12px */
--space-4:   1rem;      /* 16px */
--space-5:   1.25rem;   /* 20px */
--space-6:   1.5rem;    /* 24px */
--space-8:   2rem;      /* 32px */
--space-10:  2.5rem;    /* 40px */
--space-12:  3rem;      /* 48px */
```

### 4.2 Layout Dimensions

```css
/* Panel widths */
--panel-left-min:    200px;
--panel-left-default: 260px;
--panel-left-max:    400px;

--panel-right-min:   240px;
--panel-right-default: 320px;
--panel-right-max:   480px;

/* Heights */
--header-height:    48px;
--toolbar-height:   40px;
--tab-height:       36px;
--breadcrumb-height: 32px;

/* Border radius */
--radius-none: 0;
--radius-sm:   0.25rem;  /* 4px */
--radius-md:   0.375rem; /* 6px */
--radius-lg:   0.5rem;   /* 8px */
--radius-full: 9999px;
```

### 4.3 IDE Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Header (48px)                                           [⚙️] [👤]     │
├─────────────────────────────────────────────────────────────────────────┤
│           │                                    │                        │
│   Left    │         Center Panel               │        Right          │
│  Panel    │         (Editor)                   │        Panel          │
│  (260px)  │                                    │        (320px)        │
│           │  ┌─────────────────────────────┐  │                        │
│  ┌─────┐  │  │ Breadcrumbs (32px)          │  │  ┌──────────────────┐ │
│  │Files│  │  ├─────────────────────────────┤  │  │ Active Entities  │ │
│  │     │  │  │ Toolbar (40px)              │  │  │                  │ │
│  │Tree │  │  ├─────────────────────────────┤  │  │  ┌────────────┐  │ │
│  │     │  │  │                             │  │  │  │Entity Card│  │ │
│  └─────┘  │  │                             │  │  │  └────────────┘  │ │
│           │  │     Editor Content          │  │  │                  │ │
│  ┌─────┐  │  │                             │  │  └──────────────────┘ │
│  │Data │  │  │                             │  │                        │
│  │base │  │  │                             │  │  ┌──────────────────┐ │
│  │     │  │  │                             │  │  │    AI Chat       │ │
│  │List │  │  │                             │  │  │   (Placeholder)  │ │
│  └─────┘  │  └─────────────────────────────┘  │  └──────────────────┘ │
│           │                                    │                        │
└───────────┴────────────────────────────────────┴────────────────────────┘
```

---

## 5. COMPONENT PATTERNS

### 5.1 Panel Component

```
┌─ Panel ─────────────────────────────────┐
│ ┌─ Header ────────────────────────────┐ │
│ │ [Icon] Title              [Actions] │ │
│ └─────────────────────────────────────┘ │
│ ┌─ Content ───────────────────────────┐ │
│ │                                     │ │
│ │                                     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Styles:
- Background: var(--bg-surface)
- Border: 1px solid var(--border-default)
- Header: border-bottom, padding: var(--space-2) var(--space-3)
- Content: padding: var(--space-2)
```

### 5.2 Entity Card Component

```
┌─ EntityCard ────────────────────────────┐
│ ┌─ Header ────────────────────────────┐ │
│ │ [●] Character Name          [⋮]    │ │
│ │     "Protagonist"                   │ │
│ └─────────────────────────────────────┘ │
│ ┌─ Attributes ────────────────────────┐ │
│ │ Age: 32                             │ │
│ │ Status: alive                       │ │
│ │ Occupation: Detective               │ │
│ └─────────────────────────────────────┘ │
│ ┌─ Tags ──────────────────────────────┐ │
│ │ [main] [mystery] [london]           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Styles:
- Background: var(--bg-overlay)
- Border: 1px solid var(--border-muted)
- Border-radius: var(--radius-md)
- Entity type indicator: colored dot (var(--entity-character))
- Attributes: font-mono, var(--text-xs)
- Tags: small badges with subtle background
```

### 5.3 Tree Item Component

```
┌─ TreeItem ──────────────────────────────┐
│ [▶] [📄] Chapter 1: The Beginning      │
│     [▶] [📝] Scene 1                   │
│     [─] [📝] Scene 2                   │
│ [▼] [📄] Chapter 2: Rising Action      │
│     [─] [📝] Scene 3                   │
└─────────────────────────────────────────┘

Styles:
- Indent: var(--space-4) per level
- Icon size: 16px
- Hover: var(--bg-overlay)
- Selected: var(--accent-subtle), border-left: 2px solid var(--accent-primary)
- Font: var(--font-ui), var(--text-sm)
```

### 5.4 Button Variants

```css
/* Primary Button */
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverse);
  border: none;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: none;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

/* Icon Button */
.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}
```

---

## 6. TAILWIND CONFIGURATION

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background
        canvas: '#1c2128',
        surface: '#22272e',
        overlay: '#2d333b',
        inset: '#161b22',
        
        // Border
        border: {
          DEFAULT: '#373e47',
          muted: '#30363d',
          emphasis: '#444c56',
        },
        
        // Text
        fg: {
          DEFAULT: '#adbac7',
          secondary: '#768390',
          muted: '#545d68',
          link: '#539bf5',
          inverse: '#1c2128',
        },
        
        // Accent
        accent: {
          DEFAULT: '#539bf5',
          secondary: '#316dca',
          subtle: '#1f3855',
        },
        
        // State
        success: '#57ab5a',
        warning: '#c69026',
        error: '#e5534b',
        info: '#539bf5',
        
        // Entity types
        entity: {
          character: '#a371f7',
          location: '#57ab5a',
          item: '#c69026',
          event: '#e5534b',
          concept: '#539bf5',
        },
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Merriweather', 'Noto Serif', 'Georgia', 'serif'],
      },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],    // 10px
        xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],       // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
      },
      
      spacing: {
        '4.5': '1.125rem',  // 18px
        '13': '3.25rem',    // 52px
        '15': '3.75rem',    // 60px
      },
      
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'dropdown': '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
        'modal': '0 8px 24px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

---

## 7. CSS VARIABLES FILE

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors - using Tailwind config values */
    --background: 222 22% 14%;
    --foreground: 213 23% 73%;
    
    --card: 216 21% 16%;
    --card-foreground: 213 23% 73%;
    
    --popover: 216 18% 20%;
    --popover-foreground: 213 23% 73%;
    
    --primary: 213 86% 64%;
    --primary-foreground: 222 22% 14%;
    
    --secondary: 215 16% 22%;
    --secondary-foreground: 213 23% 73%;
    
    --muted: 215 16% 22%;
    --muted-foreground: 213 12% 47%;
    
    --accent: 213 56% 42%;
    --accent-foreground: 213 23% 73%;
    
    --destructive: 4 66% 60%;
    --destructive-foreground: 0 0% 100%;
    
    --border: 214 14% 24%;
    --input: 215 16% 22%;
    --ring: 213 86% 64%;
    
    --radius: 0.375rem;
  }
}

@layer base {
  body {
    @apply bg-canvas text-fg font-sans antialiased;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-border-muted rounded-full;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-border;
  }
}

@layer components {
  /* Panel base styles */
  .panel {
    @apply bg-surface border border-border rounded-md;
  }
  
  .panel-header {
    @apply px-3 py-2 border-b border-border flex items-center justify-between;
  }
  
  .panel-title {
    @apply text-sm font-semibold text-fg;
  }
  
  .panel-content {
    @apply p-2;
  }
  
  /* Entity type indicators */
  .entity-dot {
    @apply w-2 h-2 rounded-full;
  }
  
  .entity-dot-character { @apply bg-entity-character; }
  .entity-dot-location { @apply bg-entity-location; }
  .entity-dot-item { @apply bg-entity-item; }
  .entity-dot-event { @apply bg-entity-event; }
  .entity-dot-concept { @apply bg-entity-concept; }
  
  /* Tree item styles */
  .tree-item {
    @apply flex items-center gap-1 px-2 py-1 rounded-sm cursor-pointer
           hover:bg-overlay transition-colors;
  }
  
  .tree-item-selected {
    @apply bg-accent-subtle border-l-2 border-accent;
  }
}
```

---

## 8. VERIFICATION CHECKLIST

### Requirements Coverage
- [x] R1: Dark theme по умолчанию ✅
- [x] R2: Плотный, функциональный интерфейс ✅
- [x] R3: Минимум анимаций ✅
- [x] R4: Три типографики (UI, Data, Content) ✅
- [x] R5: 1px borders, синий accent ✅
- [x] R6: Shadcn/UI совместимость ✅

### Design Validation
- [x] Color palette определена
- [x] Typography scale задан
- [x] Spacing система определена
- [x] Component patterns описаны
- [x] Tailwind config готов
- [x] CSS variables готовы

---

# 🎨🎨🎨 EXITING CREATIVE PHASE CP-3 🎨🎨🎨

## Summary
Создана полная design system в стиле "GitHub Dark Dimmed" с поддержкой трех типографик и entity-type color coding.

## Key Decisions
1. GitHub Dark Dimmed как основа палитры
2. Три font families: Inter (UI), JetBrains Mono (data), Merriweather (content)
3. Entity types с цветовым кодированием
4. Tailwind + CSS variables для максимальной гибкости
5. Component patterns для Panel, EntityCard, TreeItem

## Files to Create
- `tailwind.config.ts`
- `src/app/globals.css`
- `src/presentation/components/ui/` (Shadcn components с темой)
