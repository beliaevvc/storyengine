'use server';

import { revalidatePath } from 'next/cache';
import { getEntityTypeDefinitionsTable } from '@/lib/supabase/tables';
import type { 
  EntityTypeDefinition, 
  CreateEntityTypeInput, 
  UpdateEntityTypeInput,
  DEFAULT_ENTITY_TYPES,
} from '@/core/types/entity-type-schema';
import { DEFAULT_ENTITY_TYPES as defaultTypes } from '@/core/types/entity-type-schema';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Database row type
interface EntityTypeRow {
  id: string;
  project_id: string;
  name: string;
  label: string;
  icon: string;
  color: string;
  order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

function mapRowToEntityType(row: EntityTypeRow): EntityTypeDefinition {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    label: row.label,
    icon: row.icon,
    color: row.color,
    order: row.order,
    isDefault: row.is_default,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Получить все типы сущностей проекта
 */
export async function getEntityTypeDefinitionsAction(
  projectId: string
): Promise<ActionResult<EntityTypeDefinition[]>> {
  try {
    const table = await getEntityTypeDefinitionsTable();

    const { data, error } = await table
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });

    if (error) {
      // Table doesn't exist - return empty array
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { success: true, data: [] };
      }
      throw new Error(error.message);
    }

    return {
      success: true,
      data: (data as EntityTypeRow[]).map(mapRowToEntityType),
    };
  } catch (error) {
    console.error('getEntityTypeDefinitionsAction error:', error);
    return { success: false, error: 'Не удалось получить типы сущностей' };
  }
}

/**
 * Создать новый тип сущности
 */
export async function createEntityTypeDefinitionAction(
  input: CreateEntityTypeInput
): Promise<ActionResult<EntityTypeDefinition>> {
  try {
    const table = await getEntityTypeDefinitionsTable();

    // Get max order
    const { data: existingTypes } = await table
      .select('order')
      .eq('project_id', input.projectId)
      .order('order', { ascending: false })
      .limit(1);

    const nextOrder = existingTypes && existingTypes.length > 0 
      ? (existingTypes[0] as { order: number }).order + 1 
      : 0;

    const { data, error } = await table
      .insert({
        project_id: input.projectId,
        name: input.name.toUpperCase().replace(/\s+/g, '_'), // Нормализуем имя
        label: input.label,
        icon: input.icon,
        color: input.color,
        order: nextOrder,
        is_default: input.isDefault ?? false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Тип с таким именем уже существует');
      }
      throw new Error(error.message);
    }

    revalidatePath(`/projects/${input.projectId}/settings`);
    return {
      success: true,
      data: mapRowToEntityType(data as EntityTypeRow),
    };
  } catch (error) {
    console.error('createEntityTypeDefinitionAction error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Не удалось создать тип сущности' 
    };
  }
}

/**
 * Обновить тип сущности
 */
export async function updateEntityTypeDefinitionAction(
  id: string,
  input: UpdateEntityTypeInput
): Promise<ActionResult<EntityTypeDefinition>> {
  try {
    const table = await getEntityTypeDefinitionsTable();

    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) {
      updateData.name = input.name.toUpperCase().replace(/\s+/g, '_');
    }
    if (input.label !== undefined) updateData.label = input.label;
    if (input.icon !== undefined) updateData.icon = input.icon;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.order !== undefined) updateData.order = input.order;

    const { data, error } = await table
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Тип с таким именем уже существует');
      }
      throw new Error(error.message);
    }

    const entityType = data as EntityTypeRow;
    revalidatePath(`/projects/${entityType.project_id}/settings`);
    return {
      success: true,
      data: mapRowToEntityType(entityType),
    };
  } catch (error) {
    console.error('updateEntityTypeDefinitionAction error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Не удалось обновить тип сущности' 
    };
  }
}

/**
 * Удалить тип сущности
 */
export async function deleteEntityTypeDefinitionAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const table = await getEntityTypeDefinitionsTable();

    // Get projectId before delete for revalidation
    const { data: existing } = await table
      .select('project_id')
      .eq('id', id)
      .single();

    const { error } = await table
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    if (existing) {
      revalidatePath(`/projects/${(existing as { project_id: string }).project_id}/settings`);
    }
    return { success: true, data: undefined };
  } catch (error) {
    console.error('deleteEntityTypeDefinitionAction error:', error);
    return { success: false, error: 'Не удалось удалить тип сущности' };
  }
}

/**
 * Создать дефолтные типы для проекта
 */
export async function seedDefaultEntityTypesAction(
  projectId: string
): Promise<ActionResult<EntityTypeDefinition[]>> {
  try {
    const table = await getEntityTypeDefinitionsTable();

    // Check if types already exist
    const { data: existingTypes } = await table
      .select('id')
      .eq('project_id', projectId)
      .limit(1);

    if (existingTypes && existingTypes.length > 0) {
      // Types already seeded, get all
      const result = await getEntityTypeDefinitionsAction(projectId);
      return result;
    }

    // Insert default types
    const typesToInsert = defaultTypes.map((t, index) => ({
      project_id: projectId,
      name: t.name,
      label: t.label,
      icon: t.icon,
      color: t.color,
      order: index,
      is_default: true,
    }));

    const { data, error } = await table
      .insert(typesToInsert)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: (data as EntityTypeRow[]).map(mapRowToEntityType),
    };
  } catch (error) {
    console.error('seedDefaultEntityTypesAction error:', error);
    return { success: false, error: 'Не удалось создать дефолтные типы' };
  }
}

/**
 * Изменить порядок типов сущностей
 */
export async function reorderEntityTypeDefinitionsAction(
  projectId: string,
  orderedIds: string[]
): Promise<ActionResult<EntityTypeDefinition[]>> {
  try {
    const table = await getEntityTypeDefinitionsTable();

    // Update order for each type
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await table
        .update({ order: i })
        .eq('id', orderedIds[i]);

      if (error) {
        throw new Error(error.message);
      }
    }

    // Fetch updated list
    const { data, error } = await table
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/projects/${projectId}/settings`);
    return {
      success: true,
      data: (data as EntityTypeRow[]).map(mapRowToEntityType),
    };
  } catch (error) {
    console.error('reorderEntityTypeDefinitionsAction error:', error);
    return { success: false, error: 'Не удалось изменить порядок типов' };
  }
}
