'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  CC_GAG_TRACKS, GAG_BUILD_PRESETS, TRAINING_POINTS_MAX,
  TP_PER_TRACK, TP_PER_PRESTIGE, type GagTrackKey,
} from './data-cc-gags';
import { useAuth } from '../components/AuthProvider';
import { createClient } from '../../lib/supabase/client';

// Starting tracks are chosen at Make-a-Toon and cost 0 TP.
// Any tracks beyond the 2 starting ones cost 2 TP each.
const STARTING_TRACKS_COUNT = 2;

interface BuildState {
  tracks: Set<GagTrackKey>;       // all unlocked tracks (includes starting 2)
  startingTracks: Set<GagTrackKey>; // the 2 free starting tracks
  prestiges: Set<GagTrackKey>;
}

// Serialisable form of BuildState (Sets → arrays)
interface BuildSave {
  tracks: GagTrackKey[];
  startingTracks: GagTrackKey[];
  prestiges: GagTrackKey[];
  activePreset: string | null;
}

function buildToSave(build: BuildState, activePreset: string | null): BuildSave {
  return {
    tracks: [...build.tracks] as GagTrackKey[],
    startingTracks: [...build.startingTracks] as GagTrackKey[],
    prestiges: [...build.prestiges] as GagTrackKey[],
    activePreset,
  };
}

function saveToState(s: BuildSave): { build: BuildState; activePreset: string | null } {
  return {
    build: {
      tracks: new Set(s.tracks),
      startingTracks: new Set(s.startingTracks),
      prestiges: new Set(s.prestiges),
    },
    activePreset: s.activePreset,
  };
}

export function BuildsTab() {
  const { user, loading: authLoading } = useAuth();
  const [build, setBuild] = useState<BuildState>({
    tracks: new Set(),
    startingTracks: new Set(),
    prestiges: new Set(),
  });
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [loadedFromDb, setLoadedFromDb] = useState(false);

  // Refs to avoid stale closures in save
  const buildRef = useRef(build);
  const activePresetRef = useRef(activePreset);
  useEffect(() => { buildRef.current = build; }, [build]);
  useEffect(() => { activePresetRef.current = activePreset; }, [activePreset]);

  // TP is only spent on tracks beyond the 2 free starting ones
  const tpTracks = Math.max(0, build.tracks.size - STARTING_TRACKS_COUNT);
  const usedTP = tpTracks * TP_PER_TRACK + build.prestiges.size * TP_PER_PRESTIGE;
  const remainingTP = TRAINING_POINTS_MAX - usedTP;
  const tpPct = Math.min(100, Math.round((usedTP / TRAINING_POINTS_MAX) * 100));
  const tpColor = usedTP > TRAINING_POINTS_MAX ? '#e05050' : usedTP === TRAINING_POINTS_MAX ? '#4ade80' : '#a4f78f';

  // Load saved build from Supabase when user signs in
  const userId = user?.id ?? null;
  useEffect(() => {
    if (authLoading || !userId) return;
    const supabase = createClient();
    supabase.from('gag_builds').select('data').eq('user_id', userId).single()
      .then(({ data }) => {
        if (data?.data) {
          const saved = data.data as BuildSave;
          const { build: loadedBuild, activePreset: loadedPreset } = saveToState(saved);
          setBuild(loadedBuild);
          setActivePreset(loadedPreset);
        }
        setLoadedFromDb(true);
      });
  }, [userId, authLoading]);

  const saveBuild = useCallback(async (b: BuildState, preset: string | null) => {
    if (!user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('gag_builds').upsert(
        { user_id: user.id, data: buildToSave(b, preset), updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
      setSaving(false);
      if (error) {
        setSaveMsg('Save failed');
      } else {
        setSaveMsg('Saved!');
      }
    } catch {
      setSaving(false);
      setSaveMsg('');
      return;
    }
    setTimeout(() => setSaveMsg(''), 2000);
  }, [user]);

  function toggleTrack(key: GagTrackKey) {
    setBuild(prev => {
      const tracks    = new Set(prev.tracks);
      const starting  = new Set(prev.startingTracks);
      const prestiges = new Set(prev.prestiges);

      if (tracks.has(key)) {
        // Cannot remove if it would drop below 2 total tracks
        if (tracks.size <= 2) return prev;
        tracks.delete(key);
        starting.delete(key);
        prestiges.delete(key);
      } else {
        tracks.add(key);
        // First 2 tracks added are free starting tracks
        if (starting.size < STARTING_TRACKS_COUNT) starting.add(key);
      }
      const next = { tracks, startingTracks: starting, prestiges };
      if (user) saveBuild(next, null);
      return next;
    });
    setActivePreset(null);
  }

  function togglePrestige(key: GagTrackKey) {
    if (!build.tracks.has(key)) return;
    setBuild(prev => {
      const p = new Set(prev.prestiges);
      p.has(key) ? p.delete(key) : p.add(key);
      const next = { ...prev, prestiges: p };
      if (user) saveBuild(next, activePresetRef.current);
      return next;
    });
  }

  function applyPreset(label: string, tracks: number, prestiges: number) {
    const tk = CC_GAG_TRACKS.map(t => t.key).slice(0, tracks) as GagTrackKey[];
    const startingTk = new Set(tk.slice(0, STARTING_TRACKS_COUNT));
    const next: BuildState = {
      tracks: new Set(tk),
      startingTracks: startingTk,
      prestiges: new Set(tk.slice(0, prestiges)),
    };
    setBuild(next);
    setActivePreset(label);
    if (user) saveBuild(next, label);
  }

  function clearBuild() {
    const empty: BuildState = { tracks: new Set(), startingTracks: new Set(), prestiges: new Set() };
    setBuild(empty);
    setActivePreset(null);
    if (user) saveBuild(empty, null);
  }

  return (
    <div className="gagbuilds-layout">
      <BuildLeft
        build={build} usedTP={usedTP} remainingTP={remainingTP}
        tpPct={tpPct} tpColor={tpColor}
        onToggleTrack={toggleTrack} onTogglePrestige={togglePrestige} onClear={clearBuild}
      />
      <BuildRight
        build={build} usedTP={usedTP} activePreset={activePreset} onApplyPreset={applyPreset}
        saving={saving} saveMsg={saveMsg} isLoggedIn={!!user}
      />
    </div>
  );
}

function BuildLeft({ build, usedTP, remainingTP, tpPct, tpColor, onToggleTrack, onTogglePrestige, onClear }: {
  build: BuildState; usedTP: number; remainingTP: number;
  tpPct: number; tpColor: string;
  onToggleTrack(k: GagTrackKey): void;
  onTogglePrestige(k: GagTrackKey): void;
  onClear(): void;
}) {
  return (
    <div className="gagbuilds-left">
      <div className="gagbuilds-tp-meter">
        <div className="gagbuilds-tp-bar-wrap">
          <div className="gagbuilds-tp-bar" style={{ width: `${tpPct}%`, background: tpColor }} />
        </div>
        <div className="gagbuilds-tp-counts">
          <span style={{ color: tpColor }}><strong>{usedTP}</strong> / {TRAINING_POINTS_MAX} TP used</span>
          {remainingTP >= 0
            ? <span className="gagcalc-muted">{remainingTP} remaining</span>
            : <span style={{ color: '#e05050' }}>Over by {-remainingTP} TP!</span>}
        </div>
      </div>
      <p className="gagbuilds-hint">
        You start with <strong>2 free Gag Tracks</strong> chosen at Make-a-Toon — these cost no TP.
        Additional tracks cost <strong>2 TP</strong> each. Prestige an unlocked track for <strong>+1 TP</strong>.
        You must always keep at least <strong>2 Gag Tracks</strong>.
        Tracks and Prestiges can be refunded for free in-game.
      </p>
      <div className="gagbuilds-tracks">
        {CC_GAG_TRACKS.map(track => {
          const isOn      = build.tracks.has(track.key);
          const isPrs     = build.prestiges.has(track.key);
          const isStarting = build.startingTracks.has(track.key);
          const isLocked  = isOn && build.tracks.size <= 2;
          const largeIcon = track.key === 'toon-up' ? 'toon-up.png' : `${track.key}-large.png`;

          // Cost label
          let costLabel: string;
          let costColor: string;
          if (isLocked)     { costLabel = '🔒 Min 2 tracks'; costColor = '#e0a050'; }
          else if (isStarting) { costLabel = 'Starting · Free'; costColor = '#a4f78f'; }
          else if (isOn)    { costLabel = 'Unlocked · 2 TP'; costColor = '#4ade80'; }
          else              { costLabel = '+ 2 TP';           costColor = 'var(--muted)'; }

          return (
            <div key={track.key} className={`gagbuilds-track-row${isOn ? ' gagbuilds-track-row--on' : ''}`}>
              <button
                className="gagbuilds-track-btn"
                onClick={() => onToggleTrack(track.key)}
                title={isLocked ? 'Cannot remove — minimum 2 tracks required' : isOn ? 'Click to remove track' : isStarting ? 'Starting track (free)' : 'Click to unlock track (2 TP)'}
                style={{ background: isOn ? track.headerColor : '#111711', borderColor: isOn ? track.color : '#293528' }}
              >
                <Image src={`/icons/gags/large/${largeIcon}`} alt={track.name} width={28} height={28} unoptimized
                  style={{ opacity: isOn ? 1 : 0.4 }} />
                <span style={{ color: isOn ? track.labelColor : 'var(--muted)' }}>{track.name}</span>
                <span className="gagbuilds-cost" style={{ color: costColor }}>{costLabel}</span>
              </button>
              <button
                className={`gagbuilds-pres-btn${isPrs ? ' gagbuilds-pres-btn--on' : ''}`}
                onClick={() => onTogglePrestige(track.key)}
                disabled={!isOn}
                title={isOn ? (isPrs ? 'Remove prestige' : 'Prestige this track (+1 TP)') : 'Unlock track first'}
                style={{ opacity: isOn ? 1 : 0.25 }}
              >
                <Image src="/icons/gags/PrestigeStar.webp" alt="Prestige" width={16} height={16} unoptimized />
                <span style={{ color: isPrs ? '#ffd700' : 'var(--muted)' }}>
                  {isPrs ? 'Prestiged · 1 TP' : '+ 1 TP'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <button className="gagcalc-clear-btn" onClick={onClear} style={{ marginTop: 16 }}>Reset build</button>
    </div>
  );
}

function BuildRight({ build, usedTP, activePreset, onApplyPreset, saving, saveMsg, isLoggedIn }: {
  build: BuildState; usedTP: number; activePreset: string | null;
  onApplyPreset(label: string, tracks: number, prestiges: number): void;
  saving: boolean; saveMsg: string; isLoggedIn: boolean;
}) {
  return (
    <div className="gagbuilds-right">
      <div className="gagcalc-panel-head">
        <span className="kicker">Quick Presets</span>
        {isLoggedIn && (
          <span className="gagbuilds-save-status">
            {saving ? '⏳ Saving…' : saveMsg ? saveMsg : '☁ Auto-saved'}
          </span>
        )}
      </div>
      <p className="gagbuilds-preset-note">
        You start with <strong>2 free Gag Tracks</strong> from Make-a-Toon. Training Points are earned at
        Toon Levels <strong>4, 8, 12, 16, 20, 28, 38, 48, 58, 68, and 78</strong> (11 total),
        plus 1 more for <strong>maxing all four Department Levels</strong> — <strong>12 TP total</strong>.
      </p>
      <div className="gagbuilds-preset-groups">
        {([11, 12] as const).map(tp => (
          <div key={tp} className="gagbuilds-preset-group">
            <p className="gagbuilds-preset-tp-label">{tp} Training Points</p>
            {GAG_BUILD_PRESETS.filter(p => p.tp === tp).map(preset => (
              <button
                key={preset.label}
                className={`gagbuilds-preset-btn${activePreset === preset.label ? ' gagbuilds-preset-btn--active' : ''}`}
                onClick={() => onApplyPreset(preset.label, preset.tracks, preset.prestiges)}
              >
                <span className="gagbuilds-preset-ratio">{preset.label}</span>
                <span className="gagbuilds-preset-desc">{preset.tracks} Tracks · {preset.prestiges} Prestiges</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {build.tracks.size > 0 && (
        <div className="gagbuilds-summary">
          <div className="gagcalc-panel-head"><span className="kicker">Your Build Summary</span></div>
          <div className="gagbuilds-summary-list">
            {CC_GAG_TRACKS.filter(t => build.tracks.has(t.key)).map(t => {
              const isPrs      = build.prestiges.has(t.key);
              const isStarting = build.startingTracks.has(t.key);
              const largeIcon  = t.key === 'toon-up' ? 'toon-up.png' : `${t.key}-large.png`;
              // TP cost: starting track = 0, TP track = 2, +1 if prestiged
              const tpCost = isStarting ? (isPrs ? 1 : 0) : (isPrs ? 3 : 2);
              const tpLabel = isStarting
                ? (isPrs ? '1 TP (prestige)' : 'Free')
                : `${tpCost} TP`;
              return (
                <div key={t.key} className="gagbuilds-sum-row" style={{ borderLeftColor: t.color }}>
                  <Image src={`/icons/gags/large/${largeIcon}`} alt={t.name} width={20} height={20} unoptimized />
                  <span style={{ color: t.labelColor }}>{t.name}</span>
                  {isStarting && !isPrs && (
                    <span className="gagbuilds-sum-free">Starting</span>
                  )}
                  {isPrs && (
                    <span className="gagbuilds-sum-pres">
                      <Image src="/icons/gags/PrestigeStar.webp" alt="★" width={11} height={11} unoptimized /> Prestige
                    </span>
                  )}
                  <span className="gagbuilds-sum-tp" style={{ color: tpCost === 0 ? '#a4f78f' : 'var(--muted)' }}>
                    {tpLabel}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="gagbuilds-sum-total">
            <span>Total</span>
            <span style={{ color: usedTP > TRAINING_POINTS_MAX ? '#e05050' : '#4ade80' }}>
              <strong>{usedTP}</strong> / {TRAINING_POINTS_MAX} TP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
