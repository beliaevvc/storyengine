'use client';

import { Separator } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function ResizeHandle({ className, orientation = 'horizontal' }: ResizeHandleProps) {
  return (
    <Separator
      className={cn(
        'group relative flex items-center justify-center bg-transparent',
        orientation === 'horizontal' ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize',
        'hover:bg-accent/10 active:bg-accent/20',
        'transition-colors duration-150',
        className
      )}
    >
      <div
        className={cn(
          'bg-border-muted group-hover:bg-accent group-active:bg-accent',
          'transition-colors duration-150 rounded-full',
          orientation === 'horizontal' ? 'w-0.5 h-8' : 'h-0.5 w-8'
        )}
      />
    </Separator>
  );
}
