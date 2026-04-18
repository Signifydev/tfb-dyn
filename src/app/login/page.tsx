'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Compass, Mountain, ShieldCheck, Sparkles, Stars } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.push(redirect);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef5f9_40%,#fff8ef_100%)] px-4 pb-10 pt-24 md:px-6 md:pt-28">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,#082f49,#0f172a_52%,#1d4ed8)] p-6 text-white shadow-[0_32px_100px_rgba(15,23,42,0.24)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_30%)]" />
          <div className="absolute -left-16 top-16 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute bottom-12 right-0 h-52 w-52 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100 backdrop-blur">
                <Stars className="h-3.5 w-3.5 text-amber-300" />
                Travel For Benefits
              </div>

              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                Step back into your next journey with everything ready to go.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 md:text-lg">
                Access saved itineraries, continue bookings, and manage premium travel plans with a smoother customer dashboard experience.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Compass,
                  title: 'Continue Faster',
                  description: 'Pick up your booking flow exactly where you left it.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Trusted Access',
                  description: 'Secure sign-in for customer details, bookings, and follow-ups.',
                },
                {
                  icon: Mountain,
                  title: 'Curated Journeys',
                  description: 'Return to premium itineraries, darshan packages, and adventure escapes.',
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sky-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full overflow-hidden rounded-[2rem] border-white/70 bg-white/88 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Welcome Back
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">Sign in to your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Continue to your itinerary booking, saved preferences, and customer follow-up flow.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-white"
                    required
                  />
                </div>

                <Button type="submit" className="h-12 w-full rounded-xl bg-slate-950 hover:bg-slate-800" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.18em]">
                  <span className="bg-white px-3 text-slate-400">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-slate-200"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>

              <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-sm text-slate-600">
                  New here?{' '}
                  <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-sky-700 hover:text-sky-800">
                    Create your account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
