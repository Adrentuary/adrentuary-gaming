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

// ─── Rich Text Types ──────────────────────────────────────────────────────────
type Seg =
  | { t: 'plain'; v: string }
  | { t: 'bold'; v: string }
  | { t: 'em'; v: string }
  | { t: 'green'; v: string }
  | { t: 'cyan'; v: string }
  | { t: 'muted'; v: string }
  | { t: 'icon'; name: string; src: string; tooltip: string };

type RichLine = Seg[];

type MechanicItem = {
  label: string;
  labelColor?: string;   // CSS color override for the label keyword
  rich: RichLine;        // main description line
  sub?: RichLine[];      // sub-bullets
};
type MechanicSection = { heading: string; prestige?: boolean; items: MechanicItem[] };
type MechanicsEntry = { intro: RichLine; sections: MechanicSection[] };

// ─── Rich Text Helpers ────────────────────────────────────────────────────────
const p  = (v: string): Seg => ({ t: 'plain', v });
const b  = (v: string): Seg => ({ t: 'bold',  v });
const em = (v: string): Seg => ({ t: 'em',    v });
const g  = (v: string): Seg => ({ t: 'green', v });
const cy = (v: string): Seg => ({ t: 'cyan',  v });
const mu = (v: string): Seg => ({ t: 'muted', v });
const icon = (name: string, src: string, tooltip: string): Seg => ({ t: 'icon', name, src, tooltip });

// ─── Gag Mechanics Data ───────────────────────────────────────────────────────
const GAG_MECHANICS: Record<string, MechanicsEntry> = {
  'Toon-Up': {
    intro: [
      cy('Toon-Up'), p(' is a '), cy('Gag Track'), p(' used by '), cy('Toons'), p(' in '), cy('Cog Battles'), p('. Toon-Up Gags are '), b('Support Gags'), p(' used to heal other Toons in battle as well as the user. Toon-Up can be vital for keeping your team alive, though its inability to deal damage can slow battles down. Toon-Up is the first track in the Gag order, going before all other Gags in a turn.'),
    ],
    sections: [
      { heading: 'Toon-Up Mechanics', items: [
        {
          label: 'Laff Heal', labelColor: '#4ade80',
          rich: [p('Toon-Up '), g('restores the Laff points of other Toons in battle'), p('.')],
          sub: [
            [p('Toon-Up '), b('cannot'), p(' target its user directly '), em('(i.e. it cannot be used alone)'), p('. Toon-Up does not damage '), cy('Cogs'), p(' either.')],
          ],
        },
        {
          label: 'Single/Multi-Target', labelColor: '#22d3ee',
          rich: [p('Every odd-numbered Toon-Up Gag will target only one Toon, while every even-numbered Gag will target all other Toons in battle '), em('(excluding the user)'), p('.')],
          sub: [
            [mu("Multi-target Toon-Up's heal is split between the Toons in battle "), em('(i.e. 3 other Toons splits its healing to 1/3 per Toon, 2 other Toons splits it to 1/2 per Toon, rounded up)'), mu('.')],
          ],
        },
        {
          label: 'Self-Heal', labelColor: '#f472b6',
          rich: [p('Using Toon-Up '), g('heals'), p(' the user for '), g("25% the Gag's total heal"), p('.')],
          sub: [
            [p('The self-heal factors in Gag effectiveness buffs '), em('(e.g. '), cy('Toon-Up IOUs'), em(')'), p('.')],
          ],
        },
        {
          label: 'Cheer', labelColor: '#4ade80',
          rich: [p('Healing a Toon gives them the '), icon('Cheer', '/icons/gags/effects/Cheer.webp', "This Toon's attack accuracy is increased by +10%."), cy(' Cheer'), p(' buff for '), b('the round'), p('. Cheer grants a '), g('10% Gag accuracy increase'), p('.')],
          sub: [
            [cy('Cheer'), p(' does not stack in any way. The Toon-Up user does not get the '), icon('Cheer', '/icons/gags/effects/Cheer.webp', "This Toon's attack accuracy is increased by +10%."), cy(' Cheer'), p(' buff.')],
          ],
        },
        {
          label: 'Accuracy', labelColor: '#e5e7eb',
          rich: [p('Toon-Up has '), g('perfect accuracy '), em('(100%)'), p(' and will '), b('never miss'), p('.')],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'Self-Heal', labelColor: '#f472b6',
          rich: [p('Prestige Toon-Up '), g('heals'), p(' the user for '), g("45% the Gag's total heal"), p(' '), em('(increased from 25%)'), p('.')],
        },
        {
          label: 'Cheer', labelColor: '#4ade80',
          rich: [icon('Cheer', '/icons/gags/effects/Cheer.webp', "This Toon's attack accuracy is increased by +10%."), cy(' Cheer'), p(' now lasts '), g('2 rounds'), p(' '), em('(increased from 1 round)'), p('.')],
        },
      ]},
    ],
  },
  'Trap': {
    intro: [p('Trap is a Power Gag that specializes in dealing massive damage to a single Cog. It is the second track in the Gag order, going after Toon-Up and before Lure.')],
    sections: [
      { heading: 'Trap Mechanics', items: [
        { label: 'Trapped', rich: [p('Using Trap places the Gag in front of the Cog. To trigger it, the Cog must be Lured into it via Lure. The Trap remains until triggered or the Cog is destroyed.')], sub: [[p('Only one Trap can be placed on a Cog at a time.')], [p("Multiple Traps on the same Cog — only the strongest is used (or the rightmost Toon's in a tie).")]] },
        { label: 'Dazed', rich: [p('Upon triggering a Trap Gag, the Cog is Dazed for 2 rounds. Dazed lowers Cog Defense by 10%, making Gags more accurate against it.')] },
        { label: 'Executive Bonus', rich: [p('Trap deals '), g('30% more damage'), p(' against Executive and Manager Cogs.')] },
        { label: 'Accuracy', rich: [p('Trap cannot miss on its own — Lure must activate it. Lure gains a 20% accuracy boost when targeting a Trapped Cog, and luring a Trapped Cog counts as two stuns.')] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Damage Bonus', rich: [p('Prestige Trap deals '), g('15% more damage'), p(' to any Cog. Stacks multiplicatively with the Executive/Manager bonus — '), g('49.5% more damage'), p(' total against Executives/Managers.')] },
      ]},
    ],
  },
  'Lure': {
    intro: [p('Lure is a Support Gag used to stun Cogs, preventing them from attacking for multiple turns. Lure cannot deal damage on its own. It is the third track in the Gag order.')],
    sections: [
      { heading: 'Lure Mechanics', items: [
        { label: 'Lured', rich: [p('Luring a Cog gives them the Lured debuff — Lured Cogs cannot attack for a set number of rounds.')], sub: [[p('Cogs immediately unlure when attacked with Gags (excluding Drop and Squirt splash damage).')], [p('Cogs can attack the same round they unlure.')], [p('Throw and Squirt are guaranteed to hit Lured Cogs.')], [p('Drop and unsoaked Zap are guaranteed to miss Lured Cogs.')], [p('Sound is guaranteed to hit so long as every Cog is Lured.')], [p('Lure Gags cannot be used on Cogs that are already Lured.')]] },
        { label: 'Single/Multi-Target', rich: [p('Every odd-numbered Lure Gag targets one Cog; every even-numbered Gag targets all Cogs.')] },
        { label: 'Knockback Damage', rich: [p('Using Throw or Squirt on a Lured Cog inflicts Knockback Damage — a flat damage bonus that stacks with multiple Throw/Squirt Gags in a turn. Knockback is factored into Throw and Squirt Combo Damage.')] },
        { label: 'Accuracy', rich: [p("Lure's base accuracy ranges from "), g('75%–85%'), p(' per Gag. Gains a 20% boost when luring a Trapped Cog.')], sub: [[p('If Lure misses, targeted Cogs deal -25% less damage that turn.')], [p('Rounds Lured and Knockback Damage do NOT stack with multiple Lure Gags — highest values are used.')]] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Knockback Damage', rich: [p('Prestige Lure gains increased knockback damage:')], sub: [[p('Single-target Lure Gags: '), g('+15% more knockback damage'), p(' (rounded up).')], [p('Multi-target Lure Gags: '), g('+25% more knockback damage'), p(' (rounded up).')]] },
      ]},
    ],
  },
  'Throw': {
    intro: [p("Throw is a Power Gag that deals a decent amount of damage. It provides strong single-target damage when combined with other Throw Gags and Lure's Knockback bonus. It is the fourth track in the Gag order.")],
    sections: [
      { heading: 'Throw Mechanics', items: [
        { label: 'Marked for Laugh', rich: [p('Cogs hit by Throw take '), g('10% more damage'), p(' from other Gag Tracks and sources in the turn (rounded up).')] },
        { label: 'Combo Damage', rich: [p('Using multiple Throw Gags on the same Cog applies Combo Damage — '), g('20% of total Throw damage'), p(' dealt (rounded up). Lure Knockback is factored into Throw Combo Damage.')] },
        { label: 'Accuracy', rich: [p('Throw has a base accuracy of '), g('80%'), p('.')] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Caramelize', rich: [p('Hitting a Cog with Throw gives the user a self-heal for '), g('20% the damage dealt'), p(' (rounded up). Damage buffs and debuffs factor in; Lure Knockback and Combo Damage do not.')] },
      ]},
    ],
  },
  'Squirt': {
    intro: [p("Squirt is a Support Gag that deals moderate damage, can hit multiple Cogs, and inflicts the Soaked debuff. Soaked reduces Cog dodge chance and is required by Zap to function. It is the fifth track in the Gag order.")],
    sections: [
      { heading: 'Squirt Mechanics', items: [
        { label: 'Splash Damage', rich: [p("Squirt deals Splash Damage to adjacent Cogs at "), g("33% of Squirt's damage"), p(" per hit (rounded up).")], sub: [[p('Splash Damage does not wake up Lured Cogs.')], [p('Combo Damage and Lure Knockback are NOT factored into Splash Damage.')]] },
        { label: 'Soaked', rich: [p('Squirt applies the Soaked debuff for '), g('3–4 rounds'), p('. Soaked reduces Cog Defense by -10 and gives Zap perfect accuracy (100%).')], sub: [[p('Splash Damage also inflicts Soaked.')], [p('Zapping a Soaked Cog removes the debuff at end of turn.')]] },
        { label: 'Combo Damage', rich: [p('Using multiple Squirt Gags on the same Cog applies Combo Damage — '), g('20% of total Squirt damage'), p(' dealt (rounded up). Lure Knockback is factored in.')], sub: [[p('Splash Damage is NOT factored in nor can it trigger Combo Damage.')]] },
        { label: 'Accuracy', rich: [p('Squirt has a base accuracy of '), g('95%'), p('.')] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Splash Damage', rich: [p("Prestige Squirt's Splash Damage deals "), g("75% of Squirt's damage"), p(" (increased from 33%).")] },
      ]},
    ],
  },
  'Zap': {
    intro: [p('Zap is a Power Gag dealing solid damage that can chain to up to 3 Cogs at once. Cogs must be Soaked (via Squirt) for Zap to hit. It is the sixth track in the Gag order.')],
    sections: [
      { heading: 'Zap Mechanics', items: [
        { label: 'Soaked Requirement', rich: [p('Zap can only hit Cogs who are Soaked (applied via Squirt Gags). Zapping a Soaked Cog removes the debuff at end of turn.')] },
        { label: 'Zap Jumps', rich: [p("Zap Jumps to adjacent Soaked Cogs, damaging them. Can Jump up to 2 other Cogs. Jumps draw from a Damage Pool equal to "), g("80% of Zap's base damage"), p(", split between Jumps.")], sub: [[p('If Zap Jumps twice, each Jump deals 40% of base damage.')], [p('Zap Jumps always move left if possible, otherwise right (one direction only).')], [p('Zap Jumps will NOT chain across unsoaked Cogs or empty spaces.')]] },
        { label: 'Accuracy', rich: [p('Zap has '), g('perfect accuracy (100%)'), p(' against Soaked Cogs, but will '), b('always miss'), p(' on unsoaked Cogs.')], sub: [[p('If Squirt misses, Zap Gags targeting those Cogs are conserved (not consumed).')]] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Zap Jumps', rich: [p("Prestige Zap Jump's Damage Pool is now "), g("105% of Zap's base damage"), p(" (up from 80%). If Zap Jumps twice, each Jump deals 52.5% of base damage.")] },
      ]},
    ],
  },
  'Sound': {
    intro: [p("Sound is a Support Gag that deals low damage and targets all Cogs in battle simultaneously. Its damage is not split — each Cog takes the full amount. It is the seventh track in the Gag order.")],
    sections: [
      { heading: 'Sound Mechanics', items: [
        { label: 'AoE', rich: [p('Sound targets '), b('all Cogs in battle'), p('. Its damage is not split — each Cog takes the full amount regardless of how many are present.')] },
        { label: 'Encore', rich: [p('When Sound hits, it grants the user the Encore buff on the following round. Encore gives Gags a '), g('10% damage boost'), p(' (rounded up). Encore works with any Gag, including Sound itself.')] },
        { label: 'Winded', rich: [p("Using Sound while Encore is active inflicts Winded for the next two rounds. Winded reduces Sound's damage by "), g('50%'), p('.')], sub: [[p('Encore and Winded are only applied if Sound successfully hits.')]] },
        { label: 'Accuracy', rich: [p('Sound has a base accuracy of '), g('95%'), p('.')] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Encore', rich: [p("Prestige Sound's Encore grants a "), g('20% damage boost'), p(" to the next Gag (increased from 10%).")] },
      ]},
    ],
  },
  'Drop': {
    intro: [p('Drop is a Power Gag with low accuracy that deals heavy single-target damage to Cogs. It is the eighth and final track in the Gag order, going after Sound.')],
    sections: [
      { heading: 'Drop Mechanics', items: [
        { label: 'Combo Damage', rich: [p('Using multiple Drop Gags on the same Cog applies Combo Damage — '), g('30% of total Drop damage'), p(' dealt (rounded up).')] },
        { label: 'Accuracy', rich: [p('Drop has a base accuracy of '), g('60%'), p('. Drop Gags will always miss on Lured Cogs. Each Drop Gag rolls its accuracy individually.')], sub: [[p("Drop's accuracy soft-caps at "), g('96%'), p(" (vs 95% for other Gag Tracks) when using accuracy-boosting effects.")]] },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        { label: 'Debuff Boost', rich: [p('Prestige Drop deals '), g('10% more damage'), p(' (rounded down) towards Debuffed Cogs, '), g('+5% per additional debuff'), p(' (stacks additively).')], sub: [[p("Applicable debuffs: Dazed (Trap), Marked for Laugh (Throw), Soaked (Squirt), Sued, Explosion Imminent!, Red Thread, Can't Dodge, Frozen, Aggrandize, Kickback.")]] },
      ]},
    ],
  },
};

// ─── Rich Text Renderer ───────────────────────────────────────────────────────
function RichText({ line }: { line: RichLine }) {
  return (
    <>
      {line.map((seg, i) => {
        if (seg.t === 'plain') return <span key={i}>{seg.v}</span>;
        if (seg.t === 'bold')  return <strong key={i}>{seg.v}</strong>;
        if (seg.t === 'em')    return <em key={i} className="gag-mech-italic">{seg.v}</em>;
        if (seg.t === 'green') return <span key={i} className="gag-mech-green">{seg.v}</span>;
        if (seg.t === 'cyan')  return <span key={i} className="gag-mech-cyan">{seg.v}</span>;
        if (seg.t === 'muted') return <span key={i} className="gag-mech-muted">{seg.v}</span>;
        if (seg.t === 'icon')  return (
          <span key={i} className="gag-mech-icon-wrap">
            <Image src={seg.src} alt={seg.name} width={18} height={18} className="gag-mech-icon" unoptimized />
            <span className="gag-mech-tooltip">
              <span className="gag-mech-tooltip-header">
                <Image src={seg.src} alt={seg.name} width={30} height={30} className="gag-mech-tooltip-icon" unoptimized />
              </span>
              <span className="gag-mech-tooltip-body">
                <strong className="gag-mech-tooltip-name">{seg.name}</strong>
                <span className="gag-mech-tooltip-desc">{seg.tooltip}</span>
              </span>
            </span>
          </span>
        );
        return null;
      })}
    </>
  );
}

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
        lastUpdated="September 5th, 2026"
        lastChanges="Toon-Up Mechanics now uses full wiki-style rich text: colored labels, green highlights, cyan game terms, italic parentheticals, and inline Cheer icon with hover tooltip popup."
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
              <p className="gag-mechanics-intro"><RichText line={mechanics.intro} /></p>
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
                        <span
                          className="gag-mechanics-label"
                          style={item.labelColor ? { color: item.labelColor } as React.CSSProperties : undefined}
                        >{item.label}</span>
                        <span className="gag-mechanics-text"> : <RichText line={item.rich} /></span>
                        {item.sub && (
                          <ul className="gag-mechanics-sublist">
                            {item.sub.map((subLine, si2) => (
                              <li key={si2} className="gag-mechanics-subitem"><RichText line={subLine} /></li>
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