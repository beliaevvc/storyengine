import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SemanticBlockView } from './SemanticBlockView';

// ============================================================================
// Types
// ============================================================================

export type SemanticBlockType = 'empty' | 'unmarked' | 'dialogue' | 'description' | 'action' | 'thought';

export interface SemanticBlockAttributes {
  blockType: SemanticBlockType;
  speakers?: Array<{ id: string; name: string }>;  // Multiple speakers for dialogue/thought
  isNew?: boolean;  // Flag for newly AI-created blocks (for highlighting)
}

// ============================================================================
// Module Augmentation
// ============================================================================

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    semanticBlock: {
      /**
       * Insert a semantic block
       */
      insertSemanticBlock: (attrs: SemanticBlockAttributes) => ReturnType;
      /**
       * Update semantic block attributes
       */
      updateSemanticBlockAttrs: (attrs: Partial<SemanticBlockAttributes>) => ReturnType;
      /**
       * Convert current block to semantic block
       */
      setSemanticBlock: (attrs: SemanticBlockAttributes) => ReturnType;
      /**
       * Remove semantic block wrapper, keeping content
       */
      unsetSemanticBlock: () => ReturnType;
    };
  }
}

// ============================================================================
// Extension
// ============================================================================

export const SemanticBlock = Node.create({
  name: 'semanticBlock',

  // Semantic blocks belong to 'block' group so they can be used inside scenes
  group: 'block',

  // Content: paragraphs, headings, lists, quotes — but NO nested semanticBlocks
  content: '(paragraph | heading | bulletList | orderedList | blockquote)+',

  // Makes this block isolating (cursor doesn't escape easily)
  isolating: true,

  // Defines the block
  defining: true,

  // Enable drag & drop
  draggable: true,

  addAttributes() {
    return {
      blockType: {
        default: 'empty' as SemanticBlockType,
        parseHTML: (element) => element.getAttribute('data-block-type') as SemanticBlockType,
        renderHTML: (attributes) => ({
          'data-block-type': attributes.blockType,
        }),
      },
      speakers: {
        default: [],
        parseHTML: (element) => {
          const data = element.getAttribute('data-speakers');
          try {
            return data ? JSON.parse(data) : [];
          } catch {
            return [];
          }
        },
        renderHTML: (attributes) => ({
          'data-speakers': JSON.stringify(attributes.speakers || []),
        }),
      },
      isNew: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-is-new') === 'true',
        renderHTML: (attributes) => ({
          'data-is-new': attributes.isNew ? 'true' : 'false',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="semantic-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'semantic-block' }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SemanticBlockView);
  },

  addCommands() {
    return {
      insertSemanticBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
            content: [{ type: 'paragraph' }],
          });
        },

      updateSemanticBlockAttrs:
        (attrs) =>
        ({ state, tr }) => {
          const { selection } = state;
          const { $from } = selection;

          // Find parent semantic block
          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'semanticBlock') {
              const pos = $from.before(depth);
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                ...attrs,
              });
              return true;
            }
          }
          return false;
        },

      setSemanticBlock:
        (attrs) =>
        ({ state, tr, dispatch }) => {
          const { selection } = state;
          const { $from } = selection;
          
          // Find parent semantic block and update its attributes
          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'semanticBlock') {
              const pos = $from.before(depth);
              if (dispatch) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs });
              }
              return true;
            }
          }
          return false;
        },

      unsetSemanticBlock:
        () =>
        ({ state, tr, dispatch }) => {
          const { selection } = state;
          const { $from } = selection;

          // Find parent semantic block
          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'semanticBlock') {
              const pos = $from.before(depth);
              const endPos = pos + node.nodeSize;
              
              // Extract content and replace the block with just the content
              if (dispatch) {
                const content = node.content;
                tr.replaceWith(pos, endPos, content);
              }
              return true;
            }
          }
          return false;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      // Cmd+Shift+D for dialogue
      'Mod-Shift-d': () => 
        this.editor.commands.insertSemanticBlock({ blockType: 'dialogue' }),
      
      // Enter in Clean mode: create new unmarked block after blocks with text
      Enter: ({ editor }) => {
        const viewMode = (editor.storage as any).viewMode?.current;
        
        // Only apply in Clean mode
        if (viewMode !== 'clean') return false;
        
        const { selection } = editor.state;
        const { $from, empty: isEmptySelection } = selection;
        
        if (!isEmptySelection) return false;
        
        // Find parent semantic block
        for (let depth = $from.depth; depth >= 0; depth--) {
          const node = $from.node(depth);
          if (node.type.name === 'semanticBlock') {
            // Check if block has text content
            const hasText = node.textContent.trim().length > 0;
            
            // Check if cursor is at the end of the block
            const blockEnd = $from.end(depth);
            const isAtEnd = $from.pos === blockEnd;
            
            console.log('[SemanticBlock] Enter:', { 
              blockType: node.attrs.blockType, 
              hasText, 
              isAtEnd,
              textContent: node.textContent.substring(0, 50)
            });
            
            if (hasText && isAtEnd) {
              // Create new unmarked block after this one
              const afterBlockPos = $from.after(depth);
              console.log('[SemanticBlock] Creating unmarked block at:', afterBlockPos);
              
              editor
                .chain()
                .insertContentAt(afterBlockPos, {
                  type: 'semanticBlock',
                  attrs: { blockType: 'unmarked' },
                  content: [{ type: 'paragraph' }],
                })
                .setTextSelection(afterBlockPos + 2)
                .focus()
                .run();
              
              return true;
            }
            break;
          }
        }
        return false;
      },
      
      // Backspace at start of empty semantic block removes it
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from, empty } = selection;
        
        if (!empty) return false;
        
        // Check if we're at the start of a semantic block
        for (let depth = $from.depth; depth >= 0; depth--) {
          const node = $from.node(depth);
          if (node.type.name === 'semanticBlock') {
            const pos = $from.before(depth);
            // If we're at position right after the block start
            if ($from.pos === pos + 1 && node.textContent === '') {
              return editor.commands.unsetSemanticBlock();
            }
            break;
          }
        }
        return false;
      },
    };
  },
});

export default SemanticBlock;
