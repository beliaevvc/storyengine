import type { EntityType } from '@/types/supabase';

/**
 * Relationship type definition stored in database
 */
export interface RelationshipType {
  id: string;
  projectId: string;
  name: string;
  reverseName: string | null; // null = symmetric relationship
  sourceEntityTypes: EntityType[] | null; // null = all types
  targetEntityTypes: EntityType[] | null; // null = all types
  color: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data for creating a new relationship type
 */
export interface CreateRelationshipTypeData {
  projectId: string;
  name: string;
  reverseName?: string | null;
  sourceEntityTypes?: EntityType[] | null;
  targetEntityTypes?: EntityType[] | null;
  color?: string | null;
  order?: number;
}

/**
 * Data for updating a relationship type
 */
export interface UpdateRelationshipTypeData {
  name?: string;
  reverseName?: string | null;
  sourceEntityTypes?: EntityType[] | null;
  targetEntityTypes?: EntityType[] | null;
  color?: string | null;
  order?: number;
}

/**
 * A relationship between two entities (stored in entity.attributes.relationships)
 */
export interface EntityRelationship {
  entityId: string;
  typeId: string;
  typeName: string; // Denormalized for display
  description?: string;
}

/**
 * Check if a relationship type is symmetric
 */
export function isSymmetricRelationship(type: RelationshipType): boolean {
  return type.reverseName === null;
}

/**
 * Get the reverse name for a relationship type
 * Returns the same name if symmetric
 */
export function getReverseTypeName(type: RelationshipType): string {
  return type.reverseName ?? type.name;
}

/**
 * Check if a relationship type can be used for given entity types
 */
export function canUseRelationshipType(
  type: RelationshipType,
  sourceType: EntityType,
  targetType: EntityType
): boolean {
  const sourceAllowed =
    type.sourceEntityTypes === null ||
    type.sourceEntityTypes.includes(sourceType);
  const targetAllowed =
    type.targetEntityTypes === null ||
    type.targetEntityTypes.includes(targetType);

  return sourceAllowed && targetAllowed;
}

/**
 * Default relationship types to seed for new projects
 */
export const DEFAULT_RELATIONSHIP_TYPES: Omit<CreateRelationshipTypeData, 'projectId'>[] = [
  { name: 'Друг', reverseName: null, order: 0 },
  { name: 'Враг', reverseName: null, order: 1 },
  { name: 'Союзник', reverseName: null, order: 2 },
  { name: 'Наставник', reverseName: 'Ученик', order: 3 },
  { name: 'Родитель', reverseName: 'Ребёнок', order: 4 },
  { name: 'Босс', reverseName: 'Подчинённый', order: 5 },
  { name: 'Любовь', reverseName: null, order: 6 },
  { name: 'Соперник', reverseName: null, order: 7 },
  { name: 'Знакомый', reverseName: null, order: 8 },
];
