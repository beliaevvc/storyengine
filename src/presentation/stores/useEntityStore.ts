import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Entity, EntityType } from '@/core/entities/entity';

interface EntityState {
  entities: Entity[];
  isLoading: boolean;
  error: string | null;

  actions: {
    setEntities: (entities: Entity[]) => void;
    addEntity: (entity: Entity) => void;
    updateEntity: (id: string, data: Partial<Entity>) => void;
    removeEntity: (id: string) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}

const initialState = {
  entities: [] as Entity[],
  isLoading: false,
  error: null,
};

export const useEntityStore = create<EntityState>()(
  devtools(
    (set) => ({
      ...initialState,

      actions: {
        setEntities: (entities) =>
          set({ entities, error: null }, false, 'setEntities'),

        addEntity: (entity) =>
          set(
            (state) => ({ entities: [...state.entities, entity] }),
            false,
            'addEntity'
          ),

        updateEntity: (id, data) =>
          set(
            (state) => ({
              entities: state.entities.map((e) =>
                e.id === id ? { ...e, ...data, updatedAt: new Date() } : e
              ),
            }),
            false,
            'updateEntity'
          ),

        removeEntity: (id) =>
          set(
            (state) => ({
              entities: state.entities.filter((e) => e.id !== id),
            }),
            false,
            'removeEntity'
          ),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'setLoading'),

        setError: (error) =>
          set({ error, isLoading: false }, false, 'setError'),

        reset: () =>
          set(initialState, false, 'resetEntities'),
      },
    }),
    { name: 'EntityStore' }
  )
);

// Selectors
export const selectEntities = (state: EntityState) => state.entities;

export const selectEntitiesByType = (type: EntityType) => (state: EntityState) =>
  state.entities.filter((e) => e.type === type);

export const selectEntityById = (id: string) => (state: EntityState) =>
  state.entities.find((e) => e.id === id) ?? null;

export const selectEntityByName = (name: string) => (state: EntityState) =>
  state.entities.find((e) => e.name.toLowerCase() === name.toLowerCase()) ?? null;
