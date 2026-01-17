'use client';

import { Panel } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

interface RightPanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function RightPanel({
  children,
  defaultSize = 22,
  minSize = 12,
  maxSize = 40,
  className,
}: RightPanelProps) {
  return (
    <Panel
      id="right-panel"
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      className={cn('bg-surface border-l border-border overflow-hidden', className)}
    >
      <div className="h-full overflow-auto">
        {children}
      </div>
    </Panel>
  );
}
