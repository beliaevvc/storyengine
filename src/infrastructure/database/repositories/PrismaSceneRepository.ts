import type { PrismaClient, Scene as PrismaScene, SceneEntity as PrismaSceneEntity, Prisma } from '@/generated/prisma/client';
import type { ISceneRepository } from '@/core/repositories';
import type { Scene, SceneWithEntities, CreateSceneInput, UpdateSceneInput, SceneMetadata, SceneEntityLink } from '@/core/entities/scene';

export class PrismaSceneRepository implements ISceneRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Scene | null> {
    const scene = await this.prisma.scene.findUnique({
      where: { id },
    });
    return scene ? this.mapToEntity(scene) : null;
  }

  async findByIdWithEntities(id: string): Promise<SceneWithEntities | null> {
    const scene = await this.prisma.scene.findUnique({
      where: { id },
      include: {
        entities: true,
      },
    });
    return scene ? this.mapToEntityWithEntities(scene) : null;
  }

  async findByDocument(documentId: string): Promise<Scene[]> {
    const scenes = await this.prisma.scene.findMany({
      where: { documentId },
      orderBy: { order: 'asc' },
    });
    return scenes.map((s) => this.mapToEntity(s));
  }

  async findByDocumentWithEntities(documentId: string): Promise<SceneWithEntities[]> {
    const scenes = await this.prisma.scene.findMany({
      where: { documentId },
      include: {
        entities: true,
      },
      orderBy: { order: 'asc' },
    });
    return scenes.map((s) => this.mapToEntityWithEntities(s));
  }

  async create(data: CreateSceneInput): Promise<Scene> {
    // Get max order for the document
    const maxOrder = await this.prisma.scene.aggregate({
      where: { documentId: data.documentId },
      _max: { order: true },
    });

    const scene = await this.prisma.scene.create({
      data: {
        documentId: data.documentId,
        title: data.title,
        summary: data.summary,
        order: data.order ?? (maxOrder._max.order ?? -1) + 1,
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
    return this.mapToEntity(scene);
  }

  async update(id: string, data: UpdateSceneInput): Promise<Scene> {
    const scene = await this.prisma.scene.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.summary !== undefined && { summary: data.summary }),
        ...(data.startOffset !== undefined && { startOffset: data.startOffset }),
        ...(data.endOffset !== undefined && { endOffset: data.endOffset }),
        ...(data.metadata !== undefined && { metadata: data.metadata as Prisma.InputJsonValue }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
    return this.mapToEntity(scene);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.scene.delete({ where: { id } });
  }

  async reorder(documentId: string, sceneIds: string[]): Promise<void> {
    // Use a transaction to update all orders atomically
    await this.prisma.$transaction(
      sceneIds.map((id, index) =>
        this.prisma.scene.update({
          where: { id },
          data: { order: index },
        })
      )
    );
  }

  private mapToEntity(data: PrismaScene): Scene {
    return {
      id: data.id,
      documentId: data.documentId,
      title: data.title,
      summary: data.summary,
      startOffset: data.startOffset,
      endOffset: data.endOffset,
      metadata: data.metadata as SceneMetadata,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  private mapToEntityWithEntities(
    data: PrismaScene & { entities: PrismaSceneEntity[] }
  ): SceneWithEntities {
    return {
      ...this.mapToEntity(data),
      entities: data.entities.map((e) => this.mapEntityLink(e)),
    };
  }

  private mapEntityLink(data: PrismaSceneEntity): SceneEntityLink {
    return {
      entityId: data.entityId,
      role: data.role,
      notes: data.notes,
    };
  }
}
