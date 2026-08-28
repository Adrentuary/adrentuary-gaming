'use client';
import Image from 'next/image';
import { GAG_TRACKS, RECOMMENDED_ZONES } from './data-gags';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

export function SectionGags() {
  const { toonNames } = useTracker();
  return (
    <div className="tracker-section">
      {GAG_TRACKS.map(track => (
        <div
          key={track.name}
          className="gag-card"
          style={{'--gc': track.color, '--gh': track.headerColor, '--gl': track.labelColor} as React.CSSProperties}
        >
          {/* Track header */}
          <div className="gag-card-header">
            <Image
              src={`/icons/gags/large/${track.largeIcon}`}
              alt={track.name}
              width={36}
              height={36}
              className="gag-large-icon"
            />
            <span className="gag-track-name">{track.name}</span>
          </div>

          <div className="gag-table-scroll">
            <table className="gag-redesign-table">
              {/* Recommended zones row */}
              <thead>
                <tr className="gag-zone-row">
                  <th className="gag-col-label"></th>
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

                {/* Gag name + XP row */}
                <tr className="gag-name-row">
                  <th className="gag-col-label">Toon</th>
                  {track.gags.map((g, gi) => (
                    <th key={gi} className="gag-col-gag">
                      <Image
                        src={`/icons/gags/small/${track.trackKey}/${g}.png`}
                        alt={g}
                        width={38}
                        height={38}
                        className="gag-small-icon"
                      />
                      <div className="gag-col-name">{g}</div>
                      <div className="gag-col-xp">{track.xpMin[gi]}–{track.xpMax[gi]}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Toon check rows */}
                {([0,1,2,3] as ToonIndex[]).map(t => (
                  <tr key={t} className="gag-toon-row">
                    <td className="gag-col-label gag-toon-name" style={{color: TOON_COLORS[t]}}>
                      {toonNames[t]}
                    </td>
                    {track.gags.map((g, gi) => (
                      <td key={gi} className="gag-col-gag">
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
                    <td className="gag-col-label gag-stat-label">{stat.label}</td>
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
      ))}
    </div>
  );
}
