'use client';

// Entity-related extensions
export { EntityMark, type EntityMarkOptions, type EntityMarkAttributes } from './EntityMark';
export { EntityMarkComponent } from './EntityMarkComponent';
export { EntityMention } from './EntityMention';
export { EntityMentionComponent } from './EntityMentionComponent';
export { createMentionSuggestion } from './mentionSuggestion';

// Comments
export { InlineComment } from './InlineComment';

// Document structure (scene-centric architecture)
export { DocumentExtension } from './DocumentExtension';
export { SceneExtension, type SceneAttributes, type SceneStatus } from './SceneExtension';
export { SceneView } from './SceneView';

// Semantic blocks
export { SemanticBlock, type SemanticBlockType, type SemanticBlockAttributes } from './SemanticBlock';
export { SemanticBlockView } from './SemanticBlockView';

// Slash commands
export { SlashCommands, SLASH_COMMANDS, type SlashCommandItem } from './SlashCommands';
export { createSlashCommandSuggestion } from './slashCommandSuggestion';
