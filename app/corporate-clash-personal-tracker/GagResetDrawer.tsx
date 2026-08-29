'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { GAG_TRACKS } from './data-gags';

const CONFIRM_WORD = 'RESET';

type Target = ToonIndex | 'all';
interface ArmedState { trackName: string | 'ALL'; toon: Target }

export function GagResetDrawer() {
  const { toonNames, resetToon, resetAll, resetSection } = useTracker();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState<ArmedState | null>(null);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState<string | null>(null);

  const arm = (trackName: string | 'ALL', toon: Target) => {
    setArmed({ trackName, toon });
    setTyped('');
    setDone(null);
  };

  const cancel = () => { setArmed(null); setTyped(''); };
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const execute = () => {
    if (!confirmed || !armed) return;
    const { trackName, toon } = armed;
    const label = toon === 'all' ? 'All Toons' : toonNames[toon as ToonIndex];
    if (trackName === 'ALL') {
      toon === 'all' ? resetAll() : resetToon(toon as ToonIndex);
      setDone(`Reset ${label} across all gag tracks.`);
    } else {
      resetSection(`g:${trackName}:`, toon);
      setDone(`Reset ${label} in ${trackName}.`);
    }
    setArmed(null);
    setTyped('');
  };

  const toonColor = (t: Target): React.CSSProperties =>
    t === 'all' ? {} : { '--tc': TOON_COLORS[t as ToonIndex] } as React.CSSProperties;

  const isArmed = (trackName: string | 'ALL', t: Target) =>
    armed?.trackName === trackName && armed?.toon === t;

  return (
    <div className="quest-reset-drawer">
      <button
        className={`quest-reset-toggle${open ? ' quest-reset-toggle--open' : ''}`}
        onClick={() => { setOpen(o => !o); setArmed(null); setTyped(''); setDone(null); }}
        aria-expanded={open}
      >
        <span className="quest-reset-toggle-icon">⚠</span>
        Reset Gag Progress
        <span className="quest-reset-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="quest-reset-body">
          <p className="quest-reset-desc">
            Select a toon button to arm it, then type <strong>{CONFIRM_WORD}</strong> and click Reset to confirm.
          </p>

          {GAG_TRACKS.map(track => (
            <div key={track.name} className="quest-reset-row">
              <span className="quest-reset-row-label">
                <Image
                  src={`/icons/gags/large/${track.largeIcon}`}
                  alt={track.name}
                  width={20}
                  height={20}
                  className="quest-reset-row-icon"
                />
                {track.name}
              </span>
              <div className="quest-reset-row-btns">
                {([0,1,2,3] as ToonIndex[]).map(t => (
                  <button key={t}
                    className={`reset-btn${isArmed(track.name, t) ? ' reset-btn--armed' : ''}`}
                    style={toonColor(t)}
                    onClick={() => arm(track.name, t)}
                  >{toonNames[t]}</button>
                ))}
                <button
                  className={`reset-btn reset-btn--all${isArmed(track.name, 'all') ? ' reset-btn--armed' : ''}`}
                  onClick={() => arm(track.name, 'all')}
                >All Toons</button>
              </div>
            </div>
          ))}

          <div className="quest-reset-row quest-reset-row--all">
            <span className="quest-reset-row-label quest-reset-row-label--danger">
              ⚠ Reset ALL Gag Tracks
            </span>
            <div className="quest-reset-row-btns">
              {([0,1,2,3] as ToonIndex[]).map(t => (
                <button key={t}
                  className={`reset-btn${isArmed('ALL', t) ? ' reset-btn--armed' : ''}`}
                  style={toonColor(t)}
                  onClick={() => arm('ALL', t)}
                >{toonNames[t]}</button>
              ))}
              <button
                className={`reset-btn reset-btn--all${isArmed('ALL', 'all') ? ' reset-btn--armed' : ''}`}
                onClick={() => arm('ALL', 'all')}
              >All Toons</button>
            </div>
          </div>

          {armed && (
            <div className="acct-danger-confirm">
              <p className="acct-danger-confirm-msg">
                You are about to reset{' '}
                <strong>{armed.toon === 'all' ? 'All Toons' : toonNames[armed.toon as ToonIndex]}</strong>
                {armed.trackName === 'ALL' ? ' across ALL gag tracks' : ` in ${armed.trackName}`}.{' '}
                Type <strong>{CONFIRM_WORD}</strong> below to confirm.
              </p>
              <div className="acct-danger-confirm-row">
                <input
                  className="acct-danger-input"
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && confirmed) execute(); if (e.key === 'Escape') cancel(); }}
                  placeholder={`Type ${CONFIRM_WORD} to confirm`}
                  autoFocus
                  spellCheck={false}
                />
                <button className="acct-danger-go-btn" onClick={execute} disabled={!confirmed}>Reset</button>
                <button className="acct-danger-cancel-btn" onClick={cancel}>Cancel</button>
              </div>
            </div>
          )}

          {done && <p className="acct-danger-done">{done}</p>}
        </div>
      )}
    </div>
  );
}
