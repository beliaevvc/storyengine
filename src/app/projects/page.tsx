import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProjects } from '@/app/actions/supabase/project-actions';
import { ProjectsList } from '@/presentation/components/projects/ProjectsList';

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: projects, error } = await getProjects();

  return (
    <div className="min-h-screen bg-[#1c2128]">
      <header className="border-b border-[#444c56] bg-[#22272e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-[#539bf5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-xl font-semibold text-[#adbac7]">
                StoryEngine
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#768390]">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-[#768390] hover:text-[#adbac7]"
                >
                  Выйти
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#adbac7]">Мои проекты</h1>
          <p className="text-[#768390] mt-2">
            Создавайте и управляйте своими историями
          </p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <ProjectsList projects={projects || []} />
        )}
      </main>
    </div>
  );
}
