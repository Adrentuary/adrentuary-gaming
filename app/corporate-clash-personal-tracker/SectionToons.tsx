'use client';
import { useState } from 'react';
import { SectionNote } from './SectionNote';
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

// Per-playground quest counts by section type
function getQuestBreakdown(pg: QuestPlayground) {
  const mainRows = pg.rows.filter(r => !r.isHeader && r.sectionType === 'main');
  const sideRows = pg.rows.filter(r => !r.isHeader && r.sectionType === 'side');
  const kudosRows = pg.rows.filter(r => !r.isHeader && (r.sectionType === 'kudos-low' || r.sectionType === 'kudos-high'));
  return { mainRows, sideRows, kudosRows };
}

export function SectionToons() {
  const { toonNames, setToonNames, isDone, commitToonName } = useTracker();
  const [editingToon, setEditingToon] = useState<number|null>(null);

  const getHighestGag = (trackName: string, gags: string[], t: ToonIndex): string => {
    let hi = -1;
    gags.forEach((g,i) => { if (isDone(`g:${trackName}:${g}:max`, t) || isDone(`g:${trackName}:${g}:min`, t)) hi = i; });
    return hi >= 0 ? gags[hi] : '—';
  };

  const isGagTrackComplete = (trackName: string, gags: string[], t: ToonIndex): boolean =>
    gags.every(g => isDone(`g:${trackName}:${g}:max`, t));

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

  const getQuestSectionDone = (pg: QuestPlayground, type: 'main'|'side'|'kudos', t: ToonIndex) => {
    const rows = pg.rows.filter(r => {
      if (r.isHeader) return false;
      if (type === 'kudos') return r.sectionType === 'kudos-low' || r.sectionType === 'kudos-high';
      return r.sectionType === type;
    });
    return { done: rows.filter(r => isDone(`q:${pg.name}:${r.name}`, t)).length, total: rows.length };
  };

  return (
    <div className="tracker-section">
      <SectionNote
        description="A per-toon overview of your progress across all sections. Shows quest completion by playground, gag track progress, promotion levels, leveling milestones, and laff boosts. Click a toon name to rename it."
        lastUpdated="September 9th, 2026 4:21 PM"
      />
      <div className="toons-grid-2x2">
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
            <div className="toon-body-grid">
              <div className="toon-quest-panel">
                <div className="toon-stat-section-label">Quest Progress</div>
                {QUESTS.map(pg => {
                  const main=getQuestSectionDone(pg,'main',t),side=getQuestSectionDone(pg,'side',t),kudos=getQuestSectionDone(pg,'kudos',t);
                  const allDone=main.done===main.total&&side.done===side.total&&kudos.done===kudos.total&&main.total>0;
                  return (
                    <div key={pg.name} className={`toon-pg-quest-row${allDone?' toon-pg-quest-done':''}`}>
                      <span className="toon-pg-icon">{pg.icon}</span>
                      <div className="toon-pg-quest-detail">
                        <span className="toon-pg-name">{pg.name}</span>
                        {allDone
                          ? <span className="toon-q-all-done">✔ Completed</span>
                          : <div className="toon-pg-quest-subs">
                              {main.total>0&&<span className={main.done===main.total?'toon-q-done':''}>Main {main.done}/{main.total}</span>}
                              {side.total>0&&<span className={side.done===side.total?'toon-q-done':''}>Side {side.done}/{side.total}</span>}
                              {kudos.total>0&&<span className={kudos.done===kudos.total?'toon-q-done':''}>Kudos {kudos.done}/{kudos.total}</span>}
                            </div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="toon-stats-panel">
                <div className="toon-stat-row"><span>Character Level</span><strong>{getHighestLevel(t)}</strong></div>
                <div className="toon-stat-section-label">Highest Gag Unlocked</div>
                <div className="toon-gag-grid">
                  {GAG_TRACKS.map(tr => {
                    const complete=isGagTrackComplete(tr.name,tr.gags,t);
                    return <div key={tr.name} className={`toon-gag-cell${complete?' toon-gag-complete':''}`} style={{'--gcolor':tr.color} as React.CSSProperties}>
                      <span className="toon-gag-track">{tr.name}</span>
                      <span className="toon-gag-val">{complete?'✔ Completed':getHighestGag(tr.name,tr.gags,t)}</span>
                    </div>;
                  })}
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
                <div className="toon-stat-section-label">Laff Boosts</div>
                <div className="toon-laff-grid">
                  <div className="toon-laff-group-label">Kudos</div>
                  {(()=>{const c=getLaffCount('Kudos Ranking',t),tot=LAFF_TOTALS['Kudos Ranking'];return(
                    <div className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>Kudos Ranking</span><span>{c===tot?'✔ Completed':`${c}/${tot}`}</span></div>
                  );})()}
                  <div className="toon-laff-group-label">Activities</div>
                  {(['Fishing','Trolly','Racing','Golfing'] as const).map(sec=>{
                    const c=getLaffCount(sec,t),tot=LAFF_TOTALS[sec];
                    return <div key={sec} className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>{sec}</span><span>{c===tot?'✔ Completed':`${c}/${tot}`}</span></div>;
                  })}
                  <div className="toon-laff-group-label">Promotions</div>
                  {(['Sellbot Promotions','Cashbot Promotions','Lowbot Promotions','Bossbot Promotions'] as const).map(sec=>{
                    const c=getLaffCount(sec,t),tot=LAFF_TOTALS[sec];
                    return <div key={sec} className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>{sec.replace(' Promotions','')}</span><span>{c===tot?'✔ Completed':`${c}/${tot}`}</span></div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
