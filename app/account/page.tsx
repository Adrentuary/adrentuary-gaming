'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../lib/supabase/client';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { useAuth } from '../components/AuthProvider';

interface Profile {
  username: string;
  display_name: string;
  avatar_url: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile>({ username: '', display_name: '', avatar_url: null });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('profiles')
      .select('username, display_name, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
        setProfileLoading(false);
      });
  }, [user]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMsg('');
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaveMsg(error ? error.message : 'Saved!');
    setTimeout(() => setSaveMsg(''), 3000);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setPwSaving(true);
    setPwMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) {
      setPwMsg(error.message);
    } else {
      setNewPassword('');
      setPwMsg('Password updated!');
      setTimeout(() => setPwMsg(''), 3000);
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (upErr) { setAvatarUploading(false); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatarUrl = data.publicUrl + '?t=' + Date.now();
    await supabase.from('profiles').upsert({ id: user.id, avatar_url: avatarUrl, updated_at: new Date().toISOString() });
    setProfile(p => ({ ...p, avatar_url: avatarUrl }));
    setAvatarUploading(false);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading || profileLoading) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="auth-page"><div className="auth-card"><p className="kicker">Loading…</p></div></main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="account-page">
        <div className="account-shell">
          <aside className="account-sidebar">
            <div className="account-avatar-wrap">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" className="account-avatar" />
                : <div className="account-avatar account-avatar--placeholder" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
              }
              <button className="avatar-change-btn" onClick={() => fileRef.current?.click()} disabled={avatarUploading}>
                {avatarUploading ? 'Uploading…' : 'Change photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadAvatar} />
            </div>
            <div className="account-identity">
              <strong>{profile.display_name || profile.username || 'Your Account'}</strong>
              <span>{user?.email}</span>
            </div>
            <button className="account-signout" onClick={signOut}>Sign out</button>
          </aside>
          <div className="account-content">
            <section className="account-section">
              <h2>Profile</h2>
              <form onSubmit={saveProfile} className="account-form">
                <label htmlFor="display_name">Display name</label>
                <input id="display_name" type="text" value={profile.display_name} onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))} placeholder="How your name shows publicly" maxLength={50} />
                <label htmlFor="username">Username</label>
                <input id="username" type="text" value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} placeholder="Unique handle" maxLength={30} />
                <div className="form-footer">
                  {saveMsg && <span className={saveMsg === 'Saved!' ? 'form-success' : 'form-error'}>{saveMsg}</span>}
                  <button type="submit" className="button button--primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
                </div>
              </form>
            </section>
            <section className="account-section">
              <h2>Change password</h2>
              <form onSubmit={changePassword} className="account-form">
                <label htmlFor="new_password">New password</label>
                <input id="new_password" type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="8+ characters" />
                <div className="form-footer">
                  {pwMsg && <span className={pwMsg === 'Password updated!' ? 'form-success' : 'form-error'}>{pwMsg}</span>}
                  <button type="submit" className="button button--primary" disabled={pwSaving || newPassword.length < 8}>{pwSaving ? 'Updating…' : 'Update password'}</button>
                </div>
              </form>
            </section>
            <section className="account-section">
              <h2>Guide progress</h2>
              <p className="account-body">Your saved guide progress will appear here once you start using interactive guides.</p>
              <Link className="button button--ghost" href="/corporate-clash-personal-tracker">Open Corporate Clash Personal Tracker</Link>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
