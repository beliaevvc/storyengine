'use client';

import * as React from 'react';
import { Tooltip } from 'radix-ui';
import { cn } from '@/lib/utils';

const TooltipProvider = Tooltip.Provider;

const TooltipRoot = Tooltip.Root;

const TooltipTrigger = Tooltip.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof Tooltip.Content>,
  React.ComponentPropsWithoutRef<typeof Tooltip.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Tooltip.Portal>
    <Tooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-overlay border border-border px-3 py-1.5 text-xs text-fg shadow-dropdown animate-fade-in',
        className
      )}
      {...props}
    />
  </Tooltip.Portal>
));
TooltipContent.displayName = 'TooltipContent';

export { TooltipRoot as Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
