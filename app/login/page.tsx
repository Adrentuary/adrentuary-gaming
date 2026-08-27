'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { useAuth } from '../components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Show error if redirected here after a failed confirmation link
  useEffect(() => {
    if (searchParams.get('error') === 'confirmation_failed') {
      setError('Email confirmation failed or link expired. Please try signing up again or contact support.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) router.replace('/account');
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      router.push('/account');
    }
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="auth-page">
        <div className="auth-card">
          <p className="kicker">Welcome back</p>
          <h1>Log in</h1>
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>
          <p className="auth-alt">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
