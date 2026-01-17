import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title is required')
    .max(255, 'Project title must be less than 255 characters')
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .transform((val) => val?.trim()),
  settings: z
    .object({
      genre: z.string().optional(),
      targetWordCount: z.number().positive().optional(),
    })
    .passthrough()
    .optional(),
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title cannot be empty')
    .max(255, 'Project title must be less than 255 characters')
    .transform((val) => val.trim())
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .nullable()
    .optional()
    .transform((val) => val?.trim() ?? val),
  settings: z
    .object({
      genre: z.string().optional(),
      targetWordCount: z.number().positive().optional(),
    })
    .passthrough()
    .optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
