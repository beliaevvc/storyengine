import { z } from 'zod';

export const entityTypeSchema = z.enum([
  'CHARACTER',
  'LOCATION',
  'ITEM',
  'EVENT',
  'CONCEPT',
]);

export const createEntitySchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  type: entityTypeSchema,
  name: z
    .string()
    .min(1, 'Entity name is required')
    .max(255, 'Entity name must be less than 255 characters')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional()
    .transform((val) => val?.trim()),
  attributes: z.record(z.string(), z.unknown()).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export const updateEntitySchema = z.object({
  type: entityTypeSchema.optional(),
  name: z
    .string()
    .min(1, 'Entity name cannot be empty')
    .max(255, 'Entity name must be less than 255 characters')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .nullable()
    .optional()
    .transform((val) => val?.trim() ?? val),
  attributes: z.record(z.string(), z.unknown()).optional(),
  imageUrl: z.string().url('Invalid image URL').nullable().optional(),
});

export type EntityTypeSchema = z.infer<typeof entityTypeSchema>;
export type CreateEntitySchema = z.infer<typeof createEntitySchema>;
export type UpdateEntitySchema = z.infer<typeof updateEntitySchema>;
