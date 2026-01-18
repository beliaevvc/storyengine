import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { SlashCommandList, SlashCommandListRef } from '../SlashCommandList';
import { SLASH_COMMANDS, type SlashCommandItem } from './SlashCommands';
import { useEditorStore } from '@/presentation/stores/useEditorStore';

/**
 * Creates the suggestion configuration for slash commands.
 * This handles the UI rendering and interaction for the slash menu.
 */
export function createSlashCommandSuggestion(): Omit<SuggestionOptions<SlashCommandItem>, 'editor'> {
  return {
    char: '/',
    startOfLine: false,
    allowSpaces: false,
    allowedPrefixes: null, // Allow "/" after any character
    
    items: ({ query }): SlashCommandItem[] => {
      // Disable slash commands in clean mode
      const viewMode = useEditorStore.getState().viewMode;
      if (viewMode === 'clean') {
        return [];
      }

      const searchQuery = query.toLowerCase();
      
      if (!searchQuery) {
        return SLASH_COMMANDS;
      }
      
      return SLASH_COMMANDS.filter((item) => {
        // Check title
        if (item.title.toLowerCase().includes(searchQuery)) return true;
        // Check aliases
        if (item.aliases.some((alias) => alias.toLowerCase().includes(searchQuery))) return true;
        // Check description
        if (item.description.toLowerCase().includes(searchQuery)) return true;
        return false;
      }).slice(0, 10);
    },

    render: () => {
      let component: ReactRenderer<SlashCommandListRef> | null = null;
      let popup: TippyInstance[] | null = null;

      return {
        onStart: (props: SuggestionProps<SlashCommandItem>) => {
          // Don't show popup in clean mode
          const viewMode = useEditorStore.getState().viewMode;
          if (viewMode === 'clean') {
            return;
          }

          component = new ReactRenderer(SlashCommandList, {
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
            maxWidth: 320,
          });
        },

        onUpdate(props: SuggestionProps<SlashCommandItem>) {
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
