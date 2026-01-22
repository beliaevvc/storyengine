'use client';

import { memo } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';

export interface RelationEdgeData extends Record<string, unknown> {
  label?: string;
  relationType?: string;
}

function RelationEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as RelationEdgeData | undefined;
  const label = edgeData?.label || edgeData?.relationType;
  const hasLabel = Boolean(label);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#539bf5' : hasLabel ? '#60a5fa' : '#444c56',
          strokeWidth: selected ? 2.5 : hasLabel ? 2 : 1.5,
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={`
              px-2.5 py-1 rounded-full text-xs font-medium shadow-lg
              transition-all duration-150
              ${selected 
                ? 'bg-[#539bf5] text-white scale-110' 
                : 'bg-[#1c2128] text-[#60a5fa] border border-[#60a5fa]/50 hover:bg-[#60a5fa]/10'
              }
            `}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const RelationEdge = memo(RelationEdgeComponent);
