'use client';
import { useState } from 'react';
import { TrackerProvider, useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const CONFIRM_WORD = 'RESET';

type ResetTarget = ToonIndex | 'all';

function AccountTrackerResetInner() {
  const { toonNames, resetToon, resetAll } = useTracker();
  const [armed, setArmed] = useState<ResetTarget | null>(null);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState<string | null>(null);

  const arm = (t: ResetTarget) => {
    setArmed(t);
    setTyped('');
    setDone(null);
  };

  const cancel = () => { setArmed(null); setTyped(''); };

  const execute = () => {
    if (typed.trim().toUpperCase() !== CONFIRM_WORD || armed === null) return;
    const label = armed === 'all' ? 'All toons' : toonNames[armed as ToonIndex];
    if (armed === 'all') resetAll();
    else resetToon(armed as ToonIndex);
    setDone(`Progress reset for ${label}.`);
    setArmed(null);
    setTyped('');
  };

  const toonColor = (t: ToonIndex) => ({ '--tc': TOON_COLORS[t] }) as React.CSSProperties;
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  return (
    <div className="acct-danger-zone">
      <div className="acct-danger-header">
        <span className="acct-danger-icon">⚠</span>
        <div>
          <strong className="acct-danger-title">Danger Zone</strong>
          <p className="acct-danger-desc">
            Permanently erases tracker progress for the selected toon. This cannot be undone.
          </p>
        </div>
      </div>

      <div className="acct-danger-toons">
        <span className="acct-danger-toon-label">Select toon to reset:</span>
        <div className="acct-danger-toon-btns">
          {([0,1,2,3] as ToonIndex[]).map(t => (
            <button
              key={t}
              className={`acct-reset-toon-btn${armed === t ? ' acct-reset-toon-btn--armed' : ''}`}
              style={toonColor(t)}
              onClick={() => arm(t)}
            >
              {toonNames[t]}
            </button>
          ))}
          <button
            className={`acct-reset-toon-btn acct-reset-toon-btn--all${armed === 'all' ? ' acct-reset-toon-btn--armed' : ''}`}
            onClick={() => arm('all')}
          >
            All Toons
          </button>
        </div>
      </div>

      {armed !== null && (
        <div className="acct-danger-confirm">
          <p className="acct-danger-confirm-msg">
            You are about to reset progress for{' '}
            <strong>{armed === 'all' ? 'ALL toons' : toonNames[armed as ToonIndex]}</strong>.
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
            <button
              className="acct-danger-go-btn"
              onClick={execute}
              disabled={!confirmed}
            >
              Reset
            </button>
            <button className="acct-danger-cancel-btn" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      {done && <p className="acct-danger-done">{done}</p>}
    </div>
  );
}

export function AccountTrackerReset() {
  return (
    <TrackerProvider>
      <AccountTrackerResetInner />
    </TrackerProvider>
  );
}

