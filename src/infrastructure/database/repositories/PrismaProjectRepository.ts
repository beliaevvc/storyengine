import type { PrismaClient, Project as PrismaProject, Prisma } from '@/generated/prisma/client';
import type { IProjectRepository } from '@/core/repositories';
import type { Project, CreateProjectInput, UpdateProjectInput, ProjectSettings } from '@/core/entities/project';

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    return project ? this.mapToEntity(project) : null;
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return projects.map((p) => this.mapToEntity(p));
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        settings: (data.settings ?? {}) as Prisma.InputJsonValue,
      },
    });
    return this.mapToEntity(project);
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.settings !== undefined && { settings: data.settings as Prisma.InputJsonValue }),
      },
    });
    return this.mapToEntity(project);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }

  private mapToEntity(data: PrismaProject): Project {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      settings: data.settings as ProjectSettings,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
