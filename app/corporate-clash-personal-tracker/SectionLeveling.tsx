'use client';
import { useCallback } from 'react';
import { SectionNote } from './SectionNote';
import { LEVELING_REWARDS } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

export function SectionLeveling() {
  const { toonNames, progress, toggle, toggleAll, isAllDone } = useTracker();

  const allKeys = LEVELING_REWARDS.map(r => `lv:${r.level}`);

  const handleLevelClick = useCallback((key: string, toon: ToonIndex) => {
    const idx = allKeys.indexOf(key);
    if (idx === -1) { toggle(key, toon); return; }
    const done = !!(progress[key]?.[toon]);
    if (!done) {
      for (let i = 0; i <= idx; i++) {
        if (!progress[allKeys[i]]?.[toon]) toggle(allKeys[i], toon);
      }
    } else {
      for (let i = idx; i < allKeys.length; i++) {
        if (progress[allKeys[i]]?.[toon]) toggle(allKeys[i], toon);
      }
    }
  }, [allKeys, progress, toggle]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLevelAll = useCallback((key: string) => {
    const idx = allKeys.indexOf(key);
    if (idx === -1) { toggleAll(key); return; }
    const allDone = isAllDone(key);
    ([0,1,2,3] as ToonIndex[]).forEach(toon => {
      if (!allDone) {
        for (let i = 0; i <= idx; i++) {
          if (!progress[allKeys[i]]?.[toon]) toggle(allKeys[i], toon);
        }
      } else {
        for (let i = idx; i < allKeys.length; i++) {
          if (progress[allKeys[i]]?.[toon]) toggle(allKeys[i], toon);
        }
      }
    });
  }, [allKeys, progress, toggle, toggleAll, isAllDone]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="tracker-section">
      <SectionNote
        description="Character level rewards from 2 through 85. Clicking a level auto-marks all previous levels for that toon. Rewards include laff boosts, gag access, and other progression milestones."
        status="Section design and interactive features are currently under development."
        lastUpdated="September 9th, 2026 4:21 PM"
      />
      <div className="tracker-card" style={{'--dc':'#1a2540','--da':'#7b6cf0'} as React.CSSProperties}>
        <div className="tracker-card-header">
          <strong>Leveling Rewards</strong>
          <span className="tracker-card-sub">Max Laff: 99 · Levels 2–85</span>
        </div>
        <div className="tracker-table-wrap">
          <table className="tracker-table">
            <thead><tr>
              <th className="col-sm">Level</th>
              <th className="col-sm">Laff</th>
              <th className="col-sm">XP from prev</th>
              <th className="col-main">Reward</th>
              {toonNames.map((n,i) => (
                <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>
              ))}
              <th className="col-all">All</th>
            </tr></thead>
            <tbody>
              {LEVELING_REWARDS.map((row, ri) => {
                const key = `lv:${row.level}`;
                const allDone = isAllDone(key);
                return (
                  <tr key={ri} className={allDone ? 'row-all-done' : ''}>
                    <td className="col-sm">{row.level}</td>
                    <td className="col-sm">{row.laff}</td>
                    <td className="col-sm">{row.xp.toLocaleString()}</td>
                    <td className="col-main">{row.reward}</td>
                    {([0,1,2,3] as ToonIndex[]).map(t => (
                      <td key={t} className="col-toon">
                        <button
                          className={`check-btn${progress[key]?.[t] ? ' check-btn--done' : ''}`}
                          style={progress[key]?.[t] ? {'--tc': TOON_COLORS[t]} as React.CSSProperties : {}}
                          onClick={() => handleLevelClick(key, t)}
                          aria-label={`${toonNames[t]}: Level ${row.level}`}
                        >&#10003;</button>
                      </td>
                    ))}
                    <td className="col-all">
                      <button
                        className={`all-btn${allDone?' all-btn--done':''}`}
                        onClick={() => handleLevelAll(key)}
                        title={allDone ? 'Unmark all' : 'Mark all toons'}
                        aria-label={`Mark all toons: Level ${row.level}`}
                      >{allDone ? '★' : '☆'}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
