'use client';

import { cn } from '@/lib/utils';

interface EntityProfileLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

export function EntityProfileLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  className,
}: EntityProfileLayoutProps) {
  return (
    <div
      className={cn(
        'h-screen grid grid-cols-[300px_1fr_350px] bg-canvas',
        className
      )}
    >
      {/* Left Column: Passport */}
      <aside className="h-full overflow-hidden border-r border-border bg-surface">
        {leftPanel}
      </aside>

      {/* Center Column: Content */}
      <main className="h-full overflow-hidden bg-canvas">
        {centerPanel}
      </main>

      {/* Right Column: Timeline */}
      <aside className="h-full overflow-hidden border-l border-border bg-surface">
        {rightPanel}
      </aside>
    </div>
  );
}
