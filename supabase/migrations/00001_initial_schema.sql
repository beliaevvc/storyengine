-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE entity_type AS ENUM (
  'CHARACTER',
  'LOCATION',
  'ITEM',
  'EVENT',
  'FACTION',
  'WORLDBUILDING',
  'NOTE'
);

CREATE TYPE document_type AS ENUM (
  'FOLDER',
  'CHAPTER',
  'SCENE',
  'NOTE'
);

CREATE TYPE relation_type AS ENUM (
  'FRIEND',
  'ENEMY',
  'FAMILY',
  'ALLY',
  'RIVAL',
  'MENTOR',
  'STUDENT',
  'LOVER',
  'COLLEAGUE',
  'CUSTOM'
);

-- Profiles table (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Entities table (polymorphic: characters, locations, items, etc.)
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type entity_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  attributes JSONB DEFAULT '{}',
  embedding vector(1536), -- OpenAI embeddings dimension
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Documents table (chapters, scenes, notes)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB, -- Tiptap JSON content
  type document_type NOT NULL,
  "order" INTEGER DEFAULT 0 NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Timelines table (for multi-timeline support)
CREATE TABLE timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6', -- Default blue
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Events table (timeline events)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  timeline_id UUID REFERENCES timelines(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  position INTEGER DEFAULT 0 NOT NULL, -- Position on timeline
  linked_entity_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Entity relations table (relationships between entities)
CREATE TABLE entity_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  relation_type relation_type NOT NULL,
  label TEXT, -- Custom label for the relationship
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(source_id, target_id, relation_type)
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_entities_project_id ON entities(project_id);
CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_parent_id ON documents(parent_id);
CREATE INDEX idx_events_project_id ON events(project_id);
CREATE INDEX idx_events_timeline_id ON events(timeline_id);
CREATE INDEX idx_entity_relations_source ON entity_relations(source_id);
CREATE INDEX idx_entity_relations_target ON entity_relations(target_id);

-- Create vector similarity search indexes
CREATE INDEX idx_entities_embedding ON entities 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_documents_embedding ON documents 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timelines_updated_at
  BEFORE UPDATE ON timelines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entity_relations_updated_at
  BEFORE UPDATE ON entity_relations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Vector similarity search function for documents
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  filter_project_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 
    documents.embedding IS NOT NULL
    AND (filter_project_id IS NULL OR documents.project_id = filter_project_id)
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Vector similarity search function for entities
CREATE OR REPLACE FUNCTION match_entities(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  filter_project_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  type entity_type,
  description text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    entities.id,
    entities.name,
    entities.type,
    entities.description,
    1 - (entities.embedding <=> query_embedding) AS similarity
  FROM entities
  WHERE 
    entities.embedding IS NOT NULL
    AND (filter_project_id IS NULL OR entities.project_id = filter_project_id)
  ORDER BY entities.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
