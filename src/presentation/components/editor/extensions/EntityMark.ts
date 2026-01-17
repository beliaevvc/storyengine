'use client';

import { Mark, mergeAttributes } from '@tiptap/core';
import { ReactMarkViewRenderer } from '@tiptap/react';
import { EntityMarkComponent } from './EntityMarkComponent';

// ============================================================================
// Types
// ============================================================================

export interface EntityMarkOptions {
  HTMLAttributes: Record<string, unknown>;
}

export interface EntityMarkAttributes {
  entityId: string;
  entityType: string;
  entityName: string;
}

// ============================================================================
// Module Augmentation for Commands
// ============================================================================

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    entityMark: {
      /**
       * Set entity mark with attributes
       */
      setEntityMark: (attributes: EntityMarkAttributes) => ReturnType;
      /**
       * Remove entity mark
       */
      unsetEntityMark: () => ReturnType;
    };
  }
}

// ============================================================================
// EntityMark Extension
// ============================================================================

export const EntityMark = Mark.create<EntityMarkOptions>({
  name: 'entityMark',
  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      entityId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-entity-id'),
        renderHTML: (attributes) => ({
          'data-entity-id': attributes.entityId as string,
        }),
      },
      entityType: {
        default: 'CHARACTER',
        parseHTML: (element) => element.getAttribute('data-entity-type'),
        renderHTML: (attributes) => ({
          'data-entity-type': attributes.entityType as string,
        }),
      },
      entityName: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-entity-name'),
        renderHTML: (attributes) => ({
          'data-entity-name': attributes.entityName as string,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-entity-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const entityType = (HTMLAttributes['data-entity-type'] as string)?.toLowerCase() || 'character';

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `entity-mark entity-${entityType}`,
      }),
      0,
    ];
  },

  addMarkView() {
    return ReactMarkViewRenderer(EntityMarkComponent);
  },

  addCommands() {
    return {
      setEntityMark:
        (attributes) =>
        ({ commands }) =>
          commands.setMark(this.name, attributes),
      unsetEntityMark:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
