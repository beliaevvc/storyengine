'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/projects';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Введите email для Magic Link');
      return;
    }
    
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="bg-[#22272e] border border-[#444c56] rounded-lg p-8 text-center">
        <Mail className="w-12 h-12 text-[#539bf5] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-[#adbac7] mb-2">
          Проверьте почту
        </h2>
        <p className="text-[#768390] mb-4">
          Мы отправили ссылку для входа на {email}
        </p>
        <Button
          variant="ghost"
          onClick={() => setMagicLinkSent(false)}
          className="text-[#539bf5]"
        >
          Назад к форме входа
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#22272e] border border-[#444c56] rounded-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#adbac7] mb-2">
          Добро пожаловать
        </h1>
        <p className="text-[#768390]">Войдите в StoryEngine</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 mb-6 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#adbac7] mb-1"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#768390]" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#adbac7] mb-1"
          >
            Пароль
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#768390]" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#347d39] hover:bg-[#46954a] text-white"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Войти
        </Button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#444c56]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#22272e] px-2 text-[#768390]">или</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleMagicLink}
          disabled={loading}
        >
          <Mail className="w-4 h-4 mr-2" />
          Войти через Magic Link
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Войти через Google
        </Button>
      </div>

      <p className="text-center text-sm text-[#768390] mt-6">
        Нет аккаунта?{' '}
        <Link href="/register" className="text-[#539bf5] hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#22272e] border border-[#444c56] rounded-lg p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#539bf5] mx-auto" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
