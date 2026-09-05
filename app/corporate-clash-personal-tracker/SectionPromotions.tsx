'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { LAST_UPDATED } from './last-updated';
import { PROMOTIONS } from './data-promotions';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { PromoInfoModal } from './PromoInfoModal';

const COLLAPSED_KEY = 'promo-cogs';
type Lv = { level: number; cost: string };

export function SectionPromotions() {
  const { toonNames, progress, toggle, isAllDone, collapsedUI, setCollapsedUI } = useTracker();
  const [tab, setTab]           = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const suit = PROMOTIONS[tab];

  const nsKey     = `${COLLAPSED_KEY}:${suit.name}`;
  const collapsed = new Set<string>(collapsedUI[nsKey] ?? []);
  const isCogOpen = (n: string) => !collapsed.has(n);
  const toggleCog = (n: string) => {
    setCollapsedUI(prev => {
      const cur = new Set<string>(prev[nsKey] ?? []);
      cur.has(n) ? cur.delete(n) : cur.add(n);
      return { ...prev, [nsKey]: [...cur] };
    });
  };

  const handleLvClick = useCallback((cogName: string, levels: Lv[], li: number, toon: ToonIndex) => {
    const keys = levels.map(lv => `p:${suit.name}:${cogName}:${lv.level}`);
    const done = !!(progress[keys[li]]?.[toon]);
    if (!done) { for (let i=0;i<=li;i++)           { if(!progress[keys[i]]?.[toon]) toggle(keys[i],toon); } }
    else       { for (let i=li;i<keys.length;i++)  { if( progress[keys[i]]?.[toon]) toggle(keys[i],toon); } }
  }, [suit.name, progress, toggle]);

  const handleLvAll = useCallback((cogName: string, levels: Lv[], li: number) => {
    const keys = levels.map(lv => `p:${suit.name}:${cogName}:${lv.level}`);
    const all  = isAllDone(keys[li]);
    ([0,1,2,3] as ToonIndex[]).forEach(toon => {
      if (!all) { for (let i=0;i<=li;i++)          { if(!progress[keys[i]]?.[toon]) toggle(keys[i],toon); } }
      else      { for (let i=li;i<keys.length;i++) { if( progress[keys[i]]?.[toon]) toggle(keys[i],toon); } }
    });
  }, [suit.name, progress, toggle, isAllDone]);


  return (
    <div className="tracker-section">
      <SectionNote
        description="Cog suit promotion costs for each department. Select a suit using the tabs. Click a level to auto-mark all previous levels for that toon. Each cog row is collapsible."
        status="Everything in this section is currently up to date."
        lastUpdated={LAST_UPDATED.promotions}
        lastChanges="Cog head icons, collapsible cog rows, progressive level clicking, and suit info modals added."
      />
      <nav className="sub-tabs">
        {PROMOTIONS.map((s,i) => (
          <button key={s.name} className={`sub-tab${tab===i?' sub-tab--active':''}`}
            onClick={() => { setTab(i); setInfoOpen(false); }}>{s.name}</button>
        ))}
      </nav>
      <div className="tracker-card" style={{'--dc':suit.color,'--da':suit.accent} as React.CSSProperties}>
        <div className="tracker-card-header">
          <strong>{suit.name} Promotions — {suit.currency}</strong>
          <button className="pgm-title-btn pgm-title-btn--right" onClick={() => setInfoOpen(true)}
            title={`View ${suit.name} additional info`}>
            <span className="pgm-title-btn-badge">{suit.name} Additional Info</span>
          </button>
        </div>
        {suit.cogs.map(cog => {
          const open       = isCogOpen(cog.name);
          const allCogDone = cog.levels.every(lv => isAllDone(`p:${suit.name}:${cog.name}:${lv.level}`));
          return (
            <div key={cog.name} className="promo-cog-block">
              <button className={`promo-cog-toggle${allCogDone?' promo-cog-toggle--done':''}`}
                onClick={() => toggleCog(cog.name)} aria-expanded={open}>
                <Image src={cog.icon} alt={cog.name} width={22} height={22} className="promo-cog-icon" unoptimized />
                <span className="promo-cog-toggle-name">{cog.name}</span>
                <span className="promo-cog-toggle-arrow">{open ? '▼' : '▶'}</span>
              </button>
              {open && (
                <div className="promo-levels">
                  {cog.levels.map((lv, li) => {
                    const key     = `p:${suit.name}:${cog.name}:${lv.level}`;
                    const allDone = isAllDone(key);
                    return (
                      <div key={lv.level} className={`promo-level-group${allDone?' promo-level-group--done':''}`}>
                        <div className="promo-level-label">Lvl {lv.level}</div>
                        <div className="promo-cost">{lv.cost === 'MAXED' ? '🏆 MAXED' : lv.cost}</div>
                        <div className="promo-toon-checks">
                          {([0,1,2,3] as ToonIndex[]).map(t => (
                            <button key={t}
                              className={`all-btn all-btn--sm${progress[key]?.[t]?' all-btn--done':''}`}
                              style={{'--da':TOON_COLORS[t]} as React.CSSProperties}
                              onClick={() => handleLvClick(cog.name, cog.levels, li, t)}
                              title={`${toonNames[t]}: ${cog.name} Lvl ${lv.level}`}
                            >{progress[key]?.[t] ? '★' : '☆'}</button>
                          ))}
                        </div>
                        <button className={`all-btn all-btn--sm${allDone?' all-btn--done':''}`}
                          onClick={() => handleLvAll(cog.name, cog.levels, li)}
                          title={allDone ? 'Unmark all' : 'Mark all toons'}
                        >{allDone ? '★' : '☆'}</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {infoOpen && (
        <PromoInfoModal suitName={suit.name} accent={suit.accent} onClose={() => setInfoOpen(false)} />
      )}
    </div>
  );
}
