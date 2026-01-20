'use client';

import { Hash, Type, ToggleLeft, List, ListOrdered } from 'lucide-react';
import type { AttributeDefinition, AttributeType } from '@/core/types/attribute-schema';

// Icons for attribute types
const TYPE_ICONS: Record<AttributeType, React.ElementType> = {
  number: Hash,
  text: Type,
  boolean: ToggleLeft,
  enum: List,
  list: ListOrdered,
};

interface AttributesListProps {
  /** Entity attributes (values) */
  attributes: Record<string, unknown>;
  /** Attribute definitions from project schema (optional) */
  definitions?: AttributeDefinition[];
  /** Entity type for filtering applicable attributes */
  entityType?: string;
}

export function AttributesList({
  attributes,
  definitions = [],
  entityType,
}: AttributesListProps) {
  // Filter definitions applicable to this entity type
  const applicableDefinitions = definitions.filter(
    (d) => d.entityTypes.length === 0 || (entityType && d.entityTypes.includes(entityType))
  );

  // Get all attribute keys (from definitions + any extra in attributes)
  const definedKeys = new Set(applicableDefinitions.map((d) => d.name));
  const extraKeys = Object.keys(attributes).filter((k) => !definedKeys.has(k));

  if (applicableDefinitions.length === 0 && extraKeys.length === 0) {
    return (
      <p className="text-sm text-fg-muted italic">Нет атрибутов</p>
    );
  }

  return (
    <div className="space-y-2">
      {/* Defined attributes (from schema) */}
      {applicableDefinitions.map((def) => {
        const value = attributes[def.name];
        const Icon = TYPE_ICONS[def.type];

        return (
          <div key={def.id} className="flex items-start gap-2">
            <Icon className="w-3.5 h-3.5 mt-0.5 text-fg-muted shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-fg-secondary">{def.name}</span>
              <div className="font-mono text-sm text-fg">
                {formatValue(value, def.type)}
              </div>
            </div>
          </div>
        );
      })}

      {/* Extra attributes (not in schema) */}
      {extraKeys.map((key) => (
        <div key={key} className="flex items-start gap-2">
          <Type className="w-3.5 h-3.5 mt-0.5 text-fg-muted shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-fg-secondary">{key}</span>
            <div className="font-mono text-sm text-fg">
              {formatValue(attributes[key], 'text')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: unknown, type: AttributeType): string {
  if (value === null || value === undefined) {
    return '—';
  }

  switch (type) {
    case 'boolean':
      return value ? 'Да' : 'Нет';
    case 'list':
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '—';
      }
      return String(value);
    case 'number':
      return String(value);
    case 'enum':
    case 'text':
    default:
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
  }
}
