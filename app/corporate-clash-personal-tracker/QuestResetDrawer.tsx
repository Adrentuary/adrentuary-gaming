'use client';
import { useState } from 'react';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { TTC, BB, YOTT, DG, MML, TB, AA, DDL } from './data-quests-index';

const PLAYGROUNDS = [TTC, BB, YOTT, DG, MML, TB, AA, DDL];

type Target = ToonIndex | 'all';
interface ConfirmState { pg: string | 'ALL'; toon: Target }

export function QuestResetDrawer() {
  const { toonNames, resetToon, resetAll, resetSection } = useTracker();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const request = (pg: string | 'ALL', toon: Target) => {
    // If same button clicked again = confirmed
    if (confirm?.pg === pg && confirm?.toon === toon) {
      if (pg === 'ALL') {
        toon === 'all' ? resetAll() : resetToon(toon as ToonIndex);
      } else {
        resetSection(`q:${pg}:`, toon);
      }
      setConfirm(null);
    } else {
      setConfirm({ pg, toon });
    }
  };

  const cancel = () => setConfirm(null);

  const toonLabel = (t: Target) =>
    t === 'all' ? 'All Toons' : toonNames[t as ToonIndex];

  const toonColor = (t: Target): React.CSSProperties =>
    t === 'all' ? {} : { '--tc': TOON_COLORS[t as ToonIndex] } as React.CSSProperties;

  const isConfirming = (pg: string | 'ALL', t: Target) =>
    confirm?.pg === pg && confirm?.toon === t;

  return (
    <div className="quest-reset-drawer">
      <button
        className={`quest-reset-toggle${open ? ' quest-reset-toggle--open' : ''}`}
        onClick={() => { setOpen(o => !o); setConfirm(null); }}
        aria-expanded={open}
      >
        <span className="quest-reset-toggle-icon">⚠</span>
        Reset Quest Progress
        <span className="quest-reset-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="quest-reset-body">
          <p className="quest-reset-desc">
            Click a toon button once to <strong>arm</strong> it, then click again to <strong>confirm</strong> the reset. Click Cancel to abort.
          </p>

          {/* Per-playground rows */}
          {PLAYGROUNDS.map(pg => (
            <div key={pg.name} className="quest-reset-row">
              <span className="quest-reset-row-label">
                {pg.icon} {pg.name}
              </span>
              <div className="quest-reset-row-btns">
                {([0,1,2,3] as ToonIndex[]).map(t => {
                  const armed = isConfirming(pg.name, t);
                  return (
                    <button
                      key={t}
                      className={`reset-btn${armed ? ' reset-btn--armed' : ''}`}
                      style={toonColor(t)}
                      onClick={() => request(pg.name, t)}
                    >
                      {armed ? `Confirm reset ${toonNames[t]}?` : toonNames[t]}
                    </button>
                  );
                })}
                <button
                  className={`reset-btn reset-btn--all${isConfirming(pg.name, 'all') ? ' reset-btn--armed' : ''}`}
                  onClick={() => request(pg.name, 'all')}
                >
                  {isConfirming(pg.name, 'all') ? 'Confirm reset All?' : 'All Toons'}
                </button>
              </div>
            </div>
          ))}

          {/* Reset all playgrounds */}
          <div className="quest-reset-row quest-reset-row--all">
            <span className="quest-reset-row-label quest-reset-row-label--danger">
              ⚠ Reset ALL Playgrounds
            </span>
            <div className="quest-reset-row-btns">
              {([0,1,2,3] as ToonIndex[]).map(t => {
                const armed = isConfirming('ALL', t);
                return (
                  <button
                    key={t}
                    className={`reset-btn${armed ? ' reset-btn--armed' : ''}`}
                    style={toonColor(t)}
                    onClick={() => request('ALL', t)}
                  >
                    {armed ? `Confirm reset ${toonNames[t]}?` : toonNames[t]}
                  </button>
                );
              })}
              <button
                className={`reset-btn reset-btn--all${isConfirming('ALL', 'all') ? ' reset-btn--armed' : ''}`}
                onClick={() => request('ALL', 'all')}
              >
                {isConfirming('ALL', 'all') ? 'Confirm reset ALL?' : 'All Toons'}
              </button>
            </div>
          </div>

          {confirm && (
            <div className="quest-reset-confirm-bar">
              <span>
                Resetting <strong>{toonLabel(confirm.toon)}</strong>
                {confirm.pg === 'ALL' ? ' across ALL playgrounds' : ` in ${confirm.pg}`} — click the highlighted button again to confirm.
              </span>
              <button className="reset-btn reset-btn--cancel" onClick={cancel}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
