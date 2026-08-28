'use client';
import { LEVELING_REWARDS } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

export function SectionLeveling() {
  const { toonNames, toggleAll, isAllDone } = useTracker();
  return (
    <div className="tracker-section">
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
                        <CheckBtn id={key} toon={t} label={`${toonNames[t]}: Level ${row.level}`} />
                      </td>
                    ))}
                    <td className="col-all">
                      <button
                        className={`all-btn${allDone?' all-btn--done':''}`}
                        onClick={() => toggleAll(key)}
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
