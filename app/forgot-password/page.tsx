'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(prefillEmail);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account%3Freset%3D1`,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="kicker">Check your inbox</p>
          <h1>Reset link sent</h1>
          <p className="auth-body">
            We sent a password reset link to <strong>{email}</strong>.
            Click the link in that email to set a new password — it expires in 1 hour.
          </p>
          <p className="auth-body" style={{ marginTop: 0 }}>
            Didn&apos;t get it? Check your spam folder, or{' '}
            <button
              className="auth-inline-btn"
              onClick={() => setSent(false)}>
              try again
            </button>
            .
          </p>
          <Link className="button" href="/login" style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            Back to log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="kicker">Forgot your password?</p>
        <h1>Reset password</h1>
        <p className="auth-body">
          Enter your account email and we&apos;ll send you a link to set a new password.
        </p>
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
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="button" disabled={submitting || !email}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <p className="auth-alt">
          Remembered it? <Link href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="site-page">
      <SiteHeader />
      <Suspense fallback={<main className="auth-page"><div className="auth-card"><p className="kicker">Loading…</p></div></main>}>
        <ForgotPasswordForm />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
