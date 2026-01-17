import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-accent-subtle text-accent border border-accent/30',
        secondary: 'bg-overlay text-fg-secondary border border-border',
        success: 'bg-success/20 text-success border border-success/30',
        warning: 'bg-warning/20 text-warning border border-warning/30',
        error: 'bg-error/20 text-error border border-error/30',
        character: 'bg-entity-character/20 text-entity-character border border-entity-character/30',
        location: 'bg-entity-location/20 text-entity-location border border-entity-location/30',
        item: 'bg-entity-item/20 text-entity-item border border-entity-item/30',
        event: 'bg-entity-event/20 text-entity-event border border-entity-event/30',
        concept: 'bg-entity-concept/20 text-entity-concept border border-entity-concept/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
