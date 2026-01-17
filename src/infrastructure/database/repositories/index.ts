import { prisma } from '../prisma/client';
import { PrismaProjectRepository } from './PrismaProjectRepository';
import { PrismaEntityRepository } from './PrismaEntityRepository';
import { PrismaDocumentRepository } from './PrismaDocumentRepository';
import { PrismaSceneRepository } from './PrismaSceneRepository';

// Singleton repository instances
export const repositories = {
  projectRepository: new PrismaProjectRepository(prisma),
  entityRepository: new PrismaEntityRepository(prisma),
  documentRepository: new PrismaDocumentRepository(prisma),
  sceneRepository: new PrismaSceneRepository(prisma),
};

// Export classes for testing/DI
export { PrismaProjectRepository };
export { PrismaEntityRepository };
export { PrismaDocumentRepository };
export { PrismaSceneRepository };
