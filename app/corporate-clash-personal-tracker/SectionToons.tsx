'use client';
import { useState } from 'react';
import { GAG_TRACKS } from './data-gags';
import { PROMOTIONS } from './data-promotions';
import { LEVELING_REWARDS, LAFF_BOOSTS } from './data-laff';
import { TTC, BB, YOTT, DG, MML, TB, AA, DDL } from './data-quests-index';
import type { QuestPlayground } from './data-quests-types';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const QUESTS: QuestPlayground[] = [TTC, BB, YOTT, DG, MML, TB, AA, DDL];
const LAFF_TOTALS: Record<string, number> = {
  'Kudos Ranking':8,'Fishing':7,'Trolly':3,'Racing':3,'Golfing':3,
  'Sellbot Promotions':6,'Cashbot Promotions':6,'Lowbot Promotions':9,'Bossbot Promotions':6,
};

export function SectionToons() {
  const { toonNames, setToonNames, isDone, commitToonName } = useTracker();
  const [editingToon, setEditingToon] = useState<number|null>(null);

  const getQuestCount = (t: ToonIndex) =>
    QUESTS.flatMap(pg => pg.rows.filter(r => !r.isHeader && r.name).map(r => `q:${pg.name}:${r.name}`))
      .filter(k => isDone(k, t)).length;

  const getHighestGag = (trackName: string, gags: string[], t: ToonIndex): string => {
    let hi = -1;
    gags.forEach((g,i) => { if (isDone(`g:${trackName}:${g}`, t)) hi = i; });
    return hi >= 0 ? gags[hi] : '—';
  };

  const getHighestPromo = (suitName: string, t: ToonIndex): string => {
    const suit = PROMOTIONS.find(s => s.name === suitName);
    if (!suit) return '—';
    let hiLv = -1;
    suit.cogs.forEach(cog => cog.levels.forEach(lv => {
      if (isDone(`p:${suitName}:${cog.name}:${lv.level}`, t)) hiLv = lv.level;
    }));
    return hiLv >= 0 ? `Lvl ${hiLv}` : '—';
  };

  const getHighestLevel = (t: ToonIndex): string => {
    let hi = -1;
    LEVELING_REWARDS.forEach(row => { if (isDone(`lv:${row.level}`, t)) hi = row.level; });
    return hi >= 0 ? `Lvl ${hi}` : '—';
  };

  const getLaffCount = (section: string, t: ToonIndex): number =>
    LAFF_BOOSTS.filter(e => !e.isHeader && e.section === section)
      .filter(e => isDone(`lb:${e.section}:${(e as {note:string}).note}:${(e as {source:string}).source}`, t)).length;

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
                    onKeyDown={e => { e.stopPropagation(); if(e.key==='Enter'){commitToonName(t,toonNames);setEditingToon(null);} }}
                    className="toon-name-input" maxLength={20} />
                : <button className="toon-name-btn" onClick={() => setEditingToon(t)}>{toonNames[t]} ✏️</button>
              }
            </div>
            <div className="toon-stats">
              <div className="toon-stat-row"><span>Quests completed</span><strong>{getQuestCount(t)}</strong></div>
              <div className="toon-stat-section-label">Highest Gag Unlocked</div>
              <div className="toon-gag-grid">
                {GAG_TRACKS.map(tr => (
                  <div key={tr.name} className="toon-gag-cell" style={{'--gcolor':tr.color} as React.CSSProperties}>
                    <span className="toon-gag-track">{tr.name}</span>
                    <span className="toon-gag-val">{getHighestGag(tr.name, tr.gags, t)}</span>
                  </div>
                ))}
              </div>
              <div className="toon-stat-section-label">Highest Promotion</div>
              <div className="toon-promo-grid">
                {PROMOTIONS.map(suit => (
                  <div key={suit.name} className="toon-promo-cell" style={{'--pcolor':suit.accent} as React.CSSProperties}>
                    <span className="toon-promo-suit">{suit.name}</span>
                    <span className="toon-promo-val">{getHighestPromo(suit.name, t)}</span>
                  </div>
                ))}
              </div>
              <div className="toon-stat-row"><span>Highest level reached</span><strong>{getHighestLevel(t)}</strong></div>
              <div className="toon-stat-section-label">Laff Boosts</div>
              <div className="toon-laff-grid">
                <div className="toon-laff-group-label">Kudos</div>
                {(()=>{ const c=getLaffCount('Kudos Ranking',t),tot=LAFF_TOTALS['Kudos Ranking']; return (
                  <div className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>Kudos Ranking</span><span>{c===tot?'✔ COMPLETED':`${c}/${tot}`}</span></div>
                ); })()}
                <div className="toon-laff-group-label">Activities</div>
                {(['Fishing','Trolly','Racing','Golfing'] as const).map(sec => {
                  const c=getLaffCount(sec,t),tot=LAFF_TOTALS[sec];
                  return <div key={sec} className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>{sec}</span><span>{c===tot?'✔ COMPLETED':`${c}/${tot}`}</span></div>;
                })}
                <div className="toon-laff-group-label">Promotions</div>
                {(['Sellbot Promotions','Cashbot Promotions','Lowbot Promotions','Bossbot Promotions'] as const).map(sec => {
                  const c=getLaffCount(sec,t),tot=LAFF_TOTALS[sec];
                  return <div key={sec} className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>{sec.replace(' Promotions','')}</span><span>{c===tot?'✔ COMPLETED':`${c}/${tot}`}</span></div>;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
