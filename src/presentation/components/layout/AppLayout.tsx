'use client';

import { Header, type WorkspaceMode } from './Header';
import { PanelLayout } from './PanelLayout';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  projectId?: string;
  projectTitle?: string;
  activeMode?: WorkspaceMode;
  onModeChange?: (mode: WorkspaceMode) => void;
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

export function AppLayout({
  projectId,
  projectTitle,
  activeMode,
  onModeChange,
  leftPanel,
  centerPanel,
  rightPanel,
  className,
}: AppLayoutProps) {
  return (
    <div className={cn('h-screen flex flex-col bg-canvas', className)}>
      <Header 
        projectId={projectId}
        projectTitle={projectTitle} 
        activeMode={activeMode}
        onModeChange={onModeChange}
      />
      <main className="flex-1 overflow-hidden">
        <PanelLayout
          leftPanel={leftPanel}
          centerPanel={centerPanel}
          rightPanel={rightPanel}
        />
      </main>
    </div>
  );
}
