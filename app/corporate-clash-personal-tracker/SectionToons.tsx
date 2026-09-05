'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { LAST_UPDATED } from './last-updated';
import { GAG_TRACKS } from './data-gags';
import { PROMOTIONS } from './data-promotions';
import { LEVELING_REWARDS, LAFF_BOOSTS } from './data-laff';
import { TTC, BB, YOTT, DG, MML, TB, AA, DDL } from './data-quests-index';
import type { QuestPlayground } from './data-quests-types';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { ToonAllResetDrawer } from './ToonAllResetDrawer';

const QUESTS: QuestPlayground[] = [TTC, BB, YOTT, DG, MML, TB, AA, DDL];

const PG_ICON: Record<string, string> = {
  'Toontown Central': '/icons/playground-emblems/TTC.png',
  'Barnacle Boatyard': '/icons/playground-emblems/BB.png',
  'Ye Olde Toontowne': '/icons/playground-emblems/YOTT.png',
  'Daffodil Gardens':  '/icons/playground-emblems/DG.png',
  'Mezzo Melodyland':  '/icons/playground-emblems/MML.png',
  'The Brrrgh':        '/icons/playground-emblems/TB.png',
  'Acorn Acres':       '/icons/playground-emblems/AA.png',
  'Drowsy Dreamland':  '/icons/playground-emblems/DDL.png',
};

const LAFF_TOTALS: Record<string, number> = {
  'Kudos Ranking':8,'Fishing':7,'Trolly':3,'Racing':3,'Golfing':3,
  'Sellbot Promotions':6,'Cashbot Promotions':6,'Lawbot Promotions':6,'Bossbot Promotions':6,
  'Directives':3,
};

// Per-playground quest counts by section type
function getQuestBreakdown(pg: QuestPlayground) {
  const mainRows = pg.rows.filter(r => !r.isHeader && r.sectionType === 'main');
  const sideRows = pg.rows.filter(r => !r.isHeader && r.sectionType === 'side');
  const kudosRows = pg.rows.filter(r => !r.isHeader && (r.sectionType === 'kudos-low' || r.sectionType === 'kudos-high'));
  return { mainRows, sideRows, kudosRows };
}

const TOON_COLLAPSE_KEY = 'toons-cards';

export function SectionToons() {
  const { toonNames, setToonNames, isDone, commitToonName, collapsedUI, setCollapsedUI } = useTracker();
  const [editingToon, setEditingToon] = useState<number|null>(null);

  const closedToons = new Set<string>(collapsedUI[TOON_COLLAPSE_KEY] ?? []);
  const isToonOpen  = (t: ToonIndex) => !closedToons.has(String(t));
  const toggleToon  = (t: ToonIndex) => {
    setCollapsedUI(prev => {
      const cur = new Set<string>(prev[TOON_COLLAPSE_KEY] ?? []);
      cur.has(String(t)) ? cur.delete(String(t)) : cur.add(String(t));
      return { ...prev, [TOON_COLLAPSE_KEY]: [...cur] };
    });
  };

  const getHighestGag = (trackName: string, gags: string[], t: ToonIndex): string => {
    let hi = -1;
    gags.forEach((g,i) => { if (isDone(`g:${trackName}:${g}:max`, t) || isDone(`g:${trackName}:${g}:min`, t)) hi = i; });
    return hi >= 0 ? gags[hi] : '—';
  };

  const isGagTrackComplete = (trackName: string, gags: string[], t: ToonIndex): boolean =>
    gags.every(g => isDone(`g:${trackName}:${g}:max`, t));

  const getHighestPromo = (suitName: string, t: ToonIndex): { cog: string; level: number } | null => {
    const suit = PROMOTIONS.find(s => s.name === suitName);
    if (!suit) return null;
    let hiLv = -1, hiCog = '';
    suit.cogs.forEach(cog => cog.levels.forEach(lv => {
      if (isDone(`p:${suitName}:${cog.name}:${lv.level}`, t)) { hiLv = lv.level; hiCog = cog.name; }
    }));
    return hiLv >= 0 ? { cog: hiCog, level: hiLv } : null;
  };

  const getHighestLevel = (t: ToonIndex): string => {
    let hi = -1;
    LEVELING_REWARDS.forEach(row => { if (isDone(`lv:${row.level}`, t)) hi = row.level; });
    return hi >= 0 ? `Lvl ${hi}` : '—';
  };

  const getLaffCount = (section: string, t: ToonIndex): number =>
    LAFF_BOOSTS.filter(e => !e.isHeader && e.section === section)
      .filter(e => {
        if (e.isHeader) return false;
        const key = e.section === 'Kudos Ranking'
          ? `lb:${e.section}:${e.note}:${e.source}:${e.playground}`
          : `lb:${e.section}:${e.note}:${e.source}`;
        return isDone(key, t);
      }).length;

  const getQuestSectionDone = (pg: QuestPlayground, type: 'main' | 'side' | 'kudos', t: ToonIndex) => {
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
        status="Everything in this section is currently up to date."
        lastUpdated={LAST_UPDATED.toons}
        lastChanges="Playground emblem icons added to toon stat cards. Small gag icons added to gag track progress display."
      />
      <ToonAllResetDrawer />
      <div className="toons-list">
        {([0,1,2,3] as ToonIndex[]).map(t => (
          <div key={t} className="toon-card" style={{'--tc':TOON_COLORS[t]} as React.CSSProperties}>
            <button className="toon-card-header toon-card-header-btn" onClick={() => toggleToon(t)}>
              <span className="toon-card-dot" />
              {editingToon === t
                ? <input autoFocus value={toonNames[t]}
                    onChange={e => { const n=[...toonNames]; n[t]=e.target.value; setToonNames(n); }}
                    onBlur={e => { e.stopPropagation(); commitToonName(t, toonNames); setEditingToon(null); }}
                    onKeyDown={e => { e.stopPropagation(); if(e.key==='Enter'){commitToonName(t,toonNames);setEditingToon(null);} }}
                    onClick={e => e.stopPropagation()}
                    className="toon-name-input" maxLength={20} />
                : <span className="toon-name-btn" onClick={e => { e.stopPropagation(); setEditingToon(t); }}>{toonNames[t]} {'\u270f\ufe0f'}</span>
              }
              <span className="toon-collapse-chevron">{isToonOpen(t) ? '▼' : '▶'}</span>
            </button>
            {isToonOpen(t) && (
            <div className="toon-body-3col">
              {/* ── Left: Leveling + Quest Progress ── */}
              <div className="toon-col-left">
                <div className="toon-stat-section-label">Leveling</div>
                <div className="toon-level-row"><span>Character Level</span><strong>{getHighestLevel(t)}</strong></div>
                <div className="toon-stat-section-label" style={{marginTop:'10px'}}>Quest Progress</div>
                {QUESTS.map(pg => {
                  const { mainRows, sideRows, kudosRows } = getQuestBreakdown(pg);
                  const main  = getQuestSectionDone(pg, 'main', t);
                  const side  = getQuestSectionDone(pg, 'side', t);
                  const kudos = getQuestSectionDone(pg, 'kudos', t);
                  const allDone = main.done===main.total && side.done===side.total && kudos.done===kudos.total && main.total>0;
                  void mainRows; void sideRows; void kudosRows;
                  return (
                    <div key={pg.name} className={`toon-pg-quest-row${allDone?' toon-pg-quest-done':''}`}>
                      <Image src={PG_ICON[pg.name]??`/icons/playground-emblems/${pg.pgKey}.png`} alt={pg.name} width={18} height={18} className="toon-pg-icon" unoptimized />
                      <div className="toon-pg-quest-detail">
                        <span className="toon-pg-name">{pg.name}</span>
                        {allDone
                          ? <span className="toon-q-all-done">{'✔'} Completed</span>
                          : <div className="toon-pg-quest-subs">
                              {main.total>0  && <span className={main.done===main.total  ?'toon-q-done':''}>Main {main.done}/{main.total}</span>}
                              {side.total>0  && <><span className="toon-q-pipe">|</span><span className={side.done===side.total  ?'toon-q-done':''}>Side {side.done}/{side.total}</span></>}
                              {kudos.total>0 && <><span className="toon-q-pipe">|</span><span className={kudos.done===kudos.total ?'toon-q-done':''}>Kudos {kudos.done}/{kudos.total}</span></>}
                            </div>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="toon-col-mid">
                <div className="toon-stat-section-label">Highest Gag Unlocked</div>
                <div className="toon-gag-grid">
                  {GAG_TRACKS.map(tr => {
                    const complete = isGagTrackComplete(tr.name, tr.gags, t);
                    const highGag  = getHighestGag(tr.name, tr.gags, t);
                    const imgGag   = complete ? tr.gags[tr.gags.length-1] : highGag !== '—' ? highGag : tr.gags[0];
                    return (
                      <div key={tr.name} className={`toon-gag-cell${complete?' toon-gag-complete':''}`} style={{'--gcolor':tr.color} as React.CSSProperties}>
                        <Image src={`/icons/gags/small/${tr.trackKey}/${imgGag}.png`} alt={tr.name} width={24} height={24} className="toon-gag-icon" unoptimized />
                        <div className="toon-gag-cell-text">
                          <span className="toon-gag-track">{tr.name}</span>
                          <span className="toon-gag-val">{complete ? <>{'✔'} Completed</> : highGag}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="toon-stat-section-label" style={{marginTop:'10px'}}>Highest Cog Promotion</div>
                <div className="toon-promo-grid">
                  {PROMOTIONS.map(suit => {
                    const promo = getHighestPromo(suit.name, t);
                    const cogIcon = promo ? suit.cogs.find(c => c.name === promo.cog)?.icon : undefined;
                    return (
                      <div key={suit.name} className="toon-promo-cell" style={{'--pcolor':suit.accent} as React.CSSProperties}>
                        <div className="toon-promo-text">
                          <span className="toon-promo-suit">{suit.name}</span>
                          {promo
                            ? <><span className="toon-promo-val">{promo.cog}</span><span className="toon-promo-sublevel">Lvl {promo.level}</span></>
                            : <span className="toon-promo-val">{'—'}</span>}
                        </div>
                        {cogIcon && (
                          <Image src={cogIcon} alt={promo!.cog} width={36} height={36} className="toon-promo-icon" unoptimized />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="toon-col-right">
                <div className="toon-stat-section-label">Laff Boosts</div>
                <div className="toon-laff-grid">
                  <div className="toon-laff-group-label">Kudos</div>
                  {(()=>{const c=getLaffCount('Kudos Ranking',t),tot=LAFF_TOTALS['Kudos Ranking'];return(
                    <div className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>Kudos Ranking</span><span>{c===tot?<>{'✔'} Completed</>:`${c}/${tot}`}</span></div>
                  );})()}
                  <div className="toon-laff-group-label">Activities</div>
                  {(['Fishing','Trolly','Racing','Golfing'] as const).map(sec=>{
                    const c=getLaffCount(sec,t),tot=LAFF_TOTALS[sec];
                    return <div key={sec} className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>{sec}</span><span>{c===tot?<>{'✔'} Completed</>:`${c}/${tot}`}</span></div>;
                  })}
                  <div className="toon-laff-group-label">Promotions</div>
                  {(['Sellbot Promotions','Cashbot Promotions','Lawbot Promotions','Bossbot Promotions'] as const).map(sec=>{
                    const c=getLaffCount(sec,t),tot=LAFF_TOTALS[sec];
                    return <div key={sec} className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>{sec.replace(' Promotions','')}</span><span>{c===tot?<>{'✔'} Completed</>:`${c}/${tot}`}</span></div>;
                  })}
                  <div className="toon-laff-group-label">Directives</div>
                  {(()=>{const c=getLaffCount('Directives',t),tot=LAFF_TOTALS['Directives'];return(
                    <div className={`toon-laff-row${c===tot?' toon-laff-done':''}`}><span>Directives</span><span>{c===tot?<>{'✔'} Completed</>:`${c}/${tot}`}</span></div>
                  );})()}
                </div>
              </div>
            </div>)}{/* end toon-body-3col */}
          </div>
        ))}
      </div>
    </div>
  );
}
