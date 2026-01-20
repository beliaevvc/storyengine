'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/infrastructure/database/prisma/client';
import { DomainError, NotFoundError, ValidationError } from '@/core/errors';
import {
  createAttributeSchema,
  updateAttributeSchema,
  reorderAttributesSchema,
} from '@/lib/validations/attributeSchemas';
import type {
  AttributeDefinition,
  CreateAttributeInput,
  UpdateAttributeInput,
} from '@/core/types/attribute-schema';
import type { Prisma } from '@/generated/prisma/client';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// ============================================
// HELPERS
// ============================================

function mapPrismaToAttributeDefinition(
  prismaAttr: {
    id: string;
    projectId: string;
    name: string;
    type: string;
    config: unknown;
    entityTypes: string[];
    color: string | null;
    icon: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }
): AttributeDefinition {
  return {
    ...prismaAttr,
    type: prismaAttr.type as AttributeDefinition['type'],
    config: prismaAttr.config as Record<string, unknown>,
  };
}

// ============================================
// ACTIONS
// ============================================

/**
 * Получить все атрибуты проекта
 */
export async function getAttributeDefinitionsAction(
  projectId: string
): Promise<ActionResult<AttributeDefinition[]>> {
  try {
    const attributes = await prisma.attributeDefinition.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });

    return {
      success: true,
      data: attributes.map(mapPrismaToAttributeDefinition),
    };
  } catch (error) {
    console.error('getAttributeDefinitionsAction error:', error);
    return { success: false, error: 'Не удалось получить атрибуты' };
  }
}

/**
 * Получить один атрибут по ID
 */
export async function getAttributeDefinitionAction(
  id: string
): Promise<ActionResult<AttributeDefinition>> {
  try {
    const attribute = await prisma.attributeDefinition.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundError('AttributeDefinition', id);
    }

    return {
      success: true,
      data: mapPrismaToAttributeDefinition(attribute),
    };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('getAttributeDefinitionAction error:', error);
    return { success: false, error: 'Не удалось получить атрибут' };
  }
}

/**
 * Создать новый атрибут
 */
export async function createAttributeDefinitionAction(
  input: CreateAttributeInput
): Promise<ActionResult<AttributeDefinition>> {
  try {
    // Validation
    const parsed = createAttributeSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      throw new ValidationError(firstError?.message ?? 'Ошибка валидации', 'input');
    }

    // Get max order for the project
    const maxOrderResult = await prisma.attributeDefinition.aggregate({
      where: { projectId: input.projectId },
      _max: { order: true },
    });
    const nextOrder = (maxOrderResult._max.order ?? -1) + 1;

    const attribute = await prisma.attributeDefinition.create({
      data: {
        projectId: input.projectId,
        name: parsed.data.name,
        type: parsed.data.type,
        config: parsed.data.config as Prisma.InputJsonValue,
        entityTypes: parsed.data.entityTypes,
        color: parsed.data.color,
        icon: parsed.data.icon,
        order: nextOrder,
      },
    });

    revalidatePath(`/project/${input.projectId}/settings`);
    return {
      success: true,
      data: mapPrismaToAttributeDefinition(attribute),
    };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('createAttributeDefinitionAction error:', error);
    return { success: false, error: 'Не удалось создать атрибут' };
  }
}

/**
 * Обновить атрибут
 */
export async function updateAttributeDefinitionAction(
  id: string,
  input: UpdateAttributeInput
): Promise<ActionResult<AttributeDefinition>> {
  try {
    // Check existence
    const existing = await prisma.attributeDefinition.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundError('AttributeDefinition', id);
    }

    // Validation
    const parsed = updateAttributeSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      throw new ValidationError(firstError?.message ?? 'Ошибка валидации', 'input');
    }

    const attribute = await prisma.attributeDefinition.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.type !== undefined && { type: parsed.data.type }),
        ...(parsed.data.config !== undefined && { config: parsed.data.config as Prisma.InputJsonValue }),
        ...(parsed.data.entityTypes !== undefined && { entityTypes: parsed.data.entityTypes }),
        ...(parsed.data.color !== undefined && { color: parsed.data.color }),
        ...(parsed.data.icon !== undefined && { icon: parsed.data.icon }),
        ...(parsed.data.order !== undefined && { order: parsed.data.order }),
      },
    });

    revalidatePath(`/project/${existing.projectId}/settings`);
    return {
      success: true,
      data: mapPrismaToAttributeDefinition(attribute),
    };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('updateAttributeDefinitionAction error:', error);
    return { success: false, error: 'Не удалось обновить атрибут' };
  }
}

/**
 * Удалить атрибут
 */
export async function deleteAttributeDefinitionAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const existing = await prisma.attributeDefinition.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundError('AttributeDefinition', id);
    }

    await prisma.attributeDefinition.delete({
      where: { id },
    });

    revalidatePath(`/project/${existing.projectId}/settings`);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('deleteAttributeDefinitionAction error:', error);
    return { success: false, error: 'Не удалось удалить атрибут' };
  }
}

/**
 * Изменить порядок атрибутов
 */
export async function reorderAttributeDefinitionsAction(
  projectId: string,
  orderedIds: string[]
): Promise<ActionResult<AttributeDefinition[]>> {
  try {
    // Validation
    const parsed = reorderAttributesSchema.safeParse({ projectId, orderedIds });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      throw new ValidationError(firstError?.message ?? 'Ошибка валидации', 'input');
    }

    // Update order for each attribute
    const updates = orderedIds.map((id, index) =>
      prisma.attributeDefinition.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Fetch updated list
    const attributes = await prisma.attributeDefinition.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });

    revalidatePath(`/project/${projectId}/settings`);
    return {
      success: true,
      data: attributes.map(mapPrismaToAttributeDefinition),
    };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('reorderAttributeDefinitionsAction error:', error);
    return { success: false, error: 'Не удалось изменить порядок атрибутов' };
  }
}
