'use client';

import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface StatusBarProps {
  wordCount: number;
  characterCount: number;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function StatusBar({ wordCount, characterCount, className }: StatusBarProps) {
  return (
    <div
      className={cn(
        'h-6 bg-surface border-t border-border px-4 flex items-center justify-end gap-4 text-xs text-fg-muted',
        className
      )}
    >
      <span>{wordCount.toLocaleString()} words</span>
      <span>{characterCount.toLocaleString()} characters</span>
    </div>
  );
}
