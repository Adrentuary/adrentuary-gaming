'use client';
import { GAG_TRACKS, GAG_XP } from './data-gags';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

export function SectionGags() {
  const { toonNames } = useTracker();
  return (
    <div className="tracker-section">
      <p className="tracker-section-desc">Track which gags each toon has unlocked. Click to mark obtained.</p>
      {GAG_TRACKS.map(track => (
        <div key={track.name} className="tracker-card" style={{'--dc':track.color,'--da':track.color} as React.CSSProperties}>
          <div className="tracker-card-header"><strong>{track.name}</strong></div>
          <div className="tracker-table-wrap">
            <table className="tracker-table gag-table">
              <thead><tr>
                <th className="col-toon-label">Toon</th>
                {track.gags.map((g,i) => (
                  <th key={i} className="col-gag">
                    <div className="gag-name">{g}</div>
                    <div className="gag-xp">{GAG_XP[i]}</div>
                  </th>
                ))}
              </tr></thead>
              <tbody>
                {([0,1,2,3] as ToonIndex[]).map(t => (
                  <tr key={t}>
                    <td className="col-toon-label" style={{color:TOON_COLORS[t]}}>{toonNames[t]}</td>
                    {track.gags.map((g,gi) => (
                      <td key={gi} className="col-gag">
                        <CheckBtn id={`g:${track.name}:${g}`} toon={t} label={`${toonNames[t]}: ${track.name} – ${g}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
