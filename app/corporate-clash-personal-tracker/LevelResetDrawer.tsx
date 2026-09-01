'use client';
import { useState } from 'react';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const CONFIRM_WORD = 'RESET';
type Target = ToonIndex | 'all';
interface ArmedState { toon: Target }

export function LevelResetDrawer() {
  const { toonNames, resetToon, resetAll, resetSection } = useTracker();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState<ArmedState | null>(null);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState<string | null>(null);

  const arm = (toon: Target) => { setArmed({ toon }); setTyped(''); setDone(null); };
  const cancel = () => { setArmed(null); setTyped(''); };
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const execute = () => {
    if (!confirmed || !armed) return;
    const { toon } = armed;
    const label = toon === 'all' ? 'All Toons' : toonNames[toon as ToonIndex];
    if (toon === 'all') {
      resetSection('lv:', 'all');
      setDone(`Reset leveling progress for all toons.`);
    } else {
      resetSection('lv:', toon as ToonIndex);
      setDone(`Reset leveling progress for ${label}.`);
    }
    setArmed(null);
    setTyped('');
  };

  const toonColor = (t: Target): React.CSSProperties =>
    t === 'all' ? {} : { '--tc': TOON_COLORS[t as ToonIndex] } as React.CSSProperties;

  const isArmed = (t: Target) => armed?.toon === t;

  return (
    <div className="quest-reset-drawer">
      <button
        className={`quest-reset-toggle${open ? ' quest-reset-toggle--open' : ''}`}
        onClick={() => { setOpen(o => !o); setArmed(null); setTyped(''); setDone(null); }}
        aria-expanded={open}
      >
        <span className="quest-reset-toggle-icon">⚠</span>
        Reset Leveling Progress
        <span className="quest-reset-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="quest-reset-body">
          <p className="quest-reset-desc">
            Select a toon to reset, then type <strong>{CONFIRM_WORD}</strong> and click Reset to confirm.
          </p>

          <div className="quest-reset-row quest-reset-row--all">
            <span className="quest-reset-row-label">Leveling Progress</span>
            <div className="quest-reset-row-btns">
              {([0,1,2,3] as ToonIndex[]).map(t => (
                <button key={t}
                  className={`reset-btn${isArmed(t) ? ' reset-btn--armed' : ''}`}
                  style={toonColor(t)}
                  onClick={() => arm(t)}
                >{toonNames[t]}</button>
              ))}
              <button
                className={`reset-btn reset-btn--all${isArmed('all') ? ' reset-btn--armed' : ''}`}
                onClick={() => arm('all')}
              >All Toons</button>
            </div>
          </div>

          {armed && (
            <div className="acct-danger-confirm">
              <p className="acct-danger-confirm-msg">
                You are about to reset leveling progress for{' '}
                <strong>{armed.toon === 'all' ? 'All Toons' : toonNames[armed.toon as ToonIndex]}</strong>.{' '}
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
