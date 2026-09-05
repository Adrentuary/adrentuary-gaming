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
    intro: [
      cy('Trap'), p(' is a '), cy('Gag Track'), p(' used by '), cy('Toons'), p(' in '), cy('Cog Battles'), p('. Trap Gags are '), b('Power Gags'), p(' that specialize in dealing massive damage to a Cog in a single attack. Trap is the second track in the Gag order, going after '), cy('Toon-Up'), p(' and before '), cy('Lure'), p(' in a turn.'),
    ],
    sections: [
      { heading: 'Trap Mechanics', items: [
        {
          label: 'Trapped', labelColor: '#f87171',
          rich: [p('Using Trap places the Gag in front the Cog. To trigger it, the Cog must be '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p(' into it via the '), cy('Lure'), p(' Track. The Trap will remain in front of the Cog until it\'s triggered or the Cog destroyed.')],
          sub: [
            [p('Only '), b('one Trap'), p(' can be placed on a Cog at a time. Attempting to use multiple Traps on the same Cog will result in only the strongest Trap being used '), em('(or the rightmost Toon\'s Trap in case of a tie)'), p('.')],
          ],
        },
        {
          label: 'Dazed', labelColor: '#facc15',
          rich: [p('Upon triggering a Trap Gag, the Cog will be '), icon('Dazed', '/icons/gags/effects/Dazed.webp', "This Cog is dazed due to a TRAP activation, and as such has a -10% dodge chance reduction!"), cy('Dazed'), p(' for '), b('2 rounds'), p('. Dazed lowers the Cog\'s '), cy('Defense'), p(' by '), r('10%'), p(' '), em('(making Gags used on this Cog more accurate)'), p('.')],
        },
        {
          label: 'Executive Bonus', labelColor: '#f97316',
          rich: [p('Trap deals '), g('30% more damage'), p(' against '), cy('Executive'), p(' and '), cy('Manager'), p(' Cogs.')],
        },
        {
          label: 'Accuracy', labelColor: '#f87171',
          rich: [p('Trap cannot miss on its own. However, '), b('Lure must be used to activate it'), p('.')],
          sub: [
            [p('Lure gains a '), g('20% accuracy boost'), p(' when used on a '), icon('Trapped', '/icons/gags/effects/Trapped.webp', "This Cog is TRAPPED by a [Trap Gag]! LURE Gags are +20% more accurate against this Cog. Once LURED, they will take -[#] damage."), cy('Trapped'), p(' Cog. Additionally, '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('luring'), p(' a Cog into a Trap counts as two '), cy('stuns'), p('.')],
          ],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'Damage Bonus', labelColor: '#f97316',
          rich: [p('Prestige Trap deals '), g('15% more damage'), p(' to any Cog.')],
          sub: [
            [p('This stacks '), b('multiplicatively'), p(' with Trap\'s Executive/Manager bonus, meaning Prestige Trap deals '), g('49.5% more damage'), p(' towards '), cy('Executive'), p(' and '), cy('Manager'), p(' Cogs.')],
          ],
        },
      ]},
    ],
  },
    'Lure': {
    intro: [
      cy('Lure'), p(' is a '), cy('Gag Track'), p(' used by '), cy('Toons'), p(' in '), cy('Cog Battles'), p('. Lure Gags are '), b('Support Gags'), p(' used to stun Cogs, preventing them from attacking for multiple turns. Lure cannot deal damage on its own, but is great for preventing damage from Cogs and allows Toons to safely focus dangerous Cogs. Lure is the third track in the Gag order, going after '), cy('Trap'), p(' and before '), cy('Throw'), p(' in a turn.'),
    ],
    sections: [
      { heading: 'Lure Mechanics', items: [
        {
          label: 'Lured', labelColor: '#4ade80',
          rich: [p('Luring a Cog gives them the '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p(' debuff. '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p(' Cogs '), b('cannot attack'), p(' for a set number of rounds. Cogs immediately '), b('unlure'), p(' when attacked with Gags '), em("(excluding Drop and Squirt's splash damage)"), p('. Cogs can attack the same round they unlure '), em('(i.e. 1 round of Lure left means they will attack that turn)'), p('.')],
          sub: [
            [cy('Throw'), p(' and '), cy('Squirt'), p(' are '), b('guaranteed to hit'), p(' '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p(' Cogs.')],
            [cy('Drop'), p(' and unsoaked '), cy('Zap'), p(' are '), b('guaranteed to miss'), p(' on '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p(' Cogs.')],
            [cy('Sound'), p(' is '), b('guaranteed to hit'), p(' so long as every Cog is '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p('.')],
            [p('Lure Gags '), b('cannot'), p(' be used on Cogs that are currently '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p('.')],
          ],
        },
        {
          label: 'Single/Multi-Target', labelColor: '#f9fafb',
          rich: [p('Every odd-numbered Lure Gag can only target one Cog, while every even-numbered Gag will target all Cogs in battle.')],
        },
        {
          label: 'Knockback Damage', labelColor: '#f97316',
          rich: [p('Using '), cy('Throw'), p(' or '), cy('Squirt'), p(' on a '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p(' Cog inflicts '), cy('Knockback Damage'), p('. Knockback Damage is a flat '), g('damage bonus'), p(' that stacks with multiple Throw or Squirt Gags used in a turn.')],
          sub: [
            [cy('Knockback Damage'), p(" is factored into Throw and Squirt's "), b('Combo Damage'), p('.')],
          ],
        },
        {
          label: 'Accuracy', labelColor: '#f87171',
          rich: [p("Lure's "), cy('base accuracy'), p(' varies by Gag, ranging from '), g('75% - 85%'), p('.')],
          sub: [
            [p('When luring a '), icon('Trapped', '/icons/gags/effects/Trapped.webp', "This Cog is TRAPPED by a [Trap Gag]! LURE Gags are +20% more accurate against this Cog. Once LURED, they will take -[#] damage."), cy('Trapped'), p(' Cog, Lure gains a '), g('20% accuracy boost'), p('. Additionally, luring a Cog into a Trap counts as two '), cy('stuns'), p('.')],
            [p('If Lure misses, the targeted Cog(s) will deal '), icon('CogDamageDown', '/icons/gags/effects/CogDamageDown.webp', "This Cog will deal 25% less damage with their attacks."), r('-25% less damage'), p(' during the turn. This hidden debuff does '), b('NOT'), p(' affect Cogs with '), icon('LureResistance', '/icons/gags/effects/LureResistance.webp', "Cogs cannot be lured."), cy('Lure Resistance'), p('.')],
          ],
        },
        {
          label: '', labelColor: undefined,
          rich: [p('Rounds '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy('Lured'), p(' and '), cy('Knockback Damage'), p(' do '), b('NOT'), p(' stack with multiple Lure Gags. Instead, it will use the highest rounds & knockback values.')],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'Knockback Damage', labelColor: '#f97316',
          rich: [p('Prestige Lure gains increased knockback damage:')],
          sub: [
            [p('Single-target Lure Gags have '), g('15% more knockback damage'), p(' '), em('(rounded up)'), p('.')],
            [p('Multi-target Lure Gags have '), g('25% more knockback damage'), p(' '), em('(rounded up)'), p('.')],
          ],
        },
      ]},
    ],
  },
  'Throw': {
    intro: [
      cy('Throw'), p(' is a '), cy('Gag Track'), p(' used by '), cy('Toons'), p(' in '), cy('Cog Battles'), p('. Throw Gags are '), b('Power Gags'), p(' that deal a decent amount of damage. Throw provides strong single-target damage when used with multiple other Throw Gags, and its effectiveness can be boosted greatly when used in conjunction with '), cy("Lure's"), p(' Knockback bonus. Throw is the fourth track in the Gag order, going after '), cy('Lure'), p(' and before '), cy('Squirt'), p(' in a turn.'),
    ],
    sections: [
      { heading: 'Throw Mechanics', items: [
        {
          label: 'MARKED FOR LAUGH', labelColor: '#f97316',
          rich: [p('Cogs hit by Throw take '), g('10% more damage'), p(' from other Gag Tracks and sources in the turn '), em('(rounded up)'), p('.')],
          sub: [
            [icon('MarkedForLaugh', '/icons/gags/effects/MarkedForLaugh.webp', "Cogs take 10% more damage from other Gag Tracks and sources in the turn."), cy(' Marked for Laugh'), p(' is applied on hit and lasts for the remainder of the turn.')],
          ],
        },
        {
          label: 'COMBO DAMAGE', labelColor: '#facc15',
          rich: [p('Using multiple Throw Gags on the same Cog in a turn applies '), g('Combo Damage'), p('. Combo Damage deals '), g('20% of total Throw damage dealt'), p(' to the Cog '), em('(rounded up)'), p('.')],
          sub: [
            [cy('Lure Knockback'), p(" is factored into Throw's "), g('Combo Damage'), p('.')],
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
          rich: [p('Hitting a Cog with Throw gives the user a '), g('self-heal'), p(' for '), g('20% the damage dealt'), p(' '), em('(rounded up)'), p('.')],
          sub: [
            [p('Damage buffs and debuffs '), em('(e.g. Throw IOUs, Damage Reduction)'), p(' factor into the self-heal. However, '), cy('Lure Knockback'), p(' and '), g('Combo Damage'), p(' '), b('do not'), p('.')],
          ],
        },
      ]},
    ],
  },
  'Squirt': {
    intro: [
      cy('Squirt'), p(' is a '), cy('Gag Track'), p(' used by '), cy('Toons'), p(' in '), cy('Cog Battles'), p('. Squirt Gags are '), b('Support Gags'), p(' that deal moderate damage to Cogs, can hit multiple Cogs, and can inflict them with the Soaked debuff. This debuff reduces a Cog\'s dodge chance which can be useful in conjunction with other Gags, especially '), cy('Zap'), p(', which requires the debuff to function. Squirt is the fifth track in the Gag order, going after '), cy('Throw'), p(' and before '), cy('Zap'), p(' in a turn.'),
    ],
    sections: [
      { heading: 'Squirt Mechanics', items: [
        {
          label: 'SPLASH DAMAGE', labelColor: '#f472b6',
          rich: [p('Squirt deals '), cy('Splash Damage'), p(' to adjacent Cogs. Splash Damage deals '), g("33% of Squirt's damage"), p(' per hit '), em('(rounded up)'), p('.')],
          sub: [
            [p('Splash Damage does not wake up '), icon('Lured', '/icons/gags/effects/Lured.webp', "LURED Cogs cannot attack and take +[#] more damage from each THROW or SQUIRT Gag that's used."), cy(' Lured'), p(' Cogs.')],
            [g('Combo Damage'), p(' and '), cy('Lure Knockback'), p(' are '), b('NOT'), p(' factored into Splash Damage.')],
          ],
        },
        {
          label: 'SOAKED', labelColor: '#22d3ee',
          rich: [p('Squirt applies the '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' debuff on Cogs for '), b('3\u20134 rounds'), p('. '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' reduces '), cy('Cog Defense'), p(' by '), r('-10'), p(' and gives Zap '), g('perfect accuracy'), p(' '), em('(100%)'), p('. '), cy('Splash Damage'), p(' also inflicts '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p('.')],
          sub: [
            [p('Zapping a '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' Cog removes the debuff at the end of the turn.')],
          ],
        },
        {
          label: 'COMBO DAMAGE', labelColor: '#facc15',
          rich: [p('Using multiple Squirt Gags on the same Cog in a turn applies '), g('Combo Damage'), p('. Combo Damage deals '), g('20% of total Squirt damage dealt'), p(' to the Cog '), em('(rounded up)'), p('.')],
          sub: [
            [cy('Lure Knockback'), p(" is factored into Squirt's "), g('Combo Damage'), p('. However, '), cy('Splash Damage'), p(' is '), b('NOT'), p(' factored in nor can it trigger Combo Damage.')],
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
          rich: [p("Prestige Squirt's "), cy('Splash Damage'), p(' deals '), g("75% of Squirt's damage"), p(' '), em('(increased from 33%)'), p('.')],
        },
      ]},
    ],
  },
  'Zap': {
    intro: [
      cy('Zap'), p(' is a '), cy('Gag Track'), p(' used by '), cy('Toons'), p(' in '), cy('Cog Battles'), p('. Zap Gags are '), b('Power Gags'), p(' dealing solid damage and can chain damage up to 3 Cogs at once. However, Cogs must be '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' for Zap to hit, which can only be applied via '), cy('Squirt Gags'), p('. Zap is the sixth track in the Gag order, going after '), cy('Squirt'), p(' and before '), cy('Sound'), p(' in a turn.'),
    ],
    sections: [
      { heading: 'Zap Mechanics', items: [
        {
          label: 'SOAKED', labelColor: '#22d3ee',
          rich: [p('Zap can only hit Cogs who are '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' '), em('(applied via Squirt Gags)'), p('. Zapping a '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' Cog removes the debuff at the end of the turn.')],
        },
        {
          label: 'ZAP JUMPS', labelColor: '#facc15',
          rich: [p('Zap will '), b('Jump'), p(' to adjacent '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' Cogs, damaging them. Zap can Jump up to '), b('2 other Cogs'), p(' in a row. Zap Jumps take from a '), g('Damage Pool'), p(':')],
          sub: [
            [g('Damage Pool'), p(': Zap Jumps deal '), g("80% of Zap's base damage"), p(' '), em('(rounded up)'), p(', split between the Jumps. If Zap Jumps twice, each Jump will deal '), g("40% of Zap's base damage"), p('.')],
            [p('Zap Jumps will always move '), b('left'), p(' if possible; otherwise, they will move right. Zap Jumps will only move in one direction '), em('(i.e. the second Jump cannot change direction)'), p('.')],
            [p('Zap Jumps will '), b('NOT'), p(' chain across unsoaked Cogs nor empty spaces '), em('(if a Cog was killed previously in the turn)'), p('.')],
          ],
        },
        {
          label: 'ACCURACY', labelColor: '#e5e7eb',
          rich: [p('Zap has '), g('perfect accuracy'), p(' '), em('(100%)'), p(' against '), icon('Soaked', '/icons/gags/effects/Soaked.webp', "Soaked Cogs have a -10% dodge chance and are vulnerable to ZAP Gags. Removed if this Cog is hit by ZAP Gags."), cy(' Soaked'), p(' Cogs, but will '), r('always miss'), p(' on unsoaked Cogs.')],
          sub: [
            [p('If Squirt misses and Cogs are unsoaked, none of the Zap Gags in that turn will be used, conserving them '), em('(assuming they were targeted towards would-be Soaked Cogs)'), p('.')],
          ],
        },
      ]},
      { heading: 'Prestige', prestige: true, items: [
        {
          label: 'ZAP JUMPS', labelColor: '#facc15',
          rich: [p("Prestige Zap Jump's "), g('Damage Pool'), p(' is now '), g("105% of Zap's base damage"), p(' '), em('(increased from 80%)'), p('.')],
          sub: [
            [p('If Zap Jumps twice, each Jump will deal '), g("52.5% of Zap's base damage"), p('.')],
          ],
        },
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
        lastChanges="Throw, Squirt & Zap Mechanics fully enriched: wiki-accurate rich text, colored labels, inline status-effect icons (MarkedForLaugh, Soaked, Lured) with hover tooltips."
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
  );
}