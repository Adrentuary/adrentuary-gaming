'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useAuth } from '../components/AuthProvider';

export type ToonIndex = 0 | 1 | 2 | 3;
export type Progress = Record<string, boolean[]>;
export const TOON_COLORS = ['#e05a5a','#5ab0e0','#5ae07a','#e0c05a'];

interface Ctx {
  progress: Progress;
  toonNames: string[];
  setToonNames: (n: string[]) => void;
  toggle: (key: string, toon: ToonIndex) => void;
  isDone: (key: string, toon: ToonIndex) => boolean;
  saving: boolean;
  saveMsg: string;
  commitToonName: (i: number, names: string[]) => void;
}
const TrackerCtx = createContext<Ctx | null>(null);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({});
  const [toonNames, setToonNames] = useState(['Toon 1','Toon 2','Toon 3','Toon 4']);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from('tracker_progress').select('data').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data?.data) {
          const d = data.data as { progress?: Progress; toonNames?: string[] };
          if (d.progress) setProgress(d.progress);
          if (d.toonNames) setToonNames(d.toonNames);
        }
      });
  }, [user]);

  const save = useCallback(async (p: Progress, names: string[]) => {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('tracker_progress').upsert(
      { user_id: user.id, data: { progress: p, toonNames: names }, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    setSaving(false);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  }, [user]);

  const toggle = useCallback((key: string, toon: ToonIndex) => {
    setProgress(prev => {
      const arr: boolean[] = prev[key] ? [...prev[key]] : [false,false,false,false];
      arr[toon] = !arr[toon];
      const next = { ...prev, [key]: arr };
      if (user) save(next, toonNames);
      return next;
    });
  }, [user, toonNames, save]);

  const isDone = (key: string, toon: ToonIndex) => !!(progress[key]?.[toon]);

  const commitToonName = (i: number, names: string[]) => {
    setToonNames(names);
    if (user) save(progress, names);
  };

  return (
    <TrackerCtx.Provider value={{ progress, toonNames, setToonNames, toggle, isDone, saving, saveMsg, commitToonName }}>
      {children}
    </TrackerCtx.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerCtx);
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider');
  return ctx;
}
