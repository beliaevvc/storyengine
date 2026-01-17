# Project Brief

## Project: StoryEngine

### Overview
StoryEngine — это революционная IDE для писателей. Философия продукта основана на концепции "сюжет — это код", где история рассматривается не просто как текст, а как набор состояний базы данных.

### Vision Statement
Мы создаем IDE для сторителлинга — инструмент, который позволяет писателям управлять своими историями так же эффективно, как разработчики управляют кодом.

### Core Philosophy
1. **Сюжет — это код**: История — это не просто текст, это набор состояний базы данных
2. **Single Source of Truth**: Информация о персонаже (имя, возраст, статус) хранится в БД. Текст в редакторе — это лишь "рендер" этой информации
3. **AI-Native**: Архитектура готова к подключению ИИ-агентов, которые читают и меняют базу данных в реальном времени

### Technical Stack
| Layer | Technology |
|-------|------------|
| **Frontend Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | Shadcn/UI (Radix primitives) |
| **State Management** | Zustand (для клиентского стейта IDE) |
| **Editor** | Tiptap (Headless WYSIWYG) — критично для расширяемости |
| **ORM** | Prisma ORM |
| **Database** | PostgreSQL |

### Design System (Visual Vibes)
| Aspect | Specification |
|--------|---------------|
| **Style** | "GitHub Dark Dimmed" / "Modern IDE" |
| **Palette** | Темно-серые тона, тонкие бордюры (1px borders), акцентный синий (VS Code style) |
| **UI Typography** | Inter / San Francisco |
| **Data Typography** | JetBrains Mono (для данных, мета-тегов, свойств) |
| **Content Typography** | Merriweather / Noto Serif (для текста книги) |
| **Feel** | Плотный, функциональный интерфейс. Минимум анимаций, максимум информации |

### Key Architectural Requirements

#### Database Schema (Prisma)
1. **Project**: Книга/сценарий
2. **Entity**: Полиморфная сущность (Персонажи, Локации, Предметы) с JSONB attributes
3. **Beat/Scene**: Единица сюжета со связью с Entity
4. **Document**: Текст (содержимое главы)

#### IDE Layout (Three-Panel Design)
1. **Left Panel (Project Explorer)**:
   - Дерево файлов (Главы → Сцены)
   - Вкладка "Database" (Список сущностей)

2. **Center Panel (The Editor)**:
   - Tiptap редактор
   - Breadcrumbs навигация

3. **Right Panel (Context Inspector / AI Copilot)**:
   - "Active Entities" — карточка из БД при клике на имя
   - "AI Chat" — место для будущего агента

#### Two-Way Binding (Mock)
- При клике на имя персонажа → загрузка данных из Mock DB / Zustand
- Кнопка "AI Scan" → симуляция сканирования текста и обновление "Entities present in scene"

### Key Constraints

#### Mandatory Practices
1. **Clean Architecture**: Строгое следование принципам чистой архитектуры
2. **MCP Context7**: Всегда использовать для получения актуальных данных о библиотеках
3. **No Placeholders**: Писать рабочий код для MVP, не использовать "To Do" плейсхолдеры
4. **Modular Code**: Код должен быть чистым, модульным и готовым к расширению

#### Development Approach
- **Plan First**: Детальный план реализации перед написанием кода
- **Hierarchical Planning**: Каждому пункту может понадобиться отдельный детальный план
- **Command Semantics**:
  - `plan` → создание общего плана планов
  - `build` → создание детальных планов (не код!)

### Success Criteria
- [ ] Рабочий Prisma Schema с правильными связями
- [ ] IDE Layout с тремя resizable панелями
- [ ] Интегрированный Tiptap редактор
- [ ] Two-way binding между текстом и mock database
- [ ] AI-ready архитектура
- [ ] Clean Architecture соблюдена

### Project Complexity
**Level 4: Complex System**
- Полная архитектура системы
- Множество подсистем (DB, UI, Editor, State, AI-ready)
- Архитектурные импликации на уровне всего приложения
- Требует детального планирования и фазированной реализации
