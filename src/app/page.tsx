import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Sparkles,
  BookOpen,
  Users,
  GitBranch,
  Clock,
  Bot,
  ArrowRight,
} from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect authenticated users to projects
  if (user) {
    redirect('/projects');
  }

  return (
    <div className="min-h-screen bg-[#1c2128]">
      {/* Header */}
      <header className="border-b border-[#444c56]">
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
              <Link
                href="/login"
                className="text-[#768390] hover:text-[#adbac7] transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="bg-[#347d39] hover:bg-[#46954a] text-white px-4 py-2 rounded-md transition-colors"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#539bf5]/10 text-[#539bf5] px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-powered IDE для писателей</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#adbac7] mb-6 leading-tight">
            Создавайте истории
            <br />
            <span className="text-[#539bf5]">как профессионалы пишут код</span>
          </h1>
          
          <p className="text-xl text-[#768390] mb-8 max-w-2xl mx-auto">
            StoryEngine — это IDE для сторителлинга с AI-ассистентом, базой знаний 
            персонажей, визуальным редактором сюжета и полным контекстом вашей истории.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#347d39] hover:bg-[#46954a] text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 text-[#768390] hover:text-[#adbac7] px-8 py-3 transition-colors"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#22272e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#adbac7] mb-4">
              Всё для создания историй
            </h2>
            <p className="text-[#768390] max-w-2xl mx-auto">
              Инструменты, которые помогут вам управлять сложными сюжетами 
              и персонажами так же эффективно, как разработчики управляют кодом.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Assistant */}
            <div className="bg-[#2d333b] border border-[#444c56] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#539bf5]/10 rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-[#539bf5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#adbac7] mb-2">
                AI-ассистент
              </h3>
              <p className="text-[#768390]">
                GPT-4 и Claude знают контекст всей вашей истории. 
                Продолжайте сцены, генерируйте диалоги, получайте идеи.
              </p>
            </div>

            {/* Knowledge Base */}
            <div className="bg-[#2d333b] border border-[#444c56] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#347d39]/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#347d39]" />
              </div>
              <h3 className="text-lg font-semibold text-[#adbac7] mb-2">
                База знаний
              </h3>
              <p className="text-[#768390]">
                Персонажи, локации, предметы, события — всё в одном месте. 
                Упоминайте через @ прямо в тексте.
              </p>
            </div>

            {/* Visual Nodes */}
            <div className="bg-[#2d333b] border border-[#444c56] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#986ee2]/10 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-[#986ee2]" />
              </div>
              <h3 className="text-lg font-semibold text-[#adbac7] mb-2">
                Визуальные ноды
              </h3>
              <p className="text-[#768390]">
                Сюжетный flow, карта персонажей, связи между сущностями — 
                визуализируйте структуру истории.
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-[#2d333b] border border-[#444c56] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#e5534b]/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#e5534b]" />
              </div>
              <h3 className="text-lg font-semibold text-[#adbac7] mb-2">
                Мульти-таймлайн
              </h3>
              <p className="text-[#768390]">
                Отслеживайте события на нескольких временных линиях. 
                Идеально для сложных сюжетов с flashback-ами.
              </p>
            </div>

            {/* Rich Editor */}
            <div className="bg-[#2d333b] border border-[#444c56] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#57ab5a]/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#57ab5a]" />
              </div>
              <h3 className="text-lg font-semibold text-[#adbac7] mb-2">
                Умный редактор
              </h3>
              <p className="text-[#768390]">
                Форматирование, комментарии, версионирование. 
                Ссылки на персонажей подсвечиваются автоматически.
              </p>
            </div>

            {/* Export */}
            <div className="bg-[#2d333b] border border-[#444c56] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#c69026]/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#c69026]" />
              </div>
              <h3 className="text-lg font-semibold text-[#adbac7] mb-2">
                Экспорт
              </h3>
              <p className="text-[#768390]">
                Экспортируйте в PDF, DOCX или Fountain (для сценариев). 
                Готово к публикации или питчингу.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#adbac7] mb-4">
            Готовы начать?
          </h2>
          <p className="text-[#768390] mb-8">
            Присоединяйтесь к писателям, которые уже используют StoryEngine 
            для создания своих историй.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#347d39] hover:bg-[#46954a] text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Создать бесплатный аккаунт
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#444c56] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#539bf5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="text-[#768390]">StoryEngine</span>
          </div>
          <p className="text-sm text-[#768390]">
            © 2026 StoryEngine. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
