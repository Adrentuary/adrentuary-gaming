'use client';
import { STREETS } from './data-streets';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

export function SectionStreets() {
  const { toonNames } = useTracker();
  return (
    <div className="tracker-section">
      <p className="tracker-section-desc">Track which streets you&apos;ve visited on each toon. Click to mark complete.</p>
      {STREETS.map(district => (
        <div key={district.name} className="tracker-card" style={{'--dc':district.color,'--da':district.accent} as React.CSSProperties}>
          <div className="tracker-card-header"><span className="dc-icon">{district.icon}</span><strong>{district.name}</strong></div>
          <div className="tracker-table-wrap">
            <table className="tracker-table">
              <thead><tr>
                <th className="col-main">Street</th>
                <th className="col-tunnel">Tunnel</th>
                <th className="col-sm">Lvls</th>
                <th className="col-sm">EXE</th>
                <th className="col-sm">SB%</th><th className="col-sm">CB%</th><th className="col-sm">LB%</th><th className="col-sm">BB%</th><th className="col-sm">BsB%</th>
                {toonNames.map((n,i) => <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>)}
              </tr></thead>
              <tbody>
                {district.streets.map(s => {
                  const key = `st:${district.name}:${s.location}`;
                  return (
                    <tr key={s.location}>
                      <td className="col-main">{s.location}</td>
                      <td className="col-tunnel">{s.tunnel}</td>
                      <td className="col-sm">{s.levels}</td>
                      <td className="col-sm">{s.exe}</td>
                      {s.cogs.map((c,i) => <td key={i} className="col-sm">{c}</td>)}
                      {([0,1,2,3] as ToonIndex[]).map(t => (
                        <td key={t} className="col-toon">
                          <CheckBtn id={key} toon={t} label={`${s.location} – ${toonNames[t]}`} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
