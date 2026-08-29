'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { TTC, BB, YOTT, DG, MML, TB, AA, DDL } from './data-quests-index';
import type { QuestPlayground, QuestSectionType } from './data-quests-types';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';
import { QuestResetDrawer } from './QuestResetDrawer';

const QUESTS: QuestPlayground[] = [TTC, BB, YOTT, DG, MML, TB, AA, DDL];
const LS_KEY = 'cc-quest-collapsed';

function loadCollapsed(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}'); } catch { return {}; }
}
function saveCollapsed(data: Record<string, string[]>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}
function rowClass(t: QuestSectionType | undefined): string {
  if (t === 'main') return 'quest-row--main';
  if (t === 'side') return 'quest-row--side';
  if (t === 'kudos-low') return 'quest-row--kudos-low';
  if (t === 'kudos-high') return 'quest-row--kudos-high';
  return '';
}

export function SectionQuests() {
  const { toonNames, progress, toggle, toggleAll, isAllDone } = useTracker();
  const [tab, setTab] = useState(0);
  const pg = QUESTS[tab];

  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    const all = loadCollapsed();
    return new Set(all[pg.name] ?? []);
  });
  useEffect(() => {
    const all = loadCollapsed(); all[pg.name] = [...collapsed]; saveCollapsed(all);
  }, [collapsed, pg.name]);

  const toggleSection = useCallback((label: string) => {
    setCollapsed(prev => {
      const next = new Set(prev); next.has(label) ? next.delete(label) : next.add(label); return next;
    });
  }, []);

  const handleTabChange = (i: number) => {
    const all = loadCollapsed(); setCollapsed(new Set(all[QUESTS[i].name] ?? [])); setTab(i);
  };

  // For progression: main rows form one pool, ALL kudos rows (low+high) form one unified pool
  const progKeys = (sType: QuestSectionType): string[] => {
    if (sType === 'kudos-low' || sType === 'kudos-high') {
      return pg.rows
        .filter(r => !r.isHeader && (r.sectionType === 'kudos-low' || r.sectionType === 'kudos-high'))
        .map(r => `q:${pg.name}:${r.name}`);
    }
    return pg.rows
      .filter(r => !r.isHeader && r.sectionType === sType)
      .map(r => `q:${pg.name}:${r.name}`);
  };

  const handleProgressClick = useCallback((key: string, toon: ToonIndex, sType: QuestSectionType) => {
    const keys = progKeys(sType); const idx = keys.indexOf(key);
    if (idx === -1) { toggle(key, toon); return; }
    const done = !!(progress[key]?.[toon]);
    if (!done) { for (let i = 0; i <= idx; i++) { if (!progress[keys[i]]?.[toon]) toggle(keys[i], toon); } }
    else        { for (let i = idx; i < keys.length; i++) { if (progress[keys[i]]?.[toon]) toggle(keys[i], toon); } }
  }, [pg, progress, toggle]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProgressAll = useCallback((key: string, sType: QuestSectionType) => {
    const keys = progKeys(sType); const idx = keys.indexOf(key);
    if (idx === -1) { toggleAll(key); return; }
    const allDone = isAllDone(key);
    ([0,1,2,3] as ToonIndex[]).forEach(toon => {
      if (!allDone) { for (let i = 0; i <= idx; i++) { if (!progress[keys[i]]?.[toon]) toggle(keys[i], toon); } }
      else          { for (let i = idx; i < keys.length; i++) { if (progress[keys[i]]?.[toon]) toggle(keys[i], toon); } }
    });
  }, [pg, progress, toggle, toggleAll, isAllDone]); // eslint-disable-line react-hooks/exhaustive-deps

  let currentSection = '';
  let currentSectionType: QuestSectionType | undefined;
  const renderedRows: React.ReactNode[] = [];

  pg.rows.forEach((row, ri) => {
    if (row.isHeader) {
      currentSection = row.headerLabel ?? '';
      if (currentSection === 'Main Storyline') currentSectionType = 'main';
      else if (currentSection === 'Sidetasks') currentSectionType = 'side';
      else if (currentSection === 'Kudos Rank-Up Quests') currentSectionType = 'kudos-low';
      else currentSectionType = 'main';
      const sectionLabel = currentSection;
      const isOpen = !collapsed.has(sectionLabel);
      renderedRows.push(
        <tr key={`h-${ri}`} className="quest-section-header quest-section-header--toggle">
          <td colSpan={4 + toonNames.length}>
            <button className="quest-collapse-btn" onClick={() => toggleSection(sectionLabel)} aria-expanded={isOpen}>
              <span className="quest-collapse-arrow">{isOpen ? '▼' : '▶'}</span>
              {row.headerLabel}
            </button>
          </td>
        </tr>
      );
    } else {
      if (collapsed.has(currentSection)) return;
      const key = `q:${pg.name}:${row.name}`;
      const allDone = isAllDone(key);
      const sType = row.sectionType ?? currentSectionType;
      const isProg = sType === 'main' || sType === 'kudos-low' || sType === 'kudos-high';
      renderedRows.push(
        <tr key={`r-${ri}`}
          className={`${rowClass(sType)}${allDone ? ' row-quest-done' : ''}`}
          style={allDone ? {'--qrc': 'var(--dc)'} as React.CSSProperties : undefined}>
          <td className="col-main">{row.name}</td>
          <td className="col-reward">{row.reward}</td>
          <td className="col-loc">{row.location}</td>
          {([0,1,2,3] as ToonIndex[]).map(t => (
            <td key={t} className="col-toon">
              {isProg ? (
                <button
                  className={`check-btn${progress[key]?.[t] ? ' check-btn--done' : ''}`}
                  style={progress[key]?.[t] ? {'--tc': TOON_COLORS[t]} as React.CSSProperties : {}}
                  onClick={() => handleProgressClick(key, t, sType!)}
                  aria-label={`${row.name} - ${toonNames[t]}`}
                >&#10003;</button>
              ) : (
                <CheckBtn id={key} toon={t} label={`${row.name} - ${toonNames[t]}`} />
              )}
            </td>
          ))}
          <td className="col-all">
            <button
              className={`all-btn${allDone ? ' all-btn--done' : ''}`}
              onClick={() => isProg ? handleProgressAll(key, sType!) : toggleAll(key)}
              title={allDone ? 'Unmark all' : 'Mark all toons'}
            >{allDone ? '★' : '☆'}</button>
          </td>
        </tr>
      );
    }
  });

  return (
    <div className="tracker-section">
      <SectionNote
        description="Track quest completion across all 8 playgrounds for each of your toons. Main storyline, sidetasks, and Kudos rank-up quests are all included. Checking a row auto-marks all previous rows for that toon."
        status="Everything in this section is currently up to date."
        lastUpdated="September 9th, 2026 4:21 PM"
      />
      <QuestResetDrawer />
      <nav className="sub-tabs">
        {QUESTS.map((q,i) => (
          <button key={q.name} className={`sub-tab${tab===i?' sub-tab--active':''}`} onClick={() => handleTabChange(i)}>
            <Image src={`/icons/playground-emblems/${q.pgKey}.png`} alt={q.name} width={16} height={16} className="sub-tab-emblem" />
            {q.name}
          </button>
        ))}
      </nav>
      <div className="tracker-card"
        style={{'--dc':pg.color,'--da':pg.accent} as React.CSSProperties}>
        <div className="tracker-card-header">
          <Image
            src={`/icons/playground-emblems/${pg.pgKey}.png`}
            alt={pg.name}
            width={28}
            height={28}
            className="pg-emblem"
          />
          <strong>{pg.name}</strong>
        </div>
        <div className="tracker-table-wrap">
          <table className="tracker-table">
            <thead><tr>
              <th className="col-main">Quest</th>
              <th className="col-reward">Reward</th>
              <th className="col-loc">Location</th>
              {toonNames.map((n,i) => <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>)}
              <th className="col-all">All</th>
            </tr></thead>
            <tbody>{renderedRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

