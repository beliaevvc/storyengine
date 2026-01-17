'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, X, Loader2 } from 'lucide-react';
import { EntityTypeIcon, getEntityTypeLabel } from './EntityTypeIcon';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import {
  getEntityRelations,
  createEntityRelation,
  deleteEntityRelation,
} from '@/app/actions/supabase/entity-actions';
import type { Entity, EntityRelation, RelationType, InsertTables } from '@/types/supabase';

const RELATION_TYPES: { value: RelationType; label: string }[] = [
  { value: 'FRIEND', label: 'Друг' },
  { value: 'ENEMY', label: 'Враг' },
  { value: 'FAMILY', label: 'Семья' },
  { value: 'ALLY', label: 'Союзник' },
  { value: 'RIVAL', label: 'Соперник' },
  { value: 'MENTOR', label: 'Наставник' },
  { value: 'STUDENT', label: 'Ученик' },
  { value: 'LOVER', label: 'Возлюбленный' },
  { value: 'COLLEAGUE', label: 'Коллега' },
  { value: 'CUSTOM', label: 'Другое' },
];

interface EntityRelationsProps {
  entity: Entity;
  allEntities: Entity[];
  onClose?: () => void;
}

export function EntityRelations({
  entity,
  allEntities,
  onClose,
}: EntityRelationsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [outgoing, setOutgoing] = useState<Array<{ relation: any; target: Entity }>>([]);
  const [incoming, setIncoming] = useState<Array<{ relation: any; source: Entity }>>([]);
  
  // New relation form
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [selectedType, setSelectedType] = useState<RelationType>('FRIEND');
  const [customLabel, setCustomLabel] = useState('');

  useEffect(() => {
    loadRelations();
  }, [entity.id]);

  const loadRelations = async () => {
    setLoading(true);
    const { data, error } = await getEntityRelations(entity.id);
    if (data) {
      setOutgoing(data.outgoing);
      setIncoming(data.incoming);
    }
    setLoading(false);
  };

  const handleAddRelation = async () => {
    if (!selectedTargetId) return;

    setSaving(true);
    const { error } = await createEntityRelation({
      source_id: entity.id,
      target_id: selectedTargetId,
      relation_type: selectedType,
      label: selectedType === 'CUSTOM' ? customLabel : null,
    });

    if (!error) {
      await loadRelations();
      setShowAddForm(false);
      setSelectedTargetId('');
      setSelectedType('FRIEND');
      setCustomLabel('');
    }
    setSaving(false);
  };

  const handleDeleteRelation = async (relationId: string) => {
    setSaving(true);
    await deleteEntityRelation(relationId);
    await loadRelations();
    setSaving(false);
  };

  const getRelationLabel = (type: RelationType, customLabel?: string | null) => {
    if (type === 'CUSTOM' && customLabel) return customLabel;
    return RELATION_TYPES.find((r) => r.value === type)?.label || type;
  };

  // Filter out already related entities and self
  const availableTargets = allEntities.filter(
    (e) =>
      e.id !== entity.id &&
      !outgoing.some((o) => o.target.id === e.id)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#768390]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Entity Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#444c56]">
        <EntityTypeIcon type={entity.type} size="lg" />
        <div>
          <h3 className="text-lg font-medium text-[#adbac7]">{entity.name}</h3>
          <p className="text-sm text-[#768390]">
            {getEntityTypeLabel(entity.type)}
          </p>
        </div>
      </div>

      {/* Outgoing Relations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-[#adbac7]">
            Связи ({outgoing.length})
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="text-[#539bf5]"
          >
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>

        {outgoing.length === 0 && !showAddForm ? (
          <p className="text-sm text-[#768390]">Нет связей</p>
        ) : (
          <div className="space-y-2">
            {outgoing.map(({ relation, target }) => (
              <div
                key={relation.id}
                className="flex items-center gap-3 p-3 bg-[#2d333b] rounded-lg"
              >
                <EntityTypeIcon type={entity.type} size="sm" />
                <span className="text-sm text-[#adbac7]">{entity.name}</span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#373e47] rounded text-xs text-[#768390]">
                  <ArrowRight className="w-3 h-3" />
                  {getRelationLabel(relation.relation_type, relation.label)}
                </div>
                <EntityTypeIcon type={target.type} size="sm" />
                <span className="text-sm text-[#adbac7] flex-1">{target.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteRelation(relation.id)}
                  disabled={saving}
                  className="text-[#768390] hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Relation Form */}
        {showAddForm && (
          <div className="mt-3 p-4 bg-[#2d333b] rounded-lg space-y-3">
            <div>
              <label className="block text-xs text-[#768390] mb-1">
                Связать с
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full px-3 py-2 bg-[#22272e] border border-[#444c56] rounded-md text-[#adbac7] text-sm focus:outline-none focus:ring-2 focus:ring-[#539bf5]"
              >
                <option value="">Выберите сущность...</option>
                {availableTargets.map((e) => (
                  <option key={e.id} value={e.id}>
                    {getEntityTypeLabel(e.type)}: {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#768390] mb-1">
                Тип связи
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as RelationType)}
                className="w-full px-3 py-2 bg-[#22272e] border border-[#444c56] rounded-md text-[#adbac7] text-sm focus:outline-none focus:ring-2 focus:ring-[#539bf5]"
              >
                {RELATION_TYPES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedType === 'CUSTOM' && (
              <div>
                <label className="block text-xs text-[#768390] mb-1">
                  Название связи
                </label>
                <Input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="Например: бывший партнёр"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Отмена
              </Button>
              <Button
                size="sm"
                onClick={handleAddRelation}
                disabled={!selectedTargetId || saving}
                className="bg-[#347d39] hover:bg-[#46954a] text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Добавить'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Incoming Relations */}
      {incoming.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-[#adbac7] mb-3">
            Входящие связи ({incoming.length})
          </h4>
          <div className="space-y-2">
            {incoming.map(({ relation, source }) => (
              <div
                key={relation.id}
                className="flex items-center gap-3 p-3 bg-[#2d333b] rounded-lg opacity-75"
              >
                <EntityTypeIcon type={source.type} size="sm" />
                <span className="text-sm text-[#adbac7]">{source.name}</span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#373e47] rounded text-xs text-[#768390]">
                  <ArrowRight className="w-3 h-3" />
                  {getRelationLabel(relation.relation_type, relation.label)}
                </div>
                <EntityTypeIcon type={entity.type} size="sm" />
                <span className="text-sm text-[#adbac7]">{entity.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
