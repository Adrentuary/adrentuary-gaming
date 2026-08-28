'use client';
import { useState } from 'react';
import { TTC, BB, YOTT, DG, MML, TB, AA, DDL } from './data-quests-index';
import type { QuestPlayground } from './data-quests-types';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

const QUESTS: QuestPlayground[] = [TTC, BB, YOTT, DG, MML, TB, AA, DDL];

export function SectionQuests() {
  const { toonNames, toggleAll, isAllDone } = useTracker();
  const [tab, setTab] = useState(0);
  const pg = QUESTS[tab];

  // Build section keys from header rows so we can track collapsed state
  const sectionKeys = pg.rows
    .filter(r => r.isHeader)
    .map(r => r.headerLabel ?? '');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleSection = (label: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // Build rows with section awareness
  let currentSection = '';
  const renderedRows: React.ReactNode[] = [];
  pg.rows.forEach((row, ri) => {
    if (row.isHeader) {
      currentSection = row.headerLabel ?? '';
      const isOpen = !collapsed.has(currentSection);
      renderedRows.push(
        <tr key={`h-${ri}`} className="quest-section-header quest-section-header--toggle">
          <td colSpan={4 + toonNames.length}>
            <button
              className="quest-collapse-btn"
              onClick={() => toggleSection(currentSection)}
              aria-expanded={isOpen}
            >
              <span className="quest-collapse-arrow">{isOpen ? '▾' : '▸'}</span>
              {row.headerLabel}
            </button>
          </td>
        </tr>
      );
    } else {
      if (collapsed.has(currentSection)) return;
      const key = `q:${pg.name}:${row.name}`;
      const allDone = isAllDone(key);
      renderedRows.push(
        <tr key={`r-${ri}`} className={allDone ? 'row-all-done' : ''}>
          <td className="col-main">{row.name}</td>
          <td className="col-reward">{row.reward}</td>
          <td className="col-loc">{row.location}</td>
          {([0,1,2,3] as ToonIndex[]).map(t => (
            <td key={t} className="col-toon">
              <CheckBtn id={key} toon={t} label={`${row.name} – ${toonNames[t]}`} />
            </td>
          ))}
          <td className="col-all">
            <button
              className={`all-btn${allDone?' all-btn--done':''}`}
              onClick={() => toggleAll(key)}
              aria-label={`Mark all toons: ${row.name}`}
              title={allDone ? 'Unmark all' : 'Mark all toons'}
            >{allDone ? '★' : '☆'}</button>
          </td>
        </tr>
      );
    }
  });

  // Reset collapsed when switching tabs
  const handleTabChange = (i: number) => {
    setTab(i);
    setCollapsed(new Set());
  };

  // Suppress unused sectionKeys warning
  void sectionKeys;

  return (
    <div className="tracker-section">
      <nav className="sub-tabs">
        {QUESTS.map((q,i) => (
          <button key={q.name} className={`sub-tab${tab===i?' sub-tab--active':''}`} onClick={() => handleTabChange(i)}>
            {q.icon} {q.name}
          </button>
        ))}
      </nav>
      <div className="tracker-card" style={{'--dc':pg.color,'--da':pg.accent} as React.CSSProperties}>
        <div className="tracker-card-header"><span className="dc-icon">{pg.icon}</span><strong>{pg.name}</strong></div>
        <div className="tracker-table-wrap">
          <table className="tracker-table">
            <thead><tr>
              <th className="col-main">Quest</th>
              <th className="col-reward">Reward</th>
              <th className="col-loc">Location</th>
              {toonNames.map((n,i) => <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>)}
              <th className="col-all">All</th>
            </tr></thead>
            <tbody>
              {renderedRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
