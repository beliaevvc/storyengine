'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { SlashCommandItem } from './extensions/SlashCommands';

// ============================================================================
// Types
// ============================================================================

export interface SlashCommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface SlashCommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

// ============================================================================
// Group Labels
// ============================================================================

const GROUP_LABELS: Record<string, string> = {
  format: 'Форматирование',
  semantic: 'Семантические блоки',
  entity: 'Упоминания',
  scene: 'Сцены',
};

const GROUP_ORDER: string[] = ['format', 'semantic', 'entity', 'scene'];

// ============================================================================
// Component
// ============================================================================

export const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Group items by category
    const groupedItems = useMemo(() => {
      const groups: Record<string, SlashCommandItem[]> = {};
      
      for (const item of items) {
        const group = item.group;
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(item);
      }
      
      // Return in order
      return GROUP_ORDER
        .filter((g) => groups[g]?.length > 0)
        .map((g) => ({
          group: g,
          label: GROUP_LABELS[g] || g,
          items: groups[g],
        }));
    }, [items]);

    // Flat list for navigation - must be in same order as display!
    const flatItems = useMemo(() => {
      const result: SlashCommandItem[] = [];
      for (const group of groupedItems) {
        result.push(...group.items);
      }
      return result;
    }, [groupedItems]);

    const selectItem = useCallback(
      (index: number) => {
        const item = flatItems[index];
        if (item) {
          command(item);
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
        <div className="bg-[#1e2228] border border-[#4a5568] rounded-lg shadow-2xl px-3 py-2 ring-1 ring-black/20">
          <p className="text-xs text-[#6e7681]">Ничего не найдено</p>
        </div>
      );
    }

    // Track global index for selection
    let globalIndex = 0;

    return (
      <div className="bg-[#1e2228] border border-[#4a5568] rounded-lg shadow-2xl overflow-hidden max-h-[360px] overflow-y-auto min-w-[240px] ring-1 ring-black/20">
        {groupedItems.map(({ group, label, items: groupItems }) => (
          <div key={group}>
            {/* Group Header */}
            <div className="px-3 py-2 text-[10px] text-[#8b949e] uppercase tracking-wider bg-[#161a1f] border-b border-[#4a5568]">
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
                    gap-3
                    px-3 
                    py-2
                    text-left 
                    transition-colors
                    border-b
                    border-[#2d333b]
                    last:border-b-0
                    ${currentIndex === selectedIndex
                      ? 'bg-[#58a6ff]/20 text-white'
                      : 'text-[#c9d1d9] hover:bg-[#2d333b]'
                    }
                  `}
                >
                  {/* Shortcut */}
                  <span className="text-xs text-[#6e7681] w-24">
                    /{item.aliases[0]}
                  </span>
                  
                  {/* Title */}
                  <span className="text-sm">
                    {item.title}
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

SlashCommandList.displayName = 'SlashCommandList';
