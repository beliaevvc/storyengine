-- Migration: Entity Type Definitions
-- Добавляет настраиваемые типы сущностей

-- ============================================
-- 1. Создаём таблицу entity_type_definitions
-- ============================================

CREATE TABLE IF NOT EXISTS entity_type_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT entity_type_definitions_project_name_unique UNIQUE (project_id, name)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_entity_type_definitions_project_order 
  ON entity_type_definitions(project_id, "order");

-- ============================================
-- 2. Изменяем entities.type с enum на text
-- ============================================

-- Сначала убираем constraint enum (если есть)
ALTER TABLE entities 
  ALTER COLUMN type TYPE TEXT;

-- ============================================
-- 3. Seed дефолтных типов для существующих проектов
-- ============================================

INSERT INTO entity_type_definitions (project_id, name, label, icon, color, "order", is_default)
SELECT 
  p.id,
  unnest(ARRAY['CHARACTER', 'LOCATION', 'ITEM', 'EVENT', 'FACTION', 'WORLDBUILDING', 'NOTE']),
  unnest(ARRAY['Персонаж', 'Локация', 'Предмет', 'Событие', 'Фракция', 'Мир', 'Заметка']),
  unnest(ARRAY['User', 'MapPin', 'Package', 'Calendar', 'Users', 'Globe', 'StickyNote']),
  unnest(ARRAY['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#06b6d4', '#6b7280']),
  unnest(ARRAY[0, 1, 2, 3, 4, 5, 6]),
  true
FROM projects p
ON CONFLICT (project_id, name) DO NOTHING;

-- ============================================
-- 4. RLS Policies
-- ============================================

ALTER TABLE entity_type_definitions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations (for now, can be restricted later)
CREATE POLICY "Allow all for entity_type_definitions" ON entity_type_definitions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. Updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_entity_type_definitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entity_type_definitions_updated_at
  BEFORE UPDATE ON entity_type_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_entity_type_definitions_updated_at();
