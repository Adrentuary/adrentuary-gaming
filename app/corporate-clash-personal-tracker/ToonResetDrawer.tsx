'use client';
import { useState } from 'react';
import { useTracker } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const CONFIRM_WORD = 'RESET';

interface Props { toon: ToonIndex; }

export function ToonResetDrawer({ toon }: Props) {
  const { toonNames, resetToon } = useTracker();
  const [open, setOpen]   = useState(false);
  const [typed, setTyped] = useState('');
  const [done, setDone]   = useState<string | null>(null);

  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const close  = () => { setOpen(false); setTyped(''); setDone(null); };
  const toggle = () => { if (open) close(); else { setOpen(true); setDone(null); } };

  const execute = () => {
    if (!confirmed) return;
    resetToon(toon);
    setDone(`Progress reset for ${toonNames[toon]}.`);
    setTyped('');
  };

  return (
    <div className="quest-reset-drawer toon-reset-drawer">
      <button
        className={`quest-reset-toggle${open ? ' quest-reset-toggle--open' : ''}`}
        onClick={toggle}
        aria-expanded={open}
      >
        <span className="quest-reset-toggle-icon">⚠</span>
        Reset {toonNames[toon]} Progress
        <span className="quest-reset-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="quest-reset-body">
          {done ? (
            <p className="acct-danger-done">{done}</p>
          ) : (
            <>
              <p className="quest-reset-desc">
                Type <strong style={{color:'#f87171'}}>{CONFIRM_WORD}</strong> and click Reset to permanently erase all progress for <strong>{toonNames[toon]}</strong>. This cannot be undone.
              </p>
              <div className="acct-danger-confirm-row">
                <input
                  className="acct-danger-input"
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && confirmed) execute(); if (e.key === 'Escape') close(); }}
                  placeholder={`Type ${CONFIRM_WORD} to confirm`}
                  autoFocus
                  spellCheck={false}
                />
                <button className="acct-danger-go-btn" onClick={execute} disabled={!confirmed}>Reset</button>
                <button className="acct-danger-cancel-btn" onClick={close}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
