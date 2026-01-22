'use client';

import { PRESET_COLORS } from '@/core/types/entity-type-schema';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => {
          const isSelected = value === color;
          
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`
                w-8 h-8 rounded-lg transition-all
                ${isSelected 
                  ? 'ring-2 ring-offset-2 ring-offset-bg-surface ring-fg-default scale-110' 
                  : 'hover:scale-105'
                }
              `}
              style={{ backgroundColor: color }}
              title={color}
            />
          );
        })}
      </div>

      {/* Custom color input */}
      <div className="mt-3 flex items-center gap-2">
        <label className="text-xs text-fg-muted">Или выберите свой:</label>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
        />
        <span className="text-xs text-fg-muted font-mono">{value}</span>
      </div>
    </div>
  );
}

/**
 * Цветной индикатор для отображения цвета
 */
export function ColorDot({ 
  color, 
  size = 'md',
  className,
}: { 
  color: string; 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span 
      className={`rounded-full inline-block ${sizeClasses[size]} ${className ?? ''}`}
      style={{ backgroundColor: color }}
    />
  );
}
