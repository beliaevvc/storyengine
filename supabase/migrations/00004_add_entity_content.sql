-- Add content column to entities table for Tiptap document content
-- This allows entities (characters, locations, etc.) to have rich text content
-- structured by templates

ALTER TABLE entities
ADD COLUMN content JSONB;

-- Add comment for documentation
COMMENT ON COLUMN entities.content IS 'Tiptap JSON content for entity document (structured by entity type templates)';
