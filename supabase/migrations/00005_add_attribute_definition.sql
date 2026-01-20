-- Migration: Add AttributeDefinition table for project schema editor
-- Created: 2026-01-19

-- Create attribute_definitions table
CREATE TABLE IF NOT EXISTS public.attribute_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'number' | 'text' | 'boolean' | 'enum' | 'list'
    config JSONB DEFAULT '{}',
    entity_types TEXT[] DEFAULT '{}',
    color VARCHAR(50),
    icon VARCHAR(100),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_attribute_definitions_project_order 
ON public.attribute_definitions(project_id, "order");

-- Enable RLS
ALTER TABLE public.attribute_definitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now - same as other tables)
CREATE POLICY "Allow all operations on attribute_definitions" 
ON public.attribute_definitions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_attribute_definitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_attribute_definitions_updated_at
    BEFORE UPDATE ON public.attribute_definitions
    FOR EACH ROW
    EXECUTE FUNCTION update_attribute_definitions_updated_at();
