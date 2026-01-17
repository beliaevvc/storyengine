'use client';

import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface BreadcrumbsProps {
  projectName?: string;
  documentName?: string;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Breadcrumbs({ projectName, documentName, className }: BreadcrumbsProps) {
  return (
    <div
      className={cn(
        'h-8 bg-surface border-b border-border px-4 flex items-center gap-1.5 text-sm',
        className
      )}
    >
      <Home className="w-3.5 h-3.5 text-fg-muted" />
      {projectName && (
        <>
          <ChevronRight className="w-3 h-3 text-fg-muted" />
          <span className="text-fg-muted hover:text-fg cursor-pointer transition-colors">
            {projectName}
          </span>
        </>
      )}
      {documentName && (
        <>
          <ChevronRight className="w-3 h-3 text-fg-muted" />
          <span className="text-fg">{documentName}</span>
        </>
      )}
    </div>
  );
}
