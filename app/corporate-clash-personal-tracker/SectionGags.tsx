'use client';
import Image from 'next/image';
import { GAG_TRACKS, RECOMMENDED_ZONES } from './data-gags';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

// Zone boundary: which gag column index (0-based) each zone START sits above.
// TTC: cols 0-1, BB: col 2, YOTT: between 3-4 (show above col 3 right-border),
// DG: between 4-5, MML: col 5, TB: col 6, DDL: col 7
// We render one zone cell per gag column; a zone spans until the next boundary.
// zone col-spans: TTC→2, BB→1, YOTT→1, DG→1, MML→1, TB→1, DDL→1  (matches data-gags)

export function SectionGags() {
  const { toonNames } = useTracker();

  // Total body rows per track = 4 toon rows + stat rows
  return (
    <div className="tracker-section">
      {GAG_TRACKS.map(track => {
        const totalBodyRows = 4 + track.stats.length;
        return (
          <div
            key={track.name}
            className="gag-card"
            style={{'--gc': track.color, '--gh': track.headerColor, '--gl': track.labelColor} as React.CSSProperties}
          >
            <div className="gag-table-scroll">
              <table className="gag-redesign-table">
                <thead>
                  {/* Row 1: Recommended zones across gag columns (no label col) */}
                  <tr className="gag-zone-row">
                    <th className="gag-track-cell" rowSpan={2}>
                      <Image
                        src={`/icons/gags/large/${track.largeIcon}`}
                        alt={track.name}
                        width={52}
                        height={52}
                        className="gag-large-icon"
                      />
                      <span className="gag-track-name">{track.name}</span>
                    </th>
                    {RECOMMENDED_ZONES.map((z, zi) => (
                      <th
                        key={zi}
                        colSpan={z.span}
                        className="gag-zone-cell"
                        style={{background: z.color, color: z.accent}}
                      >
                        {z.name}
                      </th>
                    ))}
                  </tr>

                  {/* Row 2: Gag icon + name + XP */}
                  <tr className="gag-name-row">
                    {track.gags.map((g, gi) => (
                      <th key={gi} className="gag-col-gag">
                        <Image
                          src={`/icons/gags/small/${track.trackKey}/${g}.png`}
                          alt={g}
                          width={44}
                          height={44}
                          className="gag-small-icon"
                        />
                        <div className="gag-col-name">{g}</div>
                        <div className="gag-col-xp">
                          <span>Min – {track.xpMin[gi]} XP</span>
                          <span>Max – {track.xpMax[gi]} XP</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {/* Toon rows — first row gets the track label rowspan */}
                  {([0,1,2,3] as ToonIndex[]).map((t) => (
                    <tr key={t} className="gag-toon-row">
                      {t === 0 && (
                        <td
                          className="gag-label-col"
                          rowSpan={totalBodyRows}
                        >
                          <div className="gag-label-col-inner">
                            <div className="gag-toon-labels">
                              {([0,1,2,3] as ToonIndex[]).map(ti => (
                                <span key={ti} className="gag-toon-label-item" style={{color: TOON_COLORS[ti]}}>
                                  Toon {ti + 1}
                                </span>
                              ))}
                            </div>
                            <div className="gag-stat-labels">
                              {track.stats.map((stat, si) => (
                                <span key={si} className="gag-stat-label-item">{stat.label}</span>
                              ))}
                            </div>
                          </div>
                        </td>
                      )}
                      {track.gags.map((g, gi) => (
                        <td key={gi} className="gag-col-gag gag-check-cell">
                          <CheckBtn
                            id={`g:${track.name}:${g}`}
                            toon={t}
                            label={`${toonNames[t]}: ${track.name} – ${g}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Stat rows */}
                  {track.stats.map((stat, si) => (
                    <tr key={si} className="gag-stat-row">
                      {stat.values.map((v, vi) => (
                        <td key={vi} className={`gag-col-gag gag-stat-val gag-stat-val--${stat.type ?? 'label'}`}>
                          {v ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
