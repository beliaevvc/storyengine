'use client';

interface PanelLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export function PanelLayout({
  leftPanel,
  centerPanel,
  rightPanel,
}: PanelLayoutProps) {
  return (
    <div className="h-full flex">
      {/* Left Panel - 250px */}
      <div className="w-[250px] min-w-[200px] max-w-[350px] flex-shrink-0 bg-surface border-r border-border overflow-auto">
        {leftPanel}
      </div>

      {/* Center Panel - flexible */}
      <div className="flex-1 min-w-[400px] bg-canvas overflow-hidden flex flex-col">
        {centerPanel}
      </div>

      {/* Right Panel - 280px */}
      <div className="w-[280px] min-w-[200px] max-w-[400px] flex-shrink-0 bg-surface border-l border-border overflow-auto">
        {rightPanel}
      </div>
    </div>
  );
}
