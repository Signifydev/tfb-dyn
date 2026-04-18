'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle,
  HeartHandshake,
  MapPinned,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbf8_0%,#eef7ff_55%,#fffdf7_100%)] px-4 pb-12 pt-24 md:pt-28">
        <div className="mx-auto max-w-3xl">
          <Card className="overflow-hidden rounded-[2rem] border-white/70 bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <CardContent className="p-8 text-center md:p-12">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-9 w-9 text-emerald-600" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Almost There
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">Check your email</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
                We sent a confirmation email to <strong>{email}</strong>. Verify your account and then continue to your booking flow without losing your selected itinerary.
              </p>
              <Button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(redirect)}`)}
                className="mt-8 h-12 rounded-xl bg-slate-950 px-8 hover:bg-slate-800"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffaf2_0%,#eef5ff_45%,#f8fbff_100%)] px-4 pb-10 pt-24 md:px-6 md:pt-28">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(145deg,#fff7ed,#fef3c7_40%,#fff)] p-6 shadow-[0_28px_90px_rgba(245,158,11,0.12)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_26%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 backdrop-blur">
                <UserPlus className="h-3.5 w-3.5" />
                Create Your Account
              </div>
              <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
                Join once, book faster, and travel with more confidence.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                Build your customer profile to continue itinerary bookings, receive quick follow-up support, and manage trips in one place.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {[
                {
                  icon: HeartHandshake,
                  title: 'Customer-first support',
                  description: 'Your enquiry details and booking preferences stay connected for easier follow-ups.',
                },
                {
                  icon: MapPinned,
                  title: 'Save selected itineraries',
                  description: 'Pick up from Char Dham, helicopter, adventure, or premium tours without starting over.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure account access',
                  description: 'Manage bookings, account details, and travel history with confidence.',
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-amber-100 bg-white/80 p-4 backdrop-blur"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full overflow-hidden rounded-[2rem] border-white/70 bg-white/90 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Start Your Journey
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">Create your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Set up your customer account once and continue bookings with your selected itinerary already attached.
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
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-slate-200"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-xl border-slate-200"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full rounded-xl bg-slate-950 hover:bg-slate-800" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4 text-xs leading-6 text-slate-500">
                By signing up, you agree to our{' '}
                <Link href="#" className="font-medium text-sky-700 hover:text-sky-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="font-medium text-sky-700 hover:text-sky-800">
                  Privacy Policy
                </Link>
                .
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link
                    href={`/login?redirect=${encodeURIComponent(redirect)}`}
                    className="font-semibold text-sky-700 hover:text-sky-800"
                  >
                    Sign in
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
