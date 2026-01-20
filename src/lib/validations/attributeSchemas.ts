import { z } from 'zod';

// ============================================
// BASE SCHEMAS
// ============================================

/** Типы атрибутов */
export const attributeTypeSchema = z.enum(['number', 'text', 'boolean', 'enum', 'list']);

/** Типы сущностей (для привязки атрибутов) */
export const entityTypeSchema = z.enum([
  'CHARACTER',
  'LOCATION',
  'ITEM',
  'EVENT',
  'FACTION',
  'WORLDBUILDING',
  'NOTE',
]);

// ============================================
// CONFIG SCHEMAS (для каждого типа атрибута)
// ============================================

/** Конфигурация числового атрибута */
export const numberConfigSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  default: z.number().optional(),
}).refine(
  (data) => {
    if (data.min !== undefined && data.max !== undefined) {
      return data.min <= data.max;
    }
    return true;
  },
  { message: 'Минимум не может быть больше максимума' }
);

/** Конфигурация текстового атрибута */
export const textConfigSchema = z.object({
  default: z.string().optional(),
  maxLength: z.number().positive().optional(),
});

/** Конфигурация булевого атрибута */
export const booleanConfigSchema = z.object({
  default: z.boolean().optional(),
});

/** Конфигурация enum атрибута */
export const enumConfigSchema = z.object({
  options: z.array(z.string().min(1)).min(1, 'Необходимо добавить хотя бы один вариант'),
  default: z.string().optional(),
}).refine(
  (data) => {
    if (data.default !== undefined) {
      return data.options.includes(data.default);
    }
    return true;
  },
  { message: 'Значение по умолчанию должно быть из списка вариантов' }
);

/** Конфигурация list атрибута */
export const listConfigSchema = z.object({
  default: z.array(z.string()).optional(),
});

// ============================================
// DISCRIMINATED UNION FOR CONFIG
// ============================================

/** Конфигурация в зависимости от типа */
export const attributeConfigSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('number'), config: numberConfigSchema }),
  z.object({ type: z.literal('text'), config: textConfigSchema }),
  z.object({ type: z.literal('boolean'), config: booleanConfigSchema }),
  z.object({ type: z.literal('enum'), config: enumConfigSchema }),
  z.object({ type: z.literal('list'), config: listConfigSchema }),
]);

// ============================================
// CREATE / UPDATE SCHEMAS
// ============================================

/** Схема для создания атрибута */
export const createAttributeSchema = z.object({
  projectId: z.string().uuid('Некорректный ID проекта'),
  name: z
    .string()
    .min(1, 'Название обязательно')
    .max(100, 'Название не должно превышать 100 символов')
    .transform((val) => val.trim()),
  type: attributeTypeSchema,
  config: z.record(z.string(), z.unknown()).default({}),
  entityTypes: z.array(z.string()).default([]),
  color: z.string().optional(),
  icon: z.string().optional(),
});

/** Схема для обновления атрибута */
export const updateAttributeSchema = z.object({
  name: z
    .string()
    .min(1, 'Название не может быть пустым')
    .max(100, 'Название не должно превышать 100 символов')
    .transform((val) => val.trim())
    .optional(),
  type: attributeTypeSchema.optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  entityTypes: z.array(z.string()).optional(),
  color: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  order: z.number().int().min(0).optional(),
});

/** Схема для изменения порядка атрибутов */
export const reorderAttributesSchema = z.object({
  projectId: z.string().uuid('Некорректный ID проекта'),
  orderedIds: z.array(z.string().uuid()),
});

// ============================================
// INFERRED TYPES
// ============================================

export type AttributeTypeSchema = z.infer<typeof attributeTypeSchema>;
export type CreateAttributeSchema = z.infer<typeof createAttributeSchema>;
export type UpdateAttributeSchema = z.infer<typeof updateAttributeSchema>;
export type ReorderAttributesSchema = z.infer<typeof reorderAttributesSchema>;

export type NumberConfigSchema = z.infer<typeof numberConfigSchema>;
export type TextConfigSchema = z.infer<typeof textConfigSchema>;
export type BooleanConfigSchema = z.infer<typeof booleanConfigSchema>;
export type EnumConfigSchema = z.infer<typeof enumConfigSchema>;
export type ListConfigSchema = z.infer<typeof listConfigSchema>;
