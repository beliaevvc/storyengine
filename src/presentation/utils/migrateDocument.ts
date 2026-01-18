import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Types
// ============================================================================

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
}

interface TiptapDocument {
  type: 'doc';
  content?: TiptapNode[];
}

// ============================================================================
// Migration Logic
// ============================================================================

/**
 * Проверяет, является ли node сценой
 */
function isSceneNode(node: TiptapNode): boolean {
  return node.type === 'scene';
}

/**
 * Создаёт semantic block с контентом
 */
function createSemanticBlock(content: TiptapNode[], blockType = 'empty'): TiptapNode {
  return {
    type: 'semanticBlock',
    attrs: { blockType },
    content: content.length > 0 ? content : [{ type: 'paragraph' }],
  };
}

/**
 * Создаёт новую сцену с заданным контентом (обёрнутым в semantic block)
 */
function createSceneNode(content: TiptapNode[], slug = 'Без названия'): TiptapNode {
  // Если контент - это semantic blocks, используем как есть
  // Иначе оборачиваем в empty semantic block
  const sceneContent = content.length > 0 && content[0].type === 'semanticBlock'
    ? content
    : [createSemanticBlock(content.length > 0 ? content : [{ type: 'paragraph' }])];
  
  return {
    type: 'scene',
    attrs: {
      id: uuidv4(),
      slug,
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
    content: sceneContent,
  };
}

/**
 * Создаёт пустой документ с одной сценой
 */
function createEmptyDocument(): TiptapDocument {
  return {
    type: 'doc',
    content: [createSceneNode([], 'Новая сцена')],
  };
}

/**
 * Мигрирует документ старого формата в scene-centric формат.
 * 
 * Логика:
 * 1. Если документ пустой — создаём одну пустую сцену
 * 2. Если весь контент уже в сценах — возвращаем как есть
 * 3. Если есть контент вне сцен — оборачиваем в сцены
 * 
 * @param content - Tiptap JSON документ (может быть старого формата)
 * @returns Мигрированный документ в scene-centric формате
 */
export function migrateDocument(content: unknown): TiptapDocument {
  // Если контент пустой или невалидный
  if (!content || typeof content !== 'object') {
    console.log('[migrateDocument] Empty or invalid content, creating empty document');
    return createEmptyDocument();
  }

  const doc = content as TiptapDocument;

  // Проверяем что это doc
  if (doc.type !== 'doc') {
    console.log('[migrateDocument] Not a doc type, creating empty document');
    return createEmptyDocument();
  }

  // Если нет контента
  if (!doc.content || doc.content.length === 0) {
    console.log('[migrateDocument] Empty doc content, creating empty document');
    return createEmptyDocument();
  }

  // Проверяем, весь ли контент уже в сценах
  const allScenes = doc.content.every(isSceneNode);
  if (allScenes) {
    console.log('[migrateDocument] Document already scene-centric, no migration needed');
    console.log('[migrateDocument] Scenes content:', JSON.stringify(doc.content.map(s => s.content?.map(b => b.attrs)), null, 2));
    return doc;
  }

  // Нужна миграция: собираем контент в сцены
  console.log('[migrateDocument] Migrating document to scene-centric format');
  
  const newContent: TiptapNode[] = [];
  let orphanedContent: TiptapNode[] = [];

  for (const node of doc.content) {
    if (isSceneNode(node)) {
      // Если есть накопленный контент — создаём для него сцену
      if (orphanedContent.length > 0) {
        newContent.push(createSceneNode(orphanedContent, 'Импортированный контент'));
        orphanedContent = [];
      }
      // Добавляем существующую сцену
      newContent.push(node);
    } else {
      // Накапливаем контент вне сцен
      orphanedContent.push(node);
    }
  }

  // Если остался контент вне сцен в конце
  if (orphanedContent.length > 0) {
    newContent.push(createSceneNode(orphanedContent, 'Импортированный контент'));
  }

  // Если после миграции нет сцен (не должно произойти)
  if (newContent.length === 0) {
    return createEmptyDocument();
  }

  return {
    type: 'doc',
    content: newContent,
  };
}

/**
 * Проверяет, нужна ли миграция для документа
 */
export function needsMigration(content: unknown): boolean {
  if (!content || typeof content !== 'object') {
    return true;
  }

  const doc = content as TiptapDocument;

  if (doc.type !== 'doc' || !doc.content || doc.content.length === 0) {
    return true;
  }

  // Проверяем, весь ли контент уже в сценах
  return !doc.content.every(isSceneNode);
}

/**
 * Создаёт default контент для нового документа
 */
export function createDefaultDocumentContent(): TiptapDocument {
  return {
    type: 'doc',
    content: [
      {
        type: 'scene',
        attrs: {
          id: uuidv4(),
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
        content: [
          {
            type: 'semanticBlock',
            attrs: { blockType: 'empty' },
            content: [{ type: 'paragraph' }],
          },
        ],
      },
    ],
  };
}
