'use client';

import type { LucideIcon } from 'lucide-react';
import { Button, Tooltip, TooltipTrigger, TooltipContent } from '@/presentation/components/ui';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function ToolbarButton({
  icon: Icon,
  label,
  isActive,
  disabled,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-8 p-0',
            isActive && 'bg-accent/20 text-accent'
          )}
          disabled={disabled}
          onClick={onClick}
        >
          <Icon className="w-4 h-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
