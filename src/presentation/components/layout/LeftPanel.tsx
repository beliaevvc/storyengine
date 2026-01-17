'use client';

import { Panel } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

interface LeftPanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function LeftPanel({
  children,
  defaultSize = 20,
  minSize = 12,
  maxSize = 35,
  className,
}: LeftPanelProps) {
  return (
    <Panel
      id="left-panel"
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      className={cn('bg-surface border-r border-border overflow-hidden', className)}
    >
      <div className="h-full overflow-auto">
        {children}
      </div>
    </Panel>
  );
}
