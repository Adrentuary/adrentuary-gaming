﻿﻿﻿﻿﻿﻿﻿﻿'use client';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { GagResetDrawer } from './GagResetDrawer';
import { GAG_TRACKS, RECOMMENDED_ZONES } from './data-gags';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

export function SectionGags() {
  const { toonNames, isDone, setProgressBatch } = useTracker();

  return (
    <div className="tracker-section">
      <SectionNote
        description="Gag XP requirements and recommended training zones per track."
        status="Section design and interactive features are currently under development."
        lastUpdated="September 1st, 2026"
        lastChanges="Added per-track gag reset drawer with large gag icons. Min-cascade fixed: clicking a lower gag level auto-unchecks all higher levels atomically."
      />
      <GagResetDrawer />
      {GAG_TRACKS.map(track => (
        <div key={track.name} className="gag-card"
          style={{"--gc": track.color, "--gh": track.headerColor, "--gl": track.labelColor} as React.CSSProperties}>
          <div className="gag-table-scroll">
            <table className="gag-ss-table">
              <thead>
                <tr className="gag-ss-zone-row">
                  <td className="gag-ss-track-cell" rowSpan={4}>
                    <Image src={`/icons/gags/large/${track.largeIcon}`}
                      alt={track.name} width={60} height={60} className="gag-ss-large-icon" />
                    <span className="gag-ss-track-name">{track.name}</span>
                  </td>
                  <td className="gag-ss-label-hdr gag-ss-zone-label-cell">
                    <span className="gag-ss-zone-label-text">Recommended<br/>Zone</span>
                  </td>
                  {RECOMMENDED_ZONES.map((z, zi) => (
                    <td key={zi} colSpan={(z as {span?:number}).span ?? 1}
                      className="gag-ss-zone-cell"
                      style={{background: z.color, color: z.accent}}>
                      <Image src={`/icons/playground-emblems/${z.pgKey}.png`}
                        alt={z.name} width={28} height={28} className="gag-ss-zone-emblem" unoptimized />
                      <span className="gag-ss-zone-name">{z.name}</span>
                    </td>
                  ))}
                </tr>
                <tr className="gag-ss-gag-row">
                  <td className="gag-ss-label-hdr" />
                  {track.gags.map((g, gi) => (
                    <td key={gi} className="gag-ss-gag-cell"
                      colSpan={gi === track.gags.length - 1 ? 2 : 1}>
                      <Image src={`/icons/gags/small/${track.trackKey}/${g}.png`}
                        alt={g} width={44} height={44} className="gag-ss-small-icon" />
                      <div className="gag-ss-gag-name">{g}</div>
                    </td>
                  ))}
                </tr>
                <tr className="gag-ss-min-row">
                  <td className="gag-ss-label-hdr gag-ss-minmax-label">
                    <div className="gag-ss-tnum-group">
                      {([0,1,2,3] as ToonIndex[]).map(t => (
                        <span key={t} className="gag-ss-tnum" style={{color: TOON_COLORS[t]}}>{t+1}</span>
                      ))}
                    </div>
                  </td>
                  {track.gags.map((g, gi) => (
                    <td key={gi} className="gag-ss-minmax-cell"
                      colSpan={gi === track.gags.length - 1 ? 2 : 1}>
                      <div className="gag-ss-minmax-inner">
                        <div className="gag-ss-check-group">
                          {([0,1,2,3] as ToonIndex[]).map(t => {
                            const key = `g:${track.name}:${g}:min`;
                            const done = isDone(key, t);
                            const handleMinClick = () => {
                              const toDone: { key: string; toon: ToonIndex }[] = [];
                              const toUndone: { key: string; toon: ToonIndex }[] = [];
                              if (!done) {
                                for (let i = 0; i < gi; i++) {
                                  toDone.push({ key: `g:${track.name}:${track.gags[i]}:min`, toon: t });
                                  toDone.push({ key: `g:${track.name}:${track.gags[i]}:max`, toon: t });
                                }
                                toDone.push({ key: `g:${track.name}:${track.gags[gi]}:min`, toon: t });
                                for (let i = gi; i < track.gags.length; i++) {
                                  toUndone.push({ key: `g:${track.name}:${track.gags[i]}:max`, toon: t });
                                  if (i > gi) toUndone.push({ key: `g:${track.name}:${track.gags[i]}:min`, toon: t });
                                }
                              } else {
                                for (let i = gi; i < track.gags.length; i++) {
                                  toUndone.push({ key: `g:${track.name}:${track.gags[i]}:min`, toon: t });
                                  toUndone.push({ key: `g:${track.name}:${track.gags[i]}:max`, toon: t });
                                }
                              }
                              setProgressBatch(toDone, toUndone);
                            };
                            return (
                              <button key={t}
                                className={`gag-ss-chk${done ? " gag-ss-chk--done gag-ss-chk--min-done" : ""}`}
                                style={done ? {"--tc": TOON_COLORS[t]} as React.CSSProperties : {}}
                                onClick={handleMinClick}
                                aria-label={`${toonNames[t]}: ${track.name} - ${g} (Min)`}>✓</button>
                            );
                          })}
                        </div>
                        <span className="gag-ss-xp-text gag-ss-xp-text--min">Min - {track.xpMin[gi]} XP</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="gag-ss-max-row">
                  <td className="gag-ss-label-hdr gag-ss-minmax-label">
                    <div className="gag-ss-tnum-group">
                      {([0,1,2,3] as ToonIndex[]).map(t => (
                        <span key={t} className="gag-ss-tnum" style={{color: TOON_COLORS[t]}}>{t+1}</span>
                      ))}
                    </div>
                  </td>
                  {track.gags.map((g, gi) => (
                    <td key={gi} className="gag-ss-minmax-cell"
                      colSpan={gi === track.gags.length - 1 ? 2 : 1}>
                      <div className="gag-ss-minmax-inner">
                        <div className="gag-ss-check-group">
                          {([0,1,2,3] as ToonIndex[]).map(t => {
                            const key = `g:${track.name}:${g}:max`;
                            const done = isDone(key, t);
                            const handleMaxClick = () => {
                              const toDone: { key: string; toon: ToonIndex }[] = [];
                              const toUndone: { key: string; toon: ToonIndex }[] = [];
                              if (!done) {
                                for (let i = 0; i <= gi; i++) {
                                  toDone.push({ key: `g:${track.name}:${track.gags[i]}:min`, toon: t });
                                  toDone.push({ key: `g:${track.name}:${track.gags[i]}:max`, toon: t });
                                }
                                for (let i = gi + 1; i < track.gags.length; i++) {
                                  toUndone.push({ key: `g:${track.name}:${track.gags[i]}:min`, toon: t });
                                  toUndone.push({ key: `g:${track.name}:${track.gags[i]}:max`, toon: t });
                                }
                              } else {
                                for (let i = gi; i < track.gags.length; i++) {
                                  toUndone.push({ key: `g:${track.name}:${track.gags[i]}:min`, toon: t });
                                  toUndone.push({ key: `g:${track.name}:${track.gags[i]}:max`, toon: t });
                                }
                              }
                              setProgressBatch(toDone, toUndone);
                            };
                            return (
                              <button key={t}
                                className={`gag-ss-chk${done ? " gag-ss-chk--done gag-ss-chk--max-done" : ""}`}
                                style={done ? {"--tc": TOON_COLORS[t]} as React.CSSProperties : {}}
                                onClick={handleMaxClick}
                                aria-label={`${toonNames[t]}: ${track.name} - ${g} (Max)`}>✓</button>
                            );
                          })}
                        </div>
                        <span className="gag-ss-xp-text gag-ss-xp-text--max">Max - {track.xpMax[gi]} XP</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {track.stats.map((stat, si) => (
                  <tr key={si} className={`gag-ss-stat-row${stat.prestige ? " gag-ss-stat-row--prestige" : ""}`}>
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
                      <td key={vi} className={`gag-ss-stat-val gag-ss-stat-val--${stat.type ?? "label"}`}
                        colSpan={vi === stat.values.length - 1 ? 2 : 1}>{v ?? "—"}</td>
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