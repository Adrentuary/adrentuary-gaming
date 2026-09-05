'use client';
import React, { useState } from 'react';
import { useTracker } from './TrackerContext';

const CONFIRM_WORD = 'RESET';

export function ToonAllResetDrawer() {
  const { resetAll } = useTracker();
  const [open, setOpen]   = useState(false);
  const [armed, setArmed] = useState(false);
  const [typed, setTyped] = useState('');
  const [done, setDone]   = useState<string | null>(null);

  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const closeDrawer = () => { setOpen(false); setArmed(false); setTyped(''); setDone(null); };
  const toggle      = () => { if (open) closeDrawer(); else setOpen(true); };
  const arm         = () => { setArmed(true); setTyped(''); setDone(null); };
  const cancel      = () => { setArmed(false); setTyped(''); };

  const execute = () => {
    if (!confirmed) return;
    resetAll();
    setDone('Progress reset for all toons.');
    setArmed(false);
    setTyped('');
  };

  return (
    <div className="quest-reset-drawer">
      <button
        className={`quest-reset-toggle quest-reset-toggle--danger${open ? ' quest-reset-toggle--open' : ''}`}
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
            Type <strong>{CONFIRM_WORD}</strong> and click Reset to permanently erase all progress for <strong>all toons</strong>. This cannot be undone.
          </p>

          <div className="quest-reset-row quest-reset-row--all">
            <span className="quest-reset-row-label quest-reset-row-label--danger">All Toon Progress</span>
            <div className="quest-reset-row-btns">
              <button
                className={`reset-btn reset-btn--all${armed ? ' reset-btn--armed' : ''}`}
                onClick={arm}
              >All Toons</button>
            </div>
          </div>

          {armed && (
            <div className="acct-danger-confirm">
              <p className="acct-danger-confirm-msg">
                You are about to reset progress for <strong>ALL toons</strong>.{' '}
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
