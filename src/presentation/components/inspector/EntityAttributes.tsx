import { cn } from '@/lib/utils';

interface EntityAttributesProps {
  attributes: Record<string, unknown>;
  className?: string;
}

export function EntityAttributes({ attributes, className }: EntityAttributesProps) {
  const entries = Object.entries(attributes).filter(
    ([key, value]) => value !== undefined && value !== null && key !== 'aliases' && key !== 'relationships'
  );

  if (entries.length === 0) {
    return (
      <p className="text-xs text-fg-muted italic">No attributes defined</p>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-start gap-2 text-xs">
          <span className="text-fg-muted font-mono min-w-[80px] capitalize">{formatKey(key)}:</span>
          <span className="text-fg font-mono">
            {formatValue(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}
