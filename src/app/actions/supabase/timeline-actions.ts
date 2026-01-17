'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type {
  Timeline,
  Event,
  InsertTables,
  UpdateTables,
} from '@/types/supabase';

// ============================================================================
// Timeline Actions
// ============================================================================

// Get all timelines for a project
export async function getTimelines(
  projectId: string
): Promise<{ data: Timeline[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('timelines')
    .select('*')
    .eq('project_id', projectId)
    .order('name');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Create timeline
export async function createTimeline(
  input: InsertTables<'timelines'>
): Promise<{ data: Timeline | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('timelines')
    .insert(input)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath(`/projects/${input.project_id}`);
  return { data, error: null };
}

// Update timeline
export async function updateTimeline(
  timelineId: string,
  input: UpdateTables<'timelines'>
): Promise<{ data: Timeline | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('timelines')
    .update(input)
    .eq('id', timelineId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  if (data) {
    revalidatePath(`/projects/${data.project_id}`);
  }

  return { data, error: null };
}

// Delete timeline
export async function deleteTimeline(
  timelineId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('timelines')
    .delete()
    .eq('id', timelineId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}

// ============================================================================
// Event Actions
// ============================================================================

// Get all events for a project
export async function getEvents(
  projectId: string
): Promise<{ data: Event[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('project_id', projectId)
    .order('position');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Get events for a specific timeline
export async function getTimelineEvents(
  timelineId: string
): Promise<{ data: Event[] | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('timeline_id', timelineId)
    .order('position');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Create event
export async function createEvent(
  input: InsertTables<'events'>
): Promise<{ data: Event | null; error: string | null }> {
  const supabase = await createClient();

  // Get max position
  const { data: maxPosEvent } = await supabase
    .from('events')
    .select('position')
    .eq('project_id', input.project_id)
    .order('position', { ascending: false })
    .limit(1)
    .single();

  const newPosition = input.position ?? (maxPosEvent?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...input,
      position: newPosition,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  revalidatePath(`/projects/${input.project_id}`);
  return { data, error: null };
}

// Update event
export async function updateEvent(
  eventId: string,
  input: UpdateTables<'events'>
): Promise<{ data: Event | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('events')
    .update(input)
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  if (data) {
    revalidatePath(`/projects/${data.project_id}`);
  }

  return { data, error: null };
}

// Delete event
export async function deleteEvent(
  eventId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}

// Link entity to event
export async function linkEntityToEvent(
  eventId: string,
  entityId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Get current linked entities
  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('linked_entity_ids')
    .eq('id', eventId)
    .single();

  if (fetchError || !event) {
    return { success: false, error: fetchError?.message || 'Event not found' };
  }

  const currentIds = event.linked_entity_ids || [];
  if (currentIds.includes(entityId)) {
    return { success: true, error: null }; // Already linked
  }

  const { error: updateError } = await supabase
    .from('events')
    .update({ linked_entity_ids: [...currentIds, entityId] })
    .eq('id', eventId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}

// Unlink entity from event
export async function unlinkEntityFromEvent(
  eventId: string,
  entityId: string,
  projectId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  // Get current linked entities
  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('linked_entity_ids')
    .eq('id', eventId)
    .single();

  if (fetchError || !event) {
    return { success: false, error: fetchError?.message || 'Event not found' };
  }

  const currentIds = event.linked_entity_ids || [];
  const newIds = currentIds.filter((id: string) => id !== entityId);

  const { error: updateError } = await supabase
    .from('events')
    .update({ linked_entity_ids: newIds })
    .eq('id', eventId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}

// Reorder events
export async function reorderEvents(
  projectId: string,
  eventPositions: Array<{ id: string; position: number }>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const updates = eventPositions.map(({ id, position }) =>
    supabase
      .from('events')
      .update({ position })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some((r) => r.error);

  if (hasError) {
    return { success: false, error: 'Failed to reorder some events' };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, error: null };
}
