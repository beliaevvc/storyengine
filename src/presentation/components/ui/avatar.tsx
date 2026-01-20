'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

function Avatar({
  src,
  alt = '',
  fallback,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const showFallback = !src || imageError;

  // Generate initials from alt or fallback
  const initials = React.useMemo(() => {
    const text = fallback || alt || '?';
    const words = text.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '');
    }
    return text.slice(0, 2);
  }, [alt, fallback]);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full overflow-hidden',
        'bg-overlay border border-border',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showFallback ? (
        <span className="font-medium text-fg-secondary uppercase select-none">
          {initials}
        </span>
      ) : (
        <img
          src={src!}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
