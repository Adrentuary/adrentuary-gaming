'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  CC_GAG_TRACKS, GAG_BUILD_PRESETS, TRAINING_POINTS_MAX,
  TP_PER_TRACK, TP_PER_PRESTIGE, type GagTrackKey,
} from './data-cc-gags';

interface BuildState { tracks: Set<GagTrackKey>; prestiges: Set<GagTrackKey>; }

export function BuildsTab() {
  const [build, setBuild] = useState<BuildState>({ tracks: new Set(), prestiges: new Set() });
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const usedTP = build.tracks.size * TP_PER_TRACK + build.prestiges.size * TP_PER_PRESTIGE;
  const remainingTP = TRAINING_POINTS_MAX - usedTP;
  const tpPct = Math.min(100, Math.round((usedTP / TRAINING_POINTS_MAX) * 100));
  const tpColor = usedTP > TRAINING_POINTS_MAX ? '#e05050' : usedTP === TRAINING_POINTS_MAX ? '#4ade80' : '#a4f78f';

  function toggleTrack(key: GagTrackKey) {
    setBuild(prev => {
      const tracks = new Set(prev.tracks);
      const prestiges = new Set(prev.prestiges);
      if (tracks.has(key)) { tracks.delete(key); prestiges.delete(key); }
      else tracks.add(key);
      return { tracks, prestiges };
    });
    setActivePreset(null);
  }
  function togglePrestige(key: GagTrackKey) {
    if (!build.tracks.has(key)) return;
    setBuild(prev => {
      const p = new Set(prev.prestiges);
      p.has(key) ? p.delete(key) : p.add(key);
      return { ...prev, prestiges: p };
    });
    setActivePreset(null);
  }
  function applyPreset(label: string, tracks: number, prestiges: number) {
    const tk = CC_GAG_TRACKS.map(t => t.key).slice(0, tracks) as GagTrackKey[];
    setBuild({ tracks: new Set(tk), prestiges: new Set(tk.slice(0, prestiges)) });
    setActivePreset(label);
  }
  function clearBuild() {
    setBuild({ tracks: new Set(), prestiges: new Set() });
    setActivePreset(null);
  }

  return (
    <div className="gagbuilds-layout">
      <BuildLeft
        build={build} usedTP={usedTP} remainingTP={remainingTP}
        tpPct={tpPct} tpColor={tpColor}
        onToggleTrack={toggleTrack} onTogglePrestige={togglePrestige} onClear={clearBuild}
      />
      <BuildRight build={build} usedTP={usedTP} activePreset={activePreset} onApplyPreset={applyPreset} />
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
        Click a track to unlock it <strong>(2 TP each)</strong>. Click the
        <Image src="/icons/gags/PrestigeStar.webp" alt="star" width={12} height={12} unoptimized className="gagbuilds-inline-star" />
        star to prestige it <strong>(+1 TP)</strong>. A track must be unlocked before it can be prestiged.
      </p>
      <div className="gagbuilds-tracks">
        {CC_GAG_TRACKS.map(track => {
          const isOn  = build.tracks.has(track.key);
          const isPrs = build.prestiges.has(track.key);
          const largeIcon = track.key === 'toon-up' ? 'toon-up.png' : `${track.key}-large.png`;
          return (
            <div key={track.key} className={`gagbuilds-track-row${isOn ? ' gagbuilds-track-row--on' : ''}`}>
              <button
                className="gagbuilds-track-btn"
                onClick={() => onToggleTrack(track.key)}
                style={{ background: isOn ? track.headerColor : '#111711', borderColor: isOn ? track.color : '#293528' }}
              >
                <Image src={`/icons/gags/large/${largeIcon}`} alt={track.name} width={28} height={28} unoptimized
                  style={{ opacity: isOn ? 1 : 0.4 }} />
                <span style={{ color: isOn ? track.labelColor : 'var(--muted)' }}>{track.name}</span>
                <span className="gagbuilds-cost" style={{ color: isOn ? '#4ade80' : 'var(--muted)' }}>
                  {isOn ? 'Unlocked · 2 TP' : '+ 2 TP'}
                </span>
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

function BuildRight({ build, usedTP, activePreset, onApplyPreset }: {
  build: BuildState; usedTP: number; activePreset: string | null;
  onApplyPreset(label: string, tracks: number, prestiges: number): void;
}) {
  return (
    <div className="gagbuilds-right">
      <div className="gagcalc-panel-head"><span className="kicker">Quick Presets</span></div>
      <p className="gagbuilds-preset-note">
        Training Points are earned at Toon Levels 4, 8, 12, 16, 20, 28, 38, 48, 58, 68, and 78 (11 TP), plus 1 bonus TP for maxing all four Department Levels — 12 TP total.
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
              const isPrs = build.prestiges.has(t.key);
              const largeIcon = t.key === 'toon-up' ? 'toon-up.png' : `${t.key}-large.png`;
              return (
                <div key={t.key} className="gagbuilds-sum-row" style={{ borderLeftColor: t.color }}>
                  <Image src={`/icons/gags/large/${largeIcon}`} alt={t.name} width={20} height={20} unoptimized />
                  <span style={{ color: t.labelColor }}>{t.name}</span>
                  {isPrs && (
                    <span className="gagbuilds-sum-pres">
                      <Image src="/icons/gags/PrestigeStar.webp" alt="★" width={11} height={11} unoptimized /> Prestige
                    </span>
                  )}
                  <span className="gagbuilds-sum-tp">{isPrs ? 3 : 2} TP</span>
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
