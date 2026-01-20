'use server';

import { revalidatePath } from 'next/cache';
import { getAttributeDefinitionsTable } from '@/lib/supabase/tables';
import type { AttributeDefinition, CreateAttributeInput, UpdateAttributeInput } from '@/core/types/attribute-schema';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Database row type
interface AttributeRow {
  id: string;
  project_id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  entity_types: string[];
  color: string | null;
  icon: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

function mapRowToAttribute(row: AttributeRow): AttributeDefinition {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    type: row.type as AttributeDefinition['type'],
    config: row.config,
    entityTypes: row.entity_types,
    color: row.color,
    icon: row.icon,
    order: row.order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}


/**
 * Получить все атрибуты проекта
 */
export async function getAttributeDefinitionsAction(
  projectId: string
): Promise<ActionResult<AttributeDefinition[]>> {
  try {
    const table = await getAttributeDefinitionsTable();

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
      data: (data as AttributeRow[]).map(mapRowToAttribute),
    };
  } catch (error) {
    console.error('getAttributeDefinitionsAction error:', error);
    return { success: false, error: 'Не удалось получить атрибуты' };
  }
}

/**
 * Создать новый атрибут
 */
export async function createAttributeDefinitionAction(
  input: CreateAttributeInput
): Promise<ActionResult<AttributeDefinition>> {
  try {
    const table = await getAttributeDefinitionsTable();

    // Get max order
    const { data: existingAttrs } = await table
      .select('order')
      .eq('project_id', input.projectId)
      .order('order', { ascending: false })
      .limit(1);

    const nextOrder = existingAttrs && existingAttrs.length > 0 
      ? (existingAttrs[0] as { order: number }).order + 1 
      : 0;

    const { data, error } = await table
      .insert({
        project_id: input.projectId,
        name: input.name,
        type: input.type,
        config: input.config ?? {},
        entity_types: input.entityTypes ?? [],
        color: input.color ?? null,
        icon: input.icon ?? null,
        order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath(`/projects/${input.projectId}/settings`);
    return {
      success: true,
      data: mapRowToAttribute(data as AttributeRow),
    };
  } catch (error) {
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
    const table = await getAttributeDefinitionsTable();

    const updateData: Record<string, unknown> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.config !== undefined) updateData.config = input.config;
    if (input.entityTypes !== undefined) updateData.entity_types = input.entityTypes;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.icon !== undefined) updateData.icon = input.icon;
    if (input.order !== undefined) updateData.order = input.order;

    const { data, error } = await table
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const attr = data as AttributeRow;
    revalidatePath(`/projects/${attr.project_id}/settings`);
    return {
      success: true,
      data: mapRowToAttribute(attr),
    };
  } catch (error) {
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
    const table = await getAttributeDefinitionsTable();

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
    const table = await getAttributeDefinitionsTable();

    // Update order for each attribute
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
      data: (data as AttributeRow[]).map(mapRowToAttribute),
    };
  } catch (error) {
    console.error('reorderAttributeDefinitionsAction error:', error);
    return { success: false, error: 'Не удалось изменить порядок атрибутов' };
  }
}
