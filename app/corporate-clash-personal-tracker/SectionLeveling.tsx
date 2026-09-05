'use client';
import { useCallback } from 'react';
import { SectionNote } from './SectionNote';
import { LevelResetDrawer } from './LevelResetDrawer';
import { LEVELING_REWARDS } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const COLLAPSED_KEY = 'leveling-groups';

function buildGroups() {
  const groups: { label: string; rows: typeof LEVELING_REWARDS }[] = [];
  let i = 0;
  while (i < LEVELING_REWARDS.length) {
    const first = LEVELING_REWARDS[i].level;
    const groupEnd = first <= 10 ? 10 : Math.ceil(first / 10) * 10;
    const slice: typeof LEVELING_REWARDS = [];
    while (i < LEVELING_REWARDS.length && LEVELING_REWARDS[i].level <= groupEnd) {
      slice.push(LEVELING_REWARDS[i]);
      i++;
    }
    const last = slice[slice.length - 1].level;
    groups.push({ label: `Levels ${first}–${last}`, rows: slice });
  }
  return groups;
}
const LEVEL_GROUPS = buildGroups();

export function SectionLeveling() {
  const { toonNames, progress, toggle, toggleAll, isAllDone, collapsedUI, setCollapsedUI } = useTracker();

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

  const collapsedGroups = new Set<string>(collapsedUI[COLLAPSED_KEY] ?? []);
  const toggleGroup = (label: string) => {
    setCollapsedUI(prev => {
      const cur = new Set<string>(prev[COLLAPSED_KEY] ?? []);
      cur.has(label) ? cur.delete(label) : cur.add(label);
      return { ...prev, [COLLAPSED_KEY]: [...cur] };
    });
  };

  return (
    <div className="tracker-section">
      <SectionNote
        description="Character level rewards from 2 through 85. Clicking a level auto-marks all previous levels for that toon. Rewards include laff boosts, gag access, and other progression milestones."
        status="Everything in this section is currently up to date."
        lastUpdated="September 5th, 2026"
        lastChanges="Grouped levels into collapsible 10-level panels."
      />
      <LevelResetDrawer />
      <div className="lv-groups-list">
        {LEVEL_GROUPS.map(group => {
          const isCollapsed = collapsedGroups.has(group.label);
          return (
            <div key={group.label} className="tracker-card" style={{'--dc':'#1a2540','--da':'#7b6cf0'} as React.CSSProperties}>
              <button
                className={`tracker-card-header lv-group-header${isCollapsed ? ' lv-group-header--collapsed' : ''}`}
                onClick={() => toggleGroup(group.label)}
                aria-expanded={!isCollapsed}
              >
                <span className="lv-group-arrow">{isCollapsed ? '▶' : '▼'}</span>
                <strong>{group.label}</strong>
              </button>
              {!isCollapsed && (
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
                      {group.rows.map((row, ri) => {
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
