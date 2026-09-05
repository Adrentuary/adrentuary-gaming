'use client';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { GagResetDrawer } from './GagResetDrawer';
import { GAG_TRACKS, RECOMMENDED_ZONES } from './data-gags';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

const COLLAPSED_DETAILS_KEY   = 'gags';            // collapses the XP/stat rows
const COLLAPSED_CARD_KEY      = 'gags-card';       // collapses the entire gag card
const COLLAPSED_MECHANICS_KEY = 'gags-mechanics';  // collapses the mechanics panel

// ─── Types ────────────────────────────────────────────────────────────────────
type MechanicItem = { label: string; text: string; sub?: string[] };
type MechanicSection = { heading: string; prestige?: boolean; items: MechanicItem[] };
type MechanicsEntry = { intro: string; sections: MechanicSection[] };

// ─── Gag Mechanics Data (Part 1: Toon-Up, Trap, Lure) ────────────────────────
const GAG_MECHANICS: Record<string, MechanicsEntry> = {
  'Toon-Up': {
    intro: 'Toon-Up is a Support Gag used to heal other Toons in battle as well as the user. It is the first track in the Gag order, going before all other Gags in a turn.',
    sections: [
      { heading: 'Toon-Up Mechanics', items: [
        { label: 'Laff Heal', text: 'Toon-Up restores the Laff points of other Toons in battle.', sub: ['Toon-Up cannot target its user directly (it cannot be used alone).', 'Toon-Up does not damage Cogs.'] },
        { label: 'Single/Multi-Target', text: 'Every odd-numbered Gag targets one Toon; every even-numbered Gag targets all other Toons (excluding the user).', sub: ['Multi-target heal is split between the Toons (e.g. 3 Toons → 1/3 each, rounded up).'] },
        { label: 'Self-Heal', text: "Using Toon-Up heals the user for 25% of the Gag's total heal.", sub: ['The self-heal factors in Gag effectiveness buffs (e.g. Toon-Up IOUs).'] },
        { label: 'Cheer', text: 'Healing a Toon gives them the Cheer buff for the round — Cheer grants a 10% Gag accuracy increase.', sub: ['Cheer does not stack.', 'The Toon-Up user does not receive the Cheer buff.'] },
        { label: 'Accuracy', text: 'Toon-Up has perfect accuracy (100%) and will never miss.' },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Self-Heal', text: "Prestige Toon-Up heals the user for 45% of the Gag's total heal (increased from 25%)." },
        { label: 'Cheer', text: 'Cheer now lasts 2 rounds (increased from 1 round).' },
      ]},
    ],
  },
  'Trap': {
    intro: 'Trap is a Power Gag that specializes in dealing massive damage to a single Cog. It is the second track in the Gag order, going after Toon-Up and before Lure.',
    sections: [
      { heading: 'Trap Mechanics', items: [
        { label: 'Trapped', text: 'Using Trap places the Gag in front of the Cog. To trigger it, the Cog must be Lured into it via Lure. The Trap remains until triggered or the Cog is destroyed.', sub: ['Only one Trap can be placed on a Cog at a time.', "Multiple Traps on the same Cog — only the strongest is used (or the rightmost Toon's in a tie)."] },
        { label: 'Dazed', text: 'Upon triggering a Trap Gag, the Cog is Dazed for 2 rounds. Dazed lowers Cog Defense by 10%, making Gags more accurate against it.' },
        { label: 'Executive Bonus', text: 'Trap deals 30% more damage against Executive and Manager Cogs.' },
        { label: 'Accuracy', text: 'Trap cannot miss on its own — Lure must activate it. Lure gains a 20% accuracy boost when targeting a Trapped Cog, and luring a Trapped Cog counts as two stuns.' },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Damage Bonus', text: "Prestige Trap deals 15% more damage to any Cog. Stacks multiplicatively with the Executive/Manager bonus — 49.5% more damage total against Executives/Managers." },
      ]},
    ],
  },
  'Lure': {
    intro: 'Lure is a Support Gag used to stun Cogs, preventing them from attacking for multiple turns. Lure cannot deal damage on its own. It is the third track in the Gag order.',
    sections: [
      { heading: 'Lure Mechanics', items: [
        { label: 'Lured', text: 'Luring a Cog gives them the Lured debuff — Lured Cogs cannot attack for a set number of rounds.', sub: ['Cogs immediately unlure when attacked with Gags (excluding Drop and Squirt splash damage).', 'Cogs can attack the same round they unlure.', 'Throw and Squirt are guaranteed to hit Lured Cogs.', 'Drop and unsoaked Zap are guaranteed to miss Lured Cogs.', 'Sound is guaranteed to hit so long as every Cog is Lured.', 'Lure Gags cannot be used on Cogs that are already Lured.'] },
        { label: 'Single/Multi-Target', text: 'Every odd-numbered Lure Gag targets one Cog; every even-numbered Gag targets all Cogs.' },
        { label: 'Knockback Damage', text: 'Using Throw or Squirt on a Lured Cog inflicts Knockback Damage — a flat damage bonus that stacks with multiple Throw/Squirt Gags in a turn. Knockback is factored into Throw and Squirt Combo Damage.' },
        { label: 'Accuracy', text: "Lure's base accuracy ranges from 75%–85% per Gag. Gains a 20% boost when luring a Trapped Cog.", sub: ['If Lure misses, targeted Cogs deal -25% less damage that turn.', 'Rounds Lured and Knockback Damage do NOT stack with multiple Lure Gags — highest values are used.'] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Knockback Damage', text: 'Prestige Lure gains increased knockback damage:', sub: ['Single-target Lure Gags: +15% more knockback damage (rounded up).', 'Multi-target Lure Gags: +25% more knockback damage (rounded up).'] },
      ]},
    ],
  },
  'Throw': {
    intro: "Throw is a Power Gag that deals a decent amount of damage. It provides strong single-target damage when combined with other Throw Gags and Lure's Knockback bonus. It is the fourth track in the Gag order.",
    sections: [
      { heading: 'Throw Mechanics', items: [
        { label: 'Marked for Laugh', text: 'Cogs hit by Throw take 10% more damage from other Gag Tracks and sources in the turn (rounded up).' },
        { label: 'Combo Damage', text: 'Using multiple Throw Gags on the same Cog applies Combo Damage — 20% of total Throw damage dealt (rounded up). Lure Knockback is factored into Throw Combo Damage.' },
        { label: 'Accuracy', text: 'Throw has a base accuracy of 80%.' },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Caramelize', text: 'Hitting a Cog with Throw gives the user a self-heal for 20% of the damage dealt (rounded up). Damage buffs and debuffs factor in; Lure Knockback and Combo Damage do not.' },
      ]},
    ],
  },
  'Squirt': {
    intro: "Squirt is a Support Gag that deals moderate damage, can hit multiple Cogs, and inflicts the Soaked debuff. Soaked reduces Cog dodge chance and is required by Zap to function. It is the fifth track in the Gag order.",
    sections: [
      { heading: 'Squirt Mechanics', items: [
        { label: 'Splash Damage', text: "Squirt deals Splash Damage to adjacent Cogs at 33% of Squirt's damage per hit (rounded up).", sub: ['Splash Damage does not wake up Lured Cogs.', 'Combo Damage and Lure Knockback are NOT factored into Splash Damage.'] },
        { label: 'Soaked', text: 'Squirt applies the Soaked debuff for 3–4 rounds. Soaked reduces Cog Defense by -10 and gives Zap perfect accuracy (100%).', sub: ['Splash Damage also inflicts Soaked.', 'Zapping a Soaked Cog removes the debuff at end of turn.'] },
        { label: 'Combo Damage', text: 'Using multiple Squirt Gags on the same Cog applies Combo Damage — 20% of total Squirt damage dealt (rounded up). Lure Knockback is factored in.', sub: ['Splash Damage is NOT factored in nor can it trigger Combo Damage.'] },
        { label: 'Accuracy', text: 'Squirt has a base accuracy of 95%.' },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Splash Damage', text: "Prestige Squirt's Splash Damage deals 75% of Squirt's damage (increased from 33%)." },
      ]},
    ],
  },
  'Zap': {
    intro: 'Zap is a Power Gag dealing solid damage that can chain to up to 3 Cogs at once. Cogs must be Soaked (via Squirt) for Zap to hit. It is the sixth track in the Gag order.',
    sections: [
      { heading: 'Zap Mechanics', items: [
        { label: 'Soaked Requirement', text: 'Zap can only hit Cogs who are Soaked (applied via Squirt Gags). Zapping a Soaked Cog removes the debuff at end of turn.' },
        { label: 'Zap Jumps', text: "Zap Jumps to adjacent Soaked Cogs, damaging them. Can Jump up to 2 other Cogs. Jumps draw from a Damage Pool equal to 80% of Zap's base damage, split between Jumps.", sub: ['If Zap Jumps twice, each Jump deals 40% of base damage.', 'Zap Jumps always move left if possible, otherwise right (one direction only).', 'Zap Jumps will NOT chain across unsoaked Cogs or empty spaces.'] },
        { label: 'Accuracy', text: 'Zap has perfect accuracy (100%) against Soaked Cogs, but will always miss on unsoaked Cogs.', sub: ['If Squirt misses, Zap Gags targeting those Cogs are conserved (not consumed).'] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Zap Jumps', text: "Prestige Zap Jump's Damage Pool is now 105% of Zap's base damage (up from 80%). If Zap Jumps twice, each Jump deals 52.5% of base damage." },
      ]},
    ],
  },
  'Sound': {
    intro: 'Sound is a Support Gag that deals low damage and targets all Cogs in battle simultaneously. Its damage is not split — each Cog takes the full amount. It is the seventh track in the Gag order.',
    sections: [
      { heading: 'Sound Mechanics', items: [
        { label: 'AoE', text: 'Sound targets all Cogs in battle. Its damage is not split — each Cog takes the full amount regardless of how many are present.' },
        { label: 'Encore', text: 'When Sound hits, it grants the user the Encore buff on the following round. Encore gives Gags a 10% damage boost (rounded up). Encore works with any Gag, including Sound itself.' },
        { label: 'Winded', text: "Using Sound while Encore is active inflicts Winded for the next two rounds. Winded reduces Sound's damage by 50%.", sub: ['Encore and Winded are only applied if Sound successfully hits.'] },
        { label: 'Accuracy', text: 'Sound has a base accuracy of 95%.' },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Encore', text: "Prestige Sound's Encore grants a 20% damage boost to the next Gag (increased from 10%)." },
      ]},
    ],
  },
  'Drop': {
    intro: 'Drop is a Power Gag with low accuracy that deals heavy single-target damage to Cogs. It is the eighth and final track in the Gag order, going after Sound.',
    sections: [
      { heading: 'Drop Mechanics', items: [
        { label: 'Combo Damage', text: 'Using multiple Drop Gags on the same Cog applies Combo Damage — 30% of total Drop damage dealt (rounded up).' },
        { label: 'Accuracy', text: "Drop has a base accuracy of 60%. Drop Gags will always miss on Lured Cogs. Each Drop Gag rolls its accuracy individually.", sub: ["Drop's accuracy soft-caps at 96% (vs 95% for other Gag Tracks) when using accuracy-boosting effects."] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Debuff Boost', text: 'Prestige Drop deals 10% more damage (rounded down) towards Debuffed Cogs, +5% per additional debuff (stacks additively).', sub: ["Applicable debuffs: Dazed (Trap), Marked for Laugh (Throw), Soaked (Squirt), Sued, Explosion Imminent!, Red Thread, Can't Dodge, Frozen, Aggrandize, Kickback."] },
      ]},
    ],
  },
};

export function SectionGags() {
  const { toonNames, isDone, setProgressBatch, collapsedUI, setCollapsedUI } = useTracker();
  const collapsedInfo      = new Set<string>(collapsedUI[COLLAPSED_DETAILS_KEY]   ?? []);
  const collapsedCard      = new Set<string>(collapsedUI[COLLAPSED_CARD_KEY]      ?? []);
  const collapsedMechanics = new Set<string>(collapsedUI[COLLAPSED_MECHANICS_KEY] ?? []);

  const toggleInfo = (trackName: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[COLLAPSED_DETAILS_KEY] ?? []);
      current.has(trackName) ? current.delete(trackName) : current.add(trackName);
      return { ...prev, [COLLAPSED_DETAILS_KEY]: [...current] };
    });
  };

  const toggleCard = (trackName: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[COLLAPSED_CARD_KEY] ?? []);
      current.has(trackName) ? current.delete(trackName) : current.add(trackName);
      return { ...prev, [COLLAPSED_CARD_KEY]: [...current] };
    });
  };

  const toggleMechanics = (trackName: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[COLLAPSED_MECHANICS_KEY] ?? []);
      current.has(trackName) ? current.delete(trackName) : current.add(trackName);
      return { ...prev, [COLLAPSED_MECHANICS_KEY]: [...current] };
    });
  };

  return (
    <div className="tracker-section">
      <SectionNote
        description="Gag XP requirements and recommended training zones per track."
        status="Everything in this section is currently up to date."
        lastUpdated="September 1st, 2026"
        lastChanges="Added per-track gag reset drawer with large gag icons. Clicking a lower gag level now automatically unchecks all higher levels. Status updated to up to date."
      />
      <GagResetDrawer />
      {GAG_TRACKS.map(track => {
        const infoCollapsed  = collapsedInfo.has(track.name);
        const cardCollapsed  = collapsedCard.has(track.name);
        const mechCollapsed  = collapsedMechanics.has(track.name);
        const mechanics      = GAG_MECHANICS[track.name];
        return (
        <div key={track.name} className="gag-card"
          style={{"--gc": track.color, "--gh": track.headerColor, "--gl": track.labelColor} as React.CSSProperties}>
          {/* Top bar: track name label + card collapse button */}
          <div className="gag-card-header">
            <span className="gag-card-header-label">{track.name}</span>
            <button className="gag-card-collapse-btn" onClick={() => toggleCard(track.name)}
              aria-expanded={!cardCollapsed} aria-label={cardCollapsed ? `Expand ${track.name}` : `Collapse ${track.name}`}>
              <span className="gag-info-toggle-chevron">{cardCollapsed ? '▶' : '▼'}</span>
            </button>
          </div>
          {!cardCollapsed && <div className="gag-table-scroll">
            <table className="gag-ss-table">
              <thead>
                <tr className="gag-ss-zone-row">
                  <td className="gag-ss-track-cell" rowSpan={4}>
                    <Image src={`/icons/gags/large/${track.largeIcon}`}
                      alt={track.name} width={60} height={60} className="gag-ss-large-icon" />
                    <span className="gag-ss-track-name">{track.name}</span>
                    <button className="gag-details-collapse-btn" onClick={() => toggleInfo(track.name)}
                      aria-expanded={!infoCollapsed} aria-label={infoCollapsed ? `Show ${track.name} details` : `Hide ${track.name} details`}>
                      <span className="gag-details-collapse-label">Details</span>
                      <span className="gag-info-toggle-chevron">{infoCollapsed ? '▶' : '▼'}</span>
                    </button>
                    <button className="gag-details-collapse-btn gag-details-collapse-btn--mechanics" onClick={() => toggleMechanics(track.name)}
                      aria-expanded={!mechCollapsed} aria-label={mechCollapsed ? `Show ${track.name} mechanics` : `Hide ${track.name} mechanics`}>
                      <span className="gag-details-collapse-label">Mechanics</span>
                      <span className="gag-info-toggle-chevron">{mechCollapsed ? '▶' : '▼'}</span>
                    </button>
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
              <tbody className={infoCollapsed ? 'gag-info-body--hidden' : ''}>
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
          </div>}
          {/* ── Mechanics panel ── */}
          {!cardCollapsed && mechanics && !mechCollapsed && (
            <div className="gag-mechanics-panel">
              <p className="gag-mechanics-intro">{mechanics.intro}</p>
              {mechanics.sections.map((sec, si) => (
                <div key={si} className="gag-mechanics-section">
                  <h4 className="gag-mechanics-heading">
                    {sec.prestige ? (
                      <span className="gag-mechanics-prestige-heading">
                        <Image src="/icons/gags/PrestigeStar.webp" alt="Prestige" width={14} height={14} className="gag-mechanics-prestige-star" unoptimized />
                        {sec.heading}
                        <Image src="/icons/gags/PrestigeStar.webp" alt="" width={14} height={14} className="gag-mechanics-prestige-star" unoptimized />
                      </span>
                    ) : sec.heading}
                  </h4>
                  <ul className="gag-mechanics-list">
                    {sec.items.map((item, ii) => (
                      <li key={ii} className="gag-mechanics-item">
                        <span className="gag-mechanics-label">{item.label}</span>
                        <span className="gag-mechanics-text"> — {item.text}</span>
                        {item.sub && (
                          <ul className="gag-mechanics-sublist">
                            {item.sub.map((s, si2) => (
                              <li key={si2} className="gag-mechanics-subitem">{s}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}