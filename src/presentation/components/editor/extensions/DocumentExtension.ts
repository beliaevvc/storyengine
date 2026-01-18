import { Node } from '@tiptap/core';

/**
 * Custom Document Extension
 * 
 * Переопределяет стандартный doc из StarterKit.
 * Документ может содержать ТОЛЬКО сцены (scene nodes).
 * Это обеспечивает scene-centric архитектуру где весь контент
 * обязательно находится внутри сцен.
 */
export const DocumentExtension = Node.create({
  name: 'doc',
  
  // Это корневой node документа
  topNode: true,
  
  // КРИТИЧНО: Документ содержит только сцены
  // scene+ означает "одна или более сцен"
  // Для пустого документа используем scene* (ноль или более)
  content: 'scene*',
});

export default DocumentExtension;
