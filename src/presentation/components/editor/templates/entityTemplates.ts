import type { EntityType, TiptapContent } from '@/core/entities/entity';

// ============================================================================
// Helper functions
// ============================================================================

function heading(level: number, text: string) {
  return {
    type: 'heading',
    attrs: { level },
    content: [{ type: 'text', text }],
  };
}

function paragraph(text = '') {
  if (text) {
    return {
      type: 'paragraph',
      content: [{ type: 'text', text }],
    };
  }
  return { type: 'paragraph' };
}

function bulletList(items: string[]) {
  return {
    type: 'bulletList',
    content: items.map((item) => ({
      type: 'listItem',
      content: [paragraph(item)],
    })),
  };
}

// ============================================================================
// Templates
// ============================================================================

const CHARACTER_TEMPLATE: TiptapContent = {
  type: 'doc',
  content: [
    heading(2, 'Биография'),
    paragraph('Напишите здесь историю персонажа...'),
    heading(2, 'Внешность'),
    paragraph('Опишите внешний вид персонажа...'),
    heading(2, 'Характер'),
    paragraph('Опишите черты характера, привычки, особенности поведения...'),
    heading(2, 'Мотивация'),
    paragraph('Что движет персонажем? Какие у него цели?'),
    heading(2, 'Отношения'),
    paragraph('Опишите ключевые отношения с другими персонажами...'),
    heading(2, 'Заметки'),
    paragraph('Дополнительные заметки и идеи...'),
  ],
};

const LOCATION_TEMPLATE: TiptapContent = {
  type: 'doc',
  content: [
    heading(2, 'Обзор'),
    paragraph('Краткое описание локации...'),
    heading(2, 'География'),
    paragraph('Географическое положение, ландшафт, климат...'),
    heading(2, 'История'),
    paragraph('История места, важные события, произошедшие здесь...'),
    heading(2, 'Атмосфера'),
    paragraph('Опишите атмосферу, настроение места...'),
    heading(2, 'Значимые объекты'),
    paragraph('Важные здания, достопримечательности, секретные места...'),
    heading(2, 'Заметки'),
    paragraph('Дополнительные заметки и идеи...'),
  ],
};

const ITEM_TEMPLATE: TiptapContent = {
  type: 'doc',
  content: [
    heading(2, 'Описание'),
    paragraph('Как выглядит предмет, его физические характеристики...'),
    heading(2, 'Происхождение'),
    paragraph('Откуда появился предмет, кто его создал...'),
    heading(2, 'История'),
    paragraph('История предмета, кто им владел...'),
    heading(2, 'Свойства'),
    paragraph('Особые свойства, возможности, ограничения...'),
    heading(2, 'Текущий владелец'),
    paragraph('Кто сейчас владеет предметом и где он находится...'),
    heading(2, 'Заметки'),
    paragraph('Дополнительные заметки и идеи...'),
  ],
};

const EVENT_TEMPLATE: TiptapContent = {
  type: 'doc',
  content: [
    heading(2, 'Краткое описание'),
    paragraph('Что произошло в двух словах...'),
    heading(2, 'Предпосылки'),
    paragraph('Что привело к этому событию...'),
    heading(2, 'Ход событий'),
    paragraph('Детальное описание того, как всё происходило...'),
    heading(2, 'Участники'),
    paragraph('Кто был вовлечён в события...'),
    heading(2, 'Последствия'),
    paragraph('К чему привело это событие...'),
    heading(2, 'Заметки'),
    paragraph('Дополнительные заметки и идеи...'),
  ],
};

const FACTION_TEMPLATE: TiptapContent = {
  type: 'doc',
  content: [
    heading(2, 'Обзор'),
    paragraph('Что это за организация, группа или фракция...'),
    heading(2, 'История'),
    paragraph('Когда и как была основана, ключевые моменты истории...'),
    heading(2, 'Цели и мотивация'),
    paragraph('Чего добивается фракция, её идеология...'),
    heading(2, 'Структура'),
    paragraph('Как организована, иерархия, роли...'),
    heading(2, 'Ключевые фигуры'),
    paragraph('Лидеры и важные члены организации...'),
    heading(2, 'Отношения'),
    paragraph('Союзники, враги, нейтральные стороны...'),
    heading(2, 'Заметки'),
    paragraph('Дополнительные заметки и идеи...'),
  ],
};

const WORLDBUILDING_TEMPLATE: TiptapContent = {
  type: 'doc',
  content: [
    heading(2, 'Концепция'),
    paragraph('Основная идея, что это за элемент мира...'),
    heading(2, 'Правила'),
    paragraph('Как это работает, какие есть законы и ограничения...'),
    heading(2, 'История'),
    paragraph('Как это появилось, эволюция во времени...'),
    heading(2, 'Влияние на мир'),
    paragraph('Как это влияет на общество, культуру, повседневную жизнь...'),
    heading(2, 'Примеры'),
    paragraph('Конкретные примеры проявления в истории...'),
    heading(2, 'Заметки'),
    paragraph('Дополнительные заметки и идеи...'),
  ],
};

const NOTE_TEMPLATE: TiptapContent = {
  type: 'doc',
  content: [
    heading(2, 'Заметка'),
    paragraph('Напишите вашу заметку здесь...'),
    heading(2, 'Связанные элементы'),
    paragraph('С чем связана эта заметка...'),
    heading(2, 'Идеи'),
    paragraph('Дополнительные идеи для развития...'),
  ],
};

// ============================================================================
// Export
// ============================================================================

export const ENTITY_TEMPLATES: Record<EntityType, TiptapContent> = {
  CHARACTER: CHARACTER_TEMPLATE,
  LOCATION: LOCATION_TEMPLATE,
  ITEM: ITEM_TEMPLATE,
  EVENT: EVENT_TEMPLATE,
  FACTION: FACTION_TEMPLATE,
  WORLDBUILDING: WORLDBUILDING_TEMPLATE,
  NOTE: NOTE_TEMPLATE,
};

/**
 * Get template for entity type
 */
export function getEntityTemplate(type: EntityType): TiptapContent {
  return ENTITY_TEMPLATES[type];
}

/**
 * Get empty document (for when entity has no content yet)
 */
export const EMPTY_DOCUMENT: TiptapContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

/**
 * Check if content is empty or just default template placeholder text
 */
export function isContentEmpty(content: TiptapContent | null | undefined): boolean {
  if (!content) return true;
  if (!content.content || content.content.length === 0) return true;
  
  // Check if it's just empty paragraphs
  const hasContent = content.content.some((node) => {
    if (node.type === 'paragraph' && node.content) {
      return node.content.some((child) => child.text && child.text.trim());
    }
    if (node.type === 'heading') return true;
    return false;
  });
  
  return !hasContent;
}
