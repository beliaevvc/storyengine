'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { User, MapPin, Package, Calendar, Users, Globe, StickyNote } from 'lucide-react';
import type { NodeViewProps } from '@tiptap/react';

const TYPE_COLORS: Record<string, string> = {
  CHARACTER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LOCATION: 'bg-green-500/20 text-green-400 border-green-500/30',
  ITEM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  EVENT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  FACTION: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  WORLDBUILDING: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  NOTE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CHARACTER: User,
  LOCATION: MapPin,
  ITEM: Package,
  EVENT: Calendar,
  FACTION: Users,
  WORLDBUILDING: Globe,
  NOTE: StickyNote,
};

export function EntityMentionComponent({ node }: NodeViewProps) {
  const { id, label, type } = node.attrs;
  const colorClass = TYPE_COLORS[type] || TYPE_COLORS.CHARACTER;
  const Icon = TYPE_ICONS[type] || User;

  return (
    <NodeViewWrapper
      as="span"
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
      data-entity-id={id}
      data-entity-type={type}
    >
      <Icon className="w-3 h-3" />
      <span className="text-sm font-medium">{label}</span>
    </NodeViewWrapper>
  );
}
