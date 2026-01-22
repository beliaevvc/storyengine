'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, BookOpen, LogOut, ChevronLeft, FileText, GitBranch, Clock } from 'lucide-react';
import { Button } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

type WorkspaceMode = 'editor' | 'plot' | 'timeline';

const MODE_TABS: { id: WorkspaceMode; label: string; icon: React.ElementType }[] = [
  { id: 'editor', label: 'Редактор', icon: FileText },
  { id: 'plot', label: 'Сюжет', icon: GitBranch },
  { id: 'timeline', label: 'Таймлайн', icon: Clock },
];

interface HeaderProps {
  projectId?: string;
  projectTitle?: string;
  className?: string;
  activeMode?: WorkspaceMode;
  onModeChange?: (mode: WorkspaceMode) => void;
}

export function Header({ projectId, projectTitle, className, activeMode = 'editor', onModeChange }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    router.push('/auth/signout');
  };

  return (
    <header
      className={cn(
        'h-12 bg-surface border-b border-border flex items-center px-4',
        className
      )}
    >
      {/* Left: Logo & Project */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <Link 
          href="/projects" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-5 h-5 text-accent" />
          <span className="font-semibold text-fg">StoryEngine</span>
        </Link>
        
        {projectTitle && (
          <>
            <span className="text-fg-muted">/</span>
            <span className="text-fg-secondary text-sm truncate max-w-[150px]">{projectTitle}</span>
          </>
        )}
      </div>

      {/* Center: Mode Tabs */}
      {projectTitle && onModeChange && (
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 bg-canvas/50 rounded-lg p-1">
            {MODE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onModeChange(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    activeMode === tab.id
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-fg-muted hover:text-fg hover:bg-surface-hover'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        {projectTitle && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/projects')}
            className="gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Проекты</span>
          </Button>
        )}
        {projectId && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push(`/projects/${projectId}/settings`)}
            title="Настройки проекта"
          >
            <Settings className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}

export type { WorkspaceMode };
