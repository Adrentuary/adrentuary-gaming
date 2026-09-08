import { CC_GAG_TRACKS, LURE_GAG_DATA, COG_TYPES, type GagTrackKey, type CogType } from './data-cc-gags';

export interface SelectedGag {
  id: number;
  track: GagTrackKey;
  trackIdx: number;
  gagIdx: number;
  isPrestige: boolean;
}

// ── Base damage for a single gag (no exec/kb/combo modifiers) ─────────────────
export function getGagDamage(track: GagTrackKey, gagIdx: number, isPrestige: boolean): number {
  const t = CC_GAG_TRACKS.find(t => t.key === track)!;
  const base = t.gags[gagIdx].damage;
  if (!isPrestige || base <= 0) return base;
  // Prestige Trap: +15% damage
  if (track === 'trap') return base + Math.ceil(base * 0.15);
  return base;
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
  trapNeedsLure: boolean; // true when Trap is in combo but no Lure/isLured
}

export function calcTotalDamage(
  gags: SelectedGag[],
  isLured: boolean,
  cogType: CogType = 'standard',
): DamageBreakdown {
  const groups: Partial<Record<GagTrackKey, SelectedGag[]>> = {};
  for (const g of gags) {
    if (!groups[g.track]) groups[g.track] = [];
    groups[g.track]!.push(g);
  }

  const hasLure  = gags.some(g => g.track === 'lure');
  const hasTrap  = gags.some(g => g.track === 'trap');
  const hasSound = gags.some(g => g.track === 'sound');
  const lureActive = isLured || hasLure;
  const trapNeedsLure = hasTrap && !lureActive;

  const kbValue = getKnockbackValue(gags, isLured);
  const hasKb   = kbValue > 0;

  let total = 0;
  let totalKnockback = 0;
  let totalExecBonus = 0;
  let totalComboBonus = 0;

  for (const [track, group] of Object.entries(groups) as [GagTrackKey, SelectedGag[]][]) {
    if (track === 'toon-up' || track === 'lure') continue;
    // Trap needs Lure to deal damage; skip if no lure
    if (track === 'trap' && !lureActive) continue;
    // Sound unlures — no knockback if sound is in combo
    // Drop always misses Lured cogs
    if (track === 'drop' && lureActive && !hasSound) continue;

    const anyPrestige = group.some(g => g.isPrestige);
    const trackMulti  = group.length >= 2;
    const comboBonus  = CC_GAG_TRACKS.find(t => t.key === track)!.comboBonus;
    const getsKb      = hasKb && !hasSound && trackGetsKnockback(track);

    // Sum raw base damages for this track
    const sumBase = group.reduce(
      (acc, g) => acc + getGagDamage(g.track, g.gagIdx, g.isPrestige),
      0,
    );

    // Executive bonus (Trap only)
    const execMult = execMultiplier(track, anyPrestige, cogType);
    const afterExec = track === 'trap' ? Math.ceil(sumBase * execMult) : sumBase;
    const execBonusThisTrack = afterExec - sumBase;

    // Knockback: flat addition (only on Throw/Squirt when lured)
    const kbThisTrack = getsKb ? kbValue : 0;

    // Combo: % of (base + exec bonus + knockback) for Throw/Squirt; % of base for Drop
    const baseForCombo = track === 'drop' ? sumBase : afterExec + kbThisTrack;
    const comboThisTrack = (trackMulti && comboBonus > 0)
      ? Math.ceil(baseForCombo * comboBonus)
      : 0;

    total += afterExec + kbThisTrack + comboThisTrack;
    totalKnockback += kbThisTrack;
    totalExecBonus += execBonusThisTrack;
    totalComboBonus += comboThisTrack;
  }

  return { total, knockback: totalKnockback, execBonus: totalExecBonus, comboBonus: totalComboBonus, trapNeedsLure };
}
