import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SemanticBlockView } from './SemanticBlockView';

// ============================================================================
// Types
// ============================================================================

export type SemanticBlockType = 'empty' | 'dialogue' | 'description' | 'action' | 'thought';

export interface SemanticBlockAttributes {
  blockType: SemanticBlockType;
  speakers?: Array<{ id: string; name: string }>;  // Multiple speakers for dialogue/thought
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

  // Content can be paragraphs or other inline content
  content: 'block+',

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
        ({ commands, state }) => {
          const { selection } = state;
          const { $from, $to } = selection;
          
          // Get the content that will be wrapped
          const content = state.doc.slice($from.pos, $to.pos);
          
          return commands.insertContent({
            type: this.name,
            attrs,
            content: content.content.toJSON() || [{ type: 'paragraph' }],
          });
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
