'use client';
import React, { useCallback } from 'react';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { LAFF_BOOSTS } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';
import { LaffResetDrawer } from './LaffResetDrawer';

// ── Constants ──────────────────────────────────────────────────────────────
const PG_ICON_MAP: Record<string, string> = {
  'Toontown Central': '/icons/playground-emblems/TTC.png',
  'Barnacle Boatyard': '/icons/playground-emblems/BB.png',
  'Ye Olde Toontowne': '/icons/playground-emblems/YOTT.png',
  'Daffodil Gardens':  '/icons/playground-emblems/DG.png',
  'Mezzo Melodyland':  '/icons/playground-emblems/MML.png',
  'The Brrrgh':        '/icons/playground-emblems/TB.png',
  'Acorn Acres':       '/icons/playground-emblems/AA.png',
  'Drowsy Dreamland':  '/icons/playground-emblems/DDL.png',
};

const LAFF_DA  = '#5ab0e0';
const LAFF_DC  = '#1a2a3a';

const ACTIVITY_SECTIONS = ['Fishing', 'Golfing', 'Racing', 'Trolly'];
const PROMO_SECTIONS    = ['Sellbot Promotions', 'Cashbot Promotions', 'Lawbot Promotions', 'Bossbot Promotions'];

const LAFF_COLLAPSED_KEY = 'laff';
const ACT_KEY            = 'laff-act';
const PROMO_KEY          = 'laff-promo';

// Keys for each progressive section (pre-computed for progressive click logic)
function sectionKeys(section: string): string[] {
  return LAFF_BOOSTS
    .filter(e => !e.isHeader && e.section === section)
    .map(e => {
      if (e.isHeader) return '';
      return `lb:${e.section}:${e.note}:${e.source}`;
    });
}

export function SectionLaff() {
  const { toonNames, progress, toggle, toggleAll, isAllDone, setProgressBatch, collapsedUI, setCollapsedUI } = useTracker();

  // ── Top-level collapse (each group = its own card, stored as closed set) ──
  const closedGroups = new Set<string>(collapsedUI[LAFF_COLLAPSED_KEY] ?? []);
  const isOpen = (g: string) => !closedGroups.has(g);
  const toggleGroup = (g: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[LAFF_COLLAPSED_KEY] ?? []);
      current.has(g) ? current.delete(g) : current.add(g);
      return { ...prev, [LAFF_COLLAPSED_KEY]: [...current] };
    });
  };

  // ── Activity sub-collapses ─────────────────────────────────────────────────
  const closedActs = new Set<string>(collapsedUI[ACT_KEY] ?? []);
  const isActOpen  = (s: string) => !closedActs.has(s);
  const toggleAct  = (s: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[ACT_KEY] ?? []);
      current.has(s) ? current.delete(s) : current.add(s);
      return { ...prev, [ACT_KEY]: [...current] };
    });
  };

  // ── Promotions sub-collapses ────────────────────────────────────────────────
  const closedPromos = new Set<string>(collapsedUI[PROMO_KEY] ?? []);
  const isPromoOpen  = (s: string) => !closedPromos.has(s);
  const togglePromo  = (s: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[PROMO_KEY] ?? []);
      current.has(s) ? current.delete(s) : current.add(s);
      return { ...prev, [PROMO_KEY]: [...current] };
    });
  };

  // ── Progressive click handler (Activities / Promotions / Directives) ──────
  const handleProgClick = useCallback((key: string, toon: ToonIndex, section: string) => {
    const keys = sectionKeys(section);
    const idx  = keys.indexOf(key);
    if (idx === -1) { toggle(key, toon); return; }
    const done = !!(progress[key]?.[toon]);
    if (!done) {
      setProgressBatch(keys.slice(0, idx + 1).map(k => ({ key: k, toon })), []);
    } else {
      setProgressBatch([], keys.slice(idx).map(k => ({ key: k, toon })));
    }
  }, [progress, toggle, setProgressBatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProgAll = useCallback((key: string, section: string) => {
    const keys    = sectionKeys(section);
    const idx     = keys.indexOf(key);
    const toons   = [0, 1, 2, 3] as ToonIndex[];
    const allDone = isAllDone(key);
    if (idx === -1) { toggleAll(key); return; }
    if (!allDone) {
      setProgressBatch(keys.slice(0, idx + 1).flatMap(k => toons.map(t => ({ key: k, toon: t }))), []);
    } else {
      setProgressBatch([], keys.slice(idx).flatMap(k => toons.map(t => ({ key: k, toon: t }))));
    }
  }, [progress, toggleAll, isAllDone, setProgressBatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const colCount      = 2 + toonNames.length + 1; // milestone + +Laff + toons + All
  const kudosColCount = 3 + toonNames.length + 1; // playground + source + +Laff + toons + All


  // ── Shared table header ────────────────────────────────────────────────────
  const thead = (milestoneLabel: string, sourceLabel?: string) => (
    <thead><tr>
      <th className="col-main">{milestoneLabel}</th>
      {sourceLabel && <th className="col-main">{sourceLabel}</th>}
      <th className="col-sm" style={{textAlign:'center'}}>+Laff</th>
      {toonNames.map((n,i) => <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>)}
      <th className="col-all">All</th>
    </tr></thead>
  );

  // ── Kudos rows — individual (Sidetask-style), per-row per-toon independent ─
  const kudosRows = LAFF_BOOSTS
    .filter(e => !e.isHeader && e.section === 'Kudos Ranking')
    .map((entry, ri) => {
      if (entry.isHeader) return null;
      const key     = `lb:${entry.section}:${entry.note}:${entry.source}:${entry.playground}`;
      const allDone = isAllDone(key);
      const pgImg   = entry.playground ? PG_ICON_MAP[entry.playground] : null;
      return (
        <tr key={`kudos-${ri}`} className={allDone ? 'row-all-done' : ''}>
          <td className="col-main">
            <span className="laff-pg-cell">
              {pgImg && (
                <span className="coll-section-icon-wrap laff-pg-icon-wrap">
                  <Image src={pgImg} alt={entry.playground!} width={24} height={24} className="laff-pg-icon" unoptimized />
                </span>
              )}
              <span>{entry.playground}</span>
            </span>
          </td>
          <td className="col-main" style={{color:'var(--muted)',fontSize:'12px'}}>{entry.source}</td>
          <td className="col-sm" style={{textAlign:'center'}}>+{entry.laff}</td>
          {([0,1,2,3] as ToonIndex[]).map(t => (
            <td key={t} className="col-toon"><CheckBtn id={key} toon={t} label={`${toonNames[t]}: Kudos ${entry.playground}`} /></td>
          ))}
          <td className="col-all">
            <button className={`all-btn${allDone?' all-btn--done':''}`} onClick={() => toggleAll(key)} title={allDone?'Unmark all':'Mark all toons'}>{allDone?'★':'☆'}</button>
          </td>
        </tr>
      );
    });

  // ── Progressive rows — Activities / Promotions / Directives ────────────────
  const progRows = (section: string) =>
    LAFF_BOOSTS
      .filter(e => !e.isHeader && e.section === section)
      .map((entry, ri) => {
        if (entry.isHeader) return null;
        const key     = `lb:${entry.section}:${entry.note}:${entry.source}`;
        const allDone = isAllDone(key);
        return (
          <tr key={`${section}-${ri}`} className={allDone ? 'row-all-done' : ''}>
            <td className="col-main">{entry.note}</td>
            <td className="col-sm" style={{textAlign:'center'}}>+{entry.laff}</td>
            {([0,1,2,3] as ToonIndex[]).map(t => (
              <td key={t} className="col-toon">
                <button
                  className={`check-btn${progress[key]?.[t] ? ' check-btn--done' : ''}`}
                  style={progress[key]?.[t] ? {'--tc': TOON_COLORS[t]} as React.CSSProperties : {}}
                  onClick={() => handleProgClick(key, t, section)}
                  aria-label={`${toonNames[t]}: ${entry.section} ${entry.note}`}
                >&#10003;</button>
              </td>
            ))}
            <td className="col-all">
              <button className={`all-btn${allDone?' all-btn--done':''}`} onClick={() => handleProgAll(key, section)} title={allDone?'Unmark all':'Mark all toons'}>{allDone?'★':'☆'}</button>
            </td>
          </tr>
        );
      });


  return (
    <div className="tracker-section">
      <SectionNote
        description="All sources of laff boosts in Corporate Clash, grouped by Kudos rankings, activities, promotions, and directives. Max laff is 150. Each section can be collapsed independently."
        status="Everything in this section is currently up to date."
        lastUpdated="September 5th, 2026 · 9:00 PM"
        lastChanges="Source column added to Kudos. Promotions sub-sections are now individually collapsible like Activities. Reset drawer added with per-section per-toon reset. Lawbot corrected from Lowbot."
      />
      <LaffResetDrawer />
      <div className="laff-cards-list">

        {/* ── KUDOS CARD ─────────────────────────────────────────────────────── */}
        <div className="tracker-card coll-card" style={{'--dc':LAFF_DC,'--da':LAFF_DA} as React.CSSProperties}>
          <button
            className={`tracker-card-header coll-section-header${isOpen('Kudos')?'':' coll-section-header--collapsed'}`}
            onClick={() => toggleGroup('Kudos')} aria-expanded={isOpen('Kudos')}>
            <span className="coll-section-arrow">{isOpen('Kudos') ? '▼' : '▶'}</span>
            <strong>Kudos</strong>
          </button>
          {isOpen('Kudos') && (
            <div className="tracker-table-wrap"><table className="tracker-table">
              {thead('Playground', 'Source')}
              <tbody>{kudosRows}</tbody>
            </table></div>
          )}
        </div>

        {/* ── ACTIVITIES CARD ────────────────────────────────────────────────── */}
        <div className="tracker-card coll-card" style={{'--dc':LAFF_DC,'--da':LAFF_DA} as React.CSSProperties}>
          <button
            className={`tracker-card-header coll-section-header${isOpen('Activities')?'':' coll-section-header--collapsed'}`}
            onClick={() => toggleGroup('Activities')} aria-expanded={isOpen('Activities')}>
            <span className="coll-section-arrow">{isOpen('Activities') ? '▼' : '▶'}</span>
            <strong>Activities</strong>
          </button>
          {isOpen('Activities') && (
            <div className="tracker-table-wrap"><table className="tracker-table">
              {thead('Milestone')}
              <tbody>
                {ACTIVITY_SECTIONS.map(act => [
                  <tr key={`act-h-${act}`} className="laff-section-header"><td colSpan={colCount} style={{padding:0}}>
                    <button className="laff-collapse-btn--sub" onClick={() => toggleAct(act)}>
                      <span className="quest-collapse-arrow">{isActOpen(act) ? '▼' : '▶'}</span>{act}
                    </button>
                  </td></tr>,
                  ...(isActOpen(act) ? progRows(act) : []),
                ])}
              </tbody>
            </table></div>
          )}
        </div>




        {/* ── PROMOTIONS CARD ────────────────────────────────────────────────── */}
        <div className="tracker-card coll-card" style={{'--dc':LAFF_DC,'--da':LAFF_DA} as React.CSSProperties}>
          <button
            className={`tracker-card-header coll-section-header${isOpen('Promotions')?'':' coll-section-header--collapsed'}`}
            onClick={() => toggleGroup('Promotions')} aria-expanded={isOpen('Promotions')}>
            <span className="coll-section-arrow">{isOpen('Promotions') ? '▼' : '▶'}</span>
            <strong>Promotions</strong>
          </button>
          {isOpen('Promotions') && (
            <div className="tracker-table-wrap"><table className="tracker-table">
              {thead('Milestone')}
              <tbody>
                {PROMO_SECTIONS.map(sec => [
                  <tr key={`promo-h-${sec}`} className="laff-section-header"><td colSpan={colCount} style={{padding:0}}>
                    <button className="laff-collapse-btn--sub" onClick={() => togglePromo(sec)}>
                      <span className="quest-collapse-arrow">{isPromoOpen(sec) ? '▼' : '▶'}</span>{sec}
                    </button>
                  </td></tr>,
                  ...(isPromoOpen(sec) ? progRows(sec) : []),
                ])}
              </tbody>
            </table></div>
          )}
        </div>

        {/* ── DIRECTIVES CARD ────────────────────────────────────────────────── */}
        <div className="tracker-card coll-card" style={{'--dc':LAFF_DC,'--da':LAFF_DA} as React.CSSProperties}>
          <button
            className={`tracker-card-header coll-section-header${isOpen('Directives')?'':' coll-section-header--collapsed'}`}
            onClick={() => toggleGroup('Directives')} aria-expanded={isOpen('Directives')}>
            <span className="coll-section-arrow">{isOpen('Directives') ? '▼' : '▶'}</span>
            <strong>Directives</strong>
          </button>
          {isOpen('Directives') && (
            <div className="tracker-table-wrap"><table className="tracker-table">
              {thead('Milestone')}
              <tbody>{progRows('Directives')}</tbody>
            </table></div>
          )}
        </div>

      </div>
    </div>
  );
}
