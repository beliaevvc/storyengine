'use client';

import { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { TimelineEventCard } from './TimelineEvent';
import type { Event as TimelineEventType, Timeline as TimelineType, Entity } from '@/types/supabase';

interface TimelineProps {
  projectId: string;
  timelines: TimelineType[];
  events: TimelineEventType[];
  entities: Entity[];
  onEventClick?: (event: TimelineEventType) => void;
  onEventEdit?: (event: TimelineEventType) => void;
  onEventDelete?: (event: TimelineEventType) => void;
  onCreateEvent?: () => void;
  onCreateTimeline?: () => void;
}

const DEFAULT_COLORS = [
  '#539bf5', // blue
  '#57ab5a', // green
  '#986ee2', // purple
  '#e5534b', // red
  '#c69026', // yellow
  '#57b3ae', // teal
];

export function Timeline({
  projectId,
  timelines,
  events,
  entities,
  onEventClick,
  onEventEdit,
  onEventDelete,
  onCreateEvent,
  onCreateTimeline,
}: TimelineProps) {
  const [selectedTimelineIds, setSelectedTimelineIds] = useState<string[]>(
    timelines.map((t) => t.id)
  );
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(0);

  // Group events by timeline
  const eventsByTimeline = useMemo(() => {
    const grouped: Record<string, TimelineEventType[]> = { unassigned: [] };
    
    timelines.forEach((t) => {
      grouped[t.id] = [];
    });

    events.forEach((event) => {
      if (event.timeline_id && grouped[event.timeline_id]) {
        grouped[event.timeline_id].push(event);
      } else {
        grouped.unassigned.push(event);
      }
    });

    // Sort events by position
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.position - b.position);
    });

    return grouped;
  }, [events, timelines]);

  // Get min/max positions for scale
  const { minPos, maxPos } = useMemo(() => {
    if (events.length === 0) return { minPos: 0, maxPos: 10 };
    const positions = events.map((e) => e.position);
    return {
      minPos: Math.min(...positions),
      maxPos: Math.max(...positions),
    };
  }, [events]);

  // Calculate position on timeline
  const getPositionX = (position: number): number => {
    const range = maxPos - minPos || 1;
    const normalized = (position - minPos) / range;
    const baseWidth = 800 * zoom;
    return normalized * baseWidth + offset;
  };

  // Get timeline color
  const getTimelineColor = (timelineId: string | null, index: number): string => {
    if (!timelineId) return '#768390';
    const timeline = timelines.find((t) => t.id === timelineId);
    return timeline?.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  // Get linked entities for event
  const getLinkedEntities = (event: TimelineEventType): Entity[] => {
    if (!event.linked_entity_ids || event.linked_entity_ids.length === 0) {
      return [];
    }
    return entities.filter((e) => event.linked_entity_ids.includes(e.id));
  };

  const toggleTimeline = (timelineId: string) => {
    setSelectedTimelineIds((prev) =>
      prev.includes(timelineId)
        ? prev.filter((id) => id !== timelineId)
        : [...prev, timelineId]
    );
  };

  const visibleTimelines = timelines.filter((t) =>
    selectedTimelineIds.includes(t.id)
  );

  return (
    <div className="h-full flex flex-col bg-[#1c2128]">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#444c56] bg-[#22272e]">
        <div className="flex items-center gap-4">
          <h2 className="font-medium text-[#adbac7]">Таймлайн</h2>
          
          {/* Timeline filter */}
          <div className="flex items-center gap-1">
            {timelines.map((timeline, index) => (
              <button
                key={timeline.id}
                onClick={() => toggleTimeline(timeline.id)}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors
                  ${selectedTimelineIds.includes(timeline.id)
                    ? 'bg-[#373e47] text-[#adbac7]'
                    : 'text-[#545d68] hover:bg-[#2d333b]'
                  }
                `}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getTimelineColor(timeline.id, index) }}
                />
                {timeline.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-[#768390] w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              disabled={zoom >= 2}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {onCreateTimeline && (
            <Button variant="ghost" size="sm" onClick={onCreateTimeline}>
              <Layers className="w-4 h-4 mr-1" />
              Линия
            </Button>
          )}

          {onCreateEvent && (
            <Button
              onClick={onCreateEvent}
              className="bg-[#347d39] hover:bg-[#46954a] text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Событие
            </Button>
          )}
        </div>
      </div>

      {/* Timeline tracks */}
      <div className="flex-1 overflow-auto p-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#768390] mb-4">Нет событий на таймлайне</p>
            {onCreateEvent && (
              <Button
                onClick={onCreateEvent}
                variant="ghost"
                className="text-[#539bf5]"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить первое событие
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unassigned events */}
            {eventsByTimeline.unassigned.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#768390]" />
                  <span className="text-sm text-[#768390]">Без линии</span>
                </div>
                <div className="relative">
                  {/* Timeline axis */}
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#373e47]" />
                  
                  {/* Events */}
                  <div className="relative flex gap-4 py-4 overflow-x-auto">
                    {eventsByTimeline.unassigned.map((event) => (
                      <div
                        key={event.id}
                        className="flex-shrink-0 w-48"
                        style={{ marginLeft: event.position * 10 * zoom }}
                      >
                        <TimelineEventCard
                          event={event}
                          linkedEntities={getLinkedEntities(event)}
                          color="#768390"
                          onSelect={() => onEventClick?.(event)}
                          onEdit={() => onEventEdit?.(event)}
                          onDelete={() => onEventDelete?.(event)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline tracks */}
            {visibleTimelines.map((timeline, index) => {
              const timelineEvents = eventsByTimeline[timeline.id] || [];
              const color = getTimelineColor(timeline.id, index);

              return (
                <div key={timeline.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-[#adbac7]">{timeline.name}</span>
                    <span className="text-xs text-[#545d68]">
                      ({timelineEvents.length} событий)
                    </span>
                  </div>

                  <div className="relative">
                    {/* Timeline axis */}
                    <div
                      className="absolute left-0 right-0 top-1/2 h-0.5"
                      style={{ backgroundColor: color, opacity: 0.3 }}
                    />

                    {/* Events */}
                    {timelineEvents.length === 0 ? (
                      <div className="py-8 text-center text-sm text-[#545d68]">
                        Нет событий
                      </div>
                    ) : (
                      <div className="relative flex gap-4 py-4 overflow-x-auto">
                        {timelineEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex-shrink-0 w-48"
                            style={{ marginLeft: event.position * 10 * zoom }}
                          >
                            <TimelineEventCard
                              event={event}
                              linkedEntities={getLinkedEntities(event)}
                              color={color}
                              onSelect={() => onEventClick?.(event)}
                              onEdit={() => onEventEdit?.(event)}
                              onDelete={() => onEventDelete?.(event)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Position markers */}
      <div className="flex-shrink-0 h-8 border-t border-[#444c56] bg-[#22272e] flex items-center px-4">
        <div className="flex gap-4">
          {Array.from({ length: Math.min(10, maxPos - minPos + 1) }, (_, i) => (
            <span key={i} className="text-xs text-[#545d68]">
              {minPos + i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
