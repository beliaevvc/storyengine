/**
 * Типы для системы кастомных атрибутов (Project Schema Editor)
 * 
 * Позволяет пользователю определять собственные характеристики для сущностей
 */

// ============================================
// ATTRIBUTE TYPES
// ============================================

/** Поддерживаемые типы данных для атрибутов */
export type AttributeType = 'number' | 'text' | 'boolean' | 'enum' | 'list';

/** Названия типов на русском для UI */
export const ATTRIBUTE_TYPE_LABELS: Record<AttributeType, string> = {
  number: 'Число',
  text: 'Текст',
  boolean: 'Флаг',
  enum: 'Выбор из списка',
  list: 'Список',
};

// ============================================
// CONFIG TYPES (для каждого типа атрибута)
// ============================================

/** Конфигурация для числового атрибута */
export interface NumberConfig {
  min?: number;
  max?: number;
  default?: number;
}

/** Конфигурация для текстового атрибута */
export interface TextConfig {
  default?: string;
  maxLength?: number;
}

/** Конфигурация для булевого атрибута */
export interface BooleanConfig {
  default?: boolean;
}

/** Конфигурация для enum атрибута (выбор из списка) */
export interface EnumConfig {
  options: string[];
  default?: string;
}

/** Конфигурация для list атрибута (коллекция строк) */
export interface ListConfig {
  default?: string[];
}

/** Union тип для всех конфигураций */
export type AttributeConfigMap = {
  number: NumberConfig;
  text: TextConfig;
  boolean: BooleanConfig;
  enum: EnumConfig;
  list: ListConfig;
};

// ============================================
// ATTRIBUTE DEFINITION
// ============================================

/** 
 * Определение атрибута в схеме проекта
 * Хранится в таблице AttributeDefinition
 */
export interface AttributeDefinition {
  id: string;
  projectId: string;
  name: string;
  type: AttributeType;
  config: Record<string, unknown>;
  /** Пустой массив = атрибут применяется ко всем типам сущностей */
  entityTypes: string[];
  color?: string | null;
  icon?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Input для создания атрибута */
export interface CreateAttributeInput {
  projectId: string;
  name: string;
  type: AttributeType;
  config?: Record<string, unknown>;
  entityTypes?: string[];
  color?: string;
  icon?: string;
}

/** Input для обновления атрибута */
export interface UpdateAttributeInput {
  name?: string;
  type?: AttributeType;
  config?: Record<string, unknown>;
  entityTypes?: string[];
  color?: string | null;
  icon?: string | null;
  order?: number;
}

// ============================================
// HELPERS
// ============================================

/** Дефолтные конфигурации для каждого типа */
export const DEFAULT_ATTRIBUTE_CONFIGS: AttributeConfigMap = {
  number: { min: 0, max: 100, default: 0 },
  text: { default: '', maxLength: 500 },
  boolean: { default: false },
  enum: { options: [], default: undefined },
  list: { default: [] },
};

/** Проверяет, применяется ли атрибут к данному типу сущности */
export function isAttributeApplicableToEntityType(
  attribute: AttributeDefinition,
  entityType: string
): boolean {
  // Пустой массив = применяется ко всем типам
  if (attribute.entityTypes.length === 0) {
    return true;
  }
  return attribute.entityTypes.includes(entityType);
}
