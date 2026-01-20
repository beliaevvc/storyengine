/**
 * TipTap type extensions for StoryEngine
 * 
 * This file extends TipTap's built-in types to support custom storage properties
 * used across the editor extensions.
 */

import '@tiptap/core';

/**
 * View mode storage type for switching between syntax and clean views.
 */
export interface ViewModeStorage {
  /** Current view mode: 'syntax' shows all semantic blocks, 'clean' shows minimal UI */
  current: 'syntax' | 'clean';
}

declare module '@tiptap/core' {
  /**
   * Extended Storage interface to include custom storage properties.
   * 
   * Usage:
   * - editor.storage.viewMode?.current - current view mode (markup/clean)
   */
  interface Storage {
    /**
     * View mode storage for switching between markup and clean views.
     * Set by the viewModeStorage extension in Editor.tsx.
     */
    viewMode?: ViewModeStorage;
  }
}
