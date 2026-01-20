import type { PrismaClient, Document as PrismaDocument, Prisma } from '@/generated/prisma/client';
import type { IDocumentRepository } from '@/core/repositories';
import type { Document, CreateDocumentInput, UpdateDocumentInput, TiptapContent } from '@/core/entities/document';
import { emptyTiptapContent } from '@/core/entities/document';

export class PrismaDocumentRepository implements IDocumentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Document | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });
    return document ? this.mapToEntity(document) : null;
  }

  async findByProject(projectId: string): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
    return documents.map((d) => this.mapToEntity(d));
  }

  async create(data: CreateDocumentInput): Promise<Document> {
    // Get max order for the project
    const maxOrder = await this.prisma.document.aggregate({
      where: { projectId: data.projectId },
      _max: { order: true },
    });

    const document = await this.prisma.document.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        content: (data.content ?? emptyTiptapContent) as unknown as Prisma.InputJsonValue,
        order: data.order ?? (maxOrder._max.order ?? -1) + 1,
      },
    });
    return this.mapToEntity(document);
  }

  async update(id: string, data: UpdateDocumentInput): Promise<Document> {
    const document = await this.prisma.document.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content as unknown as Prisma.InputJsonValue }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
    return this.mapToEntity(document);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({ where: { id } });
  }

  async reorder(projectId: string, documentIds: string[]): Promise<void> {
    // Use a transaction to update all orders atomically
    await this.prisma.$transaction(
      documentIds.map((id, index) =>
        this.prisma.document.update({
          where: { id },
          data: { order: index },
        })
      )
    );
  }

  private mapToEntity(data: PrismaDocument): Document {
    return {
      id: data.id,
      projectId: data.projectId,
      parentId: null, // Prisma schema doesn't have parentId yet
      title: data.title,
      type: 'DOCUMENT' as const, // Default type
      content: data.content as unknown as TiptapContent,
      order: data.order,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
