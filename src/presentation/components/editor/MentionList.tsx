'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { Entity, EntityType } from '@/types/supabase';

const TYPE_LABELS: Record<EntityType, string> = {
  CHARACTER: 'Персонажи',
  LOCATION: 'Локации',
  ITEM: 'Предметы',
  EVENT: 'События',
  FACTION: 'Фракции',
  WORLDBUILDING: 'Мир',
  NOTE: 'Заметки',
};

const TYPE_ORDER: EntityType[] = [
  'CHARACTER',
  'LOCATION',
  'ITEM',
  'EVENT',
  'FACTION',
  'WORLDBUILDING',
  'NOTE',
];

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

    // Group items by type
    const groupedItems = useMemo(() => {
      const groups: Record<EntityType, Entity[]> = {} as Record<EntityType, Entity[]>;
      
      for (const item of items) {
        if (!groups[item.type]) {
          groups[item.type] = [];
        }
        groups[item.type].push(item);
      }
      
      return TYPE_ORDER
        .filter((t) => groups[t]?.length > 0)
        .map((t) => ({
          type: t,
          label: TYPE_LABELS[t],
          items: groups[t],
        }));
    }, [items]);

    // Flat list for navigation - in same order as display
    const flatItems = useMemo(() => {
      const result: Entity[] = [];
      for (const group of groupedItems) {
        result.push(...group.items);
      }
      return result;
    }, [groupedItems]);

    const selectItem = useCallback(
      (index: number) => {
        const item = flatItems[index];
        if (item) {
          command({
            id: item.id,
            label: item.name,
            type: item.type,
          });
        }
      },
      [flatItems, command]
    );

    const upHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + flatItems.length - 1) % flatItems.length);
    }, [flatItems.length]);

    const downHandler = useCallback(() => {
      setSelectedIndex((prev) => (prev + 1) % flatItems.length);
    }, [flatItems.length]);

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

    if (flatItems.length === 0) {
      return (
        <div className="bg-[#22272e] border border-[#3d444d] rounded shadow-lg px-2 py-1.5">
          <p className="text-[11px] font-mono text-[#545d68]">не найдено</p>
        </div>
      );
    }

    // Track global index for selection
    let globalIndex = 0;

    return (
      <div className="bg-[#22272e] border border-[#3d444d] rounded shadow-lg overflow-hidden max-h-[280px] overflow-y-auto min-w-[160px]">
        {groupedItems.map(({ type, label, items: groupItems }) => (
          <div key={type}>
            {/* Group Header */}
            <div className="px-2 py-1 text-[9px] font-mono text-[#545d68] uppercase tracking-wider border-b border-[#3d444d]/50">
              {label}
            </div>
            
            {/* Group Items */}
            {groupItems.map((item) => {
              const currentIndex = globalIndex;
              globalIndex++;

              return (
                <button
                  key={item.id}
                  onClick={() => selectItem(currentIndex)}
                  className={`
                    w-full 
                    flex 
                    items-center 
                    px-2 
                    py-1
                    text-left 
                    transition-colors
                    font-mono
                    ${currentIndex === selectedIndex
                      ? 'bg-[#373e47]'
                      : 'hover:bg-[#2d333b]'
                    }
                  `}
                >
                  <span className="text-[11px] text-[#8b949e] truncate">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
);

MentionList.displayName = 'MentionList';
