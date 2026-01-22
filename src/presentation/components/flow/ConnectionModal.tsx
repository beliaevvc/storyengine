'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowRight, Plus, Link2, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Modal } from '@/presentation/components/ui/modal';
import { getRelationshipTypesAction, createRelationshipTypeAction } from '@/app/actions/supabase/relationship-type-actions';
import { updateEntityRelationships } from '@/app/actions/supabase/entity-actions';
import type { Entity } from '@/types/supabase';
import type { RelationshipType, CreateRelationshipTypeData } from '@/core/types/relationship-types';

// ============================================================================
// Types
// ============================================================================

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceEntity: Entity | null;
  targetEntity: Entity | null;
  projectId: string;
  onConnectionCreated: () => void;
}

// Extended type option for UI (includes reverse variants)
interface TypeOption {
  id: string;
  typeId: string;
  name: string;
  reverseName: string;
  isReverse: boolean;
}

// ============================================================================
// Main Component
// ============================================================================

export function ConnectionModal({
  isOpen,
  onClose,
  sourceEntity,
  targetEntity,
  projectId,
  onConnectionCreated,
}: ConnectionModalProps) {
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TypeOption | null>(null);
  
  // Create new type mode
  const [showCreateType, setShowCreateType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeReverseName, setNewTypeReverseName] = useState('');
  const [isSymmetric, setIsSymmetric] = useState(true);
  const [isCreatingType, setIsCreatingType] = useState(false);

  // Load relationship types
  const loadTypes = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    const result = await getRelationshipTypesAction(projectId);
    if (result.success) {
      setRelationshipTypes(result.data);
    }
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      loadTypes();
      setSelectedOption(null);
      setShowCreateType(false);
      setNewTypeName('');
      setNewTypeReverseName('');
      setIsSymmetric(true);
    }
  }, [isOpen, loadTypes]);

  // Filter types by source and target entity types
  const getApplicableTypeOptions = (): TypeOption[] => {
    if (!sourceEntity || !targetEntity) return [];
    
    const sourceType = sourceEntity.type.toUpperCase();
    const targetType = targetEntity.type.toUpperCase();
    
    const options: TypeOption[] = [];
    
    for (const type of relationshipTypes) {
      // Check source restriction
      const sourceAllowed = !type.sourceEntityTypes || 
        type.sourceEntityTypes.length === 0 ||
        type.sourceEntityTypes.some((t: string) => t.toUpperCase() === sourceType);
      
      // Check target restriction
      const targetAllowed = !type.targetEntityTypes || 
        type.targetEntityTypes.length === 0 ||
        type.targetEntityTypes.some((t: string) => t.toUpperCase() === targetType);
      
      if (!sourceAllowed || !targetAllowed) continue;
      
      if (type.reverseName === null) {
        // Symmetric type
        options.push({
          id: type.id,
          typeId: type.id,
          name: type.name,
          reverseName: type.name,
          isReverse: false,
        });
      } else {
        // Asymmetric type - add both directions
        options.push({
          id: `${type.id}-direct`,
          typeId: type.id,
          name: type.name,
          reverseName: type.reverseName,
          isReverse: false,
        });
        
        // Check if reverse direction is also applicable
        const reverseSourceAllowed = !type.targetEntityTypes || 
          type.targetEntityTypes.length === 0 ||
          type.targetEntityTypes.some((t: string) => t.toUpperCase() === sourceType);
        
        const reverseTargetAllowed = !type.sourceEntityTypes || 
          type.sourceEntityTypes.length === 0 ||
          type.sourceEntityTypes.some((t: string) => t.toUpperCase() === targetType);
        
        if (reverseSourceAllowed && reverseTargetAllowed) {
          options.push({
            id: `${type.id}-reverse`,
            typeId: type.id,
            name: type.reverseName,
            reverseName: type.name,
            isReverse: true,
          });
        }
      }
    }
    
    return options;
  };

  const applicableOptions = getApplicableTypeOptions();

  // Auto-select first option when available
  useEffect(() => {
    if (!selectedOption && applicableOptions.length > 0 && !showCreateType) {
      setSelectedOption(applicableOptions[0]);
    }
  }, [applicableOptions, selectedOption, showCreateType]);

  // Handle creating the connection
  const handleCreateConnection = async () => {
    if (!sourceEntity || !targetEntity || !selectedOption) return;
    
    setIsSaving(true);
    
    // Create relationship using bidirectional update
    const newRelationship = {
      entityId: targetEntity.id,
      typeId: selectedOption.typeId,
      typeName: selectedOption.name,
      isReverse: selectedOption.isReverse,
    };
    
    // Get current relationships for source entity
    const sourceAttrs = (sourceEntity.attributes || {}) as Record<string, unknown>;
    const currentRelationships = (sourceAttrs.relationships || []) as Array<{
      entityId: string;
      typeId: string;
      typeName: string;
      isReverse?: boolean;
    }>;
    
    const result = await updateEntityRelationships(
      sourceEntity.id,
      projectId,
      [...currentRelationships, newRelationship],
      currentRelationships
    );
    
    setIsSaving(false);
    
    if (result.success) {
      onConnectionCreated();
      onClose();
    } else {
      console.error('Failed to create connection:', result.error);
    }
  };

  // Handle creating a new relationship type
  const handleCreateType = async () => {
    if (!newTypeName.trim()) return;
    
    setIsCreatingType(true);
    
    const data: CreateRelationshipTypeData = {
      projectId,
      name: newTypeName.trim(),
      reverseName: isSymmetric ? null : (newTypeReverseName.trim() || null),
      sourceEntityTypes: null,
      targetEntityTypes: null,
    };
    
    const result = await createRelationshipTypeAction(data);
    
    setIsCreatingType(false);
    
    if (result.success) {
      // Reload types and select the new one
      await loadTypes();
      setShowCreateType(false);
      setNewTypeName('');
      setNewTypeReverseName('');
      setIsSymmetric(true);
      
      // Select the newly created type
      const newType = result.data;
      setSelectedOption({
        id: newType.id,
        typeId: newType.id,
        name: newType.name,
        reverseName: newType.reverseName || newType.name,
        isReverse: false,
      });
    }
  };

  if (!sourceEntity || !targetEntity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Создание связи"
      size="md"
    >
      <div className="space-y-4">
        {/* Connection Preview */}
        <div className="flex items-center justify-center gap-3 p-4 bg-[#2d333b] rounded-lg">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-1">
              <span className="text-blue-400 text-sm font-medium">
                {sourceEntity.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-[#adbac7] font-medium">{sourceEntity.name}</span>
            <p className="text-xs text-[#768390]">{sourceEntity.type}</p>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="w-5 h-5 text-[#768390]" />
            {selectedOption && (
              <span className="text-xs text-[#539bf5] font-medium">
                {selectedOption.name}
              </span>
            )}
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-1">
              <span className="text-green-400 text-sm font-medium">
                {targetEntity.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-[#adbac7] font-medium">{targetEntity.name}</span>
            <p className="text-xs text-[#768390]">{targetEntity.type}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#768390]" />
          </div>
        ) : showCreateType ? (
          /* Create New Type Form */
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[#adbac7]">
              <Plus className="w-4 h-4" />
              <span>Новый тип связи</span>
            </div>
            
            <div>
              <label className="block text-xs text-[#768390] mb-1">
                Название связи *
              </label>
              <Input
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Например: Друг, Наставник, Владелец"
              />
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSymmetric}
                onChange={(e) => setIsSymmetric(e.target.checked)}
                className="w-4 h-4 rounded border-[#444c56] bg-[#2d333b]"
              />
              <span className="text-sm text-[#adbac7]">Симметричная связь</span>
            </label>
            
            {!isSymmetric && (
              <div>
                <label className="block text-xs text-[#768390] mb-1">
                  Обратное название
                </label>
                <Input
                  value={newTypeReverseName}
                  onChange={(e) => setNewTypeReverseName(e.target.value)}
                  placeholder="Например: Ученик (для Наставник)"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreateType(false)}
                disabled={isCreatingType}
              >
                Назад
              </Button>
              <Button
                onClick={handleCreateType}
                disabled={!newTypeName.trim() || isCreatingType}
                className="flex-1"
              >
                {isCreatingType ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Создать тип
              </Button>
            </div>
          </div>
        ) : applicableOptions.length === 0 ? (
          /* No applicable types */
          <div className="text-center py-6">
            <AlertCircle className="w-10 h-10 text-[#768390] mx-auto mb-3" />
            <p className="text-[#adbac7] mb-2">Нет подходящих типов связей</p>
            <p className="text-sm text-[#768390] mb-4">
              Для этих типов сущностей не определены связи.
              Создайте новый тип связи.
            </p>
            <Button onClick={() => setShowCreateType(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать тип связи
            </Button>
          </div>
        ) : (
          /* Type Selection */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[#768390]">Выберите тип связи:</label>
              <button
                onClick={() => setShowCreateType(true)}
                className="text-xs text-[#539bf5] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Новый тип
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {applicableOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    selectedOption?.id === option.id
                      ? 'bg-[#539bf5] text-white'
                      : 'bg-[#373e47] text-[#adbac7] hover:bg-[#444c56]'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
            
            {/* Preview what each entity gets */}
            {selectedOption && (
              <div className="p-3 bg-[#2d333b] rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#768390]">У</span>
                  <span className="text-[#adbac7] font-medium">{sourceEntity.name}</span>
                  <span className="text-[#768390]">появится:</span>
                  <span className="px-1.5 py-0.5 bg-[#539bf5]/20 text-[#539bf5] rounded">
                    {selectedOption.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#768390]">У</span>
                  <span className="text-[#adbac7] font-medium">{targetEntity.name}</span>
                  <span className="text-[#768390]">появится:</span>
                  <span className="px-1.5 py-0.5 bg-[#539bf5]/20 text-[#539bf5] rounded">
                    {selectedOption.reverseName}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!isLoading && !showCreateType && applicableOptions.length > 0 && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#444c56]">
            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
              Отмена
            </Button>
            <Button
              onClick={handleCreateConnection}
              disabled={!selectedOption || isSaving}
              className="bg-[#347d39] hover:bg-[#46954a] text-white"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Link2 className="w-4 h-4 mr-2" />
              )}
              Создать связь
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
