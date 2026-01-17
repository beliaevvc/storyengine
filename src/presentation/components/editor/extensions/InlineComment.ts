import { Mark, mergeAttributes } from '@tiptap/core';

export interface InlineCommentAttributes {
  commentId: string;
  authorId?: string;
  text?: string;
  createdAt?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineComment: {
      setInlineComment: (attributes: InlineCommentAttributes) => ReturnType;
      unsetInlineComment: () => ReturnType;
    };
  }
}

export const InlineComment = Mark.create({
  name: 'inlineComment',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'inline-comment',
      },
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-comment-id'),
        renderHTML: (attributes) => ({
          'data-comment-id': attributes.commentId,
        }),
      },
      authorId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-author-id'),
        renderHTML: (attributes) => {
          if (!attributes.authorId) return {};
          return { 'data-author-id': attributes.authorId };
        },
      },
      text: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-comment-text'),
        renderHTML: (attributes) => {
          if (!attributes.text) return {};
          return { 'data-comment-text': attributes.text };
        },
      },
      createdAt: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-created-at'),
        renderHTML: (attributes) => {
          if (!attributes.createdAt) return {};
          return { 'data-created-at': attributes.createdAt };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-inline-comment]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-inline-comment': '' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setInlineComment:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetInlineComment:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
