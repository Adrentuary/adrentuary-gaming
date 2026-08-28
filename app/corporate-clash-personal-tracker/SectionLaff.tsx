'use client';
import { LAFF_BOOSTS } from './data-laff';
import type { LaffBoostEntry } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

export function SectionLaff() {
  const { toonNames } = useTracker();
  const renderedHeaders = new Set<string>();

  return (
    <div className="tracker-section">
      <div className="tracker-card" style={{'--dc':'#1a2a3a','--da':'#5ab0e0'} as React.CSSProperties}>
        <div className="tracker-card-header">
          <strong>Total Laff Boost</strong>
          <span className="tracker-card-sub">Max Laff: 150</span>
        </div>
        <div className="tracker-table-wrap">
          <table className="tracker-table">
            <thead><tr>
              <th className="col-sm">Level / Playground</th>
              <th className="col-main">Source</th>
              <th className="col-sm">+Laff</th>
              {toonNames.map((n,i) => (
                <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>
              ))}
            </tr></thead>
            <tbody>
              {LAFF_BOOSTS.map((entry: LaffBoostEntry, ri) => {
                if (entry.isHeader) {
                  return (
                    <tr key={`hdr-${ri}`} className="tracker-section-header">
                      <td colSpan={3 + toonNames.length} style={{textAlign:'center', fontStyle:'italic'}}>
                        {entry.section} Completed — <strong>{entry.total}</strong>
                      </td>
                    </tr>
                  );
                }
                // render section divider row before first entry of each section
                const rows: React.ReactNode[] = [];
                if (!renderedHeaders.has(entry.section)) {
                  renderedHeaders.add(entry.section);
                  rows.push(
                    <tr key={`sec-${entry.section}`} className="tracker-section-divider">
                      <td colSpan={3 + toonNames.length}>{entry.section}</td>
                    </tr>
                  );
                }
                const key = `lb:${entry.section}:${entry.note}:${entry.source}`;
                rows.push(
                  <tr key={ri}>
                    <td className="col-sm">{entry.note}</td>
                    <td className="col-main">{entry.source}</td>
                    <td className="col-sm">+{entry.laff}</td>
                    {([0,1,2,3] as ToonIndex[]).map(t => (
                      <td key={t} className="col-toon">
                        <CheckBtn id={key} toon={t} label={`${toonNames[t]}: ${entry.section} ${entry.note}`} />
                      </td>
                    ))}
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
