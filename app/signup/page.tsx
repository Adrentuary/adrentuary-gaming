'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { useAuth } from '../components/AuthProvider';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/account');
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username },
      },
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="auth-page">
          <div className="auth-card">
            <p className="kicker">Almost there</p>
            <h1>Check your email</h1>
            <p className="auth-body">
              We sent a confirmation link to <strong>{email}</strong>.
              Click it to activate your account, then come back to log in.
            </p>
            <Link className="button" href="/login">Go to log in</Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="auth-page">
        <div className="auth-card">
          <p className="kicker">Join the community</p>
          <h1>Create account</h1>
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={30}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="YourGamerTag"
            />
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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="8+ characters"
            />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p className="auth-alt">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
