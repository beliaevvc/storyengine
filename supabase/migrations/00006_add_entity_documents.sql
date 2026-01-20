-- Add documents column to entities table for multi-tab content
-- This allows entities to have multiple document tabs (biography, psychology, notes, etc.)

ALTER TABLE entities
ADD COLUMN IF NOT EXISTS documents JSONB;

-- Add comment for documentation
COMMENT ON COLUMN entities.documents IS 'Multi-tab documents for entity profile (biography, psychology, notes, references, custom tabs)';
