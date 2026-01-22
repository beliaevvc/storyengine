import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Editor } from '@tiptap/core';

// ============================================================================
// Types
// ============================================================================

interface CursorPosition {
  from: number;
  to: number;
}

export type ViewMode = 'syntax' | 'clean';

interface EditorState {
  // Editor instance
  editor: Editor | null;

  // Content stats
  wordCount: number;
  characterCount: number;

  // Document context
  currentDocumentId: string | null;
  isDirty: boolean;

  // Active entities (detected in current text)
  activeEntityIds: string[];

  // Cursor position
  cursorPosition: CursorPosition | null;

  // View mode: syntax (with markup) or clean (plain text)
  viewMode: ViewMode;

  // Actions
  actions: {
    setEditor: (editor: Editor | null) => void;
    updateCounts: (words: number, characters: number) => void;
    setCurrentDocument: (documentId: string | null) => void;
    setDirty: (dirty: boolean) => void;
    setActiveEntityIds: (ids: string[]) => void;
    addActiveEntityId: (id: string) => void;
    clearActiveEntityIds: () => void;
    setCursorPosition: (position: CursorPosition | null) => void;
    setViewMode: (mode: ViewMode) => void;
    reset: () => void;
  };
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  editor: null,
  wordCount: 0,
  characterCount: 0,
  currentDocumentId: null,
  isDirty: false,
  activeEntityIds: [] as string[],
  cursorPosition: null as CursorPosition | null,
  viewMode: 'syntax' as ViewMode,
};

// ============================================================================
// Store
// ============================================================================

export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        actions: {
          setEditor: (editor) => set({ editor }, false, 'setEditor'),

          updateCounts: (wordCount, characterCount) =>
            set({ wordCount, characterCount }, false, 'updateCounts'),

          setCurrentDocument: (currentDocumentId) =>
            set({ currentDocumentId, isDirty: false }, false, 'setCurrentDocument'),

          setDirty: (isDirty) => set({ isDirty }, false, 'setDirty'),

          setActiveEntityIds: (activeEntityIds) =>
            set({ activeEntityIds }, false, 'setActiveEntityIds'),

          addActiveEntityId: (id) =>
            set(
              (state) => ({
                activeEntityIds: state.activeEntityIds.includes(id)
                  ? state.activeEntityIds
                  : [...state.activeEntityIds, id],
              }),
              false,
              'addActiveEntityId'
            ),

          clearActiveEntityIds: () =>
            set({ activeEntityIds: [] }, false, 'clearActiveEntityIds'),

          setCursorPosition: (cursorPosition) =>
            set({ cursorPosition }, false, 'setCursorPosition'),

          setViewMode: (viewMode) =>
            set({ viewMode }, false, 'setViewMode'),

          reset: () => set(initialState, false, 'reset'),
        },
      }),
      {
        name: 'storyengine-editor',
        // Сохраняем только viewMode — editor instance и другие временные данные не сериализуемы
        partialize: (state) => ({
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: 'EditorStore' }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectEditor = (state: EditorState) => state.editor;
export const selectWordCount = (state: EditorState) => state.wordCount;
export const selectCharacterCount = (state: EditorState) => state.characterCount;
export const selectEditorDocumentId = (state: EditorState) => state.currentDocumentId;
export const selectIsDirty = (state: EditorState) => state.isDirty;
export const selectActiveEntityIds = (state: EditorState) => state.activeEntityIds;
export const selectCursorPosition = (state: EditorState) => state.cursorPosition;
export const selectViewMode = (state: EditorState) => state.viewMode;