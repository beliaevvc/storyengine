-- ============================================================================
-- Migration: 00007_relationship_types
-- Description: Create relationship_types table for configurable entity relationships
-- ============================================================================

-- Create relationship_types table
CREATE TABLE IF NOT EXISTS relationship_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  reverse_name VARCHAR(100),  -- NULL = symmetric relationship
  source_entity_types TEXT[], -- NULL = all entity types
  target_entity_types TEXT[], -- NULL = all entity types
  color VARCHAR(20),
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_relationship_types_project_id 
  ON relationship_types(project_id);
CREATE INDEX IF NOT EXISTS idx_relationship_types_order 
  ON relationship_types(project_id, "order");

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE relationship_types ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (project-level access control)
CREATE POLICY "relationship_types_select" ON relationship_types
  FOR SELECT USING (true);

CREATE POLICY "relationship_types_insert" ON relationship_types
  FOR INSERT WITH CHECK (true);

CREATE POLICY "relationship_types_update" ON relationship_types
  FOR UPDATE USING (true);

CREATE POLICY "relationship_types_delete" ON relationship_types
  FOR DELETE USING (true);

-- ============================================================================
-- Seed default relationship types function
-- ============================================================================

CREATE OR REPLACE FUNCTION seed_default_relationship_types(p_project_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO relationship_types (project_id, name, reverse_name, "order")
  VALUES
    (p_project_id, 'Друг', NULL, 0),
    (p_project_id, 'Враг', NULL, 1),
    (p_project_id, 'Союзник', NULL, 2),
    (p_project_id, 'Наставник', 'Ученик', 3),
    (p_project_id, 'Родитель', 'Ребёнок', 4),
    (p_project_id, 'Босс', 'Подчинённый', 5),
    (p_project_id, 'Любовь', NULL, 6),
    (p_project_id, 'Соперник', NULL, 7),
    (p_project_id, 'Знакомый', NULL, 8);
END;
$$ LANGUAGE plpgsql;
