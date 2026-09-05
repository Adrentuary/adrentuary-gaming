'use client';
import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';

interface Props {
  suitName: string;
  accent: string;
  onClose: () => void;
}

/* ── Highlight helper ───────────────────────────────────────────────── */
const SB_HIGHLIGHTS = [
  'Factory Foreman','Factory','Sellbot','Sellbots','Senior Vice President',
  'Sellbot HQ','Sellbot Factories','Sellbot Towers','Department Levels',
  'Invoices','Invoice','Merits','Merit Monday','Cog Invasions','Boosters',
  'Cog Buildings','Teleport access','Mover and Shaker','Mover & Shaker',
  'Laff Point','Mr. Hollywood','Cold Caller','Cog Disguise','V.P.',
  'Department Experience','Boss Rewards','IOU',
];

function SBHighlight({ text }: { text: string }) {
  const escaped = SB_HIGHLIGHTS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
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

/* ── Cog data ───────────────────────────────────────────────────────── */
const SB_REGULAR = [
  { name:'Cold Caller',    tier:'Tier 1 Employee',  levels:'1–5',   dmg:'1–10',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Coldcaller_CG.gif' },
  { name:'Telemarketer',   tier:'Tier 2 Employee',  levels:'2–6',   dmg:'1–12',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Telemarketer_CG.gif' },
  { name:'Name Dropper',   tier:'Tier 3 Employee',  levels:'3–7',   dmg:'2–14',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Namedropper_CG.gif' },
  { name:'Glad Hander',    tier:'Tier 4 Employee',  levels:'4–8',   dmg:'1–20',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Gladhander_CG.gif' },
  { name:'Mover & Shaker', tier:'Tier 5 Employee',  levels:'5–10',  dmg:'5–23',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mover&shaker_CG.gif' },
  { name:'Two-Face',       tier:'Tier 6 Employee',  levels:'6–12',  dmg:'5–22',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Twoface_CG.gif' },
  { name:'Mingler',        tier:'Tier 7 Employee',  levels:'7–15',  dmg:'7–32',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mingler_CG.gif' },
  { name:'Mr. Hollywood',  tier:'Tier 8 Employee',  levels:'8–50',  dmg:'8–60',   img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mrbollywood_CG.gif' },
];
const SB_SPECIAL = [
  { name:'Factory Foreman',                  tier:'Manager',          level:'11.mgr',       dmg:'16–28',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-FactFore.gif' },
  { name:'Public Relations Representative',  tier:'Manager',          level:'10.mgr',       dmg:'13–24',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-PRR_CG.gif' },
  { name:'Director of Public Affairs',       tier:'Manager',          level:'30.mgr',       dmg:'26–40',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-DOPA_CG.gif' },
  { name:'Bellringer',                       tier:'Regional Manager', level:'13.mgr',       dmg:'10–15',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Bellringer_CG.gif' },
  { name:'Prethinker',                       tier:'Regional Manager', level:'12.mgr',       dmg:'10–19',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Prethinker_CG.gif' },
  { name:'Multislacker',                     tier:'Regional Manager', level:'24.mgr',       dmg:'18–25',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Multislacker_CG.gif' },
  { name:'Pacesetter',                       tier:'Regional Manager', level:'66.mgr',       dmg:'34–44+', img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Pacesetter_CG.gif' },
  { name:'Senior Vice President',            tier:'Boss',             level:'[CLASSIFIED]', dmg:'???',    img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-VPGif.gif' },
];
const SB_REMOVED = [
  { name:'Director of Public Relations', tier:'Manager', level:'10.mgr', dmg:'13–24', img:'/icons/promotions/Sellbot/corporate-ladder/removed/300px-DOPRGal.gif' },
];


/* ── Sellbot content component ──────────────────────────────────────── */
function SellbotContent({ accent }: { accent: string }) {
  const [innerTab, setInnerTab] = useState(0);
  return (
    <div className="pim-inner">
      <nav className="pim-inner-tabs">
        {['Sellbot Promotions','Corporate Ladder'].map((label, i) => (
          <button key={label}
            className={`pim-inner-tab${innerTab===i?' pim-inner-tab--active':''}`}
            style={{'--pim-accent':accent} as React.CSSProperties}
            onClick={() => setInnerTab(i)}>
            {label}
          </button>
        ))}
      </nav>


      {innerTab === 0 && (
        <div className="pim-scroll">
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Sellbot Promotions</h3>
            <p className="pim-section-sub">Overview on Sellbot promotion and cog suit levels.</p>
            <div className="pim-info-block">
              <div className="pim-suit-header">
                <Image src="/icons/cog-emblems/SellbotEmblem.png" alt="Sellbot" width={32} height={32} className="pim-suit-emblem" unoptimized />
                <strong className="pim-suit-name">Sellbot Suit</strong>
              </div>
              <p className="pim-para">Defeat the <span className="pim-hl">Factory Foreman</span> at the end of the <span className="pim-hl">Factory</span> to earn 1 <span className="pim-hl">Sellbot</span> Suit part. You need <strong>5 parts</strong> in total to complete the disguise.</p>
              <ul className="pim-list">
                <li>Complete <strong>5 Sellbot Factories</strong> <em>(either entrance is accepted)</em></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para"><SBHighlight text="Sellbot Promotions begin with the Cold Caller Cog Disguise after completing 5 Sellbot Factories by defeating the Factory Foreman. Each Factory rewards one suit part — run 5 short Factories for the quickest clear." /></p>
              <p className="pim-para"><SBHighlight text="Promotions are earned by defeating the Senior Vice President atop Sellbot Towers in Sellbot HQ — separate from Department Levels. Merits are called Invoices and are earned by defeating any Sellbots. A required number of Invoices must be collected before entering Sellbot Towers." /></p>
              <p className="pim-para"><SBHighlight text="Sellbot Factories are a fast way to stack Invoices since many Sellbots are defeated in one run. Earnings can be boosted through Merit Monday, Cog Invasions, and Boosters. Sellbot Cog Buildings also reward Invoices — however, Invasions do not boost Merits inside buildings or facilities." /></p>
              <p className="pim-para"><SBHighlight text="Teleport access is earned when a Toon reaches Mover and Shaker Level 5. A Laff Point is earned at Mr. Hollywood Levels 8, 15, 20, 30, 40, and 50 — totaling 6 additional Laff Points." /></p>
            </div>
          </div>


          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Department Levels</h3>
            <p className="pim-section-sub">Rewards for Sellbot department leveling.</p>
            <div className="pim-dept-levels">
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:accent}}>Level 10</div>
                <div className="pim-dept-level-body">
                  <p className="pim-para">Reaching <strong>Level 10</strong> unlocks a special department-themed outfit for your Toon.</p>
                  <div className="pim-outfit-table-wrap">
                    <table className="pim-outfit-table">
                      <thead><tr><th colSpan={3} className="pim-outfit-th">Sellbot Seeker</th></tr></thead>
                      <tbody><tr>
                        <td className="pim-outfit-img-cell"><span className="pim-outfit-placeholder">Outfit 1</span></td>
                        <td className="pim-outfit-img-cell"><span className="pim-outfit-placeholder">Outfit 2</span></td>
                        <td className="pim-outfit-img-cell"><span className="pim-outfit-placeholder">Outfit 3</span></td>
                      </tr></tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:accent}}>Level 20</div>
                <div className="pim-dept-level-body">
                  <p className="pim-para">Reaching <strong>Level 20</strong> allows <strong>50%</strong> of your <span className="pim-hl">Merits</span> to carry over into the next Promotion. For example, if your current Promotion requires 1,100 Merits, you start the next one with +550.</p>
                  <p className="pim-para pim-note">Note: Merits will <em>not</em> carry over if the previous Promotion&apos;s requirement exceeds the next (e.g. promoting to the next Cog Suit).</p>
                </div>
              </div>
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:accent}}>Level 30</div>
                <div className="pim-dept-level-body">
                  <p className="pim-para">Reaching <strong>Level 30</strong> permanently increases the <span className="pim-hl">Boss Rewards</span> gained from the Sellbot Boss:</p>
                  <ul className="pim-list"><li><span className="pim-hl">V.P.:</span> <strong>+1 <span className="pim-hl">IOU</span></strong></li></ul>
                </div>
              </div>
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Gaining Department Experience</h3>
            <div className="pim-info-block">
              <p className="pim-section-sub" style={{marginBottom:'12px'}}>XP is earned through the <span className="pim-hl">Senior Vice President</span> battle inside <span className="pim-hl">Sellbot Towers</span>.</p>
              <div className="pim-table-wrap">
                <table className="pim-xp-table">
                  <thead><tr><th>Method</th><th>Experience</th></tr></thead>
                  <tbody>
                    <tr><td>Damaging the V.P. with a pie</td><td className="pim-xp-val">+70 XP</td></tr>
                    <tr><td>Teammate stuns the V.P.</td><td className="pim-xp-val">+120 XP <span className="pim-muted">(depreciates each stun)</span></td></tr>
                    <tr><td>You stun the V.P.</td><td className="pim-xp-val">+140 XP <span className="pim-muted">(depreciates each stun)</span></td></tr>
                  </tbody>
                </table>
              </div>
              <p className="pim-table-note"><em>Each pie thrown into the V.P.&apos;s undercarriage awards XP — you and your teammates can throw multiple pies at once to stack EXP.</em></p>
            </div>
          </div>
        </div>
      )}


      {innerTab === 1 && (
        <div className="pim-scroll">
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>General Cogs</h3>
            <div className="pim-cog-grid">
              {SB_REGULAR.map(c => (
                <div key={c.name} className="pim-cog-card">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name" style={{color:accent}}>{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Levels {c.levels}</span>
                    <span className="pim-cog-stat">Damage Range: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Special Cogs</h3>
            <div className="pim-cog-grid">
              {SB_SPECIAL.map(c => (
                <div key={c.name} className="pim-cog-card">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name" style={{color:accent}}>{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Level {c.level}</span>
                    <span className="pim-cog-stat">Damage Range: {c.dmg}</span>
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
                    <span className="pim-cog-stat">Damage Range: {c.dmg}</span>
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


/* ── Main exported modal ────────────────────────────────────────────── */
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
            src="/icons/cog-emblems/SellbotEmblem.png"
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
          <button className="pgm-close" onClick={onClose} aria-label="Close">✕</button>
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

