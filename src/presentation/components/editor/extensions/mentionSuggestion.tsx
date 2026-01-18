import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import { MentionList, MentionListRef } from '../MentionList';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { useEntityStore } from '@/presentation/stores/useEntityStore';

/**
 * Creates mention suggestion config that dynamically fetches entities from store.
 * This ensures entities are always up-to-date when the suggestion is triggered.
 */
export function createMentionSuggestion(): Omit<SuggestionOptions, 'editor'> {
  return {
    char: '@',
    allowSpaces: true,

    items: ({ query }) => {
      // Get entities from store dynamically
      const entities = useEntityStore.getState().entities;
      const searchQuery = query.toLowerCase();
      return entities
        .filter((entity) =>
          entity.name.toLowerCase().includes(searchQuery) ||
          entity.description?.toLowerCase().includes(searchQuery)
        )
        .slice(0, 10);
    },

    render: () => {
      let component: ReactRenderer<MentionListRef> | null = null;
      let popup: TippyInstance[] | null = null;

      return {
        onStart: (props: SuggestionProps) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props: SuggestionProps) {
          component?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          });
        },

        onKeyDown(props: { event: KeyboardEvent }) {
          if (props.event.key === 'Escape') {
            popup?.[0]?.hide();
            return true;
          }

          return component?.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },
  };
}
