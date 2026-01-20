'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MapPin, MoreHorizontal } from 'lucide-react';

export interface LocationNodeData extends Record<string, unknown> {
  name: string;
  description?: string;
  region?: string;
  imageUrl?: string;
}

function LocationNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as LocationNodeData;
  return (
    <div
      className={`
        w-44 bg-[#22272e] border rounded-lg overflow-hidden transition-all
        ${selected ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-[#444c56]'}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-green-500 !border-2 !border-[#22272e]"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border-b border-[#444c56]">
        <MapPin className="w-4 h-4 text-green-400" />
        <span className="text-xs text-green-400">Локация</span>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-[#adbac7] truncate">
          {data.name}
        </h4>
        {data.region && (
          <p className="text-xs text-[#768390]">{data.region}</p>
        )}
        {data.description && (
          <p className="text-xs text-[#768390] line-clamp-2 mt-1">
            {data.description}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 !border-2 !border-[#22272e]"
      />
    </div>
  );
}

export const LocationNode = memo(LocationNodeComponent);
