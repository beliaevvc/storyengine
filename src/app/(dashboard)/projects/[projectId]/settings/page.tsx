'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { AttributeSchemaList, RelationshipTypesEditor } from '@/presentation/components/settings';
import { useProjectLoader } from '@/presentation/hooks';
import { useProjectStore } from '@/presentation/stores';

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();

  // Load project data
  const { isLoading } = useProjectLoader(projectId);
  const project = useProjectStore((s) => s.currentProject);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-canvas flex items-center justify-center">
        <div className="text-fg-muted">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-surface border-b border-border-default">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${projectId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Назад
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-fg-muted" />
              <h1 className="text-lg font-semibold text-fg-default">
                Настройки проекта
              </h1>
            </div>
            {project && (
              <span className="text-fg-muted text-sm">
                — {project.title}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Section: Attribute Schema */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-fg-default mb-2">
              Схема Мира
            </h2>
            <p className="text-fg-muted">
              Определите кастомные характеристики для сущностей вашего проекта.
              Атрибуты будут доступны при создании и редактировании персонажей,
              локаций и других элементов.
            </p>
          </div>

          <AttributeSchemaList projectId={projectId} />
        </section>

        {/* Section: Relationship Types */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-fg-default mb-2">
              Типы связей
            </h2>
            <p className="text-fg-muted">
              Настройте типы связей между сущностями. Связи могут быть симметричными
              (Друг ↔ Друг) или асимметричными (Наставник → Ученик).
            </p>
          </div>

          <RelationshipTypesEditor projectId={projectId} />
        </section>
      </main>
    </div>
  );
}
