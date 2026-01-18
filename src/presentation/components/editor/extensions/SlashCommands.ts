import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types
// ============================================================================

export interface SlashCommandItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  aliases: string[];
  group: 'scene' | 'format' | 'entity';
  command: (props: { editor: Editor; range: { from: number; to: number } }) => void;
}

export interface SlashCommandsOptions {
  suggestion: Partial<typeof Suggestion>;
}

// ============================================================================
// Slash Command Items
// ============================================================================

export const SLASH_COMMANDS: SlashCommandItem[] = [
  // Scene commands
  {
    id: 'scene',
    title: 'Сцена',
    description: 'Создать новую сцену',
    icon: '🎬',
    aliases: ['scene', 'сцена', 'sc'],
    group: 'scene',
    command: ({ editor, range }) => {
      const id = uuidv4();
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'scene',
          attrs: {
            id,
            slug: 'Новая сцена',
            location: '',
            locationId: null,
            status: 'draft',
            collapsed: false,
            characters: [],
            goal: '',
            event: '',
            change: '',
            metaExpanded: false,
          },
          content: [{
            type: 'semanticBlock',
            attrs: { blockType: 'empty' },
            content: [{ type: 'paragraph' }],
          }],
        })
        .run();
    },
  },
  
  // Format commands (standard blocks)
  {
    id: 'heading1',
    title: 'Заголовок 1',
    description: 'Большой заголовок',
    icon: 'H1',
    aliases: ['h1', 'heading1', 'заголовок1'],
    group: 'format',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run();
    },
  },
  {
    id: 'heading2',
    title: 'Заголовок 2',
    description: 'Средний заголовок',
    icon: 'H2',
    aliases: ['h2', 'heading2', 'заголовок2'],
    group: 'format',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run();
    },
  },
  {
    id: 'heading3',
    title: 'Заголовок 3',
    description: 'Маленький заголовок',
    icon: 'H3',
    aliases: ['h3', 'heading3', 'заголовок3'],
    group: 'format',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run();
    },
  },
  {
    id: 'bulletList',
    title: 'Список',
    description: 'Маркированный список',
    icon: '•',
    aliases: ['bullet', 'list', 'список', 'ul'],
    group: 'format',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
    },
  },
  {
    id: 'orderedList',
    title: 'Нумерованный список',
    description: 'Нумерованный список',
    icon: '1.',
    aliases: ['numbered', 'ordered', 'нумерованный', 'ol'],
    group: 'format',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run();
    },
  },
  {
    id: 'quote',
    title: 'Цитата',
    description: 'Блок цитаты',
    icon: '❝',
    aliases: ['quote', 'цитата', 'blockquote'],
    group: 'format',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBlockquote()
        .run();
    },
  },
  
  // Entity commands (insert @ to trigger mention)
  {
    id: 'character',
    title: 'Персонаж',
    description: 'Упомянуть персонажа (@)',
    icon: '👤',
    aliases: ['character', 'персонаж', 'герой', 'char', '@'],
    group: 'entity',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent('@')
        .run();
    },
  },
  {
    id: 'location',
    title: 'Локация',
    description: 'Упомянуть локацию (@)',
    icon: '📍',
    aliases: ['location', 'локация', 'место', 'loc'],
    group: 'entity',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent('@')
        .run();
    },
  },
  {
    id: 'item',
    title: 'Предмет',
    description: 'Упомянуть предмет (@)',
    icon: '🎁',
    aliases: ['item', 'предмет', 'вещь', 'объект'],
    group: 'entity',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent('@')
        .run();
    },
  },
  {
    id: 'event',
    title: 'Событие',
    description: 'Упомянуть событие (@)',
    icon: '📅',
    aliases: ['event', 'событие', 'ивент'],
    group: 'entity',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent('@')
        .run();
    },
  },
];

// ============================================================================
// Plugin Key
// ============================================================================

export const slashCommandsPluginKey = new PluginKey('slashCommands');

// ============================================================================
// Extension
// ============================================================================

export const SlashCommands = Extension.create<SlashCommandsOptions>({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        pluginKey: slashCommandsPluginKey,
        command: ({ editor, range, props }: { 
          editor: Editor; 
          range: { from: number; to: number }; 
          props: SlashCommandItem 
        }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          const searchQuery = query.toLowerCase();
          
          // Фильтруем команды по запросу
          return SLASH_COMMANDS.filter((item) => {
            // Проверяем title
            if (item.title.toLowerCase().includes(searchQuery)) return true;
            // Проверяем aliases
            if (item.aliases.some((alias) => alias.toLowerCase().includes(searchQuery))) return true;
            // Проверяем description
            if (item.description.toLowerCase().includes(searchQuery)) return true;
            return false;
          }).slice(0, 10);
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default SlashCommands;
