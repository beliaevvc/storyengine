-- Add DOCUMENT type to document_type enum
-- This allows storing documents with scenes inside them

ALTER TYPE document_type ADD VALUE 'DOCUMENT';
