/**
 * Типы для системы настраиваемых типов сущностей
 * 
 * Позволяет пользователю создавать свои типы сущностей с иконками и цветами
 */

// ============================================
// ENTITY TYPE DEFINITION
// ============================================

/**
 * Определение типа сущности
 * Хранится в таблице entity_type_definitions
 */
export interface EntityTypeDefinition {
  id: string;
  projectId: string;
  name: string;      // внутреннее имя (CHARACTER, custom_type_1)
  label: string;     // отображаемое название (Персонаж, Мой тип)
  icon: string;      // имя иконки из Lucide (User, MapPin)
  color: string;     // hex цвет (#3b82f6)
  order: number;
  isDefault: boolean; // дефолтный тип (создан при создании проекта)
  createdAt: Date;
  updatedAt: Date;
}

/** Input для создания типа */
export interface CreateEntityTypeInput {
  projectId: string;
  name: string;
  label: string;
  icon: string;
  color: string;
  isDefault?: boolean;
}

/** Input для обновления типа */
export interface UpdateEntityTypeInput {
  name?: string;
  label?: string;
  icon?: string;
  color?: string;
  order?: number;
}

// ============================================
// DEFAULT TYPES
// ============================================

/** Дефолтные типы для новых проектов */
export const DEFAULT_ENTITY_TYPES: Omit<CreateEntityTypeInput, 'projectId'>[] = [
  { name: 'CHARACTER', label: 'Персонаж', icon: 'User', color: '#3b82f6', isDefault: true },
  { name: 'LOCATION', label: 'Локация', icon: 'MapPin', color: '#22c55e', isDefault: true },
  { name: 'ITEM', label: 'Предмет', icon: 'Package', color: '#eab308', isDefault: true },
  { name: 'EVENT', label: 'Событие', icon: 'Calendar', color: '#a855f7', isDefault: true },
  { name: 'FACTION', label: 'Фракция', icon: 'Users', color: '#f97316', isDefault: true },
  { name: 'WORLDBUILDING', label: 'Мир', icon: 'Globe', color: '#06b6d4', isDefault: true },
  { name: 'NOTE', label: 'Заметка', icon: 'StickyNote', color: '#6b7280', isDefault: true },
];

// ============================================
// AVAILABLE ICONS
// ============================================

/** Доступные иконки для выбора (из Lucide) */
export const AVAILABLE_ICONS = [
  // Персонажи
  'User', 'Users', 'UserCircle', 'UserSquare', 'Baby', 'Ghost',
  // Локации
  'MapPin', 'Map', 'Building', 'Building2', 'Home', 'Castle', 'Tent', 'Church',
  // Предметы
  'Package', 'Box', 'Gem', 'Crown', 'Sword', 'Shield', 'Key', 'Gift',
  // Время/События
  'Calendar', 'Clock', 'Timer', 'Hourglass',
  // Группы
  'Flag', 'Landmark', 'Award', 'Medal',
  // Мир
  'Globe', 'Compass', 'Mountain', 'TreePine', 'Sun', 'Moon', 'Cloud', 'Sparkles',
  // Документы
  'StickyNote', 'FileText', 'Book', 'BookOpen', 'Scroll', 'Newspaper',
  // Разное
  'Heart', 'Star', 'Zap', 'Flame', 'Skull', 'Anchor', 'Rocket', 'Eye',
] as const;

export type AvailableIcon = typeof AVAILABLE_ICONS[number];

// ============================================
// PRESET COLORS
// ============================================

/** Предустановленные цвета для выбора */
export const PRESET_COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#f97316', // orange
  '#ef4444', // red
  '#a855f7', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#14b8a6', // teal
  '#84cc16', // lime
  '#6b7280', // gray
  '#78716c', // stone
] as const;

export type PresetColor = typeof PRESET_COLORS[number];
