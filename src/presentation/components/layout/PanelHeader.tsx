import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PanelHeaderProps {
  title: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export function PanelHeader({ title, icon: Icon, actions, className }: PanelHeaderProps) {
  return (
    <div className={cn('panel-header', className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-fg-secondary" />}
        <span className="panel-title">{title}</span>
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
}
