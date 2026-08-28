'use client';
import { useState } from 'react';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

interface Props {
  /** If provided, only resets keys with this prefix (section reset). If omitted, resets everything. */
  prefix?: string;
  label?: string;
}

export function ResetPanel({ prefix, label }: Props) {
  const { toonNames, resetToon, resetAll, resetSection } = useTracker();
  const [confirming, setConfirming] = useState<ToonIndex | 'all' | null>(null);

  const handleClick = (toon: ToonIndex | 'all') => {
    if (confirming === toon) {
      // confirmed — execute
      if (prefix) {
        resetSection(prefix, toon);
      } else if (toon === 'all') {
        resetAll();
      } else {
        resetToon(toon);
      }
      setConfirming(null);
    } else {
      setConfirming(toon);
    }
  };

  const cancel = () => setConfirming(null);

  return (
    <div className="reset-panel">
      {label && <span className="reset-panel-label">{label}</span>}
      <div className="reset-panel-btns">
        {([0,1,2,3] as ToonIndex[]).map(t => (
          <button
            key={t}
            className={`reset-btn${confirming === t ? ' reset-btn--confirm' : ''}`}
            style={{'--tc': TOON_COLORS[t]} as React.CSSProperties}
            onClick={() => handleClick(t)}
            title={confirming === t ? `Confirm reset ${toonNames[t]}` : `Reset ${toonNames[t]}`}
          >
            {confirming === t ? `Reset ${toonNames[t]}?` : toonNames[t]}
          </button>
        ))}
        <button
          className={`reset-btn reset-btn--all${confirming === 'all' ? ' reset-btn--confirm' : ''}`}
          onClick={() => handleClick('all')}
          title={confirming === 'all' ? 'Confirm reset all toons' : 'Reset all toons'}
        >
          {confirming === 'all' ? 'Reset ALL?' : 'All Toons'}
        </button>
        {confirming !== null && (
          <button className="reset-btn reset-btn--cancel" onClick={cancel}>Cancel</button>
        )}
      </div>
    </div>
  );
}
