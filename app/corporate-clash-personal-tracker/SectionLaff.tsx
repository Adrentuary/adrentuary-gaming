'use client';
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

export function SectionLaff() {
  const { toonNames, isDone, toggleAll, isAllDone } = useTracker();
  const renderedSections = new Set<string>();
  const renderedGroups = new Set<string>();
  const colCount = 3 + toonNames.length + 1; // note + source + laff + toons + all

  // Count how many entries each toon has done in a section
  const getSectionCount = (section: string, toon: ToonIndex): number =>
    LAFF_BOOSTS.filter(e => !e.isHeader && e.section === section)
      .filter(e => isDone(`lb:${e.section}:${(e as {note:string}).note}:${(e as {source:string}).source}`, toon)).length;

  return (
    <div className="tracker-section">
      <div className="tracker-card" style={{'--dc':'#1a2a3a','--da':'#5ab0e0'} as React.CSSProperties}>
        <div className="tracker-card-header">
          <strong>Laff Boosts</strong>
          <span className="tracker-card-sub">Max Laff: 150</span>
        </div>
        <div className="tracker-table-wrap">
          <table className="tracker-table">
            <thead><tr>
              <th className="col-sm">Milestone</th>
              <th className="col-main">Source</th>
              <th className="col-sm">+Laff</th>
              {toonNames.map((n,i) => (
                <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>
              ))}
              <th className="col-all">All</th>
            </tr></thead>
            <tbody>
              {LAFF_BOOSTS.map((entry: LaffBoostEntry, ri) => {
                if (entry.isHeader) {
                  const total = SECTION_TOTALS[entry.section] ?? '?';
                  return (
                    <tr key={`hdr-${ri}`} className="tracker-section-header">
                      <td colSpan={colCount} style={{textAlign:'center'}}>
                        {toonNames.map((n,i) => {
                          const count = getSectionCount(entry.section, i as ToonIndex);
                          const done = count === total;
                          return (
                            <span key={i} className="laff-toon-progress" style={{color: TOON_COLORS[i]}}>
                              {n}: {done ? '✔ COMPLETED' : `${count}/${total}`}
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  );
                }

                const rows: React.ReactNode[] = [];
                const group = GROUP_LABELS[entry.section] ?? entry.section;

                // Render group separator (Kudos / Activities / Promotions)
                if (!renderedGroups.has(group)) {
                  renderedGroups.add(group);
                  rows.push(
                    <tr key={`grp-${group}`} className="laff-group-divider">
                      <td colSpan={colCount}>{group}</td>
                    </tr>
                  );
                }

                // Render section sub-header within group
                if (!renderedSections.has(entry.section)) {
                  renderedSections.add(entry.section);
                  if (group !== 'Kudos') {
                    rows.push(
                      <tr key={`sec-${entry.section}`} className="tracker-section-divider">
                        <td colSpan={colCount}>{entry.section}</td>
                      </tr>
                    );
                  }
                }

                const key = `lb:${entry.section}:${entry.note}:${entry.source}`;
                const allDone = isAllDone(key);
                rows.push(
                  <tr key={ri} className={allDone ? 'row-all-done' : ''}>
                    <td className="col-sm">{entry.note}</td>
                    <td className="col-main">{entry.source}</td>
                    <td className="col-sm">+{entry.laff}</td>
                    {([0,1,2,3] as ToonIndex[]).map(t => (
                      <td key={t} className="col-toon">
                        <CheckBtn id={key} toon={t} label={`${toonNames[t]}: ${entry.section} ${entry.note}`} />
                      </td>
                    ))}
                    <td className="col-all">
                      <button
                        className={`all-btn${allDone?' all-btn--done':''}`}
                        onClick={() => toggleAll(key)}
                        title={allDone ? 'Unmark all' : 'Mark all toons'}
                        aria-label={`Mark all: ${entry.section} ${entry.note}`}
                      >{allDone ? '★' : '☆'}</button>
                    </td>
                  </tr>
                );
                return rows;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
