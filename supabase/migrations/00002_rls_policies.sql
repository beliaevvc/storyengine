-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_relations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Entities policies (based on project ownership)
CREATE POLICY "Users can view entities in their projects"
  ON entities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = entities.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create entities in their projects"
  ON entities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = entities.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update entities in their projects"
  ON entities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = entities.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete entities in their projects"
  ON entities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = entities.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Documents policies
CREATE POLICY "Users can view documents in their projects"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents in their projects"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents in their projects"
  ON documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents in their projects"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Timelines policies
CREATE POLICY "Users can view timelines in their projects"
  ON timelines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = timelines.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create timelines in their projects"
  ON timelines FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = timelines.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update timelines in their projects"
  ON timelines FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = timelines.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete timelines in their projects"
  ON timelines FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = timelines.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Events policies
CREATE POLICY "Users can view events in their projects"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = events.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events in their projects"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = events.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update events in their projects"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = events.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete events in their projects"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = events.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Entity relations policies (based on source entity project ownership)
CREATE POLICY "Users can view relations for their entities"
  ON entity_relations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM entities
      JOIN projects ON projects.id = entities.project_id
      WHERE entities.id = entity_relations.source_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create relations for their entities"
  ON entity_relations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM entities
      JOIN projects ON projects.id = entities.project_id
      WHERE entities.id = entity_relations.source_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update relations for their entities"
  ON entity_relations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM entities
      JOIN projects ON projects.id = entities.project_id
      WHERE entities.id = entity_relations.source_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete relations for their entities"
  ON entity_relations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM entities
      JOIN projects ON projects.id = entities.project_id
      WHERE entities.id = entity_relations.source_id
      AND projects.user_id = auth.uid()
    )
  );
