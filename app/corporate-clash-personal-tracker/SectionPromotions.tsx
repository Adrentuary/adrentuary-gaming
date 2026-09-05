'use client';
import { useState } from 'react';
import { SectionNote } from './SectionNote';
import { LAST_UPDATED } from './last-updated';
import { PROMOTIONS } from './data-promotions';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

export function SectionPromotions() {
  const { toonNames, toggleAll, isAllDone } = useTracker();
  const [tab, setTab] = useState(0);
  const suit = PROMOTIONS[tab];
  return (
    <div className="tracker-section">
      <SectionNote
        description="Cog suit promotion costs for each department. Select a suit type using the tabs below. Track which promotions each toon has completed across all cog levels."
        status="Section design and interactive features are currently under development."
        lastUpdated={LAST_UPDATED.promotions}
        lastChanges="Initial promotions section added. Full cog suit promotion costs for all 5 departments with per-toon progress tracking across all levels."
      />
      <nav className="sub-tabs">
        {PROMOTIONS.map((s,i) => (
          <button key={s.name} className={`sub-tab${tab===i?' sub-tab--active':''}`} onClick={() => setTab(i)}>{s.name}</button>
        ))}
      </nav>
      <div className="tracker-card" style={{'--dc':suit.color,'--da':suit.accent} as React.CSSProperties}>
        <div className="tracker-card-header"><strong>{suit.name} Promotions — {suit.currency}</strong></div>
        {suit.cogs.map(cog => (
          <div key={cog.name} className="promo-cog-block">
            <div className="promo-cog-name">{cog.name}</div>
            <div className="promo-levels">
              {cog.levels.map(lv => {
                const key = `p:${suit.name}:${cog.name}:${lv.level}`;
                const allDone = isAllDone(key);
                return (
                  <div key={lv.level} className={`promo-level-group${allDone?' promo-level-group--done':''}`}>
                    <div className="promo-level-label">Lvl {lv.level}</div>
                    <div className="promo-cost">{lv.cost === 'MAXED' ? '🏆 MAXED' : `${lv.cost}`}</div>
                    <div className="promo-toon-checks">
                      {([0,1,2,3] as ToonIndex[]).map(t => (
                        <CheckBtn key={t} id={key} toon={t} small label={`${toonNames[t]}: ${cog.name} Lvl ${lv.level}`} />
                      ))}
                    </div>
                    <button
                      className={`all-btn all-btn--sm${allDone?' all-btn--done':''}`}
                      onClick={() => toggleAll(key)}
                      title={allDone ? 'Unmark all' : 'Mark all toons'}
                      aria-label={`Mark all toons: ${cog.name} Lvl ${lv.level}`}
                    >{allDone ? '★' : '☆'}</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
