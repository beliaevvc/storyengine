import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Document, TiptapContent } from '@/core/entities/document';

interface DocumentState {
  documents: Document[];
  currentDocumentId: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;

  actions: {
    setDocuments: (documents: Document[]) => void;
    addDocument: (document: Document) => void;
    updateDocument: (id: string, data: Partial<Document>) => void;
    removeDocument: (id: string) => void;
    setCurrentDocument: (id: string | null) => void;
    updateContent: (content: TiptapContent) => void;
    setUnsavedChanges: (hasChanges: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
  };
}

const initialState = {
  documents: [] as Document[],
  currentDocumentId: null,
  hasUnsavedChanges: false,
  isLoading: false,
  error: null,
};

export const useDocumentStore = create<DocumentState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      actions: {
        setDocuments: (documents) =>
          set({ documents, error: null }, false, 'setDocuments'),

        addDocument: (document) =>
          set(
            (state) => ({ documents: [...state.documents, document] }),
            false,
            'addDocument'
          ),

        updateDocument: (id, data) =>
          set(
            (state) => ({
              documents: state.documents.map((d) =>
                d.id === id ? { ...d, ...data, updatedAt: new Date() } : d
              ),
            }),
            false,
            'updateDocument'
          ),

        removeDocument: (id) =>
          set(
            (state) => ({
              documents: state.documents.filter((d) => d.id !== id),
              currentDocumentId:
                state.currentDocumentId === id ? null : state.currentDocumentId,
            }),
            false,
            'removeDocument'
          ),

        setCurrentDocument: (id) =>
          set(
            { currentDocumentId: id, hasUnsavedChanges: false },
            false,
            'setCurrentDocument'
          ),

        updateContent: (content) => {
          const { currentDocumentId } = get();
          if (!currentDocumentId) return;

          set(
            (state) => ({
              documents: state.documents.map((d) =>
                d.id === currentDocumentId
                  ? { ...d, content, updatedAt: new Date() }
                  : d
              ),
              hasUnsavedChanges: true,
            }),
            false,
            'updateContent'
          );
        },

        setUnsavedChanges: (hasChanges) =>
          set({ hasUnsavedChanges: hasChanges }, false, 'setUnsavedChanges'),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'setLoading'),

        setError: (error) =>
          set({ error, isLoading: false }, false, 'setError'),

        reset: () =>
          set(initialState, false, 'resetDocuments'),
      },
    }),
    { name: 'DocumentStore' }
  )
);

// Selectors
export const selectDocuments = (state: DocumentState) => state.documents;

export const selectSortedDocuments = (state: DocumentState) =>
  [...state.documents].sort((a, b) => a.order - b.order);

export const selectCurrentDocument = (state: DocumentState) =>
  state.documents.find((d) => d.id === state.currentDocumentId) ?? null;

export const selectCurrentDocumentId = (state: DocumentState) =>
  state.currentDocumentId;

export const selectHasUnsavedChanges = (state: DocumentState) =>
  state.hasUnsavedChanges;
