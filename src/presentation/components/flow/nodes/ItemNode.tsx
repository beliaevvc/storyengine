'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Package, Sparkles, Sword, Shield, Scroll, Key, Gem } from 'lucide-react';

export interface ItemNodeData extends Record<string, unknown> {
  name: string;
  description?: string;
  attributes?: Record<string, unknown>;
}

// Map item types/categories to icons
function getItemIcon(name: string, attrs: Record<string, unknown>) {
  const category = (attrs['Категория'] || attrs['category'] || '') as string;
  const type = (attrs['Тип'] || attrs['type'] || '') as string;
  const combined = `${name} ${category} ${type}`.toLowerCase();

  if (combined.includes('меч') || combined.includes('оружие') || combined.includes('weapon') || combined.includes('sword')) {
    return Sword;
  }
  if (combined.includes('щит') || combined.includes('броня') || combined.includes('armor') || combined.includes('shield')) {
    return Shield;
  }
  if (combined.includes('книга') || combined.includes('свиток') || combined.includes('scroll') || combined.includes('book')) {
    return Scroll;
  }
  if (combined.includes('ключ') || combined.includes('key')) {
    return Key;
  }
  if (combined.includes('драгоценн') || combined.includes('gem') || combined.includes('jewel') || combined.includes('камень')) {
    return Gem;
  }
  if (combined.includes('магич') || combined.includes('magic') || combined.includes('артефакт') || combined.includes('artifact')) {
    return Sparkles;
  }
  return Package;
}

// Skip these keys when displaying attributes
const SKIP_KEYS = [
  'owner', 'владелец', 'Владелец', 
  'category', 'Категория',
  'relationships', 'Relationships', 'связи', 'Связи',
  'inventory', 'Inventory', 'инвентарь', 'Инвентарь',
  'role', 'Роль',
];

// Check if value is displayable as text
function isDisplayableValue(value: unknown): value is string | number | boolean | string[] {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }
  // Array of primitives (strings, numbers) is ok
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(item => 
      typeof item === 'string' || typeof item === 'number'
    );
  }
  return false;
}

function ItemNodeComponent({ data: rawData, selected }: NodeProps) {
  const data = rawData as ItemNodeData;
  const attrs = data.attributes || {};

  const Icon = getItemIcon(data.name, attrs);
  const rarity = (attrs['Редкость'] || attrs['rarity'] || '') as string;
  const owner = (attrs['Владелец'] || attrs['owner'] || '') as string;

  // Get displayable attributes (only primitive values)
  const displayAttrs = Object.entries(attrs)
    .filter(([key, value]) => {
      if (key.startsWith('_')) return false;
      if (SKIP_KEYS.includes(key)) return false;
      if (value === null || value === undefined || value === '') return false;
      // Only allow displayable values (strings, numbers, arrays of strings)
      return isDisplayableValue(value);
    })
    .slice(0, 2);

  // Rarity color
  const getRarityColor = () => {
    const r = rarity.toLowerCase();
    if (r.includes('легендар') || r.includes('legendary')) return 'text-amber-400';
    if (r.includes('эпич') || r.includes('epic')) return 'text-purple-400';
    if (r.includes('редк') || r.includes('rare')) return 'text-blue-400';
    if (r.includes('необыч') || r.includes('uncommon')) return 'text-green-400';
    return 'text-[#768390]';
  };

  return (
    <div
      className={`
        w-48 bg-[#22272e] border rounded-lg overflow-hidden transition-all
        ${selected ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-[#444c56]'}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-[#22272e]"
      />

      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-amber-500/10">
        <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-[#adbac7] truncate">
            {data.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            {rarity && (
              <span className={`text-[10px] ${getRarityColor()}`}>
                {rarity}
              </span>
            )}
            {owner && (
              <span className="text-[10px] text-[#768390] truncate">
                • {owner}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Attributes */}
      {displayAttrs.length > 0 && (
        <div className="px-3 py-2 space-y-1 border-t border-[#373e47]">
          {displayAttrs.map(([key, value]) => (
            <div key={key} className="text-[10px]">
              <span className="text-[#768390]">{key}:</span>
              <span className="text-[#adbac7] ml-1">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {data.description && (
        <div className="px-3 py-2 border-t border-[#373e47]">
          <p className="text-[10px] text-[#768390] line-clamp-2">
            {data.description}
          </p>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-[#22272e]"
      />
    </div>
  );
}

export const ItemNode = memo(ItemNodeComponent);
