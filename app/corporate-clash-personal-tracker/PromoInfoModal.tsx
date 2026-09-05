'use client';
import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';

interface Props {
  suitName: string;
  accent: string;
  onClose: () => void;
}

/* Highlight helper - longest phrases first for correct regex matching */
const SB_HIGHLIGHTS = [
  'Cold Caller Cog Disguise',
  'Senior Vice President',
  'Department Experience',
  'Sellbot Cog Buildings',
  'Sellbot Factories',
  'Sellbot Towers',
  'Department Levels',
  'Factory Foreman',
  'Sellbot HQ',
  'Mover and Shaker',
  'Mover & Shaker',
  'Merit Monday',
  'Cog Invasions',
  'Mr. Hollywood',
  'Boss Rewards',
  'Laff Points',
  'Laff Point',
  'Teleport access',
  'Cold Caller',
  'Boosters',
  'Sellbots',
  'Sellbot',
  'Invoices',
  'Invoice',
  'Factory',
  'Merits',
  'Merit',
  'V.P.',
  'IOU',
];

function SBHighlight({ text }: { text: string }) {
  const escaped = SB_HIGHLIGHTS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return (
    <>
      {parts.map((part, i) =>
        SB_HIGHLIGHTS.includes(part)
          ? <span key={i} className="pim-hl">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

/* Cog data */
const SB_REGULAR = [
  { name:'Cold Caller',    tier:'Tier 1 Employee', levels:'1-5',  dmg:'1-10',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Coldcaller_CG.gif' },
  { name:'Telemarketer',   tier:'Tier 2 Employee', levels:'2-6',  dmg:'1-12',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Telemarketer_CG.gif' },
  { name:'Name Dropper',   tier:'Tier 3 Employee', levels:'3-7',  dmg:'2-14',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Namedropper_CG.gif' },
  { name:'Glad Hander',    tier:'Tier 4 Employee', levels:'4-8',  dmg:'1-20',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Gladhander_CG.gif' },
  { name:'Mover & Shaker', tier:'Tier 5 Employee', levels:'5-10', dmg:'5-23',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mover&shaker_CG.gif' },
  { name:'Two-Face',       tier:'Tier 6 Employee', levels:'6-12', dmg:'5-22',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Twoface_CG.gif' },
  { name:'Mingler',        tier:'Tier 7 Employee', levels:'7-15', dmg:'7-32',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mingler_CG.gif' },
  { name:'Mr. Hollywood',  tier:'Tier 8 Employee', levels:'8-50', dmg:'8-60',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mrbollywood_CG.gif' },
];
const SB_SPECIAL = [
  { name:'Factory Foreman',                 tier:'Manager',          level:'11 (mgr)', dmg:'16-28',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-FactFore.gif' },
  { name:'Public Relations Representative', tier:'Manager',          level:'10 (mgr)', dmg:'13-24',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-PRR_CG.gif' },
  { name:'Director of Public Affairs',      tier:'Manager',          level:'30 (mgr)', dmg:'26-40',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-DOPA_CG.gif' },
  { name:'Bellringer',                      tier:'Regional Manager', level:'13 (mgr)', dmg:'10-15',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Bellringer_CG.gif' },
  { name:'Prethinker',                      tier:'Regional Manager', level:'12 (mgr)', dmg:'10-19',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Prethinker_CG.gif' },
  { name:'Multislacker',                    tier:'Regional Manager', level:'24 (mgr)', dmg:'18-25',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Multislacker_CG.gif' },
  { name:'Senior Vice President',           tier:'Boss',             level:'VP',       dmg:'Varies', img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-SeniorVicePresident_CG.gif' },
  { name:'Robber Baron',                    tier:'Boss',             level:'???',      dmg:'???',    img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-RobberBaron_CG.gif' },
];
const SB_REMOVED = [
  { name:'Director of Public Relations', tier:'Manager', level:'Removed', dmg:'N/A', img:'/icons/promotions/Sellbot/corporate-ladder/removed/300px-DOPRGal.gif' },
];

/* XP table */
const SB_XP_ROWS = [
  { source:'Any Sellbot',           base:'1x Cog level',    boost:'Merit Monday, Invasions, Boosters' },
  { source:'Sellbot Factories',     base:'Varies by area',  boost:'Merit Monday, Invasions, Boosters' },
  { source:'Sellbot Cog Buildings', base:'Varies by floors', boost:'Merit Monday, Boosters only' },
  { source:'Sellbot Towers (V.P.)', base:'No Dept XP',      boost:'N/A' },
];
/* Sellbot content */
function SellbotContent({ accent }: { accent: string }) {
  const [tab, setTab] = useState<'promos'|'ladder'>('promos');

  return (
    <div className="pim-inner">
      <div className="pim-inner-tabs">
        {(['promos','ladder'] as const).map(t => (
          <button
            key={t}
            className={`pim-inner-tab${tab === t ? ' pim-inner-tab--active' : ''}`}
            style={tab === t ? {'--pim-accent': accent} as React.CSSProperties : undefined}
            onClick={() => setTab(t)}
          >
            {t === 'promos' ? 'Sellbot Promotions' : 'Corporate Ladder'}
          </button>
        ))}
      </div>

      {tab === 'promos' && (
        <div className="pim-scroll">

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Suit Acquisition</h3>
            <div className="pim-info-block">
              <div className="pim-suit-header">
                <Image src="/icons/cog-emblems/SellbotEmblem.png" alt="Sellbot" width={32} height={32} className="pim-suit-emblem" unoptimized />
                <span className="pim-suit-name" style={{fontWeight:800}}>Sellbot Cog Suit</span>
              </div>
              <ul className="pim-list">
                <li><SBHighlight text="Earn the Cold Caller Cog Disguise by completing 5 Sellbot Factories." /></li>
                <li><SBHighlight text="Each Factory run defeats the Factory Foreman and rewards one suit part." /></li>
                <li><SBHighlight text="Run 5 short Factories for the quickest clear." /></li>
              </ul>
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Promotions Overview</h3>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>How promotions work:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Promotions are earned by defeating the Senior Vice President atop Sellbot Towers in Sellbot HQ." /></li>
                <li><SBHighlight text="Promotions are tracked separately from Department Levels." /></li>
                <li><SBHighlight text="The Sellbot equivalent of Merits is called Invoices." /></li>
                <li><SBHighlight text="Invoices are earned by defeating any Sellbots anywhere in the game." /></li>
                <li><SBHighlight text="A required number of Invoices must be collected before entering Sellbot Towers." /></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>Best ways to stack Invoices fast:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Sellbot Factories are the fastest method â€” many Sellbots are defeated per run." /></li>
                <li><SBHighlight text="Sellbot Cog Buildings also reward Invoices, but Invasions do not boost Merits inside buildings or facilities." /></li>
                <li><SBHighlight text="Boost earnings with Merit Monday, Cog Invasions, and Boosters." /></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>Milestone rewards:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Teleport access to Sellbot HQ is earned when a Toon reaches Mover and Shaker Level 5." /></li>
                <li><SBHighlight text="A Laff Point is earned at Mr. Hollywood Levels 8, 15, 20, 30, 40, and 50 â€” totaling 6 additional Laff Points." /></li>
              </ul>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Department Levels</h3>
            <p className="pim-section-sub">
              <SBHighlight text="Department Levels are separate from Promotions. Earn Dept XP by defeating Sellbots anywhere." />
            </p>
            <div className="pim-dept-levels">

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 40%,#1a0a14)`}}>
                  Level 10 &mdash; Sellbot Seeker
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Exclusive Sellbot Seeker outfit (shirt, shorts, and skirt options)" /></li>
                    <li><SBHighlight text="Unlocks access to higher-difficulty Sellbot content" /></li>
                  </ul>
                  <div className="pim-outfit-table-wrap">
                    <table className="pim-outfit-table">
                      <thead>
                        <tr>
                          <th className="pim-outfit-th" style={{color: accent}}>Shirt</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Shorts</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Skirt</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerShirt.png" alt="Sellbot Seeker Shirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerShorts.png" alt="Sellbot Seeker Shorts" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerSkirt.png" alt="Sellbot Seeker Skirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 30%,#1a0a14)`}}>
                  Level 20 &mdash; Sellbot Expert
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Boss Rewards â€” exclusive IOU note collectible" /></li>
                    <li><SBHighlight text="Grants access to advanced Sellbot encounters" /></li>
                  </ul>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 20%,#1a0a14)`}}>
                  Level 30 &mdash; Sellbot Master
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Boss Rewards â€” unlocks the Robber Baron encounter" /></li>
                    <li><SBHighlight text="Highest Sellbot Department Level milestone currently available" /></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Gaining Department XP</h3>
            <div className="pim-table-wrap">
              <table className="pim-xp-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Base XP</th>
                    <th>Boostable By</th>
                  </tr>
                </thead>
                <tbody>
                  {SB_XP_ROWS.map(r => (
                    <tr key={r.source}>
                      <td><span className="pim-xp-val"><SBHighlight text={r.source} /></span></td>
                      <td><SBHighlight text={r.base} /></td>
                      <td className="pim-muted"><SBHighlight text={r.boost} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pim-table-note">
              <SBHighlight text="Note: Cog Invasions do not boost Merits earned inside Sellbot Factories or Sellbot Cog Buildings. Only street Sellbots benefit from invasion multipliers." />
            </p>
          </div>

        </div>
      )}
      {tab === 'ladder' && (
        <div className="pim-scroll">

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>General Cogs</h3>
            <div className="pim-cog-grid">
              {SB_REGULAR.map(c => (
                <div key={c.name} className="pim-cog-card">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Levels {c.levels}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Special Cogs</h3>
            <div className="pim-cog-grid">
              {SB_SPECIAL.map(c => (
                <div key={c.name} className="pim-cog-card">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Level {c.level}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title pim-section-title--removed">Removed Cogs</h3>
            <div className="pim-cog-grid">
              {SB_REMOVED.map(c => (
                <div key={c.name} className="pim-cog-card pim-cog-card--removed">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name pim-cog-name--removed">{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Level {c.level}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}


/* Main exported modal */
export function PromoInfoModal({ suitName, accent, onClose }: Props) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const isSellbot = suitName === 'Sellbot';

  return (
    <div className="pgm-backdrop" onClick={onClose}>
      <div
        className={`pgm-box pim-box${isSellbot ? ' pim-box--sb' : ''}`}
        style={{'--pgm-accent': accent} as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        {isSellbot && <div className="pim-bg-overlay" />}

        <div className="pgm-header pim-header-raised">
          <Image
            src={`/icons/cog-emblems/${suitName}Emblem.png`}
            alt={suitName}
            width={36}
            height={36}
            className="pgm-emblem"
            unoptimized
          />
          <div className="pgm-header-text">
            <h2 className="pgm-title">{suitName}</h2>
            <span className="pgm-subtitle">{suitName} Additional Info</span>
          </div>
          <button className="pgm-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        <div className="pgm-body pgm-body--single pim-body-wrap">
          {isSellbot
            ? <SellbotContent accent={accent} />
            : <p className="pgm-info-placeholder">Additional information for {suitName} will be added here.</p>
          }
        </div>
      </div>
    </div>
  );
}