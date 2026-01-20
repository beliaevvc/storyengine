'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { User, MoreHorizontal } from 'lucide-react';

export interface CharacterNodeData extends Record<string, unknown> {
  name: string;
  description?: string;
  role?: string;
  imageUrl?: string;
}

function CharacterNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as CharacterNodeData;
  return (
    <div
      className={`
        w-40 bg-[#22272e] border rounded-lg overflow-hidden transition-all
        ${selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-[#444c56]'}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-[#22272e]"
      />

      {/* Avatar */}
      <div className="flex items-center justify-center py-4 bg-blue-500/10">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 text-center">
        <h4 className="text-sm font-medium text-[#adbac7] truncate">
          {data.name}
        </h4>
        {data.role && (
          <span className="text-xs text-blue-400">{data.role}</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-[#22272e]"
      />
    </div>
  );
}

export const CharacterNode = memo(CharacterNodeComponent);
