'use client';

// Main editor components
export { StoryEditor } from './Editor';
export { EntityEditor } from './EntityEditor';

// Sub-components
export { Toolbar } from './Toolbar';
export { ToolbarButton } from './ToolbarButton';
export { Breadcrumbs } from './Breadcrumbs';
export { StatusBar } from './StatusBar';

// Extensions
export { EntityMark, EntityMarkComponent, type EntityMarkAttributes } from './extensions';

// Utilities
export { applyEntityMarks, clearEntityMarks } from './utils';

// Templates
export {
  ENTITY_TEMPLATES,
  getEntityTemplate,
  EMPTY_DOCUMENT,
  isContentEmpty,
} from './templates';
