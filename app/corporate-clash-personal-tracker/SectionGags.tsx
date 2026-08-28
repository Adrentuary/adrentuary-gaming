'use client';
import Image from 'next/image';
import { GAG_TRACKS, RECOMMENDED_ZONES } from './data-gags';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

// Zone boundary: which gag column index (0-based) each zone START sits above.
// TTC: cols 0-1, BB: col 2, YOTT: between 3-4 (show above col 3 right-border),
// DG: between 4-5, MML: col 5, TB: col 6, DDL: col 7
// We render one zone cell per gag column; a zone spans until the next boundary.
// zone col-spans: TTC→2, BB→1, YOTT→1, DG→1, MML→1, TB→1, DDL→1  (matches data-gags)

export function SectionGags() {
  const { toonNames, toggle, isDone } = useTracker();
  return (
    <div className="tracker-section">
      {GAG_TRACKS.map(track => (
        <div key={track.name} className="gag-card"
          style={{'--gc': track.color, '--gh': track.headerColor, '--gl': track.labelColor} as React.CSSProperties}>
          <div className="gag-table-scroll">
            <table className="gag-ss-table">
              <thead>
                <tr className="gag-ss-zone-row">
                  <td className="gag-ss-track-cell" rowSpan={4}>
                    <Image src={`/icons/gags/large/${track.largeIcon}`}
                      alt={track.name} width={60} height={60} className="gag-ss-large-icon" />
                    <span className="gag-ss-track-name">{track.name}</span>
                  </td>
                  <td className="gag-ss-label-hdr" rowSpan={2} />
                  {RECOMMENDED_ZONES.map((z, zi) => (
                    <td key={zi} colSpan={z.span} className="gag-ss-zone-cell"
                      style={{background: z.color, color: z.accent}}>{z.name}</td>
                  ))}
                </tr>
                <tr className="gag-ss-gag-row">
                  {track.gags.map((g, gi) => (
                    <td key={gi} className="gag-ss-gag-cell">
                      <Image src={`/icons/gags/small/${track.trackKey}/${g}.png`}
                        alt={g} width={44} height={44} className="gag-ss-small-icon" />
                      <div className="gag-ss-gag-name">{g}</div>
                    </td>
                  ))}
                </tr>
                <tr className="gag-ss-xp-row">
                  <td className="gag-ss-label-hdr gag-ss-xp-label">
                    <span className="gag-ss-xp-min-lbl">Min XP</span>
                    <span className="gag-ss-xp-max-lbl">Max XP</span>
                  </td>
                  {track.gags.map((_, gi) => (
                    <td key={gi} className="gag-ss-xp-cell">
                      <span className="gag-ss-xp-min">{track.xpMin[gi]}</span>
                      <span className="gag-ss-xp-divider" />
                      <span className="gag-ss-xp-max">{track.xpMax[gi]}</span>
                    </td>
                  ))}
                </tr>
                <tr className="gag-ss-tnum-row">
                  <td className="gag-ss-label-hdr gag-ss-tnum-label">
                    <div className="gag-ss-tnum-group">
                      {([0,1,2,3] as ToonIndex[]).map(t => (
                        <span key={t} className="gag-ss-tnum" style={{color: TOON_COLORS[t]}}>{t+1}</span>
                      ))}
                    </div>
                    <div className="gag-ss-tnum-group">
                      {([0,1,2,3] as ToonIndex[]).map(t => (
                        <span key={t} className="gag-ss-tnum" style={{color: TOON_COLORS[t]}}>{t+1}</span>
                      ))}
                    </div>
                  </td>
                  {track.gags.map((g) => (
                    <td key={g} className="gag-ss-tnum-cell">
                      <div className="gag-ss-check-group">
                        {([0,1,2,3] as ToonIndex[]).map(t => {
                          const key = `g:${track.name}:${g}:min`;
                          const done = isDone(key, t);
                          return (<button key={t}
                            className={`gag-ss-chk${done?' gag-ss-chk--done':''}`}
                            style={done?{'--tc':TOON_COLORS[t]} as React.CSSProperties:{}}
                            onClick={() => toggle(key, t)}
                            aria-label={`${toonNames[t]}: ${track.name} – ${g} (Min)`}>✓</button>);
                        })}
                      </div>
                      <div className="gag-ss-check-group gag-ss-check-group--max">
                        {([0,1,2,3] as ToonIndex[]).map(t => {
                          const key = `g:${track.name}:${g}:max`;
                          const done = isDone(key, t);
                          return (<button key={t}
                            className={`gag-ss-chk${done?' gag-ss-chk--done':''}`}
                            style={done?{'--tc':TOON_COLORS[t]} as React.CSSProperties:{}}
                            onClick={() => toggle(key, t)}
                            aria-label={`${toonNames[t]}: ${track.name} – ${g} (Max)`}>✓</button>);
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {track.stats.map((stat, si) => (
                  <tr key={si} className="gag-ss-stat-row">
                    {si === 0 && (
                      <td className="gag-ss-track-cell gag-ss-track-cell--stat" rowSpan={track.stats.length} />
                    )}
                    <td className="gag-ss-stat-label">{stat.label}</td>
                    {stat.values.map((v, vi) => (
                      <td key={vi} className={`gag-ss-stat-val gag-ss-stat-val--${stat.type??'label'}`}>{v??'—'}</td>
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
