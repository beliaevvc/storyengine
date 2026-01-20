import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import Mention from '@tiptap/extension-mention';
import { PluginKey } from '@tiptap/pm/state';
import { EntityMentionComponent } from './EntityMentionComponent';
import type { SuggestionOptions } from '@tiptap/suggestion';

export interface EntityMentionAttributes {
  id: string;
  name: string;
  type: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    entityMention: {
      setEntityMention: (attributes: EntityMentionAttributes) => ReturnType;
    };
  }
}

export const EntityMention = Mention.extend({
  name: 'entityMention',

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'entity-mention',
      },
      renderLabel({ node }: { node: any }) {
        return `@${node.attrs.label ?? node.attrs.id}`;
      },
      renderText({ node }: { node: any }) {
        return `@${node.attrs.label ?? node.attrs.id}`;
      },
      renderHTML({ node }: { node: any }) {
        return ['span', { class: 'entity-mention' }, `@${node.attrs.label ?? node.attrs.id}`];
      },
      suggestion: {
        char: '@',
        pluginKey: new PluginKey('entityMention'),
        allowSpaces: true,
      } as Partial<SuggestionOptions>,
    } as any;
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => ({
          'data-id': attributes.id,
        }),
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => ({
          'data-label': attributes.label,
        }),
      },
      type: {
        default: 'CHARACTER',
        parseHTML: (element) => element.getAttribute('data-type'),
        renderHTML: (attributes) => ({
          'data-type': attributes.type,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-entity-mention]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-entity-mention': '' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EntityMentionComponent);
  },
});
