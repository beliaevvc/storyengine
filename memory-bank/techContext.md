# Tech Context

## Project: StoryEngine

---

## 🚨 CRITICAL RULE: ALWAYS USE LATEST VERSIONS + CONTEXT7

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️  MANDATORY: CONTEXT7 VERIFICATION                            │
├─────────────────────────────────────────────────────────────────┤
│ BEFORE implementing ANY library/framework:                       │
│                                                                  │
│ 1. Call `resolve-library-id` to find library                    │
│ 2. Call `query-docs` to get CURRENT documentation               │
│ 3. Use LATEST stable version (not outdated from plans)          │
│ 4. Adapt code to current API (not deprecated patterns)          │
│                                                                  │
│ This ensures we NEVER use outdated APIs or deprecated code!     │
└─────────────────────────────────────────────────────────────────┘
```

---

### Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND                                   │
├─────────────────────────────────────────────────────────────────┤
│  Framework:     Next.js 14+ (App Router)                        │
│  Language:      TypeScript 5.x                                  │
│  Styling:       Tailwind CSS 3.x                                │
│  UI Library:    Shadcn/UI (Radix Primitives)                    │
│  State:         Zustand 4.x                                     │
│  Editor:        Tiptap 2.x (Headless WYSIWYG)                   │
├─────────────────────────────────────────────────────────────────┤
│                       BACKEND                                    │
├─────────────────────────────────────────────────────────────────┤
│  Runtime:       Next.js API Routes / Server Actions             │
│  ORM:           Prisma 7.x (with adapter pattern)               │
│  Database:      PostgreSQL 14+                                  │
│  Auth:          TBD (future - likely NextAuth.js)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Technologies

### Next.js 14+ (App Router)
**Role**: Application framework
**Key Features Used**:
- App Router for file-based routing
- Server Components for performance
- Server Actions for mutations
- Route Handlers for API
- Middleware for auth (future)

**Configuration Notes**:
- TypeScript strict mode
- ESLint + Prettier
- Path aliases (@/)

### TypeScript
**Role**: Type safety
**Configuration**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Tailwind CSS
**Role**: Styling
**Configuration**:
- Dark theme by default (GitHub Dark Dimmed style)
- Custom color palette
- Typography plugin for prose

**Custom Theme Aspects**:
```javascript
// Palette concept
colors: {
  background: '#1c2128',      // Main background
  surface: '#22272e',         // Panel surfaces
  border: '#373e47',          // Borders
  text: {
    primary: '#adbac7',
    secondary: '#768390',
    muted: '#545d68'
  },
  accent: '#539bf5'           // VS Code blue
}
```

### Shadcn/UI
**Role**: UI component library
**Key Components Needed**:
- Button, Input, Textarea
- Dialog, Sheet, Popover
- Tabs, Accordion
- Command (for command palette)
- Toast (notifications)
- Card (entity cards)
- Tree (file explorer) — may need custom

**Installation**: CLI-based, components copied to project

### Zustand
**Role**: Client state management
**Store Structure**:
```typescript
// Planned stores
- useProjectStore     // Current project, settings
- useEntityStore      // All entities, selected entity
- useEditorStore      // Editor content, cursor position
- useUIStore          // Panel sizes, active tabs, modals
```

### Tiptap
**Role**: Text editor
**Key Extensions Needed**:
- StarterKit (basic formatting)
- Placeholder
- Typography
- CharacterCount
- Custom: EntityMention (for @mentions)
- Custom: EntityHighlight (for entity detection)

**Integration Pattern**:
```typescript
// Editor will emit events on:
- Entity selection (click on highlighted name)
- Content change (for entity scanning)
- Cursor position (for context)
```

### Prisma 7.x (UPDATED via Context7)
**Role**: Database ORM
**Key Features**:
- Type-safe database queries
- Migrations
- Schema-first approach
- JSONB support for flexible attributes

**Prisma 7 Breaking Changes** (verified via Context7):
```typescript
// OLD (Prisma 5) - DEPRECATED:
// url in schema.prisma datasource block

// NEW (Prisma 7):
// 1. prisma.config.ts for CLI configuration
// 2. Adapter pattern for PrismaClient
// 3. Generated client in custom path

// prisma.config.ts
import { defineConfig } from 'prisma/config';
export default defineConfig({
  datasource: { url: process.env.DATABASE_URL }
});

// Client initialization
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
```

### PostgreSQL
**Role**: Primary database
**Key Features Used**:
- JSONB columns (for Entity attributes)
- Full-text search (future)
- Relations

---

## Development Tools

### Required
| Tool | Purpose | Version |
|------|---------|---------|
| Node.js | Runtime | 18+ LTS |
| pnpm/npm | Package manager | Latest |
| PostgreSQL | Database | 14+ |

### Recommended
| Tool | Purpose |
|------|---------|
| Docker | Local PostgreSQL |
| Prisma Studio | Database GUI |
| VS Code | IDE |

---

## Key Dependencies (ALWAYS LATEST - verify with Context7!)

### Production
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "@radix-ui/*": "latest",
  "zustand": "^4.x",
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@prisma/client": "^7.x",
  "@prisma/adapter-pg": "^7.x",
  "react-resizable-panels": "^2.x",
  "clsx": "^2.x",
  "lucide-react": "latest",
  "dotenv": "^16.x"
}
```

### Development
```json
{
  "prisma": "^7.x",
  "@types/react": "^18.x",
  "@types/node": "^20.x",
  "eslint": "^8.x",
  "prettier": "^3.x",
  "prettier-plugin-tailwindcss": "latest",
  "ts-node": "^10.x"
}
```

### ⚠️ Version Policy
**ALWAYS use `npm install package@latest`** — do NOT pin to old versions from plans!
Verify current API with Context7 before implementation.

---

## External Services (MVP)

### Required for MVP
- **PostgreSQL Database**: Local Docker or cloud (Supabase, Neon, etc.)

### Future Integrations
- **AI Provider**: OpenAI / Anthropic for AI features
- **Auth Provider**: NextAuth.js with providers
- **File Storage**: For attachments (if needed)

---

## Environment Variables (Planned)

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Future: AI
# OPENAI_API_KEY=""

# Future: Auth
# NEXTAUTH_SECRET=""
# NEXTAUTH_URL=""
```

---

## Performance Considerations

### Server Components
- Default to Server Components
- Use Client Components only when needed (interactivity)

### Database
- Prisma query optimization
- Proper indexing
- Connection pooling

### Editor
- Debounced saves
- Efficient entity scanning
- Virtual rendering for long documents (future)

### State
- Zustand selectors for minimal re-renders
- Memoization where appropriate

---

## Security Considerations (Future)

### Data
- Input validation (Zod)
- SQL injection protection (Prisma handles)
- XSS protection in editor content

### Auth (Future)
- Session management
- CSRF protection
- Role-based access

---

## 🔥 MCP Context7 Integration — MANDATORY

**Purpose**: Получение АКТУАЛЬНОЙ документации для библиотек

### ⚠️ ОБЯЗАТЕЛЬНО перед каждой имплементацией:

```
┌─────────────────────────────────────────────────────────────────┐
│ WORKFLOW: Library Implementation                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. resolve-library-id(libraryName, query)                       │
│    → Get Context7-compatible ID                                 │
│                                                                  │
│ 2. query-docs(libraryId, "specific question about API")         │
│    → Get current documentation and examples                     │
│                                                                  │
│ 3. Implement using CURRENT API (not outdated plans!)            │
│                                                                  │
│ 4. If API changed from plan → UPDATE the plan!                  │
└─────────────────────────────────────────────────────────────────┘
```

### Context7 Library IDs (Verified)

| Library | Context7 ID | Status |
|---------|-------------|--------|
| Next.js | `/vercel/next.js` | ✅ Ready |
| Prisma | `/prisma/docs` | ✅ Verified (Prisma 7) |
| Zustand | `/websites/zustand_pmnd_rs` | ⏳ Check before use |
| Tiptap | `/ueberdosis/tiptap-docs` | ⏳ Check before use |
| react-resizable-panels | `/bvaughn/react-resizable-panels` | ⏳ Check before use |

### Example: Prisma 7 Discovery
```
// Query that revealed Prisma 7 breaking changes:
query-docs("/prisma/docs", "Prisma 7 prisma.config.ts migration")

// Result: url in datasource block deprecated!
// Solution: prisma.config.ts + adapter pattern
```

---

## Technical Constraints

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support

### Node.js
- Version 18+ required

### Database
- PostgreSQL 14+ required
- JSONB support required

---

## Technical Debt Tracking

| Item | Priority | Notes |
|------|----------|-------|
| TBD | - | Will be tracked during implementation |

---

## Research Notes

### Tiptap Entity Detection
Need to research:
- Custom marks for entity highlighting
- Click handling on marks
- Real-time content scanning

### Resizable Panels
`react-resizable-panels` — primary choice for IDE layout

### IDE-like Tree View
May need custom implementation or find suitable library for file tree
