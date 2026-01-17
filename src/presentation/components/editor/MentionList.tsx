'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import { User, MapPin, Package, Calendar, Users, Globe, StickyNote } from 'lucide-react';
import type { Entity, EntityType } from '@/types/supabase';

const TYPE_ICONS: Record<EntityType, React.ComponentType<{ className?: string }>> = {
  CHARACTER: User,
  LOCATION: MapPin,
  ITEM: Package,
  EVENT: Calendar,
  FACTION: Users,
  WORLDBUILDING: Globe,
  NOTE: StickyNote,
};

const TYPE_COLORS: Record<EntityType, string> = {
  CHARACTER: 'text-blue-400',
  LOCATION: 'text-green-400',
  ITEM: 'text-yellow-400',
  EVENT: 'text-purple-400',
  FACTION: 'text-orange-400',
  WORLDBUILDING: 'text-cyan-400',
  NOTE: 'text-gray-400',
};

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface MentionListProps {
  items: Entity[];
  command: (item: { id: string; label: string; type: string }) => void;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) {
          command({
            id: item.id,
            label: item.name,
            type: item.type,
          });
        }
      },
      [items, command]
    );

    const upHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
    }, [items.length]);

    const downHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const enterHandler = useCallback(() => {
      selectItem(selectedIndex);
    }, [selectItem, selectedIndex]);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="bg-[#22272e] border border-[#444c56] rounded-lg shadow-lg p-3">
          <p className="text-sm text-[#768390]">Ничего не найдено</p>
        </div>
      );
    }

    return (
      <div className="bg-[#22272e] border border-[#444c56] rounded-lg shadow-lg overflow-hidden max-h-[300px] overflow-y-auto">
        {items.map((item, index) => {
          const Icon = TYPE_ICONS[item.type];
          const colorClass = TYPE_COLORS[item.type];

          return (
            <button
              key={item.id}
              onClick={() => selectItem(index)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-[#373e47]'
                  : 'hover:bg-[#2d333b]'
              }`}
            >
              <div className={`flex-shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#adbac7] truncate">
                  {item.name}
                </p>
                {item.description && (
                  <p className="text-xs text-[#768390] truncate">
                    {item.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';
