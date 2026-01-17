// Base interface for all entity attributes
export interface BaseEntityAttributes {
  aliases?: string[];
  tags?: string[];
  notes?: string;
  [key: string]: unknown;
}

// Character-specific attributes
export interface CharacterAttributes extends BaseEntityAttributes {
  age?: number;
  gender?: string;
  occupation?: string;
  personality?: string[];
  appearance?: string;
  background?: string;
  motivation?: string;
  relationships?: Array<{
    entityId: string;
    type: string;
    description?: string;
  }>;
}

// Location-specific attributes
export interface LocationAttributes extends BaseEntityAttributes {
  locationType?: string; // city, building, room, outdoor, etc.
  climate?: string;
  geography?: string;
  population?: number;
  significance?: string;
}

// Item-specific attributes
export interface ItemAttributes extends BaseEntityAttributes {
  itemType?: string; // weapon, artifact, tool, etc.
  material?: string;
  origin?: string;
  powers?: string[];
  currentOwner?: string;
}

// Event-specific attributes
export interface EventAttributes extends BaseEntityAttributes {
  date?: string;
  duration?: string;
  participants?: string[];
  outcome?: string;
  significance?: string;
}

// Concept-specific attributes
export interface ConceptAttributes extends BaseEntityAttributes {
  category?: string; // magic system, religion, organization, etc.
  rules?: string[];
  relatedConcepts?: string[];
}

// Union type for all entity attributes
export type EntityAttributes =
  | CharacterAttributes
  | LocationAttributes
  | ItemAttributes
  | EventAttributes
  | ConceptAttributes
  | BaseEntityAttributes;
