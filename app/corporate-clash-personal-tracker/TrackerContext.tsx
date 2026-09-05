'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '../../lib/supabase/client';
import { useAuth } from '../components/AuthProvider';

export type ToonIndex = 0 | 1 | 2 | 3;
export type Progress = Record<string, boolean[]>;
/** collapsedUI: each key maps to an array of collapsed item names within that namespace */
export type CollapsedUI = Record<string, string[]>;
export const TOON_COLORS = ['#e05a5a','#5ab0e0','#5ae07a','#e0c05a'];

interface Ctx {
  progress: Progress;
  toonNames: string[];
  setToonNames: (n: string[]) => void;
  toggle: (key: string, toon: ToonIndex) => void;
  toggleAll: (key: string) => void;
  isDone: (key: string, toon: ToonIndex) => boolean;
  isAllDone: (key: string) => boolean;
  saving: boolean;
  saveMsg: string;
  commitToonName: (i: number, names: string[]) => void;
  /** Set multiple keys to true for a toon in one batch */
  setDoneMany: (entries: { key: string; toon: ToonIndex }[]) => void;
  /** Set multiple keys to false for a toon in one batch */
  setUndoneMany: (entries: { key: string; toon: ToonIndex }[]) => void;
  /** Set a list of keys to done=true and another list to done=false atomically in one state update */
  setProgressBatch: (done: { key: string; toon: ToonIndex }[], undone: { key: string; toon: ToonIndex }[]) => void;
  /** Clear progress for one toon across ALL keys */
  resetToon: (toon: ToonIndex) => void;
  /** Clear progress for ALL toons across ALL keys */
  resetAll: () => void;
  /** Clear progress for keys matching a prefix (e.g. 'q:Toontown Central:') — per toon or all */
  resetSection: (prefix: string, toon: ToonIndex | 'all') => void;
  /** Collapsed UI state — persisted to Supabase alongside progress */
  collapsedUI: CollapsedUI;
  setCollapsedUI: (updater: (prev: CollapsedUI) => CollapsedUI) => void;
}
const TrackerCtx = createContext<Ctx | null>(null);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress>({});
  const [toonNames, setToonNames] = useState(['Toon 1','Toon 2','Toon 3','Toon 4']);
  const [collapsedUI, setCollapsedUIState] = useState<CollapsedUI>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Refs always hold the latest values — avoids stale closures in save()
  const progressRef = useRef(progress);
  const toonNamesRef = useRef(toonNames);
  const collapsedUIRef = useRef(collapsedUI);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { toonNamesRef.current = toonNames; }, [toonNames]);
  useEffect(() => { collapsedUIRef.current = collapsedUI; }, [collapsedUI]);

  // Load from Supabase — keyed on user.id string so object reference changes don't cause missed loads
  const userId = user?.id ?? null;
  useEffect(() => {
    if (authLoading) return;
    if (!userId) return;
    const supabase = createClient();
    supabase.from('tracker_progress').select('data').eq('user_id', userId).single()
      .then(({ data }) => {
        if (data?.data) {
          const d = data.data as { progress?: Progress; toonNames?: string[]; collapsedUI?: CollapsedUI };
          if (d.progress) setProgress(d.progress);
          if (d.toonNames) setToonNames(d.toonNames);
          if (d.collapsedUI) setCollapsedUIState(d.collapsedUI);
        }
      });
  }, [userId, authLoading]);

  // save() always reads from refs — never stale
  const save = useCallback(async (p: Progress, names: string[], cui: CollapsedUI) => {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('tracker_progress').upsert(
      { user_id: user.id, data: { progress: p, toonNames: names, collapsedUI: cui }, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    setSaving(false);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  }, [user]);

  const setCollapsedUI = useCallback((updater: (prev: CollapsedUI) => CollapsedUI) => {
    setCollapsedUIState(prev => {
      const next = updater(prev);
      // Use refs so we always have the latest progress + toonNames, not stale closures
      save(progressRef.current, toonNamesRef.current, next);
      return next;
    });
  }, [save]);

  const toggle = useCallback((key: string, toon: ToonIndex) => {
    setProgress(prev => {
      const arr: boolean[] = prev[key] ? [...prev[key]] : [false,false,false,false];
      arr[toon] = !arr[toon];
      const next = { ...prev, [key]: arr };
      if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
      return next;
    });
  }, [user, save]);

  const isDone = (key: string, toon: ToonIndex) => !!(progress[key]?.[toon]);

  const isAllDone = (key: string) => [0,1,2,3].every(t => !!(progress[key]?.[t]));

  const toggleAll = useCallback((key: string) => {
    setProgress(prev => {
      const arr: boolean[] = prev[key] ? [...prev[key]] : [false,false,false,false];
      const allDone = arr.every(Boolean);
      const next = { ...prev, [key]: [!allDone,!allDone,!allDone,!allDone] };
      if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
      return next;
    });
  }, [user, save]);

  const commitToonName = useCallback((i: number, names: string[]) => {
    setToonNames(names);
    if (user) save(progressRef.current, names, collapsedUIRef.current);
  }, [user, save]);

  const setDoneMany = useCallback((entries: { key: string; toon: ToonIndex }[]) => {
    setProgress(prev => {
      const next = { ...prev };
      for (const { key, toon } of entries) {
        const arr: boolean[] = next[key] ? [...next[key]] : [false,false,false,false];
        arr[toon] = true;
        next[key] = arr;
      }
      if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
      return next;
    });
  }, [user, save]);

  const setUndoneMany = useCallback((entries: { key: string; toon: ToonIndex }[]) => {
    setProgress(prev => {
      const next = { ...prev };
      for (const { key, toon } of entries) {
        const arr: boolean[] = next[key] ? [...next[key]] : [false,false,false,false];
        arr[toon] = false;
        next[key] = arr;
      }
      if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
      return next;
    });
  }, [user, save]);

  const setProgressBatch = useCallback((
    done: { key: string; toon: ToonIndex }[],
    undone: { key: string; toon: ToonIndex }[]
  ) => {
    setProgress(prev => {
      const next = { ...prev };
      for (const { key, toon } of done) {
        const arr: boolean[] = next[key] ? [...next[key]] : [false,false,false,false];
        arr[toon] = true;
        next[key] = arr;
      }
      for (const { key, toon } of undone) {
        const arr: boolean[] = next[key] ? [...next[key]] : [false,false,false,false];
        arr[toon] = false;
        next[key] = arr;
      }
      if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
      return next;
    });
  }, [user, save]);

  const resetToon = useCallback((toon: ToonIndex) => {
    setProgress(prev => {
      const next: Progress = {};
      for (const key of Object.keys(prev)) {
        const arr = [...prev[key]] as boolean[];
        arr[toon] = false;
        next[key] = arr;
      }
      if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
      return next;
    });
  }, [user, save]);

  const resetAll = useCallback(() => {
    const next: Progress = {};
    setProgress(next);
    if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
  }, [user, save]);

  const resetSection = useCallback((prefix: string, toon: ToonIndex | 'all') => {
    setProgress(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (!key.startsWith(prefix)) continue;
        if (toon === 'all') {
          next[key] = [false, false, false, false];
        } else {
          const arr = [...next[key]] as boolean[];
          arr[toon] = false;
          next[key] = arr;
        }
      }
      if (user) save(next, toonNamesRef.current, collapsedUIRef.current);
      return next;
    });
  }, [user, save]);

  return (
    <TrackerCtx.Provider value={{ progress, toonNames, setToonNames, toggle, toggleAll, isDone, isAllDone, saving, saveMsg, commitToonName, setDoneMany, setUndoneMany, setProgressBatch, resetToon, resetAll, resetSection, collapsedUI, setCollapsedUI }}>
      {children}
    </TrackerCtx.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerCtx);
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider');
  return ctx;
}
