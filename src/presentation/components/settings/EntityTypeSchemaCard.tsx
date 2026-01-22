'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { DynamicIcon } from '@/presentation/components/ui/icon-picker';
import type { EntityTypeDefinition } from '@/core/types/entity-type-schema';

interface EntityTypeSchemaCardProps {
  entityType: EntityTypeDefinition;
  onEdit: (entityType: EntityTypeDefinition) => void;
  onDelete: (entityType: EntityTypeDefinition) => void;
}

export function EntityTypeSchemaCard({
  entityType,
  onEdit,
  onDelete,
}: EntityTypeSchemaCardProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border-default rounded-lg hover:border-border-emphasis transition-colors">
      {/* Icon & Color */}
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${entityType.color}20` }}
      >
        <DynamicIcon 
          name={entityType.icon} 
          className="w-5 h-5"
          style={{ color: entityType.color }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-fg-default truncate">
            {entityType.label}
          </span>
          {entityType.isDefault && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-overlay text-fg-muted">
              по умолч.
            </span>
          )}
        </div>
        <span className="text-xs text-fg-muted font-mono">
          {entityType.name}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(entityType)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(entityType)}
          className="h-8 w-8 p-0 text-fg-muted hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
