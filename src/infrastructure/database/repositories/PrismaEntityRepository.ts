import type { PrismaClient, Entity as PrismaEntity, EntityType as PrismaEntityType, Prisma } from '@/generated/prisma/client';
import type { IEntityRepository } from '@/core/repositories';
import type { Entity, EntityType, CreateEntityInput, UpdateEntityInput } from '@/core/entities/entity';
import type { EntityAttributes } from '@/core/types/entity-attributes';

export class PrismaEntityRepository implements IEntityRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Entity | null> {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
    });
    return entity ? this.mapToEntity(entity) : null;
  }

  async findByProject(projectId: string): Promise<Entity[]> {
    const entities = await this.prisma.entity.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    });
    return entities.map((e) => this.mapToEntity(e));
  }

  async findByProjectAndType(projectId: string, type: EntityType): Promise<Entity[]> {
    const entities = await this.prisma.entity.findMany({
      where: { projectId, type: type as PrismaEntityType },
      orderBy: { name: 'asc' },
    });
    return entities.map((e) => this.mapToEntity(e));
  }

  async findByName(projectId: string, name: string): Promise<Entity[]> {
    const entities = await this.prisma.entity.findMany({
      where: {
        projectId,
        name: { equals: name, mode: 'insensitive' },
      },
    });
    return entities.map((e) => this.mapToEntity(e));
  }

  async search(projectId: string, query: string): Promise<Entity[]> {
    const entities = await this.prisma.entity.findMany({
      where: {
        projectId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });
    return entities.map((e) => this.mapToEntity(e));
  }

  async create(data: CreateEntityInput): Promise<Entity> {
    const entity = await this.prisma.entity.create({
      data: {
        projectId: data.projectId,
        type: data.type as PrismaEntityType,
        name: data.name,
        description: data.description,
        attributes: (data.attributes ?? {}) as Prisma.InputJsonValue,
        imageUrl: data.imageUrl,
      },
    });
    return this.mapToEntity(entity);
  }

  async update(id: string, data: UpdateEntityInput): Promise<Entity> {
    const entity = await this.prisma.entity.update({
      where: { id },
      data: {
        ...(data.type !== undefined && { type: data.type as PrismaEntityType }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.attributes !== undefined && { attributes: data.attributes as Prisma.InputJsonValue }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      },
    });
    return this.mapToEntity(entity);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.entity.delete({ where: { id } });
  }

  async addToScene(entityId: string, sceneId: string, role?: string): Promise<void> {
    await this.prisma.sceneEntity.upsert({
      where: {
        sceneId_entityId: { sceneId, entityId },
      },
      create: {
        sceneId,
        entityId,
        role,
      },
      update: {
        role,
      },
    });
  }

  async removeFromScene(entityId: string, sceneId: string): Promise<void> {
    await this.prisma.sceneEntity.delete({
      where: {
        sceneId_entityId: { sceneId, entityId },
      },
    });
  }

  private mapToEntity(data: PrismaEntity): Entity {
    return {
      id: data.id,
      projectId: data.projectId,
      type: data.type as EntityType,
      name: data.name,
      description: data.description,
      attributes: data.attributes as EntityAttributes,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
