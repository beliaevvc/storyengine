import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { SceneView } from './SceneView';
import { v4 as uuidv4 } from 'uuid';

export type SceneStatus = 'draft' | 'review' | 'final';

export interface SceneAttributes {
  id: string;
  slug: string;
  location: string;        // Название локации (для отображения/обратной совместимости)
  locationId: string | null; // ID локации из базы данных
  status: SceneStatus;
  collapsed: boolean;
  // Персонажи в сцене
  characters: string[];
  // Метаданные сцены
  goal: string;      // Цель сцены
  event: string;     // Ключевое событие
  change: string;    // Изменение (что меняется в результате)
  metaExpanded: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    scene: {
      /**
       * Insert a new scene
       */
      insertScene: (attrs?: Partial<SceneAttributes>) => ReturnType;
      /**
       * Split scene at current cursor position
       */
      splitScene: () => ReturnType;
      /**
       * Update scene attributes
       */
      updateSceneAttrs: (id: string, attrs: Partial<SceneAttributes>) => ReturnType;
      /**
       * Toggle scene collapsed state
       */
      toggleSceneCollapse: (id: string) => ReturnType;
      /**
       * Delete scene by id
       */
      deleteScene: (id: string) => ReturnType;
      /**
       * Add character to scene
       */
      addCharacterToScene: (sceneId: string, characterId: string) => ReturnType;
      /**
       * Remove character from scene
       */
      removeCharacterFromScene: (sceneId: string, characterId: string) => ReturnType;
    };
  }
}

export const SceneExtension = Node.create({
  name: 'scene',

  group: 'block',

  content: 'block+',

  draggable: true,

  isolating: true,

  defining: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-scene-id'),
        renderHTML: (attributes) => ({
          'data-scene-id': attributes.id,
        }),
      },
      slug: {
        default: 'Новая сцена',
        parseHTML: (element) => element.getAttribute('data-scene-slug'),
        renderHTML: (attributes) => ({
          'data-scene-slug': attributes.slug,
        }),
      },
      location: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-scene-location'),
        renderHTML: (attributes) => ({
          'data-scene-location': attributes.location,
        }),
      },
      locationId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-scene-location-id') || null,
        renderHTML: (attributes) => ({
          'data-scene-location-id': attributes.locationId || '',
        }),
      },
      status: {
        default: 'draft' as SceneStatus,
        parseHTML: (element) => element.getAttribute('data-scene-status') as SceneStatus,
        renderHTML: (attributes) => ({
          'data-scene-status': attributes.status,
        }),
      },
      collapsed: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-scene-collapsed') === 'true',
        renderHTML: (attributes) => ({
          'data-scene-collapsed': attributes.collapsed ? 'true' : 'false',
        }),
      },
      // Персонажи в сцене (массив ID)
      characters: {
        default: [],
        parseHTML: (element) => {
          const chars = element.getAttribute('data-scene-characters');
          return chars ? JSON.parse(chars) : [];
        },
        renderHTML: (attributes) => ({
          'data-scene-characters': JSON.stringify(attributes.characters || []),
        }),
      },
      // AI-поля
      goal: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-scene-goal') || '',
        renderHTML: (attributes) => ({
          'data-scene-goal': attributes.goal || '',
        }),
      },
      event: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-scene-event') || '',
        renderHTML: (attributes) => ({
          'data-scene-event': attributes.event || '',
        }),
      },
      change: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-scene-change') || '',
        renderHTML: (attributes) => ({
          'data-scene-change': attributes.change || '',
        }),
      },
      metaExpanded: {
        default: false,
        parseHTML: (element) => element.getAttribute('data-scene-meta-expanded') === 'true',
        renderHTML: (attributes) => ({
          'data-scene-meta-expanded': attributes.metaExpanded ? 'true' : 'false',
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="scene"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'scene' }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SceneView);
  },

  addCommands() {
    return {
      insertScene:
        (attrs = {}) =>
        ({ commands }) => {
          const id = attrs.id || uuidv4();
          return commands.insertContent({
            type: this.name,
            attrs: {
              id,
              slug: attrs.slug || 'Новая сцена',
              location: attrs.location || '',
              locationId: attrs.locationId || null,
              status: attrs.status || 'draft',
              collapsed: attrs.collapsed || false,
              characters: attrs.characters || [],
              goal: attrs.goal || '',
              event: attrs.event || '',
              change: attrs.change || '',
              metaExpanded: attrs.metaExpanded || false,
            },
            content: [
              {
                type: 'paragraph',
              },
            ],
          });
        },

      splitScene:
        () =>
        ({ editor, state, tr, commands }) => {
          const { selection } = state;
          const { $from } = selection;

          // Find the scene node
          let scenePos: number | null = null;
          let sceneNode = null;

          for (let depth = $from.depth; depth >= 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'scene') {
              scenePos = $from.before(depth);
              sceneNode = node;
              break;
            }
          }

          if (scenePos === null || !sceneNode) {
            return false;
          }

          // Get content before and after cursor within the scene
          const sceneStart = scenePos + 1; // +1 for the opening tag
          const cursorPos = $from.pos;
          const sceneEnd = scenePos + sceneNode.nodeSize - 1; // -1 for closing tag

          // Create two new scenes
          const beforeContent = state.doc.slice(sceneStart, cursorPos);
          const afterContent = state.doc.slice(cursorPos, sceneEnd);

          // Delete old scene and insert two new ones
          const newSceneId = uuidv4();
          
          return commands.insertContentAt(
            { from: scenePos, to: scenePos + sceneNode.nodeSize },
            [
              {
                type: 'scene',
                attrs: { ...sceneNode.attrs },
                content: beforeContent.content.toJSON() || [{ type: 'paragraph' }],
              },
              {
                type: 'scene',
                attrs: {
                  id: newSceneId,
                  slug: 'Продолжение',
                  location: sceneNode.attrs.location,
                  status: 'draft',
                  collapsed: false,
                },
                content: afterContent.content.toJSON() || [{ type: 'paragraph' }],
              },
            ]
          );
        },

      updateSceneAttrs:
        (id, attrs) =>
        ({ editor, tr, state }) => {
          let updated = false;
          state.doc.descendants((node, pos) => {
            if (node.type.name === 'scene' && node.attrs.id === id) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                ...attrs,
              });
              updated = true;
              return false;
            }
          });
          return updated;
        },

      toggleSceneCollapse:
        (id) =>
        ({ editor, commands }) => {
          let currentCollapsed = false;
          editor.state.doc.descendants((node) => {
            if (node.type.name === 'scene' && node.attrs.id === id) {
              currentCollapsed = node.attrs.collapsed;
              return false;
            }
          });
          return commands.updateSceneAttrs(id, { collapsed: !currentCollapsed });
        },

      deleteScene:
        (id) =>
        ({ state, tr, dispatch }) => {
          let found = false;
          state.doc.descendants((node, pos) => {
            if (node.type.name === 'scene' && node.attrs.id === id) {
              if (dispatch) {
                tr.delete(pos, pos + node.nodeSize);
              }
              found = true;
              return false;
            }
          });
          return found;
        },

      addCharacterToScene:
        (sceneId, characterId) =>
        ({ editor, commands }) => {
          let currentCharacters: string[] = [];
          editor.state.doc.descendants((node) => {
            if (node.type.name === 'scene' && node.attrs.id === sceneId) {
              currentCharacters = node.attrs.characters || [];
              return false;
            }
          });
          if (!currentCharacters.includes(characterId)) {
            return commands.updateSceneAttrs(sceneId, {
              characters: [...currentCharacters, characterId],
            });
          }
          return true;
        },

      removeCharacterFromScene:
        (sceneId, characterId) =>
        ({ editor, commands }) => {
          let currentCharacters: string[] = [];
          editor.state.doc.descendants((node) => {
            if (node.type.name === 'scene' && node.attrs.id === sceneId) {
              currentCharacters = node.attrs.characters || [];
              return false;
            }
          });
          return commands.updateSceneAttrs(sceneId, {
            characters: currentCharacters.filter((id) => id !== characterId),
          });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-Enter': () => this.editor.commands.splitScene(),
      'Mod-Shift-s': () => this.editor.commands.insertScene(),
    };
  },
});

export default SceneExtension;
