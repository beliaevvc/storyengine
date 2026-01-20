// Re-export all actions for convenient imports
// Note: ActionResult is exported from each file, use specific imports if needed

export {
  createProjectAction,
  getProjectAction,
  listProjectsAction,
  updateProjectAction,
  deleteProjectAction,
} from './project-actions';

export {
  createEntityAction,
  getEntityAction,
  listEntitiesByProjectAction,
  listEntitiesByTypeAction,
  searchEntitiesAction,
  updateEntityAction,
  deleteEntityAction,
} from './entity-actions';

export {
  createDocumentAction,
  getDocumentAction,
  listDocumentsByProjectAction,
  updateDocumentAction,
  deleteDocumentAction,
  reorderDocumentsAction,
} from './document-actions';

export {
  createSceneAction,
  getSceneAction,
  getSceneWithEntitiesAction,
  listScenesByDocumentAction,
  listScenesWithEntitiesByDocumentAction,
  updateSceneAction,
  deleteSceneAction,
  reorderScenesAction,
  addEntityToSceneAction,
  removeEntityFromSceneAction,
  getScenesByEntityAction,
} from './scene-actions';

export type { SceneWithDocument } from './scene-actions';

export {
  getAttributeDefinitionsAction,
  getAttributeDefinitionAction,
  createAttributeDefinitionAction,
  updateAttributeDefinitionAction,
  deleteAttributeDefinitionAction,
  reorderAttributeDefinitionsAction,
} from './attribute-actions';

// Export ActionResult type once
export type { ActionResult } from './project-actions';
