'use client';

import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { useEditorStore } from '@/presentation/stores/useEditorStore';

// Technical style - monospace, underlined
export function EntityMentionComponent({ node }: NodeViewProps) {
  const { id, label, type } = node.attrs;
  const viewMode = useEditorStore((s) => s.viewMode);
  const isCleanMode = viewMode === 'clean';

  // Clean mode: just plain text, no styling
  if (isCleanMode) {
    return (
      <NodeViewWrapper as="span" className="inline">
        {label}
      </NodeViewWrapper>
    );
  }

  // Syntax mode: styled mention
  return (
    <NodeViewWrapper
      as="span"
      className="
        inline
        font-mono
        text-[#8b949e]
        border-b
        border-dashed
        border-[#4d5562]
        cursor-pointer
        hover:text-[#c9d1d9]
        hover:border-[#6e7681]
        transition-colors
      "
      data-entity-id={id}
      data-entity-type={type}
      title={type}
    >
      {label}
    </NodeViewWrapper>
  );
}

/* BACKUP - Previous style with colors:
const TYPE_STYLES: Record<string, string> = {
  CHARACTER: 'bg-blue-500/10 text-blue-200/90 hover:bg-blue-500/20',
  LOCATION: 'bg-emerald-500/10 text-emerald-200/90 hover:bg-emerald-500/20',
  ITEM: 'bg-amber-500/10 text-amber-200/90 hover:bg-amber-500/20',
  EVENT: 'bg-violet-500/10 text-violet-200/90 hover:bg-violet-500/20',
  FACTION: 'bg-orange-500/10 text-orange-200/90 hover:bg-orange-500/20',
  WORLDBUILDING: 'bg-cyan-500/10 text-cyan-200/90 hover:bg-cyan-500/20',
  NOTE: 'bg-slate-500/10 text-slate-200/90 hover:bg-slate-500/20',
};
*/
