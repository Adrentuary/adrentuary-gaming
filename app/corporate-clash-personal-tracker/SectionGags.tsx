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
  | { t: 'red'; v: string }
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
const r  = (v: string): Seg => ({ t: 'red',   v });
const icon = (name: string, src: string, tooltip: string): Seg => ({ t: 'icon', name, src, tooltip });

// ─── Gag Mechanics Data ───────────────────────────────────────────────────────
const GAG_MECHANICS: Record<string, MechanicsEntry> = {
  'Toon-Up': {
    intro: [
      cy('Toon-Up'), p(' Gags are '), b('Support Gags'), p(' focused on keeping your team healthy during '), cy('Cog Battles'), p('. They restore Laff to other Toons and grant accuracy buffs, but deal no damage to Cogs. Toon-Up goes '), b('first'), p(' in the Gag order each turn.'),
    ],
    sections: [
      { heading: 'Toon-Up Mechanics', items: [
        {
          label: 'LAFF HEAL', labelColor: '#4ade80',
          rich: [p('Toon-Up '), g('restores Laff'), p(' to other Toons in battle — it '), b('cannot'), p(' target the user and deals '), b('no damage'), p(' to Cogs.')],
        },
        {
          label: 'SINGLE / MULTI-TARGET', labelColor: '#22d3ee',
          rich: [p('Odd-numbered Toon-Up Gags heal '), b('one Toon'), p('; even-numbered Gags heal '), b('all other Toons'), p(' in battle '), em('(excluding the user)'), p('.')],
          sub: [
            [mu("A multi-target Gag's healing is divided equally among all other Toons "), em('(e.g. 3 allies each receive 1/3 of the total heal, rounded up)'), mu('.')],
          ],
        },
        {
          label: 'SELF-HEAL', labelColor: '#f472b6',
          rich: [p('The Toon-Up user also heals themselves for '), g("25% of the Gag's total heal"), p('.')],
          sub: [
            [p('Effectiveness buffs '), em('(e.g. Toon-Up IOUs)'), p(' are factored into the self-heal amount.')],
          ],
        },
        {
          label: 'CHEER', labelColor: '#4ade80',
          rich: [p('A healed Toon gains the '), icon('Cheer', '/icons/gags/effects/Cheer.webp', "This Toon's attack accuracy is increased by +10%."), cy(' Cheer'), p(' buff for '), b('that round'), p(', boosting their Gag accuracy by '), g('+10%'), p('.')],
          sub: [
            [cy('Cheer'), p(' does not stack. The Toon-Up user does '), b('not'), p(' receive the '), icon('Cheer', '/icons/gags/effects/Cheer.webp', "This Toon's attack accuracy is increased by +10%."), cy(' Cheer'), p(' buff.')],
          ],
        },
        {
          label: 'ACCURACY', labelColor: '#e5e7eb',
          rich: [p('Toon-Up has '), g('perfect accuracy'), p(' '), em('(100%)'), p(' — it will '), b('never miss'), p('.')],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'SELF-HEAL', labelColor: '#f472b6',
          rich: [p("Prestige Toon-Up increases the user's self-heal to "), g("45% of the Gag's total heal"), p(' '), em('(up from 25%)'), p('.')],
        },
        {
          label: 'CHEER', labelColor: '#4ade80',
          rich: [icon('Cheer', '/icons/gags/effects/Cheer.webp', "This Toon's attack accuracy is increased by +10%."), cy(' Cheer'), p(' now lasts '), g('2 rounds'), p(' '), em('(up from 1 round)'), p('.')],
        },
      ]},
    ],
  },
  'Trap': {
    intro: [
      cy('Trap'), p(' Gags are '), b('Power Gags'), p(' that deal massive single-target damage — the highest raw damage of any Gag track. They must be '), b('triggered by Lure'), p(' to deal damage, making teamwork essential. Trap goes '), b('second'), p(' in the Gag order, after '), cy('Toon-Up'), p(' and before '), cy('Lure'), p('.'),
    ],
    sections: [
      { heading: 'Trap Mechanics', items: [
        {
          label: 'TRAPPED', labelColor: '#f87171',
          rich: [p('A Trap Gag is placed in front of the Cog and stays there until a '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lure'), p(' Gag triggers it, or the Cog is defeated.')],
          sub: [
            [p('Only '), b('one Trap'), p(' can be active on a Cog at a time. If multiple Traps are placed, only the '), b('strongest'), p(' is kept '), em('(ties go to the rightmost Toon\'s Trap)'), p('.')],
          ],
        },
        {
          label: 'DAZED', labelColor: '#facc15',
          rich: [p('When a Trap triggers, the Cog becomes '), icon('Dazed', '/icons/gags/effects/Dazed.webp', "This Cog is DAZED and will take extra damage from TRAP Gags."), cy(' Dazed'), p(' for '), b('2 rounds'), p(', lowering their dodge chance by '), r('−10%'), p(' '), em('(making follow-up Gags more accurate)'), p('.')],
        },
        {
          label: 'EXECUTIVE BONUS', labelColor: '#f97316',
          rich: [p('Trap deals '), g('+30% bonus damage'), p(' against '), cy('Executive'), p(' and '), cy('Manager'), p(' tier Cogs.')],
        },
        {
          label: 'ACCURACY', labelColor: '#f87171',
          rich: [p('Trap itself never misses — but it requires a successful '), b('Lure'), p(' to trigger.')],
          sub: [
            [p('Lure is '), g('+20% more accurate'), p(' when targeting a '), icon('Trapped', '/icons/gags/effects/Trapped.webp', "This Cog is TRAPPED by a Trap Gag! LURE Gags are +20% more accurate against this Cog. Once LURED, they will take reduced damage."), cy(' Trapped'), p(' Cog, and triggering a Trap counts as '), b('two stuns'), p('.')],
          ],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'DAMAGE BONUS', labelColor: '#f97316',
          rich: [p('Prestige Trap deals '), g('+15% damage'), p(' against all Cogs.')],
          sub: [
            [p('This multiplies with the Executive/Manager bonus — Prestige Trap deals '), g('+49.5% total damage'), p(' against '), cy('Executive'), p(' and '), cy('Manager'), p(' Cogs.')],
          ],
        },
      ]},
    ],
  },
  'Lure': {
    intro: [
      cy('Lure'), p(' Gags are '), b('Support Gags'), p(' that stun Cogs, preventing them from attacking for multiple turns. Lure deals no damage directly, but enables '), cy('Trap'), p(', boosts '), cy('Throw'), p(' and '), cy('Squirt'), p(' via Knockback Damage, and keeps your team safe. Lure goes '), b('third'), p(' in the Gag order, after '), cy('Trap'), p(' and before '), cy('Throw'), p('.'),
    ],
    sections: [
      { heading: 'Lure Mechanics', items: [
        {
          label: 'LURED', labelColor: '#4ade80',
          rich: [p('A lured Cog gains the '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p(' debuff — they '), b('cannot attack'), p(' and take '), g('bonus damage'), p(' from Throw and Squirt. Cogs '), b('un-lure immediately'), p(' when hit by most Gags '), em('(Drop and Squirt Splash are exceptions)'), p(' and can attack the same round they un-lure.')],
          sub: [
            [cy('Throw'), p(' and '), cy('Squirt'), p(' are '), g('guaranteed to hit'), p(' '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p(' Cogs.')],
            [cy('Drop'), p(' and unsoaked '), cy('Zap'), p(' '), r('always miss'), p(' on '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p(' Cogs.')],
            [cy('Sound'), p(' is '), g('guaranteed to hit'), p(' when '), b('all'), p(' Cogs in battle are '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p('.')],
            [p('Lure '), b('cannot'), p(' be used on a Cog that is already '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p('.')],
          ],
        },
        {
          label: 'SINGLE / MULTI-TARGET', labelColor: '#f9fafb',
          rich: [p('Odd-numbered Lure Gags target '), b('one Cog'), p('; even-numbered Gags target '), b('all Cogs'), p(' in battle.')],
        },
        {
          label: 'KNOCKBACK DAMAGE', labelColor: '#f97316',
          rich: [p('Throw and Squirt deal '), cy('Knockback Damage'), p(' — a '), g('flat bonus'), p(' — when hitting a '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p(' Cog. Multiple Throw or Squirt Gags in one turn each add to this bonus.')],
          sub: [
            [cy('Knockback Damage'), p(" is included when calculating Throw and Squirt's "), b('Combo Damage'), p('.')],
          ],
        },
        {
          label: 'ACCURACY', labelColor: '#f87171',
          rich: [p("Lure's "), cy('base accuracy'), p(' ranges from '), g('75% to 85%'), p(' depending on the Gag used.')],
          sub: [
            [p('Targeting a '), icon('Trapped', '/icons/gags/effects/Trapped.webp', "This Cog is TRAPPED by a Trap Gag! LURE Gags are +20% more accurate against this Cog. Once LURED, they will take reduced damage."), cy(' Trapped'), p(' Cog gives Lure '), g('+20% accuracy'), p(', and triggering the Trap counts as '), b('two stuns'), p('.')],
            [p('On a miss, targeted Cog(s) deal '), icon('CogDamageDown', '/icons/gags/effects/CogDamageDown.webp', "This Cog will deal 25% less damage with their attacks."), r(' −25% damage'), p(' that turn. This does '), b('NOT'), p(' apply to Cogs with '), icon('Lure Resistance', '/icons/gags/effects/LureResistance.webp', "This Cog cannot be lured."), cy(' Lure Resistance'), p('.')],
          ],
        },
        {
          label: '', labelColor: undefined,
          rich: [p('When multiple Lure Gags are used, '), cy('Lured'), p(' rounds and '), cy('Knockback Damage'), p(' do '), b('NOT'), p(' stack — the '), b('highest values'), p(' from any single Lure Gag are used.')],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'KNOCKBACK DAMAGE', labelColor: '#f97316',
          rich: [p('Prestige Lure increases Knockback Damage on all Lure Gags:')],
          sub: [
            [p('Single-target Lure Gags deal '), g('+15% Knockback Damage'), p(' '), em('(rounded up)'), p('.')],
            [p('Multi-target Lure Gags deal '), g('+25% Knockback Damage'), p(' '), em('(rounded up)'), p('.')],
          ],
        },
      ]},
    ],
  },
  'Throw': {
    intro: [
      cy('Throw'), p(' Gags are '), b('Power Gags'), p(' that deal reliable single-target damage. Throw Gags scale well when stacked together via Combo Damage, and pair excellently with '), cy('Lure'), p(' for the added Knockback bonus. Throw goes '), b('fourth'), p(' in the Gag order, after '), cy('Lure'), p(' and before '), cy('Squirt'), p('.'),
    ],
    sections: [
      { heading: 'Throw Mechanics', items: [
        {
          label: 'MARKED FOR LAUGH', labelColor: '#f97316',
          rich: [p('Any Cog hit by Throw becomes '), icon('Marked for Laugh', '/icons/gags/effects/MarkedForLaugh.webp', "This Cog is more vulnerable, and will take 10% more damage."), cy(' Marked for Laugh'), p(', causing them to take '), g('+10% more damage'), p(' from all other sources that turn '), em('(rounded up)'), p('.')],
          sub: [
            [cy('Marked for Laugh'), p(' is applied on hit and lasts until the end of the current turn.')],
          ],
        },
        {
          label: 'COMBO DAMAGE', labelColor: '#facc15',
          rich: [p('Multiple Throw Gags on the same Cog in one turn deal '), g('Combo Damage'), p(' — a '), g('bonus equal to 20%'), p(' of total Throw damage dealt that turn '), em('(rounded up)'), p('.')],
          sub: [
            [cy('Lure Knockback'), p(" counts toward Throw's "), g('Combo Damage'), p(' calculation.')],
          ],
        },
        {
          label: 'ACCURACY', labelColor: '#e5e7eb',
          rich: [p('Throw has a '), cy('base accuracy'), p(' of '), b('80%'), p('.')],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'CARAMELIZE', labelColor: '#4ade80',
          rich: [p('Each time a Throw Gag hits, the user heals for '), g('20% of the damage dealt'), p(' '), em('(rounded up)'), p('.')],
          sub: [
            [p('Damage buffs and debuffs '), em('(e.g. Throw IOUs, Damage Reduction)'), p(' are factored in. However, '), cy('Lure Knockback'), p(' and '), g('Combo Damage'), p(' are '), b('not'), p('.')],
          ],
        },
      ]},
    ],
  },
  'Squirt': {
    intro: [
      cy('Squirt'), p(' Gags are '), b('Power Gags'), p(' that deal moderate damage and splash adjacent Cogs. More importantly, they apply the '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' debuff, which is required for '), cy('Zap'), p(' to function. Squirt goes '), b('fifth'), p(' in the Gag order, after '), cy('Throw'), p(' and before '), cy('Zap'), p('.'),
    ],
    sections: [
      { heading: 'Squirt Mechanics', items: [
        {
          label: 'SPLASH DAMAGE', labelColor: '#f472b6',
          rich: [p('Squirt deals '), cy('Splash Damage'), p(' to Cogs adjacent to the target, dealing '), g("33% of the Gag's damage"), p(' per splash hit '), em('(rounded up)'), p('.')],
          sub: [
            [p('Splash Damage does '), b('not'), p(' wake up '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p(' Cogs.')],
            [cy('Combo Damage'), p(' and '), cy('Lure Knockback'), p(' are '), b('NOT'), p(' factored into Splash Damage.')],
          ],
        },
        {
          label: 'SOAKED', labelColor: '#22d3ee',
          rich: [p('Squirt inflicts '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' on hit — including Splash hits — for '), b('3–4 rounds'), p('. '), cy('Soaked'), p(' lowers a Cog\'s dodge chance by '), r('−10%'), p(' and grants Zap '), g('perfect accuracy'), p(' '), em('(100%)'), p(' against them.')],
          sub: [
            [p('Zapping a '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' Cog removes the '), cy('Soaked'), p(' debuff at the end of that turn.')],
          ],
        },
        {
          label: 'COMBO DAMAGE', labelColor: '#facc15',
          rich: [p('Multiple Squirt Gags on the same Cog in one turn deal '), g('Combo Damage'), p(' — a '), g('bonus equal to 20%'), p(' of total Squirt damage dealt that turn '), em('(rounded up)'), p('.')],
          sub: [
            [cy('Lure Knockback'), p(" counts toward Squirt's "), g('Combo Damage'), p('. '), cy('Splash Damage'), p(' is '), b('NOT'), p(' counted and cannot trigger Combo Damage.')],
          ],
        },
        {
          label: 'ACCURACY', labelColor: '#e5e7eb',
          rich: [p('Squirt has a '), cy('base accuracy'), p(' of '), b('95%'), p('.')],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'SPLASH DAMAGE', labelColor: '#f472b6',
          rich: [p("Prestige Squirt's "), cy('Splash Damage'), p(' is increased to '), g("75% of the Gag's damage"), p(' per hit '), em('(up from 33%)'), p('.')],
        },
      ]},
    ],
  },
  'Zap': {
    intro: [
      cy('Zap'), p(' Gags are '), b('Power Gags'), p(' that deal high damage and can chain electricity to up to '), b('3 Cogs'), p(' in a single use. However, Zap '), b('requires'), p(' target Cogs to be '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' first — which only '), cy('Squirt'), p(' can apply. Zap goes '), b('sixth'), p(' in the Gag order, after '), cy('Squirt'), p(' and before '), cy('Sound'), p('.'),
    ],
    sections: [
      { heading: 'Zap Mechanics', items: [
        {
          label: 'SOAKED', labelColor: '#22d3ee',
          rich: [p('Zap can '), b('only hit'), p(' Cogs that are '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' '), em('(applied by Squirt Gags)'), p('. Successfully Zapping a Cog removes its '), cy('Soaked'), p(' debuff at the end of the turn.')],
        },
        {
          label: 'ZAP JUMPS', labelColor: '#facc15',
          rich: [p('After hitting the target, Zap '), b('jumps'), p(' to up to '), b('2 adjacent'), p(' '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' Cogs. Jumps draw from a shared '), g('Damage Pool'), p(':')],
          sub: [
            [g('Damage Pool'), p(' = '), g("80% of Zap's base damage"), em(' (rounded up)'), p('. Split equally if Zap jumps twice — each Jump deals '), g("40% of Zap's base damage"), p('.')],
            [p('Jumps always move '), b('left'), p(' first; if blocked, they move right. The chain '), b('cannot'), p(' change direction mid-jump.')],
            [p('Jumps '), b('cannot'), p(' skip over unsoaked Cogs or empty spaces '), em('(e.g. if a Cog was already defeated that turn)'), p('.')],
          ],
        },
        {
          label: 'ACCURACY', labelColor: '#e5e7eb',
          rich: [p('Zap has '), g('perfect accuracy'), p(' '), em('(100%)'), p(' against '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' Cogs, but '), r('always misses'), p(' against unsoaked Cogs.')],
          sub: [
            [p('If Squirt missed and no Cogs are Soaked, any Zap Gags targeting those Cogs are '), b('not consumed'), p(' '), em('(they are saved for a future turn)'), p('.')],
          ],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'ZAP JUMPS', labelColor: '#facc15',
          rich: [p("Prestige Zap's "), g('Damage Pool'), p(' increases to '), g("105% of Zap's base damage"), p(' '), em('(up from 80%)'), p('.')],
          sub: [
            [p('When Zap jumps twice, each Jump deals '), g("52.5% of Zap's base damage"), p('.')],
          ],
        },
      ]},
    ],
  },
  'Sound': {
    intro: [
      cy('Sound'), p(' Gags are '), b('Support Gags'), p(' that hit '), b('every Cog'), p(' in battle simultaneously. While their raw damage is lower than other tracks, the AoE coverage makes them excellent for clearing groups quickly. Sound goes '), b('seventh'), p(' in the Gag order, after '), cy('Zap'), p(' and before '), cy('Drop'), p('.'),
    ],
    sections: [
      { heading: 'Sound Mechanics', items: [
        {
          label: 'AoE', labelColor: '#e5e7eb',
          rich: [p('Sound hits '), b('all Cogs in battle'), p(' for the '), b('full damage amount'), p(' — the damage is '), b('not split'), p(' between targets.')],
        },
        {
          label: 'ENCORE', labelColor: '#facc15',
          rich: [p('Each time Sound successfully hits, the user gains '), icon('Encore', '/icons/gags/effects/Encore.webp', "All Gags have a damage effectiveness boost. By using SOUND again, you'll become Winded."), cy(' Encore'), p(' on the '), b('following round'), p(', giving all their Gags a '), g('+10% damage boost'), p(' '), em('(rounded up)'), p('.')],
          sub: [
            [cy('Encore'), p(' applies to '), b('any'), p(' Gag used that round — including Sound itself.')],
          ],
        },
        {
          label: 'WINDED', labelColor: '#a78bfa',
          rich: [p('Using Sound while '), icon('Encore', '/icons/gags/effects/Encore.webp', "All Gags have a damage effectiveness boost. By using SOUND again, you'll become Winded."), cy(' Encore'), p(' is active inflicts '), icon('Winded', '/icons/gags/effects/Winded.webp', "Your SOUND Gags will deal -50% less damage."), cy(' Winded'), p(' for '), b('the next 2 rounds'), p(', causing Sound Gags to deal '), r('−50% damage'), p('.')],
          sub: [
            [cy('Encore'), p(' and '), cy('Winded'), p(' are only applied if Sound '), b('successfully hits'), p('.')],
          ],
        },
        {
          label: 'ACCURACY', labelColor: '#e5e7eb',
          rich: [p('Sound has a '), cy('base accuracy'), p(' of '), b('95%'), p('. Sound is '), g('guaranteed to hit'), p(' if every Cog in battle is '), cy('Lured'), p('.')],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'ENCORE', labelColor: '#facc15',
          rich: [p("Prestige Sound's "), icon('Encore', '/icons/gags/effects/Encore.webp', "All Gags have a damage effectiveness boost. By using SOUND again, you'll become Winded."), cy(' Encore'), p(' buff doubles to '), g('+20% damage boost'), p(' '), em('(up from +10%)'), p('.')],
        },
      ]},
    ],
  },
  'Drop': {
    intro: [
      cy('Drop'), p(' Gags are '), b('Power Gags'), p(' that deal the highest single-hit damage in the game — at the cost of low accuracy. Timing and debuff support are key to making Drop reliable. Drop goes '), b('last'), p(' in the Gag order, after '), cy('Sound'), p('.'),
    ],
    sections: [
      { heading: 'Drop Mechanics', items: [
        {
          label: 'COMBO DAMAGE', labelColor: '#facc15',
          rich: [p('Multiple Drop Gags on the same Cog in one turn deal '), g('Combo Damage'), p(' — a '), g('bonus equal to 30%'), p(' of total Drop damage dealt that turn '), em('(rounded up)'), p('.')],
        },
        {
          label: 'ACCURACY', labelColor: '#e5e7eb',
          rich: [p('Drop has a '), cy('base accuracy'), p(' of only '), b('60%'), p('. Each Drop Gag rolls independently. Drop '), r('always misses'), p(' on '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take bonus damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p(' Cogs.')],
          sub: [
            [p("Drop's accuracy soft-caps at "), g('96%'), p(' '), em('(vs. 95% for all other tracks)'), p(' when using accuracy-boosting effects.')],
          ],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'DEBUFF BOOST', labelColor: '#4ade80',
          rich: [p('Prestige Drop deals '), g('+10% damage'), p(' against Cogs with at least one debuff, '), g('plus +5% per additional debuff'), p(' '), em('(stacks additively, rounded down)'), p('.')],
          sub: [
            [p('Applicable debuffs: '), icon('Dazed', '/icons/gags/effects/Dazed.webp', "This Cog is DAZED and will take extra damage from TRAP Gags."), cy(' Dazed'), p(' '), em('(Trap)'), p(', '), icon('Marked for Laugh', '/icons/gags/effects/MarkedForLaugh.webp', "This Cog is more vulnerable, and will take 10% more damage."), cy(' Marked for Laugh'), p(' '), em('(Throw)'), p(', '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' '), em('(Squirt)'), p(', '), icon('Sued', '/icons/gags/effects/Sued.webp', "This Cog cannot attack! Each Gag used against this Cog increases the effect duration by 1 round, up to a maximum of 2 to 4 rounds."), cy(' Sued'), p(', '), icon('Explosion Imminent!', '/icons/gags/effects/ExplosionImminent.webp', "If this Cog is Overcharged at the beginning of the round and then is destroyed, they will explode, dealing massive damage to everybody and will temporarily weaken Bellringer's healing."), cy(' Explosion Imminent!'), p(', '), icon('Red Thread', '/icons/gags/effects/RedThread.webp', "Bound by the red thread of fate! When their partner takes damage, they echo 300% of it!"), cy(' Red Thread'), p(', '), icon("Can't Dodge", '/icons/gags/effects/CantDodge.webp', "This Cog cannot dodge Gags."), cy(" Can't Dodge"), p(', '), icon('Frozen', '/icons/gags/effects/Frozen.webp', "Frozen Cogs have -25% reduced dodge chance, low ZAP effectiveness, and -10% damage reduction! Upon being destroyed, this Cog will SHATTER."), cy(' Frozen'), p(', '), icon('Aggrandize', '/icons/gags/effects/Aggrandize.webp', "This Cog will absorb 25%/50% of the damage taken to the Chainsaw Consultant."), cy(' Aggrandize'), p(', '), icon('Kickback', '/icons/gags/effects/Kickback.webp', "The Chainsaw Consultant will take +10%/30% more damage."), cy(' Kickback'), p('.')],
          ],
        },
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
        if (seg.t === 'red')   return <span key={i} className="gag-mech-red">{seg.v}</span>;
        if (seg.t === 'icon')  return (
          <span key={i} className="gag-mech-icon-wrap">
            <Image src={seg.src} alt={seg.name} width={18} height={18} className="gag-mech-icon" unoptimized />
            <span className="gag-mech-tooltip">
              <Image src={seg.src} alt={seg.name} width={28} height={28} className="gag-mech-tooltip-icon" unoptimized />
              <strong className="gag-mech-tooltip-name">{seg.name}</strong>
              <span className="gag-mech-tooltip-desc">{seg.tooltip}</span>
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
        lastChanges="All 8 gag track Mechanics fully enriched: wiki-accurate rich text, colored labels, inline status-effect icons with hover tooltips across all tracks."
      />
      <GagResetDrawer />
      <div className="gag-cards-list">
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
                        {item.label && (
                          <span
                            className="gag-mechanics-label"
                            style={item.labelColor ? { color: item.labelColor } as React.CSSProperties : undefined}
                          >{item.label}</span>
                        )}
                        <span className="gag-mechanics-text">{item.label ? ' : ' : ''}<RichText line={item.rich} /></span>
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
    </div>
  );
}