'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { LAFF_BOOSTS } from './data-laff';
import type { LaffBoostEntry } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

// Groups the laff boost sections into visual categories
const GROUP_LABELS: Record<string, string> = {
  'Kudos Ranking': 'Kudos',
  'Fishing': 'Activities',
  'Trolly': 'Activities',
  'Racing': 'Activities',
  'Golfing': 'Activities',
  'Sellbot Promotions': 'Promotions',
  'Cashbot Promotions': 'Promotions',
  'Lowbot Promotions': 'Promotions',
  'Bossbot Promotions': 'Promotions',
};

// Playground icons for Kudos section milestones
const KUDOS_PG_ICONS: Record<string, {icon: string; img: string; name: string}> = {
  '1→2 Taking Out The Trash':      { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '2→3 Panic At the Discount':     { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '3→4 Give and Cake':             { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '4→5 The Mysterious Duck':       { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '5→6 Easy As Pie In The Sky':    { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '6→7 An Oldie but a Goodie':     { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '7→8 Double Coil and Trouble':   { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '8→9 Scraping News':             { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '9→10 Brainiacs in the Basement':{ icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
  '10+ +20 Gumballs':              { icon: '🍦', img: '/icons/playground-emblems/TTC.png', name: 'Toontown Central' },
};

// Total counts per section for the progress display
const SECTION_TOTALS: Record<string, number> = {
  'Kudos Ranking': 8,
  'Fishing': 7,
  'Trolly': 3,
  'Racing': 3,
  'Golfing': 3,
  'Sellbot Promotions': 6,
  'Cashbot Promotions': 6,
  'Lowbot Promotions': 9,
  'Bossbot Promotions': 6,
};

const PG_ICON_MAP: Record<string, {emoji: string; img: string}> = {
  'Toontown Central': { emoji: '🍦', img: '/icons/playground-emblems/TTC.png' },
  'Barnacle Boatyard': { emoji: '⚓', img: '/icons/playground-emblems/BB.png' },
  'Ye Olde Toontowne': { emoji: '👑', img: '/icons/playground-emblems/YOTT.png' },
  'Daffodil Gardens': { emoji: '🌸', img: '/icons/playground-emblems/DG.png' },
  'Mezzo Melodyland': { emoji: '🎵', img: '/icons/playground-emblems/MML.png' },
  'The Brrrgh': { emoji: '❄️', img: '/icons/playground-emblems/TB.png' },
  'Acorn Acres': { emoji: '🌰', img: '/icons/playground-emblems/AA.png' },
  'Drowsy Dreamland': { emoji: '💤', img: '/icons/playground-emblems/DDL.png' },
};
const LAFF_GROUPS = ['Kudos', 'Activities', 'Promotions'];

export function SectionLaff() {
  const { toonNames, isDone, toggleAll, isAllDone } = useTracker();
  const STORAGE_KEY = 'laff-open-groups';
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set(LAFF_GROUPS);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(LAFF_GROUPS);
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...openGroups])); } catch {}
  }, [openGroups]);
  const renderedSections = new Set<string>();
  const renderedGroups = new Set<string>();
  const colCount = 3 + toonNames.length + 1;

  const toggleGroup = (g: string) => setOpenGroups(prev => {
    const next = new Set(prev); next.has(g) ? next.delete(g) : next.add(g); return next;
  });

  const getSectionCount = (section: string, toon: ToonIndex): number =>
    LAFF_BOOSTS.filter(e => !e.isHeader && e.section === section)
      .filter(e => isDone(`lb:${e.section}:${(e as {note:string}).note}:${(e as {source:string}).source}`, toon)).length;

  return (
    <div className="tracker-section">
      <SectionNote
        description="All sources of laff boosts in Corporate Clash, grouped by Kudos rankings, activities, and promotions. Max laff is 150. Sections can be collapsed using the dropdown arrows."
        status="Section design and interactive features are currently under development."
        lastUpdated="September 1st, 2026"
        lastChanges="Collapse state now saves to your profile. Section progress bars removed. Hover flicker on collapse buttons fixed. Account page banner added."
      />
      <div className="tracker-account-banner">
        <span className="tracker-account-banner-text">
          To reset all toon progress across all sections, visit your{' '}
          <Link href="/account" className="tracker-account-banner-link">Account page</Link>.
        </span>
      </div>
      <div className="tracker-card" style={{'--dc':'#1a2a3a','--da':'#5ab0e0'} as React.CSSProperties}>
        <div className="tracker-card-header"><strong>Laff Boosts</strong><span className="tracker-card-sub">Max Laff: 150</span></div>
        <div className="tracker-table-wrap">
          <table className="tracker-table">
            <thead><tr>
              <th className="col-sm">Milestone</th><th className="col-main">Source</th><th className="col-sm">+Laff</th>
              {toonNames.map((n,i) => <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>)}
              <th className="col-all">All</th>
            </tr></thead>
            <tbody>
              {LAFF_BOOSTS.map((entry: LaffBoostEntry, ri) => {
                if (entry.isHeader) return null;
                const group = GROUP_LABELS[entry.section] ?? entry.section;
                const rows: React.ReactNode[] = [];
                if (!renderedGroups.has(group)) {
                  renderedGroups.add(group);
                  const isOpen = openGroups.has(group);
                  rows.push(<tr key={`grp-${group}`} className="laff-group-divider"><td colSpan={colCount}>
                    <button className="laff-collapse-btn" onClick={() => toggleGroup(group)}>
                      <span className="quest-collapse-arrow">{isOpen ? '▼' : '▶'}</span>{group}
                    </button></td></tr>);
                }
                if (!openGroups.has(group)) return rows.length ? rows : null;
                if (!renderedSections.has(entry.section)) {
                  renderedSections.add(entry.section);
                }
                const key = `lb:${entry.section}:${entry.note}:${entry.source}`;
                const allDone = isAllDone(key);
                rows.push(<tr key={ri} className={allDone ? 'row-all-done' : ''}>
                  <td className="col-sm">{entry.note}</td>
                  <td className="col-main">{entry.source}</td>
                  <td className="col-sm">+{entry.laff}</td>
                  {([0,1,2,3] as ToonIndex[]).map(t => (
                    <td key={t} className="col-toon"><CheckBtn id={key} toon={t} label={`${toonNames[t]}: ${entry.section} ${entry.note}`} /></td>
                  ))}
                  <td className="col-all"><button className={`all-btn${allDone?' all-btn--done':''}`} onClick={() => toggleAll(key)} title={allDone?'Unmark all':'Mark all toons'}>{allDone?'★':'☆'}</button></td>
                </tr>);
                return rows;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
