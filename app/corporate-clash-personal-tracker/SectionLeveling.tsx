'use client';
import { useCallback } from 'react';
import { SectionNote } from './SectionNote';
import { LevelResetDrawer } from './LevelResetDrawer';
import { LAST_UPDATED } from './last-updated';
import { LEVELING_REWARDS } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const COLLAPSED_KEY = 'leveling-groups';

// Group header levels: a header row appears before each of these levels
const GROUP_STARTS = [2, 11, 21, 31, 41, 51, 61, 71, 81];
function groupLabel(startLevel: number): string {
  const endLevel = startLevel <= 10 ? 10 : Math.min(startLevel + 9, 85);
  return `Levels ${startLevel}–${endLevel}`;
}

// Parse a reward string into colored segments
function RewardBadges({ reward }: { reward: string }) {
  const parts = reward.split(' · ');
  return (
    <span className="lv-reward">
      {parts.map((part, i) => {
        let cls = '';
        if (part === 'Training point') cls = 'lv-badge lv-badge--blue';
        else if (part.startsWith('Carry ') && part.endsWith('gags')) cls = 'lv-badge lv-badge--green';
        else if (part.startsWith('Carry ') && part.endsWith('jellybeans')) cls = 'lv-badge lv-badge--yellow';
        return cls
          ? <span key={i} className={cls}>{part}</span>
          : <span key={i} style={{marginRight:2}}>{part}</span>;
      })}
    </span>
  );
}

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
        lastUpdated={LAST_UPDATED.leveling}
        lastChanges="Inline collapsible 10-level groups. Color-coded reward badges for training points, gag pouch, and jellybean capacity."
      />
      <LevelResetDrawer />
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
                const isGroupStart = GROUP_STARTS.includes(row.level);
                const label = isGroupStart ? groupLabel(row.level) : '';
                const isOpen = !collapsedGroups.has(label);
                // Find which group this row belongs to
                const myGroupStart = GROUP_STARTS.slice().reverse().find(s => s <= row.level) ?? 2;
                const myLabel = groupLabel(myGroupStart);
                const myGroupOpen = !collapsedGroups.has(myLabel);
                return (
                  <>
                    {isGroupStart && (
                      <tr key={`grp-${row.level}`} className="lv-section-header">
                        <td colSpan={4 + toonNames.length + 1}>
                          <button className="lv-collapse-btn" onClick={() => toggleGroup(label)} aria-expanded={isOpen}>
                            <span className="lv-collapse-arrow">{isOpen ? '▼' : '▶'}</span>
                            {label}
                          </button>
                        </td>
                      </tr>
                    )}
                    {myGroupOpen && (
                      <tr key={ri} className={allDone ? 'row-all-done' : ''}>
                        <td className="col-sm">{row.level}</td>
                        <td className="col-sm">{row.laff}</td>
                        <td className="col-sm">{row.xp.toLocaleString()}</td>
                        <td className="col-main"><RewardBadges reward={row.reward} /></td>
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
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
