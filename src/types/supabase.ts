export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Entity types enum
export type EntityType =
  | 'CHARACTER'
  | 'LOCATION'
  | 'ITEM'
  | 'EVENT'
  | 'FACTION'
  | 'WORLDBUILDING'
  | 'NOTE';

// Document types enum
// FOLDER - папка для организации
// DOCUMENT - документ с текстом и сценами внутри
// NOTE - заметка
export type DocumentType = 'FOLDER' | 'DOCUMENT' | 'NOTE';

// Relation types enum
export type RelationType =
  | 'FRIEND'
  | 'ENEMY'
  | 'FAMILY'
  | 'ALLY'
  | 'RIVAL'
  | 'MENTOR'
  | 'STUDENT'
  | 'LOVER'
  | 'COLLEAGUE'
  | 'CUSTOM';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      entities: {
        Row: {
          id: string;
          project_id: string;
          type: EntityType;
          name: string;
          description: string | null;
          attributes: Json | null;
          content: Json | null; // Tiptap JSON content for entity document
          embedding: string | null; // vector stored as string
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          type: EntityType;
          name: string;
          description?: string | null;
          attributes?: Json | null;
          content?: Json | null;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          type?: EntityType;
          name?: string;
          description?: string | null;
          attributes?: Json | null;
          content?: Json | null;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          project_id: string;
          parent_id: string | null;
          title: string;
          content: Json | null;
          type: DocumentType;
          order: number;
          embedding: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          parent_id?: string | null;
          title: string;
          content?: Json | null;
          type: DocumentType;
          order?: number;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          parent_id?: string | null;
          title?: string;
          content?: Json | null;
          type?: DocumentType;
          order?: number;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      timelines: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          project_id: string;
          timeline_id: string | null;
          name: string;
          description: string | null;
          position: number;
          linked_entity_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          timeline_id?: string | null;
          name: string;
          description?: string | null;
          position?: number;
          linked_entity_ids?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          timeline_id?: string | null;
          name?: string;
          description?: string | null;
          position?: number;
          linked_entity_ids?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      entity_relations: {
        Row: {
          id: string;
          source_id: string;
          target_id: string;
          relation_type: RelationType;
          label: string | null;
          attributes: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          target_id: string;
          relation_type: RelationType;
          label?: string | null;
          attributes?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source_id?: string;
          target_id?: string;
          relation_type?: RelationType;
          label?: string | null;
          attributes?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attribute_definitions: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          type: string;
          config: Json;
          entity_types: string[];
          color: string | null;
          icon: string | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          type: string;
          config?: Json;
          entity_types?: string[];
          color?: string | null;
          icon?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          type?: string;
          config?: Json;
          entity_types?: string[];
          color?: string | null;
          icon?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      relationship_types: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          directed: boolean;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          directed?: boolean;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          directed?: boolean;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_documents: {
        Args: {
          query_embedding: string;
          match_count: number;
          filter_project_id: string;
        };
        Returns: {
          id: string;
          content: Json;
          similarity: number;
        }[];
      };
      match_entities: {
        Args: {
          query_embedding: string;
          match_count: number;
          filter_project_id: string;
        };
        Returns: {
          id: string;
          name: string;
          type: EntityType;
          description: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      entity_type: EntityType;
      document_type: DocumentType;
      relation_type: RelationType;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience types
export type Profile = Tables<'profiles'>;
export type Project = Tables<'projects'>;
export type Entity = Tables<'entities'>;
export type Document = Tables<'documents'>;
export type Timeline = Tables<'timelines'>;
export type Event = Tables<'events'>;
export type EntityRelation = Tables<'entity_relations'>;
