'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Input } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-coach-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-12 w-12 -rotate-3 items-center justify-center rounded-xl bg-focus-orange font-display text-xl font-bold text-white">
              RR
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Review<span className="text-focus-orange">Ritual</span>
          </h1>
          <p className="text-medium-gray mt-2">
            The weekly review system that won't let you skip.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-warning-red/20 p-3 text-warning-red">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-medium-gray mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 rounded-lg border-2 border-coach-slate bg-coach-slate px-4 font-body text-white placeholder-medium-gray focus:border-focus-orange focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-medium-gray mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 rounded-lg border-2 border-coach-slate bg-coach-slate px-4 font-body text-white placeholder-medium-gray focus:border-focus-orange focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-medium-gray mt-8">
          Your accountability system awaits.
        </p>
      </div>
    </div>
  );
}
