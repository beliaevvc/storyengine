# BUILD-03: UI Component Library Plan

> **Plan ID**: BUILD-03
> **Component**: UI Component Library
> **Dependencies**: CP-3 (UI/UX Design System)
> **Priority**: HIGH
> **Estimated Effort**: Phase 3 of Implementation

---

## 1. OBJECTIVE

Настроить Shadcn/UI с кастомной темой GitHub Dark Dimmed и создать базовые компоненты согласно design system из CP-3.

---

## 2. FILES TO CREATE/MODIFY

```
src/
├── app/
│   └── globals.css              # Global styles + CSS variables
├── presentation/
│   └── components/
│       └── ui/                  # Shadcn UI components
│           ├── button.tsx
│           ├── card.tsx
│           ├── input.tsx
│           ├── textarea.tsx
│           ├── badge.tsx
│           ├── tabs.tsx
│           ├── tooltip.tsx
│           ├── dialog.tsx
│           ├── dropdown-menu.tsx
│           ├── scroll-area.tsx
│           ├── separator.tsx
│           └── index.ts
├── lib/
│   └── utils/
│       └── cn.ts               # className utility
└── tailwind.config.ts          # Tailwind configuration
```

---

## 3. IMPLEMENTATION STEPS

### Step 1: Install Dependencies

```bash
# Tailwind & PostCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Shadcn/UI dependencies
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
npm install lucide-react

# Additional Radix primitives (as needed)
npm install @radix-ui/react-tabs
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-separator

# Typography plugin
npm install @tailwindcss/typography
```

### Step 2: Configure Tailwind

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background tiers
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

        // Foreground / Text
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

        // State colors
        success: '#57ab5a',
        warning: '#c69026',
        error: '#e5534b',
        info: '#539bf5',

        // Entity type colors
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
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },

      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.375rem',
        lg: '0.5rem',
      },

      boxShadow: {
        panel: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        dropdown: '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
        modal: '0 8px 24px 0 rgba(0, 0, 0, 0.5)',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in-from-top 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

### Step 3: Create Global Styles

**File**: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.375rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-canvas text-fg font-sans antialiased;
  }

  /* Custom scrollbar */
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

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #30363d transparent;
  }
}

@layer components {
  /* Panel styles */
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
    @apply w-2 h-2 rounded-full flex-shrink-0;
  }

  .entity-dot-character {
    @apply bg-entity-character;
  }
  .entity-dot-location {
    @apply bg-entity-location;
  }
  .entity-dot-item {
    @apply bg-entity-item;
  }
  .entity-dot-event {
    @apply bg-entity-event;
  }
  .entity-dot-concept {
    @apply bg-entity-concept;
  }

  /* Tree view styles */
  .tree-item {
    @apply flex items-center gap-1 px-2 py-1 rounded-sm cursor-pointer
           text-sm text-fg hover:bg-overlay transition-colors;
  }

  .tree-item-selected {
    @apply bg-accent-subtle border-l-2 border-accent text-accent;
  }

  /* Focus ring */
  .focus-ring {
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas;
  }
}

@layer utilities {
  /* Text truncation */
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

### Step 4: Create Utility Function

**File**: `src/lib/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**File**: `src/lib/utils/index.ts`

```typescript
export { cn } from './cn';
```

### Step 5: Create Base Components

**File**: `src/presentation/components/ui/button.tsx`

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-fg-inverse hover:bg-accent-secondary',
        secondary: 'bg-transparent border border-border text-fg hover:bg-overlay hover:border-border-emphasis',
        ghost: 'text-fg-secondary hover:bg-overlay hover:text-fg',
        destructive: 'bg-error text-white hover:bg-error/90',
        link: 'text-fg-link underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

**File**: `src/presentation/components/ui/card.tsx`

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-md border border-border bg-surface text-fg shadow-panel',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-4 border-b border-border', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-sm font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-fg-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-4 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

**File**: `src/presentation/components/ui/input.tsx`

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-border bg-inset px-3 py-2 text-sm text-fg',
          'placeholder:text-fg-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

**File**: `src/presentation/components/ui/badge.tsx`

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-accent-subtle text-accent border border-accent/30',
        secondary: 'bg-overlay text-fg-secondary border border-border',
        success: 'bg-success/20 text-success border border-success/30',
        warning: 'bg-warning/20 text-warning border border-warning/30',
        error: 'bg-error/20 text-error border border-error/30',
        character: 'bg-entity-character/20 text-entity-character border border-entity-character/30',
        location: 'bg-entity-location/20 text-entity-location border border-entity-location/30',
        item: 'bg-entity-item/20 text-entity-item border border-entity-item/30',
        event: 'bg-entity-event/20 text-entity-event border border-entity-event/30',
        concept: 'bg-entity-concept/20 text-entity-concept border border-entity-concept/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

**File**: `src/presentation/components/ui/tooltip.tsx`

```typescript
'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-overlay border border-border px-3 py-1.5 text-xs text-fg shadow-dropdown animate-fade-in',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
```

**File**: `src/presentation/components/ui/index.ts`

```typescript
export { Button, buttonVariants } from './button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Input } from './input';
export { Badge, badgeVariants } from './badge';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
// Add more exports as components are created
```

### Step 6: Add Fonts

**File**: `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Merriweather } from 'next/font/google';
import { TooltipProvider } from '@/presentation/components/ui/tooltip';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
});

const merriweather = Merriweather({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'StoryEngine',
  description: 'IDE for Storytelling',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${merriweather.variable} dark`}
    >
      <body>
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
```

---

## 4. SUCCESS CRITERIA

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Tailwind configured | Build passes without errors |
| 2 | Colors match design | Visual inspection |
| 3 | Fonts loaded | Inter, JetBrains Mono, Merriweather render |
| 4 | Button variants work | All 5 variants render correctly |
| 5 | Badge entity types | All 5 entity colors work |
| 6 | Tooltip shows | Hover tooltip displays |
| 7 | Dark theme default | No flash of light theme |
| 8 | Scrollbars styled | Custom scrollbar visible |

---

## 5. COMMANDS TO EXECUTE

```bash
# Install dependencies
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot @radix-ui/react-tooltip

# Create directories
mkdir -p src/presentation/components/ui
mkdir -p src/lib/utils

# Initialize Tailwind (if not already)
npx tailwindcss init -p
```

---

## 6. NOTES

- Use `'use client'` for interactive components (tooltip, dialog, etc.)
- All colors use CSS variables via Tailwind
- Entity type badges use semantic variants
- TooltipProvider must wrap app for tooltips to work
