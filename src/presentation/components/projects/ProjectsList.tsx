'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FolderOpen,
  Users,
  FileText,
  MoreHorizontal,
  Trash2,
  Copy,
  Edit,
  Loader2,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import {
  createProject,
  deleteProject,
  duplicateProject,
} from '@/app/actions/supabase/project-actions';
import type { ProjectWithCounts } from '@/app/actions/supabase/project-actions';

interface ProjectsListProps {
  projects: ProjectWithCounts[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    setLoading(true);
    const { data, error } = await createProject({
      title: newProjectTitle.trim(),
    });

    if (data && !error) {
      setNewProjectTitle('');
      setIsCreating(false);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.')) {
      return;
    }

    setActionLoading(projectId);
    await deleteProject(projectId);
    setOpenMenu(null);
    setActionLoading(null);
    router.refresh();
  };

  const handleDuplicate = async (projectId: string) => {
    setActionLoading(projectId);
    await duplicateProject(projectId);
    setOpenMenu(null);
    setActionLoading(null);
    router.refresh();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Create Project Button/Form */}
      {isCreating ? (
        <form
          onSubmit={handleCreateProject}
          className="bg-[#22272e] border border-[#444c56] rounded-lg p-4 mb-6"
        >
          <h3 className="text-lg font-medium text-[#adbac7] mb-3">
            Новый проект
          </h3>
          <div className="flex gap-3">
            <Input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Название проекта"
              className="flex-1"
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading || !newProjectTitle.trim()}
              className="bg-[#347d39] hover:bg-[#46954a] text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Создать'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewProjectTitle('');
              }}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-[#347d39] hover:bg-[#46954a] text-white mb-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый проект
        </Button>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-[#444c56] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#adbac7] mb-2">
            У вас пока нет проектов
          </h3>
          <p className="text-[#768390] mb-6">
            Создайте свой первый проект и начните писать историю
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-[#347d39] hover:bg-[#46954a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать проект
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#22272e] border border-[#444c56] rounded-lg overflow-hidden hover:border-[#539bf5] transition-colors group"
            >
              <Link
                href={`/projects/${project.id}`}
                className="block p-5"
              >
                <h3 className="text-lg font-medium text-[#adbac7] mb-2 group-hover:text-[#539bf5] transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-[#768390] mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-[#768390]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {project.entities_count} сущностей
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {project.documents_count} документов
                  </span>
                </div>
              </Link>

              <div className="border-t border-[#444c56] px-5 py-3 flex items-center justify-between">
                <span className="text-xs text-[#768390]">
                  Изменён {formatDate(project.updated_at)}
                </span>

                {/* Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === project.id ? null : project.id)
                    }
                    className="p-1 rounded hover:bg-[#373e47] text-[#768390] hover:text-[#adbac7]"
                  >
                    {actionLoading === project.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="w-4 h-4" />
                    )}
                  </button>

                  {openMenu === project.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenu(null)}
                      />
                      <div className="absolute right-0 bottom-full mb-1 bg-[#2d333b] border border-[#444c56] rounded-md shadow-lg z-20 py-1 min-w-[140px]">
                        <Link
                          href={`/projects/${project.id}/settings`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-[#adbac7] hover:bg-[#373e47]"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Edit className="w-4 h-4" />
                          Редактировать
                        </Link>
                        <button
                          onClick={() => handleDuplicate(project.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#adbac7] hover:bg-[#373e47]"
                        >
                          <Copy className="w-4 h-4" />
                          Дублировать
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#373e47]"
                        >
                          <Trash2 className="w-4 h-4" />
                          Удалить
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
