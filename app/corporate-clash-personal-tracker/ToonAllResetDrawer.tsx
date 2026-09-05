'use client';
import React, { useState } from 'react';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const CONFIRM_WORD = 'RESET';
type Target = ToonIndex | 'all';

export function ToonAllResetDrawer() {
  const { toonNames, resetToon, resetAll } = useTracker();
  const [open, setOpen]     = useState(false);
  const [armed, setArmed]   = useState<Target | null>(null);
  const [typed, setTyped]   = useState('');
  const [done, setDone]     = useState<string | null>(null);

  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const closeDrawer = () => { setOpen(false); setArmed(null); setTyped(''); setDone(null); };
  const toggle      = () => { if (open) closeDrawer(); else setOpen(true); };
  const arm         = (t: Target) => { setArmed(t); setTyped(''); setDone(null); };
  const cancel      = () => { setArmed(null); setTyped(''); };

  const execute = () => {
    if (!confirmed || armed === null) return;
    const label = armed === 'all' ? 'All Toons' : toonNames[armed as ToonIndex];
    if (armed === 'all') resetAll();
    else resetToon(armed as ToonIndex);
    setDone(`Progress reset for ${label}.`);
    setArmed(null);
    setTyped('');
  };

  const toonColor = (t: Target): React.CSSProperties =>
    t === 'all' ? {} : { '--tc': TOON_COLORS[t as ToonIndex] } as React.CSSProperties;

  return (
    <div className="quest-reset-drawer">
      <button
        className={`quest-reset-toggle${open ? ' quest-reset-toggle--open' : ''}`}
        onClick={toggle}
        aria-expanded={open}
      >
        <span className="quest-reset-toggle-icon">⚠</span>
        Reset Toon Progress
        <span className="quest-reset-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="quest-reset-body">
          <p className="quest-reset-desc">
            Select a toon to reset, then type <strong style={{color:'#f87171'}}>{CONFIRM_WORD}</strong> and click Reset to confirm.
          </p>

          <div className="quest-reset-row quest-reset-row--all">
            <span className="quest-reset-row-label">Toon Progress</span>
            <div className="quest-reset-row-btns">
              {([0,1,2,3] as ToonIndex[]).map(t => (
                <button key={t}
                  className={`reset-btn${armed === t ? ' reset-btn--armed' : ''}`}
                  style={toonColor(t)}
                  onClick={() => arm(t)}
                >{toonNames[t]}</button>
              ))}
              <button
                className={`reset-btn reset-btn--all${armed === 'all' ? ' reset-btn--armed' : ''}`}
                onClick={() => arm('all')}
              >All Toons</button>
            </div>
          </div>

          {armed !== null && (
            <div className="acct-danger-confirm">
              <p className="acct-danger-confirm-msg">
                You are about to reset progress for{' '}
                <strong>{armed === 'all' ? 'ALL toons' : toonNames[armed as ToonIndex]}</strong>.{' '}
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
