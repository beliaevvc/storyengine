'use client';

import { Panel } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

interface CenterPanelProps {
  children: React.ReactNode;
  minSize?: number;
  className?: string;
}

export function CenterPanel({
  children,
  minSize = 30,
  className,
}: CenterPanelProps) {
  return (
    <Panel
      id="center-panel"
      minSize={minSize}
      className={cn('bg-canvas flex flex-col overflow-hidden', className)}
    >
      <div className="h-full overflow-auto">
        {children}
      </div>
    </Panel>
  );
}
