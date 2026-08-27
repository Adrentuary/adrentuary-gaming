'use client';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';

interface Props { id: string; toon: ToonIndex; label?: string; small?: boolean }
export function CheckBtn({ id, toon, label, small }: Props) {
  const { isDone, toggle, toonNames } = useTracker();
  const done = isDone(id, toon);
  return (
    <button
      className={`check-btn${small?' check-btn--sm':''}${done?' check-btn--done':''}`}
      style={done ? {'--tc': TOON_COLORS[toon]} as React.CSSProperties : {}}
      onClick={() => toggle(id, toon)}
      aria-label={label ?? `${toonNames[toon]}: ${id}`}
    >✓</button>
  );
}
