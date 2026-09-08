import { CC_GAG_TRACKS, LURE_GAG_DATA, COG_TYPES, type GagTrackKey, type CogType, type IouTrackKey } from './data-cc-gags';

export interface SelectedGag {
  id: number;
  track: GagTrackKey;
  trackIdx: number;
  gagIdx: number;
  isPrestige: boolean;
  customDamage?: number; // user-overridden damage value (undefined = use max/formula value)
  customHeal?: number;   // user-overridden heal value (display only — toon-up not in damage calc)
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

// ── Prestige Drop debuff boost (wiki exact values) ────────────────────────────
// debuffCount: number of active debuffs on the cog (0 = none)
//   1 debuff  → +10% damage
//   2 debuffs → +15% damage  (additive +5% per additional debuff)
//   3 debuffs → +20% damage, etc.
// Rounding: floor by default; ceil when a Drop IOU (or other external multiplier)
// is active, per wiki — "Drop IOUs will make non-integer values round up."
// Applied PER PRESTIGE DROP GAG individually (non-prestige drops are unaffected).
export function applyPrestigeDropDebuff(
  baseDmg: number,
  debuffCount: number,
  hasDropIou: boolean = false,
): number {
  if (debuffCount <= 0) return baseDmg;
  const pct = 0.10 + (debuffCount - 1) * 0.05; // 10%, 15%, 20%, 25%, …
  const raw = baseDmg * (1 + pct);
  return hasDropIou ? Math.ceil(raw) : Math.floor(raw);
}

// ── Track count helper ────────────────────────────────────────────────────────
export function trackCounts(gags: SelectedGag[]): Partial<Record<GagTrackKey, number>> {
  const counts: Partial<Record<GagTrackKey, number>> = {};
  for (const g of gags) counts[g.track] = (counts[g.track] ?? 0) + 1;
  return counts;
}

// ── Knockback value from the best Lure gag in the combo ──────────────────────
// Returns the flat knockback damage (0 if no knockback applies).
// luredByGagIdx: which lure gag was used the previous round (-1 = unknown/generic)
// luredByPrestige: whether that previous-round lure had Prestige active
export function getKnockbackValue(
  gags: SelectedGag[],
  isLured: boolean,
  luredByGagIdx = -1,
  luredByPrestige = false,
): number {
  const lureGags = gags.filter(g => g.track === 'lure');
  const hasTrap  = gags.some(g => g.track === 'trap');
  const hasSound = gags.some(g => g.track === 'sound');

  // No knockback if nothing triggers it, or if Trap or Sound is present
  if (!isLured && lureGags.length === 0) return 0;
  if (hasTrap) return 0;
  if (hasSound) return 0;

  // Baseline KB for "pre-lured" state — use the selected gag's KB if known, else $1 Bill (5)
  let best = 0;
  if (isLured) {
    if (luredByGagIdx >= 0 && luredByGagIdx < LURE_GAG_DATA.length) {
      const d = LURE_GAG_DATA[luredByGagIdx];
      best = luredByPrestige ? d.knockbackPrestige : d.knockback;
    } else {
      best = 5; // generic / unknown
    }
  }

  // Use the highest knockback from all Lure gags used in this combo (they don't stack)
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
  iouBonus: number;
  trapNeedsLure: boolean;
  zapNeedsSoak: boolean;
}

export function calcTotalDamage(
  gags: SelectedGag[],
  isLured: boolean,
  cogType: CogType = 'standard',
  debuffCount: number = 0,
  activeIous: Partial<Record<IouTrackKey, number>> = {},
  rainIouBonus: number = 0,
  luredByGagIdx: number = -1,
  luredByPrestige: boolean = false,
  customKb: number | undefined = undefined,
  isSoaked: boolean = false,
): DamageBreakdown {
  const groups: Partial<Record<GagTrackKey, SelectedGag[]>> = {};
  for (const g of gags) {
    if (!groups[g.track]) groups[g.track] = [];
    groups[g.track]!.push(g);
  }

  const hasLure    = gags.some(g => g.track === 'lure');
  const hasTrap    = gags.some(g => g.track === 'trap');
  const hasSound   = gags.some(g => g.track === 'sound');
  const hasZap     = gags.some(g => g.track === 'zap');
  const hasSquirt  = gags.some(g => g.track === 'squirt');
  const lureActive = isLured || hasLure;
  const trapNeedsLure = hasTrap && !lureActive;
  // Zap requires the cog to be soaked (hit by Squirt this round, previously, or toggle)
  const zapNeedsSoak = hasZap && !hasSquirt && !isSoaked;

  const kbValue = customKb !== undefined ? customKb : getKnockbackValue(gags, isLured, luredByGagIdx, luredByPrestige);
  const hasKb   = kbValue > 0;

  // IOU: Lure IOU adds flat bonus to knockback value
  const lureIouBonus = activeIous['lure'] ?? 0;
  const effectiveKbValue = kbValue > 0 ? kbValue + lureIouBonus + rainIouBonus : kbValue;

  let total = 0, totalKnockback = 0, totalExecBonus = 0,
      totalComboBonus = 0, totalDebuffBonus = 0, totalIouBonus = 0;

  for (const [track, group] of Object.entries(groups) as [GagTrackKey, SelectedGag[]][]) {
    if (track === 'toon-up' || track === 'lure') continue;
    if (track === 'trap' && !lureActive) continue;
    if (track === 'drop' && lureActive && !hasSound) continue;

    const anyPrestige = group.some(g => g.isPrestige);
    const comboBonus  = CC_GAG_TRACKS.find(t => t.key === track)!.comboBonus;
    const getsKb      = hasKb && !hasSound && trackGetsKnockback(track);

    // IOU flat bonus per gag for this track (rain applies only once to first gag)
    const trackIouFlat = activeIous[track as GagTrackKey] ?? 0;

    let sumBase: number;
    let iouBonusThisTrack = 0;

    if (track === 'trap') {
      // Only ONE Trap fires — the strongest one
      const strongest = group.reduce((best, g) => {
        const dG    = getGagDamage(g.track, g.gagIdx, g.isPrestige, g.customDamage);
        const dBest = getGagDamage(best.track, best.gagIdx, best.isPrestige, best.customDamage);
        return dG > dBest ? g : best;
      }, group[0]);
      const baseDmg = getGagDamage(strongest.track, strongest.gagIdx, strongest.isPrestige, strongest.customDamage);
      // IOU adds flat bonus to the single trap gag; Rain adds once too
      const iouFlat = trackIouFlat + rainIouBonus;
      sumBase = baseDmg + iouFlat;
      iouBonusThisTrack = iouFlat;
    } else {
      // Each gag in the group gets the track IOU bonus; Rain only applies once (to first gag)
      sumBase = group.reduce((acc, g, idx) => {
        const base = getGagDamage(g.track, g.gagIdx, g.isPrestige, g.customDamage);
        const rain = idx === 0 ? rainIouBonus : 0;
        return acc + base + trackIouFlat + rain;
      }, 0);
      iouBonusThisTrack = trackIouFlat * group.length + rainIouBonus;
    }

    // Executive bonus (Trap only)
    const execMult = execMultiplier(track, anyPrestige, cogType);
    const afterExec = track === 'trap' ? Math.ceil(sumBase * execMult) : sumBase;
    const execBonusThisTrack = afterExec - sumBase;

    // Prestige Drop debuff boost — applied PER PRESTIGE DROP GAG (not to the whole sum)
    // Non-prestige drops in the same combo are NOT boosted.
    // When a Drop IOU is active, non-integer results round UP instead of DOWN (per wiki).
    let afterDebuff = afterExec;
    let debuffBonusThisTrack = 0;
    if (track === 'drop' && anyPrestige && debuffCount > 0) {
      const hasDropIou = (activeIous['drop'] ?? 0) > 0 || rainIouBonus > 0;
      // Re-calculate: prestige gags get debuff-boosted base; non-prestige gags keep plain base.
      // IOU flat is already baked into sumBase; we need per-gag bases to split correctly.
      let rebuiltSum = 0;
      for (let i = 0; i < group.length; i++) {
        const g = group[i];
        const base = getGagDamage(g.track, g.gagIdx, g.isPrestige, g.customDamage);
        const iouFlat = trackIouFlat + (i === 0 ? rainIouBonus : 0);
        const gagBase = base + iouFlat;
        rebuiltSum += g.isPrestige
          ? applyPrestigeDropDebuff(gagBase, debuffCount, hasDropIou)
          : gagBase;
      }
      afterDebuff = rebuiltSum;
      debuffBonusThisTrack = afterDebuff - afterExec;
    }

    // Knockback flat add (Throw/Squirt when lured) — uses IOU-boosted KB value
    const kbThisTrack = getsKb ? effectiveKbValue : 0;

    // Combo: Trap never combos; others use comboBonus
    const trackMulti   = track === 'trap' ? false : group.length >= 2;
    const baseForCombo = track === 'drop' ? afterDebuff : afterDebuff + kbThisTrack;
    const comboThisTrack = (trackMulti && comboBonus > 0)
      ? Math.ceil(baseForCombo * comboBonus) : 0;

    total            += afterDebuff + kbThisTrack + comboThisTrack;
    totalKnockback   += kbThisTrack;
    totalExecBonus   += execBonusThisTrack;
    totalDebuffBonus += debuffBonusThisTrack;
    totalComboBonus  += comboThisTrack;
    totalIouBonus    += iouBonusThisTrack;
  }

  return { total, knockback: totalKnockback, execBonus: totalExecBonus,
           comboBonus: totalComboBonus, debuffBonus: totalDebuffBonus,
           iouBonus: totalIouBonus, trapNeedsLure, zapNeedsSoak };
}
