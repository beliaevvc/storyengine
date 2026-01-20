'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';
import type { SceneWithDocument } from '@/app/actions/scene-actions';

interface TimelineItemProps {
  scene: SceneWithDocument;
  projectId: string;
  isLast?: boolean;
}

export function TimelineItem({ scene, projectId, isLast = false }: TimelineItemProps) {
  const sceneNumber = `${scene.documentOrder + 1}.${scene.order + 1}`;

  return (
    <div className="relative flex gap-3 pb-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
      )}

      {/* Timeline dot */}
      <div className="relative z-10 mt-1.5">
        <div className="w-[15px] h-[15px] rounded-full bg-overlay border-2 border-accent flex items-center justify-center">
          <div className="w-[5px] h-[5px] rounded-full bg-accent" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {/* Scene number */}
        <div className="text-2xs font-mono text-fg-muted mb-0.5">
          Сцена {sceneNumber}
        </div>

        {/* Scene title */}
        <Link
          href={`/projects/${projectId}`}
          className="text-sm font-medium text-fg hover:text-fg-link transition-colors line-clamp-2"
        >
          {scene.title || 'Без названия'}
        </Link>

        {/* Document (chapter) */}
        <div className="flex items-center gap-1.5 mt-1 text-xs text-fg-secondary">
          <FileText className="w-3 h-3" />
          <span className="truncate">{scene.documentTitle}</span>
        </div>

        {/* Role badge (if entity has a specific role in this scene) */}
        {scene.role && (
          <Badge variant="secondary" className="mt-2 text-2xs">
            {scene.role}
          </Badge>
        )}

        {/* Notes (if any) */}
        {scene.notes && (
          <p className="mt-1.5 text-xs text-fg-muted line-clamp-2">
            {scene.notes}
          </p>
        )}
      </div>
    </div>
  );
}
