'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { User, Users, Heart, Skull } from 'lucide-react';

export interface CharacterNodeData extends Record<string, unknown> {
  name: string;
  description?: string;
  role?: string;
  status?: string;
  gender?: string;
  relationCount?: number;
  imageUrl?: string;
}

function CharacterNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as CharacterNodeData;
  
  // Status badge color
  const isAlive = data.status === 'Жив';
  const isDead = data.status === 'Мертв';
  
  return (
    <div
      className={`
        w-48 bg-[#22272e] border rounded-lg overflow-hidden transition-all
        ${selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-[#444c56]'}
        ${isDead ? 'opacity-70' : ''}
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
          {data.role && (
            <span className="text-xs text-blue-400 truncate block">{data.role}</span>
          )}
        </div>
      </div>

      {/* Info badges */}
      <div className="px-3 py-2 flex flex-wrap gap-1.5">
        {/* Status */}
        {data.status && (
          <span className={`
            inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
            ${isDead 
              ? 'bg-red-500/20 text-red-400' 
              : isAlive 
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-gray-500/20 text-gray-400'
            }
          `}>
            {isDead ? <Skull className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
            {data.status}
          </span>
        )}
        
        {/* Gender */}
        {data.gender && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-500/20 text-purple-400">
            {data.gender}
          </span>
        )}
        
        {/* Relation count */}
        {data.relationCount !== undefined && data.relationCount > 0 && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-400">
            <Users className="w-3 h-3" />
            {data.relationCount}
          </span>
        )}
      </div>

      {/* Description preview */}
      {data.description && (
        <div className="px-3 pb-2">
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
