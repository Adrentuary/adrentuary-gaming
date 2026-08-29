'use client';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { GAG_TRACKS, RECOMMENDED_ZONES } from './data-gags';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

export function SectionGags() {
  const { toonNames, toggle, isDone } = useTracker();
  return (
    <div className="tracker-section">
      <SectionNote
        description="Gag XP requirements and recommended training zones per track. Min columns show the minimum XP needed to unlock the next tier; Max columns show the XP cap for that tier. Prestige rows are marked with a star."
        status="Section design and interactive features are currently under development."
        lastUpdated="September 9th, 2026 4:21 PM"
      />
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
                      style={{background: z.color, color: z.accent}}>
                      <span className="gag-ss-zone-icon">{z.icon}</span>
                      <span className="gag-ss-zone-name">{z.name}</span>
                    </td>
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
                    <div className="gag-ss-tnum-col">
                      <span className="gag-ss-tnum-heading gag-ss-tnum-heading--min">Min</span>
                      <div className="gag-ss-tnum-group">
                        {([0,1,2,3] as ToonIndex[]).map(t => (
                          <span key={t} className="gag-ss-tnum" style={{color: TOON_COLORS[t]}}>{t+1}</span>
                        ))}
                      </div>
                    </div>
                    <div className="gag-ss-tnum-col">
                      <span className="gag-ss-tnum-heading gag-ss-tnum-heading--max">Max</span>
                      <div className="gag-ss-tnum-group">
                        {([0,1,2,3] as ToonIndex[]).map(t => (
                          <span key={t} className="gag-ss-tnum" style={{color: TOON_COLORS[t]}}>{t+1}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  {track.gags.map((g) => (
                    <td key={g} className="gag-ss-tnum-cell">
                      <div className="gag-ss-chk-pair">
                        <div className="gag-ss-chk-col gag-ss-chk-col--min">
                          <div className="gag-ss-check-group">
                            {([0,1,2,3] as ToonIndex[]).map(t => {
                              const key = `g:${track.name}:${g}:min`;
                              const done = isDone(key, t);
                              return (<button key={t}
                                className={`gag-ss-chk${done?' gag-ss-chk--done gag-ss-chk--min-done':''}`}
                                style={done?{'--tc':TOON_COLORS[t]} as React.CSSProperties:{}}
                                onClick={() => toggle(key, t)}
                                aria-label={`${toonNames[t]}: ${track.name} – ${g} (Min)`}>✓</button>);
                            })}
                          </div>
                        </div>
                        <div className="gag-ss-chk-col gag-ss-chk-col--max">
                          <div className="gag-ss-check-group">
                            {([0,1,2,3] as ToonIndex[]).map(t => {
                              const key = `g:${track.name}:${g}:max`;
                              const done = isDone(key, t);
                              return (<button key={t}
                                className={`gag-ss-chk${done?' gag-ss-chk--done gag-ss-chk--max-done':''}`}
                                style={done?{'--tc':TOON_COLORS[t]} as React.CSSProperties:{}}
                                onClick={() => toggle(key, t)}
                                aria-label={`${toonNames[t]}: ${track.name} – ${g} (Max)`}>✓</button>);
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {track.stats.map((stat, si) => (
                  <tr key={si} className={`gag-ss-stat-row${stat.prestige?' gag-ss-stat-row--prestige':''}`}>
                    {si === 0 && (
                      <td className="gag-ss-track-cell gag-ss-track-cell--stat" rowSpan={track.stats.length} />
                    )}
                    <td className="gag-ss-stat-label">
                      {stat.prestige && (
                        <Image src="/icons/gags/PrestigeStar.webp" alt="Prestige" width={14} height={14} className="gag-ss-prestige-star" unoptimized />
                      )}
                      {stat.label}
                    </td>
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
