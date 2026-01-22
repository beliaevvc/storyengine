'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowRight, Check, Link2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Modal } from '@/presentation/components/ui/modal';
import { getRelationshipTypesAction } from '@/app/actions/supabase/relationship-type-actions';
import { updateEntityRelationships } from '@/app/actions/supabase/entity-actions';
import type { Entity } from '@/types/supabase';
import type { RelationshipType } from '@/core/types/relationship-types';

// ============================================================================
// Types
// ============================================================================

interface EditConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceEntity: Entity | null;
  targetEntity: Entity | null;
  projectId: string;
  onConnectionUpdated: () => void;
}

// Stored relationship format
interface StoredRelationship {
  entityId: string;
  typeId: string;
  typeName: string;
  isReverse?: boolean;
  description?: string;
}

// Extended type option for UI
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

export function EditConnectionModal({
  isOpen,
  onClose,
  sourceEntity,
  targetEntity,
  projectId,
  onConnectionUpdated,
}: EditConnectionModalProps) {
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TypeOption | null>(null);
  const [currentRelationship, setCurrentRelationship] = useState<StoredRelationship | null>(null);

  // Load relationship types and current relationship
  const loadData = useCallback(async () => {
    if (!projectId || !sourceEntity || !targetEntity) return;
    
    setIsLoading(true);
    
    // Load relationship types
    const result = await getRelationshipTypesAction(projectId);
    if (result.success) {
      setRelationshipTypes(result.data);
    }
    
    // Find current relationship
    const sourceAttrs = (sourceEntity.attributes || {}) as Record<string, unknown>;
    const relationships = (sourceAttrs.relationships || []) as StoredRelationship[];
    const current = relationships.find(r => r.entityId === targetEntity.id);
    setCurrentRelationship(current || null);
    
    setIsLoading(false);
  }, [projectId, sourceEntity, targetEntity]);

  useEffect(() => {
    if (isOpen) {
      loadData();
      setSelectedOption(null);
    }
  }, [isOpen, loadData]);

  // Build type options
  const getApplicableTypeOptions = (): TypeOption[] => {
    if (!sourceEntity || !targetEntity) return [];
    
    const sourceType = sourceEntity.type.toUpperCase();
    const targetType = targetEntity.type.toUpperCase();
    
    const options: TypeOption[] = [];
    
    for (const type of relationshipTypes) {
      const sourceAllowed = !type.sourceEntityTypes || 
        type.sourceEntityTypes.length === 0 ||
        type.sourceEntityTypes.some((t: string) => t.toUpperCase() === sourceType);
      
      const targetAllowed = !type.targetEntityTypes || 
        type.targetEntityTypes.length === 0 ||
        type.targetEntityTypes.some((t: string) => t.toUpperCase() === targetType);
      
      if (!sourceAllowed || !targetAllowed) continue;
      
      if (type.reverseName === null) {
        options.push({
          id: type.id,
          typeId: type.id,
          name: type.name,
          reverseName: type.name,
          isReverse: false,
        });
      } else {
        options.push({
          id: `${type.id}-direct`,
          typeId: type.id,
          name: type.name,
          reverseName: type.reverseName,
          isReverse: false,
        });
        
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

  // Auto-select current type or first option
  useEffect(() => {
    if (!selectedOption && applicableOptions.length > 0 && currentRelationship) {
      // Try to find matching option
      const current = applicableOptions.find(
        o => o.typeId === currentRelationship.typeId && o.isReverse === currentRelationship.isReverse
      ) || applicableOptions.find(
        o => o.name === currentRelationship.typeName
      ) || applicableOptions[0];
      
      setSelectedOption(current);
    } else if (!selectedOption && applicableOptions.length > 0) {
      setSelectedOption(applicableOptions[0]);
    }
  }, [applicableOptions, selectedOption, currentRelationship]);

  // Handle save
  const handleSave = async () => {
    if (!sourceEntity || !targetEntity || !selectedOption) return;
    
    setIsSaving(true);
    
    // Get current relationships
    const sourceAttrs = (sourceEntity.attributes || {}) as Record<string, unknown>;
    const currentRelationships = (sourceAttrs.relationships || []) as StoredRelationship[];
    
    // Update the relationship to target
    const newRelationships = currentRelationships.map(r => {
      if (r.entityId === targetEntity.id) {
        return {
          entityId: targetEntity.id,
          typeId: selectedOption.typeId,
          typeName: selectedOption.name,
          isReverse: selectedOption.isReverse,
          description: r.description,
        };
      }
      return r;
    });
    
    const result = await updateEntityRelationships(
      sourceEntity.id,
      projectId,
      newRelationships,
      currentRelationships
    );
    
    setIsSaving(false);
    
    if (result.success) {
      onConnectionUpdated();
      onClose();
    } else {
      console.error('Failed to update connection:', result.error);
    }
  };

  // Check if type has changed
  const hasChanged = selectedOption && currentRelationship && (
    selectedOption.typeId !== currentRelationship.typeId ||
    selectedOption.name !== currentRelationship.typeName ||
    selectedOption.isReverse !== currentRelationship.isReverse
  );

  if (!sourceEntity || !targetEntity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Редактирование связи"
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
        ) : (
          /* Type Selection */
          <div className="space-y-3">
            <label className="text-sm text-[#768390]">Выберите тип связи:</label>
            
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
                  <span className="text-[#768390]">будет:</span>
                  <span className="px-1.5 py-0.5 bg-[#539bf5]/20 text-[#539bf5] rounded">
                    {selectedOption.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#768390]">У</span>
                  <span className="text-[#adbac7] font-medium">{targetEntity.name}</span>
                  <span className="text-[#768390]">будет:</span>
                  <span className="px-1.5 py-0.5 bg-[#539bf5]/20 text-[#539bf5] rounded">
                    {selectedOption.reverseName}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!isLoading && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#444c56]">
            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedOption || isSaving || !hasChanged}
              className="bg-[#347d39] hover:bg-[#46954a] text-white"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Сохранить
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
