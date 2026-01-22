'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { User, Users } from 'lucide-react';

export interface CharacterNodeData extends Record<string, unknown> {
  name: string;
  description?: string;
  relationCount?: number;
  imageUrl?: string;
  // All attributes from entity
  attributes?: Record<string, unknown>;
}

// Skip these keys when displaying attributes
const SKIP_KEYS = ['relationships', 'role', 'inventory'];

function CharacterNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as CharacterNodeData;
  const attrs = data.attributes || {};
  
  // Get displayable attributes (skip internal ones)
  const displayAttrs = Object.entries(attrs)
    .filter(([key, value]) => {
      if (SKIP_KEYS.includes(key)) return false;
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
    .slice(0, 4); // Limit to 4 attributes
  
  return (
    <div
      className={`
        w-52 bg-[#22272e] border rounded-lg overflow-hidden transition-all
        ${selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-[#444c56]'}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-[#22272e]"
      />

      {/* Header with Avatar */}
      <div className="flex items-center gap-3 p-3 bg-blue-500/10">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-blue-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-[#adbac7] truncate">
            {data.name}
          </h4>
          {/* Relation count */}
          {data.relationCount !== undefined && data.relationCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-[#768390]">
              <Users className="w-3 h-3" />
              {data.relationCount} связей
            </span>
          )}
        </div>
      </div>

      {/* Attributes */}
      {displayAttrs.length > 0 && (
        <div className="px-3 py-2 space-y-1 border-t border-[#373e47]">
          {displayAttrs.map(([key, value]) => (
            <div key={key} className="flex text-[10px]">
              <span className="text-[#768390] mr-1.5">{key}:</span>
              <span className="text-[#adbac7] truncate flex-1">
                {typeof value === 'string' 
                  ? value 
                  : Array.isArray(value) 
                    ? value.join(', ') 
                    : String(value)
                }
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Description preview */}
      {data.description && (
        <div className="px-3 py-2 border-t border-[#373e47]">
          <p className="text-[10px] text-[#768390] line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-[#22272e]"
      />
    </div>
  );
}

export const CharacterNode = memo(CharacterNodeComponent);
