'use client';
import { useState } from 'react';
import { STREETS } from './data-streets';
import { GAG_TRACKS } from './data-gags';
import { TTC, BB, YOTT, DG, MML, TB, AA, DDL } from './data-quests-index';
import type { QuestPlayground } from './data-quests-types';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const QUESTS: QuestPlayground[] = [TTC, BB, YOTT, DG, MML, TB, AA, DDL];

export function SectionToons() {
  const { toonNames, setToonNames, isDone, commitToonName } = useTracker();
  const [editingToon, setEditingToon] = useState<number|null>(null);

  const getCount = (prefix: string, t: ToonIndex) => {
    if (prefix === 'q') {
      return QUESTS.flatMap(pg => pg.rows.filter(r => !r.isHeader && r.name).map(r => `q:${pg.name}:${r.name}`)).filter(k => isDone(k, t)).length;
    }
    if (prefix === 'g') {
      return GAG_TRACKS.flatMap(tr => tr.gags.map(g => `g:${tr.name}:${g}`)).filter(k => isDone(k, t)).length;
    }
    return STREETS.flatMap(d => d.streets.map(s => `st:${d.name}:${s.location}`)).filter(k => isDone(k, t)).length;
  };

  return (
    <div className="tracker-section">
      <p className="tracker-section-desc">Click a toon name to rename it. Progress is tracked across all sections.</p>
      <div className="toons-grid">
        {([0,1,2,3] as ToonIndex[]).map(t => (
          <div key={t} className="toon-card" style={{'--tc':TOON_COLORS[t]} as React.CSSProperties}>
            <div className="toon-card-header">
              <span className="toon-card-dot" />
              {editingToon === t
                ? <input autoFocus value={toonNames[t]}
                    onChange={e => { const n=[...toonNames]; n[t]=e.target.value; setToonNames(n); }}
                    onBlur={() => { commitToonName(t, toonNames); setEditingToon(null); }}
                    onKeyDown={e => e.key==='Enter' && (commitToonName(t, toonNames), setEditingToon(null))}
                    className="toon-name-input" maxLength={20} />
                : <button className="toon-name-btn" onClick={() => setEditingToon(t)}>{toonNames[t]} ✏️</button>
              }
            </div>
            <div className="toon-stats">
              <div className="toon-stat-row"><span>Quests completed</span><strong>{getCount('q', t)}</strong></div>
              <div className="toon-stat-row"><span>Gags unlocked</span><strong>{getCount('g', t)}</strong></div>
              <div className="toon-stat-row"><span>Streets visited</span><strong>{getCount('st', t)}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
