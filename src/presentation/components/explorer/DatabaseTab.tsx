'use client';

import { useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Loader2, X, User, MapPin, Package, Calendar, Users, Globe, FileText } from 'lucide-react';
import type { EntityType } from '@/core/entities/entity';
import { Button, Input } from '@/presentation/components/ui';
import { SearchInput } from './SearchInput';
import { EntityTypeFilter } from './EntityTypeFilter';
import { EntityList } from './EntityList';
import { useEntityStore, useUIStore, useWorkspaceStore } from '@/presentation/stores';
import { createEntity, updateEntity, deleteEntity } from '@/app/actions/supabase/entity-actions';
import type { Entity } from '@/core/entities';

// Entity type configurations with icons and default attributes
const ENTITY_CONFIGS: Record<EntityType, {
  icon: React.ElementType;
  label: string;
  color: string;
  defaultAttributes: Record<string, string>;
  attributeLabels: Record<string, string>;
}> = {
  CHARACTER: {
    icon: User,
    label: 'Персонаж',
    color: 'text-blue-400',
    defaultAttributes: { role: '', age: '', occupation: '' },
    attributeLabels: { role: 'Роль', age: 'Возраст', occupation: 'Профессия' },
  },
  LOCATION: {
    icon: MapPin,
    label: 'Локация',
    color: 'text-green-400',
    defaultAttributes: { region: '', climate: '', significance: '' },
    attributeLabels: { region: 'Регион', climate: 'Климат', significance: 'Значимость' },
  },
  ITEM: {
    icon: Package,
    label: 'Предмет',
    color: 'text-yellow-400',
    defaultAttributes: { rarity: '', origin: '', currentOwner: '' },
    attributeLabels: { rarity: 'Редкость', origin: 'Происхождение', currentOwner: 'Владелец' },
  },
  EVENT: {
    icon: Calendar,
    label: 'Событие',
    color: 'text-purple-400',
    defaultAttributes: { date: '', duration: '', participants: '' },
    attributeLabels: { date: 'Дата', duration: 'Длительность', participants: 'Участники' },
  },
  FACTION: {
    icon: Users,
    label: 'Фракция',
    color: 'text-red-400',
    defaultAttributes: { leader: '', goal: '', members: '' },
    attributeLabels: { leader: 'Лидер', goal: 'Цель', members: 'Участники' },
  },
  WORLDBUILDING: {
    icon: Globe,
    label: 'Мироустройство',
    color: 'text-cyan-400',
    defaultAttributes: { category: '', rules: '', impact: '' },
    attributeLabels: { category: 'Категория', rules: 'Правила', impact: 'Влияние' },
  },
  NOTE: {
    icon: FileText,
    label: 'Заметка',
    color: 'text-gray-400',
    defaultAttributes: { tags: '', priority: '' },
    attributeLabels: { tags: 'Теги', priority: 'Приоритет' },
  },
};

export function DatabaseTab() {
  const params = useParams();
  const projectId = params.projectId as string;

  const entities = useEntityStore((s) => s.entities);
  const addEntity = useEntityStore((s) => s.actions.addEntity);
  const updateEntityInStore = useEntityStore((s) => s.actions.updateEntity);
  const removeEntityFromStore = useEntityStore((s) => s.actions.removeEntity);
  const selectedEntityId = useUIStore((s) => s.selectedEntityId);
  const selectEntity = useUIStore((s) => s.actions.selectEntity);
  const closeTab = useWorkspaceStore((s) => s.actions.closeTab);
  const updateTabTitle = useWorkspaceStore((s) => s.actions.updateTabTitle);
  
  const [filterType, setFilterType] = useState<EntityType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedType, setSelectedType] = useState<EntityType>('CHARACTER');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const config = ENTITY_CONFIGS[selectedType];

  const handleTypeSelect = (type: EntityType) => {
    setSelectedType(type);
    setAttributes({ ...ENTITY_CONFIGS[type].defaultAttributes });
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    startTransition(async () => {
      const { data, error } = await createEntity({
        project_id: projectId,
        type: selectedType,
        name: name.trim(),
        description: description.trim() || null,
        attributes: Object.fromEntries(
          Object.entries(attributes).filter(([, v]) => v.trim())
        ),
      });

      if (data && !error) {
        const newEntity: Entity = {
          id: data.id,
          projectId: data.project_id,
          type: data.type,
          name: data.name,
          description: data.description || undefined,
          attributes: data.attributes || {},
          imageUrl: null,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
        addEntity(newEntity);
        
        // Reset form
        setName('');
        setDescription('');
        setAttributes({ ...config.defaultAttributes });
        setShowCreateForm(false);
      }
    });
  };

  const handleRename = (entityId: string, newName: string) => {
    startTransition(async () => {
      const { data, error } = await updateEntity(entityId, { name: newName });
      
      if (data && !error) {
        // Update in store
        updateEntityInStore(entityId, { name: newName });
        // Update tab title if open
        updateTabTitle(entityId, newName);
      }
    });
  };

  const handleDelete = (entityId: string) => {
    startTransition(async () => {
      const { success, error } = await deleteEntity(entityId, projectId);
      
      if (success && !error) {
        // Remove from store
        removeEntityFromStore(entityId);
        // Close tab if open
        closeTab(entityId);
        // Clear selection if deleted entity was selected
        if (selectedEntityId === entityId) {
          selectEntity(null);
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-border flex items-center gap-2">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск..."
          className="flex-1"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 flex-shrink-0"
          onClick={() => {
            setShowCreateForm(true);
            setAttributes({ ...ENTITY_CONFIGS[selectedType].defaultAttributes });
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-3 border-b border-border bg-surface-raised space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Новая сущность</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowCreateForm(false)}>
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Type selector */}
          <div className="flex flex-wrap gap-1">
            {(Object.keys(ENTITY_CONFIGS) as EntityType[]).map((type) => {
              const cfg = ENTITY_CONFIGS[type];
              const Icon = cfg.icon;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    selectedType === type
                      ? 'bg-accent/20 text-accent'
                      : 'bg-surface hover:bg-surface-hover text-fg-muted'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Name */}
          <div>
            <label className="text-xs text-fg-muted block mb-1">Название</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Имя ${config.label.toLowerCase()}...`}
              className="h-8 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-fg-muted block mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание..."
              className="w-full h-16 px-2 py-1 text-sm bg-input border border-border rounded resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Type-specific attributes */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(config.attributeLabels).map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-fg-muted block mb-1">{label}</label>
                <Input
                  value={attributes[key] || ''}
                  onChange={(e) => setAttributes({ ...attributes, [key]: e.target.value })}
                  placeholder={label}
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <Button 
            onClick={handleCreate} 
            disabled={!name.trim() || isPending}
            className="w-full h-8 text-sm"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Создать {config.label.toLowerCase()}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Filter */}
      <EntityTypeFilter selected={filterType} onSelect={setFilterType} />

      {/* List */}
      <div className="flex-1 overflow-auto">
        {entities.length === 0 && !showCreateForm ? (
          <div className="p-4 text-center text-fg-muted text-sm">
            <p>Нет сущностей</p>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowCreateForm(true)}
              className="mt-2"
            >
              Создать первую сущность
            </Button>
          </div>
        ) : (
          <EntityList
            entities={entities}
            selectedId={selectedEntityId}
            filterType={filterType}
            searchQuery={searchQuery}
            onSelect={selectEntity}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
