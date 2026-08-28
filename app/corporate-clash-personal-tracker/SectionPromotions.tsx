'use client';
import { useState } from 'react';
import { PROMOTIONS } from './data-promotions';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

export function SectionPromotions() {
  const { toonNames } = useTracker();
  const [tab, setTab] = useState(0);
  const suit = PROMOTIONS[tab];
  return (
    <div className="tracker-section">
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
                return (
                  <div key={lv.level} className="promo-level-group">
                    <div className="promo-level-label">Lvl {lv.level}</div>
                    <div className="promo-cost">{lv.cost === 'MAXED' ? '🏆 MAXED' : `${lv.cost}`}</div>
                    <div className="promo-toon-checks">
                      {([0,1,2,3] as ToonIndex[]).map(t => (
                        <CheckBtn key={t} id={key} toon={t} small label={`${toonNames[t]}: ${cog.name} Lvl ${lv.level}`} />
                      ))}
                    </div>
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
