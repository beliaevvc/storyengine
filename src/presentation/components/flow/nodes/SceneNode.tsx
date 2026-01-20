'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileText, Folder, Film, MapPin, Circle, MoreHorizontal } from 'lucide-react';

export interface SceneNodeData extends Record<string, unknown> {
  title: string;
  summary?: string;
  preview?: string;
  location?: string;
  status?: 'draft' | 'review' | 'final';
  order: number;
  type: 'SCENE' | 'DOCUMENT' | 'FOLDER' | 'NOTE';
  isFolder?: boolean;
  isDocument?: boolean;
  isScene?: boolean;
}

const STATUS_COLORS = {
  draft: 'bg-zinc-500',
  review: 'bg-amber-500',
  final: 'bg-emerald-500',
};

const BORDER_COLORS = {
  FOLDER: 'border-[#57ab5a]',
  DOCUMENT: 'border-[#986ee2]',
  SCENE: 'border-[#539bf5]',
  NOTE: 'border-[#768390]',
};

const BG_COLORS = {
  FOLDER: 'bg-[#57ab5a]/10',
  DOCUMENT: 'bg-[#986ee2]/10',
  SCENE: 'bg-[#2d333b]',
  NOTE: 'bg-[#2d333b]',
};

const HANDLE_COLORS = {
  FOLDER: '!bg-[#57ab5a]',
  DOCUMENT: '!bg-[#986ee2]',
  SCENE: '!bg-[#539bf5]',
  NOTE: '!bg-[#768390]',
};

function SceneNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as SceneNodeData;
  const nodeType = data.isFolder ? 'FOLDER' : data.isDocument ? 'DOCUMENT' : data.isScene ? 'SCENE' : data.type;
  const isFolder = nodeType === 'FOLDER';
  const isDocument = nodeType === 'DOCUMENT';
  const isScene = nodeType === 'SCENE';

  const Icon = isFolder ? Folder : isDocument ? FileText : Film;
  const iconColor = isFolder ? 'text-[#57ab5a]' : isDocument ? 'text-[#986ee2]' : 'text-[#539bf5]';
  const label = isFolder ? 'Папка' : isDocument ? 'Документ' : `Сцена ${data.order + 1}`;

  return (
    <div
      className={`
        ${isFolder ? 'w-56' : isDocument ? 'w-48' : 'w-44'} 
        bg-[#22272e] border rounded-lg overflow-hidden transition-all
        ${selected 
          ? `${BORDER_COLORS[nodeType]} shadow-lg` 
          : 'border-[#444c56]'
        }
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 !border-2 !border-[#22272e] ${HANDLE_COLORS[nodeType]}`}
      />

      {/* Header */}
      <div className={`
        flex items-center gap-2 px-3 py-2 border-b border-[#444c56]
        ${BG_COLORS[nodeType]}
      `}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className={`text-xs ${iconColor}`}>
          {label}
        </span>
        
        {/* Scene status indicator */}
        {isScene && data.status && (
          <Circle 
            className={`w-2 h-2 ml-auto ${STATUS_COLORS[data.status]}`} 
            fill="currentColor"
          />
        )}
        
        {!isScene && (
          <button className="ml-auto text-[#768390] hover:text-[#adbac7]">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className={`
          text-sm font-medium mb-1 truncate
          ${isFolder ? 'text-[#adbac7]' : isDocument ? 'text-[#c4b5fd]' : 'text-[#adbac7]'}
        `}>
          {data.title}
        </h4>
        
        {/* Location for scenes */}
        {isScene && data.location && (
          <div className="flex items-center gap-1 text-xs text-[#768390] mb-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{data.location}</span>
          </div>
        )}
        
        {/* Preview text */}
        {(data.summary || data.preview) && (
          <p className="text-xs text-[#768390] line-clamp-2">
            {data.summary || data.preview}
          </p>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 !border-2 !border-[#22272e] ${HANDLE_COLORS[nodeType]}`}
      />
    </div>
  );
}

export const SceneNode = memo(SceneNodeComponent);
