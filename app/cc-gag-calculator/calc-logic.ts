import { CC_GAG_TRACKS, type GagTrackKey } from './data-cc-gags';

export interface SelectedGag {
  id: number;
  track: GagTrackKey;
  trackIdx: number;
  gagIdx: number;
  isPrestige: boolean;
}

export function prestigeBonus(track: GagTrackKey): number {
  if (track === 'squirt' || track === 'drop') return 0.15;
  if (track === 'toon-up') return 0.20;
  return 0.10;
}

export function getGagDamage(track: GagTrackKey, gagIdx: number, isPrestige: boolean): number {
  const t = CC_GAG_TRACKS.find(t => t.key === track)!;
  const base = t.gags[gagIdx].damage;
  if (isPrestige && base > 0) return base + Math.ceil(base * prestigeBonus(track));
  return base;
}

export function trackCounts(gags: SelectedGag[]): Partial<Record<GagTrackKey, number>> {
  const counts: Partial<Record<GagTrackKey, number>> = {};
  for (const g of gags) counts[g.track] = (counts[g.track] ?? 0) + 1;
  return counts;
}

export function getKnockback(track: GagTrackKey, gags: SelectedGag[], isLured: boolean): boolean {
  const hasLure = gags.some(g => g.track === 'lure');
  const hasTrap = gags.some(g => g.track === 'trap');
  const hasSound = gags.some(g => g.track === 'sound');
  if (!isLured && !hasLure) return false;
  if (hasTrap) return false;
  if (hasSound) return false;
  if (track === 'throw') return true;
  if (track === 'squirt' && !gags.some(g => g.track === 'throw')) return true;
  return false;
}

export function calcTotalDamage(gags: SelectedGag[], isLured: boolean): number {
  const groups: Partial<Record<GagTrackKey, SelectedGag[]>> = {};
  for (const g of gags) {
    if (!groups[g.track]) groups[g.track] = [];
    groups[g.track]!.push(g);
  }
  let total = 0;
  for (const [track, group] of Object.entries(groups) as [GagTrackKey, SelectedGag[]][]) {
    if (track === 'toon-up' || track === 'lure') continue;
    if (track === 'trap' && group.length >= 2) continue;
    const tc = trackCounts(gags);
    const multi = (tc[track] ?? 0) >= 2;
    const knockback = getKnockback(track, gags, isLured);
    const sumBase = group.reduce((acc, g) => acc + getGagDamage(g.track, g.gagIdx, g.isPrestige), 0);
    total += sumBase
      + (knockback ? Math.ceil(sumBase * 0.5) : 0)
      + (multi     ? Math.ceil(sumBase * 0.2) : 0);
  }
  return total;
}
