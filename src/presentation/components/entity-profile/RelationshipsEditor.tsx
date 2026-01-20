'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Settings, Trash2, Check, Loader2, ArrowRight } from 'lucide-react';
import { Avatar } from '@/presentation/components/ui/avatar';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Modal } from '@/presentation/components/ui/modal';
import { updateEntityRelationships } from '@/app/actions/supabase/entity-actions';
import { getRelationshipTypesAction } from '@/app/actions/supabase/relationship-type-actions';
import type { Entity } from '@/core/entities/entity';
import type { RelationshipType } from '@/core/types/relationship-types';
import { useRouter } from 'next/navigation';

// ============================================================================
// Types
// ============================================================================

interface Relationship {
  entityId: string;
  typeId: string;
  typeName: string;
  description?: string;
  isReverse?: boolean; // For asymmetric: true if this is the "reverse" side
}

// Legacy format support
interface LegacyRelationship {
  entityId: string;
  type?: string;
  typeId?: string;
  typeName?: string;
  description?: string;
}

interface RelationshipsEditorProps {
  entityId: string;
  entityType: string;
  projectId: string;
  relationships: LegacyRelationship[];
  /** All entities in project (for selection) */
  allEntities: Entity[];
  /** Current entity attributes (to preserve other fields) */
  attributes: Record<string, unknown>;
  onUpdate?: () => void;
}

// ============================================================================
// Helpers
// ============================================================================

function normalizeRelationship(rel: LegacyRelationship): Relationship {
  // Convert legacy format (type string) to new format (typeId + typeName)
  if (rel.typeId && rel.typeName) {
    return {
      entityId: rel.entityId,
      typeId: rel.typeId,
      typeName: rel.typeName,
      description: rel.description,
    };
  }
  // Legacy: just 'type' string
  return {
    entityId: rel.entityId,
    typeId: '', // Will be matched later
    typeName: rel.type || 'Знакомый',
    description: rel.description,
  };
}

// ============================================================================
// Main Component
// ============================================================================

export function RelationshipsEditor({
  entityId,
  entityType,
  projectId,
  relationships,
  allEntities,
  attributes,
  onUpdate,
}: RelationshipsEditorProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Relationship types from DB
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  // Normalize relationships from props
  const normalizedRelationships = relationships.map(normalizeRelationship);
  
  // Display state - what's shown in the sidebar
  const [displayRelationships, setDisplayRelationships] = useState<Relationship[]>(normalizedRelationships);
  
  // Edit state - what's being edited in modal
  const [editRelationships, setEditRelationships] = useState<Relationship[]>(normalizedRelationships);
  
  // Previous state for diff calculation
  const previousRelationshipsRef = useRef<Relationship[]>(normalizedRelationships);

  // Sync display state when props change (only on entityId change, not on every render)
  const entityIdRef = useRef(entityId);
  useEffect(() => {
    if (entityIdRef.current !== entityId) {
      entityIdRef.current = entityId;
      const normalized = relationships.map(normalizeRelationship);
      setDisplayRelationships(normalized);
      previousRelationshipsRef.current = normalized;
    }
  }, [entityId, relationships]);

  // Load relationship types (called when modal opens)
  const loadRelationshipTypes = useCallback(async () => {
    if (relationshipTypes.length > 0 || isLoadingTypes) return;
    
    setIsLoadingTypes(true);
    const result = await getRelationshipTypesAction(projectId);
    if (result.success) {
      setRelationshipTypes(result.data);
    }
    setIsLoadingTypes(false);
  }, [projectId, relationshipTypes.length, isLoadingTypes]);

  // Filter out current entity from selection (all entity types now)
  const availableEntities = allEntities.filter((e) => e.id !== entityId);

  // Filter relationship types by source entity type
  const filteredRelationshipTypes = relationshipTypes.filter((type) => {
    // If no source restriction, allow
    if (!type.sourceEntityTypes || type.sourceEntityTypes.length === 0) {
      return true;
    }
    // Check if current entity type is allowed as source
    return type.sourceEntityTypes.includes(entityType as RelationshipType['sourceEntityTypes'][number]);
  });

  // Create entity map for quick lookup
  const entityMap = new Map(allEntities.map((e) => [e.id, e]));

  // Get current entity name
  const currentEntityName = entityMap.get(entityId)?.name || 'Текущий персонаж';

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    // Use bidirectional update that syncs both entities
    const result = await updateEntityRelationships(
      entityId,
      projectId,
      editRelationships,
      previousRelationshipsRef.current
    );
    
    if (result.success) {
      // Update display immediately
      setDisplayRelationships([...editRelationships]);
      // Update ref for next diff
      previousRelationshipsRef.current = [...editRelationships];
      onUpdate?.();
      setIsModalOpen(false);
      // Background refresh for other data
      router.refresh();
    } else {
      console.error('Failed to save relationships:', result.error);
    }
    
    setIsSaving(false);
  }, [entityId, projectId, editRelationships, onUpdate, router]);

  const handleAddRelationship = useCallback((
    targetEntityId: string, 
    typeId: string, 
    typeName: string,
    isReverse: boolean
  ) => {
    // Check if relationship already exists
    if (editRelationships.some((r) => r.entityId === targetEntityId)) {
      return;
    }
    
    setEditRelationships((prev) => [
      ...prev,
      { 
        entityId: targetEntityId, 
        typeId,
        typeName,
        isReverse,
      },
    ]);
  }, [editRelationships]);

  const handleRemoveRelationship = useCallback((targetEntityId: string) => {
    setEditRelationships((prev) => prev.filter((r) => r.entityId !== targetEntityId));
  }, []);

  const handleUpdateRelationshipType = useCallback(
    (targetEntityId: string, type: RelationshipType & { isReverse?: boolean }) => {
      setEditRelationships((prev) =>
        prev.map((r) =>
          r.entityId === targetEntityId 
            ? { ...r, typeId: type.id, typeName: type.name, isReverse: type.isReverse } 
            : r
        )
      );
    },
    []
  );

  const handleUpdateDescription = useCallback(
    (targetEntityId: string, description: string) => {
      setEditRelationships((prev) =>
        prev.map((r) =>
          r.entityId === targetEntityId ? { ...r, description } : r
        )
      );
    },
    []
  );

  // Open modal and prepare edit state
  const handleOpenModal = () => {
    // Capture current display state as "previous" for diff calculation
    previousRelationshipsRef.current = displayRelationships;
    // Copy display state to edit state
    setEditRelationships(displayRelationships);
    setIsModalOpen(true);
    // Load types in background
    loadRelationshipTypes();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-fg-secondary uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          Связи
        </h3>
        <button
          onClick={handleOpenModal}
          className="p-1 text-fg-muted hover:text-fg hover:bg-surface-hover rounded transition-colors"
          title="Редактировать связи"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Relationships list */}
      {displayRelationships.length === 0 ? (
        <div className="flex flex-col items-center py-4 text-center">
          <Users className="w-6 h-6 text-fg-muted mb-2" />
          <p className="text-sm text-fg-muted mb-2">Нет связей</p>
          <Button variant="ghost" size="sm" onClick={handleOpenModal}>
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayRelationships.map((rel) => {
            const relatedEntity = entityMap.get(rel.entityId);
            if (!relatedEntity) return null;

            // Get display type name - what role the related entity plays for current entity
            const getDisplayTypeName = (): string => {
              // If types not loaded yet, show stored typeName
              if (relationshipTypes.length === 0) {
                return rel.typeName;
              }
              
              const type = relationshipTypes.find(t => t.id === rel.typeId);
              if (!type || !type.reverseName) {
                // Symmetric or type not found - show as is
                return rel.typeName;
              }
              // Asymmetric: show the OTHER person's role
              if (rel.isReverse) {
                // I'm the reverse (e.g., Ученик), other is direct (Наставник)
                return type.name;
              } else {
                // I'm direct (e.g., Наставник), other is reverse (Ученик)
                return type.reverseName;
              }
            };

            return (
              <Link
                key={rel.entityId}
                href={`/projects/${projectId}/entity/${rel.entityId}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-overlay transition-colors group"
              >
                <Avatar
                  alt={relatedEntity.name}
                  fallback={relatedEntity.name}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-fg group-hover:text-fg-link truncate">
                    {relatedEntity.name}
                  </div>
                  <div className="text-xs text-fg-secondary truncate">
                    {getDisplayTypeName()}
                    {rel.description && ` — ${rel.description}`}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Редактирование связей"
      >
        <div className="space-y-4">
          {isLoadingTypes ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-fg-muted" />
            </div>
          ) : (
            <>
              {/* Current relationships */}
              {editRelationships.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-fg">Текущие связи</h4>
                  {editRelationships.map((rel) => {
                    const relatedEntity = entityMap.get(rel.entityId);
                    if (!relatedEntity) return null;

                    return (
                      <RelationshipItem
                        key={rel.entityId}
                        relationship={rel}
                        entity={relatedEntity}
                        relationshipTypes={relationshipTypes}
                        onUpdateType={handleUpdateRelationshipType}
                        onUpdateDescription={handleUpdateDescription}
                        onRemove={handleRemoveRelationship}
                      />
                    );
                  })}
                </div>
              )}

              {/* Add new relationship */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium text-fg mb-3">Добавить связь</h4>
                <EntitySelector
                  entities={availableEntities}
                  excludeIds={editRelationships.map((r) => r.entityId)}
                  relationshipTypes={filteredRelationshipTypes}
                  currentEntityName={currentEntityName}
                  onSelect={handleAddRelationship}
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSaving}
            >
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isLoadingTypes}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================================
// Relationship Item Component
// ============================================================================

interface RelationshipItemProps {
  relationship: Relationship;
  entity: Entity;
  relationshipTypes: RelationshipType[];
  onUpdateType: (entityId: string, type: RelationshipType & { isReverse?: boolean }) => void;
  onUpdateDescription: (entityId: string, description: string) => void;
  onRemove: (entityId: string) => void;
}

function RelationshipItem({ 
  relationship, 
  entity, 
  relationshipTypes,
  onUpdateType, 
  onUpdateDescription,
  onRemove 
}: RelationshipItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-border">
      <Avatar alt={entity.name} fallback={entity.name} size="sm" />
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-fg">{entity.name}</span>
          <button
            onClick={() => onRemove(relationship.entityId)}
            className="p-1 text-fg-muted hover:text-error rounded transition-colors"
            title="Удалить связь"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Type selector - show all options including reverse for asymmetric */}
        <div>
          <label className="text-xs text-fg-muted mb-1 block">Тип связи</label>
          <div className="flex flex-wrap gap-1">
            {relationshipTypes.flatMap((type) => {
              if (type.reverseName === null) {
                // Symmetric
                const isSelected = relationship.typeName === type.name;
                return [(
                  <button
                    key={type.id}
                    onClick={() => onUpdateType(relationship.entityId, { ...type, isReverse: false } as RelationshipType & { isReverse: boolean })}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      isSelected
                        ? 'bg-accent-primary text-white'
                        : 'bg-overlay text-fg-secondary hover:bg-surface-hover'
                    }`}
                  >
                    {type.name}
                  </button>
                )];
              } else {
                // Asymmetric: show both directions
                const isDirectSelected = relationship.typeName === type.name && !relationship.isReverse;
                const isReverseSelected = relationship.typeName === type.reverseName && relationship.isReverse;
                return [
                  <button
                    key={`${type.id}-direct`}
                    onClick={() => onUpdateType(relationship.entityId, { ...type, isReverse: false } as RelationshipType & { isReverse: boolean })}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      isDirectSelected
                        ? 'bg-accent-primary text-white'
                        : 'bg-overlay text-fg-secondary hover:bg-surface-hover'
                    }`}
                  >
                    {type.name}
                  </button>,
                  <button
                    key={`${type.id}-reverse`}
                    onClick={() => onUpdateType(relationship.entityId, { ...type, name: type.reverseName!, reverseName: type.name, isReverse: true } as RelationshipType & { isReverse: boolean })}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      isReverseSelected
                        ? 'bg-accent-primary text-white'
                        : 'bg-overlay text-fg-secondary hover:bg-surface-hover'
                    }`}
                  >
                    {type.reverseName}
                  </button>
                ];
              }
            })}
          </div>
          {/* Show what the other person gets */}
          {(() => {
            const type = relationshipTypes.find(t => t.id === relationship.typeId);
            if (type?.reverseName) {
              const otherGets = relationship.isReverse ? type.name : type.reverseName;
              return (
                <p className="text-xs text-fg-muted mt-1">
                  У {entity.name} будет: {otherGets}
                </p>
              );
            }
            return null;
          })()}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-fg-muted mb-1 block">Описание (опционально)</label>
          <Input
            value={relationship.description || ''}
            onChange={(e) => onUpdateDescription(relationship.entityId, e.target.value)}
            placeholder="Дополнительная информация о связи..."
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Entity Selector Component
// ============================================================================

// Extended type option for UI (includes reverse variants)
interface TypeOption {
  id: string;
  typeId: string;
  name: string;
  isReverse: boolean;
  otherPersonGets: string;
}

interface EntitySelectorProps {
  entities: Entity[];
  excludeIds: string[];
  relationshipTypes: RelationshipType[];
  currentEntityName: string;
  onSelect: (entityId: string, typeId: string, typeName: string, isReverse: boolean) => void;
}

function EntitySelector({ 
  entities, 
  excludeIds, 
  relationshipTypes, 
  currentEntityName,
  onSelect 
}: EntitySelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<TypeOption | null>(null);

  // Get selected entity name
  const selectedEntity = entities.find(e => e.id === selectedEntityId);
  const selectedEntityName = selectedEntity?.name || '...';

  // Build expanded type options (symmetric + both directions for asymmetric)
  const typeOptions: TypeOption[] = [];
  for (const type of relationshipTypes) {
    if (type.reverseName === null) {
      // Symmetric: one option
      typeOptions.push({
        id: type.id,
        typeId: type.id,
        name: type.name,
        isReverse: false,
        otherPersonGets: type.name,
      });
    } else {
      // Asymmetric: two options
      typeOptions.push({
        id: `${type.id}-direct`,
        typeId: type.id,
        name: type.name,
        isReverse: false,
        otherPersonGets: type.reverseName,
      });
      typeOptions.push({
        id: `${type.id}-reverse`,
        typeId: type.id,
        name: type.reverseName,
        isReverse: true,
        otherPersonGets: type.name,
      });
    }
  }

  // Update default option when types load
  useEffect(() => {
    if (!selectedOption && typeOptions.length > 0) {
      setSelectedOption(typeOptions[0]);
    }
  }, [typeOptions.length, selectedOption]);

  // Get target entity type restrictions for selected relationship type
  const getTargetRestrictions = (): string[] | null => {
    if (!selectedOption) return null;
    const type = relationshipTypes.find(t => t.id === selectedOption.typeId);
    if (!type?.targetEntityTypes || type.targetEntityTypes.length === 0) return null;
    return type.targetEntityTypes as string[];
  };

  const targetRestrictions = getTargetRestrictions();

  const filteredEntities = entities.filter((e) => {
    // Exclude already added
    if (excludeIds.includes(e.id)) return false;
    // Filter by search
    if (!e.name.toLowerCase().includes(search.toLowerCase())) return false;
    // Filter by target entity type if restrictions exist
    if (targetRestrictions && !targetRestrictions.includes(e.type)) return false;
    return true;
  });

  if (entities.length === 0) {
    return (
      <p className="text-sm text-fg-muted text-center py-4">
        Нет других персонажей в проекте
      </p>
    );
  }

  const availableCount = entities.length - excludeIds.length;

  if (availableCount === 0) {
    return (
      <p className="text-sm text-fg-muted text-center py-4">
        Все персонажи уже добавлены
      </p>
    );
  }

  const handleAdd = () => {
    if (selectedEntityId && selectedOption) {
      onSelect(selectedEntityId, selectedOption.typeId, selectedOption.name, selectedOption.isReverse);
      setSelectedEntityId(null);
    }
  };

  // Generate human-readable description
  const getRelationshipDescription = (option: TypeOption): string => {
    // For symmetric: "Друзья с Тимми"
    // For asymmetric direct: "Наставник для Тимми"
    // For asymmetric reverse: "Ученик у Тимми"
    if (option.name === option.otherPersonGets) {
      return option.name; // Symmetric - just show type name
    }
    return option.name;
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск персонажа..."
        className="text-sm"
      />
      
      {/* Entity list */}
      <div className="max-h-36 overflow-y-auto space-y-1 border border-border rounded-lg p-1">
        {filteredEntities.map((entity) => (
          <button
            key={entity.id}
            onClick={() => setSelectedEntityId(entity.id)}
            className={`w-full flex items-center gap-3 p-2 rounded transition-colors text-left ${
              selectedEntityId === entity.id
                ? 'bg-accent-primary/20 border border-accent-primary'
                : 'hover:bg-overlay'
            }`}
          >
            <Avatar alt={entity.name} fallback={entity.name} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-fg truncate">{entity.name}</div>
            </div>
          </button>
        ))}
        
        {filteredEntities.length === 0 && search && (
          <p className="text-sm text-fg-muted text-center py-4">
            Ничего не найдено
          </p>
        )}
      </div>

      {/* Type selection */}
      {selectedEntityId && (
        <div className="space-y-3">
          <label className="text-xs text-fg-muted block">Выберите тип связи:</label>
          <div className="flex flex-wrap gap-1">
            {typeOptions.map((option) => {
              const isSelected = selectedOption?.id === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    isSelected
                      ? 'bg-accent-primary text-white'
                      : 'bg-overlay text-fg-secondary hover:bg-surface-hover'
                  }`}
                >
                  {getRelationshipDescription(option)}
                </button>
              );
            })}
          </div>

          {/* Preview with names */}
          {selectedOption && (
            <div className="p-3 bg-overlay rounded-lg text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-fg-muted">У</span>
                <span className="font-medium text-fg">{currentEntityName}</span>
                <span className="text-fg-muted">появится:</span>
                <span className="px-1.5 py-0.5 bg-accent-primary/20 text-accent-primary rounded text-xs">
                  {selectedOption.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-fg-muted">У</span>
                <span className="font-medium text-fg">{selectedEntityName}</span>
                <span className="text-fg-muted">появится:</span>
                <span className="px-1.5 py-0.5 bg-accent-primary/20 text-accent-primary rounded text-xs">
                  {selectedOption.otherPersonGets}
                </span>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleAdd} 
            size="sm" 
            className="w-full"
            disabled={!selectedOption}
          >
            <Plus className="w-4 h-4 mr-1" />
            Добавить связь
          </Button>
        </div>
      )}
    </div>
  );
}
