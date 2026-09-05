'use client';
import { useState } from 'react';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const CONFIRM_WORD = 'RESET';
type Target = ToonIndex | 'all';

// Each row in the drawer: label shown + the key prefixes to reset
const LAFF_RESET_ROWS: { label: string; prefixes: string[] }[] = [
  { label: 'Kudos',       prefixes: ['lb:Kudos Ranking:'] },
  { label: 'Activities',  prefixes: ['lb:Fishing:', 'lb:Golfing:', 'lb:Racing:', 'lb:Trolly:'] },
  { label: 'Promotions',  prefixes: ['lb:Sellbot Promotions:', 'lb:Cashbot Promotions:', 'lb:Lawbot Promotions:', 'lb:Bossbot Promotions:'] },
  { label: 'Directives',  prefixes: ['lb:Directives:'] },
];

interface ArmedState { label: string; prefixes: string[]; toon: Target }

export function LaffResetDrawer() {
  const { toonNames, resetSection } = useTracker();
  const [open,  setOpen]  = useState(false);
  const [armed, setArmed] = useState<ArmedState | null>(null);
  const [typed, setTyped] = useState('');
  const [done,  setDone]  = useState<string | null>(null);

  const arm = (label: string, prefixes: string[], toon: Target) => {
    setArmed({ label, prefixes, toon });
    setTyped('');
    setDone(null);
  };
  const cancel    = () => { setArmed(null); setTyped(''); };
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const execute = () => {
    if (!confirmed || !armed) return;
    const { label, prefixes, toon } = armed;
    const toonLabel = toon === 'all' ? 'All Toons' : toonNames[toon as ToonIndex];
    for (const prefix of prefixes) {
      resetSection(prefix, toon);
    }
    setDone(`Reset ${label} progress for ${toonLabel}.`);
    setArmed(null);
    setTyped('');
  };

  const toonColor = (t: Target): React.CSSProperties =>
    t === 'all' ? {} : { '--tc': TOON_COLORS[t as ToonIndex] } as React.CSSProperties;

  const isArmed = (label: string, t: Target) =>
    armed?.label === label && armed?.toon === t;

  return (
    <div className="quest-reset-drawer">
      <button
        className={`quest-reset-toggle${open ? ' quest-reset-toggle--open' : ''}`}
        onClick={() => { setOpen(o => !o); setArmed(null); setTyped(''); setDone(null); }}
        aria-expanded={open}
      >
        <span className="quest-reset-toggle-icon">⚠</span>
        Reset Laff Boost Progress
        <span className="quest-reset-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="quest-reset-body">
          <p className="quest-reset-desc">
            Select a section and toon to arm it, then type <strong>{CONFIRM_WORD}</strong> and click Reset to confirm.
          </p>

          {LAFF_RESET_ROWS.map(row => (
            <div key={row.label} className="quest-reset-row">
              <span className="quest-reset-row-label">{row.label}</span>
              <div className="quest-reset-row-btns">
                {([0, 1, 2, 3] as ToonIndex[]).map(t => (
                  <button
                    key={t}
                    className={`reset-btn${isArmed(row.label, t) ? ' reset-btn--armed' : ''}`}
                    style={toonColor(t)}
                    onClick={() => arm(row.label, row.prefixes, t)}
                  >{toonNames[t]}</button>
                ))}
                <button
                  className={`reset-btn reset-btn--all${isArmed(row.label, 'all') ? ' reset-btn--armed' : ''}`}
                  onClick={() => arm(row.label, row.prefixes, 'all')}
                >All Toons</button>
              </div>
            </div>
          ))}

          {armed && (
            <div className="acct-danger-confirm">
              <p className="acct-danger-confirm-msg">
                You are about to reset <strong>{armed.label}</strong> progress for{' '}
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
