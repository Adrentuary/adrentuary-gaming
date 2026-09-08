import { CC_GAG_TRACKS, LURE_GAG_DATA, COG_TYPES, type GagTrackKey, type CogType } from './data-cc-gags';

export interface SelectedGag {
  id: number;
  track: GagTrackKey;
  trackIdx: number;
  gagIdx: number;
  isPrestige: boolean;
  customDamage?: number; // user-overridden damage value (undefined = use max/formula value)
}

// ── Base damage for a single gag (no exec/kb/combo modifiers) ─────────────────
// Uses customDamage if set, otherwise the max damage (+ Prestige Trap bonus).
export function getGagDamage(
  track: GagTrackKey,
  gagIdx: number,
  isPrestige: boolean,
  customDamage?: number,
): number {
  if (customDamage !== undefined && customDamage > 0) return customDamage;
  const t = CC_GAG_TRACKS.find(t => t.key === track)!;
  const base = t.gags[gagIdx].damage;
  if (!isPrestige || base <= 0) return base;
  // Prestige Trap: +15% damage
  if (track === 'trap') return base + Math.ceil(base * 0.15);
  return base;
}

// ── Prestige Drop debuff boost (wiki exact values, rounded DOWN) ──────────────
// debuffs: 0 = no prestige, 1 = +10%, 2 = +15%, 3 = +20% (additive 5% per extra)
export function applyPrestigeDropDebuff(baseDmg: number, debuffCount: number): number {
  if (debuffCount <= 0) return baseDmg;
  const pct = 0.10 + (debuffCount - 1) * 0.05; // 10%, 15%, 20%
  return Math.floor(baseDmg * (1 + pct)); // rounded DOWN per wiki
}

// ── Track count helper ────────────────────────────────────────────────────────
export function trackCounts(gags: SelectedGag[]): Partial<Record<GagTrackKey, number>> {
  const counts: Partial<Record<GagTrackKey, number>> = {};
  for (const g of gags) counts[g.track] = (counts[g.track] ?? 0) + 1;
  return counts;
}

// ── Knockback value from the best Lure gag in the combo ──────────────────────
// Returns the flat knockback damage (0 if no knockback applies).
export function getKnockbackValue(gags: SelectedGag[], isLured: boolean): number {
  const lureGags = gags.filter(g => g.track === 'lure');
  const hasTrap  = gags.some(g => g.track === 'trap');
  const hasSound = gags.some(g => g.track === 'sound');

  // No knockback if nothing triggers it, or if Trap or Sound is present
  if (!isLured && lureGags.length === 0) return 0;
  if (hasTrap) return 0;
  if (hasSound) return 0;

  // Use the highest knockback from all Lure gags used (they don't stack)
  let best = isLured ? 5 : 0; // if already lured with no Lure gag, use $1 Bill baseline
  for (const g of lureGags) {
    const data = LURE_GAG_DATA[g.gagIdx];
    const kb = g.isPrestige ? data.knockbackPrestige : data.knockback;
    if (kb > best) best = kb;
  }
  return best;
}

// ── Whether a track benefits from knockback ───────────────────────────────────
export function trackGetsKnockback(track: GagTrackKey): boolean {
  return track === 'throw' || track === 'squirt';
}

// ── Executive damage multiplier ───────────────────────────────────────────────
// Trap deals +30% vs Executives/Managers (all .exe and .mgr cogs).
export function execMultiplier(track: GagTrackKey, isPrestige: boolean, cogType: CogType): number {
  const cogTypeData = COG_TYPES.find(c => c.key === cogType);
  if (!cogTypeData?.isExec) return 1;
  if (track !== 'trap') return 1;
  // Prestige Trap stacks multiplicatively: 1.15 × 1.30 = 1.495
  return isPrestige ? 1.495 : 1.30;
}

// ── Main damage calculation ───────────────────────────────────────────────────
export interface DamageBreakdown {
  total: number;
  knockback: number;
  execBonus: number;
  comboBonus: number;
  debuffBonus: number;
  trapNeedsLure: boolean;
}

export function calcTotalDamage(
  gags: SelectedGag[],
  isLured: boolean,
  cogType: CogType = 'standard',
  debuffCount: number = 0,
): DamageBreakdown {
  const groups: Partial<Record<GagTrackKey, SelectedGag[]>> = {};
  for (const g of gags) {
    if (!groups[g.track]) groups[g.track] = [];
    groups[g.track]!.push(g);
  }

  const hasLure    = gags.some(g => g.track === 'lure');
  const hasTrap    = gags.some(g => g.track === 'trap');
  const hasSound   = gags.some(g => g.track === 'sound');
  const lureActive = isLured || hasLure;
  const trapNeedsLure = hasTrap && !lureActive;

  const kbValue = getKnockbackValue(gags, isLured);
  const hasKb   = kbValue > 0;

  let total = 0, totalKnockback = 0, totalExecBonus = 0,
      totalComboBonus = 0, totalDebuffBonus = 0;

  for (const [track, group] of Object.entries(groups) as [GagTrackKey, SelectedGag[]][]) {
    if (track === 'toon-up' || track === 'lure') continue;
    if (track === 'trap' && !lureActive) continue;
    if (track === 'drop' && lureActive && !hasSound) continue;

    const anyPrestige = group.some(g => g.isPrestige);
    const comboBonus  = CC_GAG_TRACKS.find(t => t.key === track)!.comboBonus;
    const getsKb      = hasKb && !hasSound && trackGetsKnockback(track);

    let sumBase: number;
    if (track === 'trap') {
      // Only ONE Trap fires — the strongest one (wiki: only strongest activates)
      const strongest = group.reduce((best, g) => {
        const dG    = getGagDamage(g.track, g.gagIdx, g.isPrestige, g.customDamage);
        const dBest = getGagDamage(best.track, best.gagIdx, best.isPrestige, best.customDamage);
        return dG > dBest ? g : best;
      }, group[0]);
      sumBase = getGagDamage(strongest.track, strongest.gagIdx, strongest.isPrestige, strongest.customDamage);
    } else {
      sumBase = group.reduce(
        (acc, g) => acc + getGagDamage(g.track, g.gagIdx, g.isPrestige, g.customDamage), 0);
    }

    // Executive bonus (Trap only)
    const execMult = execMultiplier(track, anyPrestige, cogType);
    const afterExec = track === 'trap' ? Math.ceil(sumBase * execMult) : sumBase;
    const execBonusThisTrack = afterExec - sumBase;

    // Prestige Drop debuff boost (rounded DOWN per wiki)
    let afterDebuff = afterExec;
    let debuffBonusThisTrack = 0;
    if (track === 'drop' && anyPrestige && debuffCount > 0) {
      afterDebuff = applyPrestigeDropDebuff(afterExec, debuffCount);
      debuffBonusThisTrack = afterDebuff - afterExec;
    }

    // Knockback flat add (Throw/Squirt when lured)
    const kbThisTrack = getsKb ? kbValue : 0;

    // Combo: Trap never combos; others use comboBonus
    const trackMulti   = track === 'trap' ? false : group.length >= 2;
    const baseForCombo = track === 'drop' ? afterDebuff : afterDebuff + kbThisTrack;
    const comboThisTrack = (trackMulti && comboBonus > 0)
      ? Math.ceil(baseForCombo * comboBonus) : 0;

    total           += afterDebuff + kbThisTrack + comboThisTrack;
    totalKnockback  += kbThisTrack;
    totalExecBonus  += execBonusThisTrack;
    totalDebuffBonus += debuffBonusThisTrack;
    totalComboBonus += comboThisTrack;
  }

  return { total, knockback: totalKnockback, execBonus: totalExecBonus,
           comboBonus: totalComboBonus, debuffBonus: totalDebuffBonus, trapNeedsLure };
}
