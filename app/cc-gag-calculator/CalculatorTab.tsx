'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { CC_GAG_TRACKS, CC_COG_HP, type GagTrackKey } from './data-cc-gags';
import { calcTotalDamage, getGagDamage, getKnockback, trackCounts, type SelectedGag } from './calc-logic';

let nextId = 1;

export function CalculatorTab() {
  const [selectedGags, setSelectedGags] = useState<SelectedGag[]>([]);
  const [isLured, setIsLured] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const totalDamage = useMemo(() => calcTotalDamage(selectedGags, isLured), [selectedGags, isLured]);

  function addGag(track: GagTrackKey, trackIdx: number, gagIdx: number) {
    setSelectedGags(prev => [...prev, { id: nextId++, track, trackIdx, gagIdx, isPrestige: false }]);
  }
  function removeGag(id: number) { setSelectedGags(prev => prev.filter(g => g.id !== id)); }
  function togglePrestige(id: number) {
    setSelectedGags(prev => prev.map(g => g.id === id ? { ...g, isPrestige: !g.isPrestige } : g));
  }
  function clearAll() { setSelectedGags([]); setIsLured(false); }

  return (
    <div className="gagcalc-layout">
      <div className="gagcalc-left">
        <div className="gagcalc-grid">
          {CC_GAG_TRACKS.map((track, ti) => (
            <div key={track.key} className="gagcalc-track-row" style={{ background: track.headerColor }}>
              <div className="gagcalc-track-label" style={{ color: track.labelColor }}>
                <Image
                  src={`/icons/gags/large/${track.key === 'toon-up' ? 'toon-up.png' : `${track.key}-large.png`}`}
                  alt={track.name} width={20} height={20} unoptimized className="gagcalc-track-icon"
                />
                {track.name}
              </div>
              {track.gags.map((gag, gi) => {
                const k = `${track.key}-${gi}`;
                return (
                  <button
                    key={gi}
                    className={`gagcalc-cell${hoveredCell === k ? ' gagcalc-cell--hov' : ''}`}
                    onClick={() => addGag(track.key, ti, gi)}
                    onMouseEnter={() => setHoveredCell(k)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{ background: track.color }}
                    title={`${gag.name} (Lv ${gi + 1})${gag.damage > 0 ? ` — ${gag.damage} dmg` : gag.heal ? ` — +${gag.heal} heal` : ''}`}
                  >
                    <Image src={`/icons/gags/small/${track.key}/${gag.icon}`} alt={gag.name} width={36} height={36} unoptimized className="gagcalc-gag-img" />
                    <span className="gagcalc-gag-name">{gag.name}</span>
                    {gag.damage > 0
                      ? <span className="gagcalc-gag-stat" style={{ color: track.labelColor }}>{gag.damage}</span>
                      : gag.heal
                        ? <span className="gagcalc-gag-stat gagcalc-gag-stat--heal">+{gag.heal}</span>
                        : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <label className="gagcalc-toggle">
          <input type="checkbox" checked={isLured} onChange={e => setIsLured(e.target.checked)} />
          <span className="gagcalc-toggle-box" />
          <span>Cog already Lured <span className="gagcalc-muted">(+50% knockback on Throw/Squirt)</span></span>
        </label>
      </div>
      <div className="gagcalc-right">
        <ComboPanel
          gags={selectedGags} isLured={isLured} totalDamage={totalDamage}
          onRemove={removeGag} onTogglePrestige={togglePrestige} onClear={clearAll}
        />
      </div>
    </div>
  );
}
function ComboPanel({ gags, isLured, totalDamage, onRemove, onTogglePrestige, onClear }: {
  gags: SelectedGag[]; isLured: boolean; totalDamage: number;
  onRemove(id: number): void; onTogglePrestige(id: number): void; onClear(): void;
}) {
  const hasDmg = gags.some(g => g.track !== 'toon-up' && g.track !== 'lure');
  return (
    <>
      <div className="gagcalc-panel-head">
        <span className="kicker">Combo</span>
        {gags.length > 0 && <button className="gagcalc-clear-btn" onClick={onClear}>Clear all</button>}
      </div>
      {gags.length === 0
        ? <p className="gagcalc-empty">Click a gag to add it to your combo.</p>
        : <SelectedList gags={gags} isLured={isLured} onRemove={onRemove} onTogglePrestige={onTogglePrestige} />
      }
      {hasDmg && <DamageResult totalDamage={totalDamage} />}
    </>
  );
}

function SelectedList({ gags, isLured, onRemove, onTogglePrestige }: {
  gags: SelectedGag[]; isLured: boolean; onRemove(id: number): void; onTogglePrestige(id: number): void;
}) {
  const tc = trackCounts(gags);
  return (
    <div className="gagcalc-sel-list">
      {gags.map(sg => {
        const track = CC_GAG_TRACKS[sg.trackIdx];
        const gag   = track.gags[sg.gagIdx];
        const dmg   = getGagDamage(sg.track, sg.gagIdx, sg.isPrestige);
        const multi = (tc[sg.track] ?? 0) >= 2 && !['toon-up','lure','trap'].includes(sg.track);
        const kb    = getKnockback(sg.track, gags, isLured) && !['toon-up','lure'].includes(sg.track);
        const healVal = gag.heal ? (sg.isPrestige ? Math.ceil(gag.heal * 1.2) : gag.heal) : null;
        return (
          <div key={sg.id} className="gagcalc-sel-gag" style={{ borderLeftColor: track.color }}>
            <Image src={`/icons/gags/small/${sg.track}/${gag.icon}`} alt={gag.name} width={34} height={34} unoptimized className="gagcalc-sel-img" />
            <div className="gagcalc-sel-info">
              <span className="gagcalc-sel-name" style={{ color: track.labelColor }}>{gag.name}</span>
              <div className="gagcalc-sel-tags">
                {dmg > 0 && <span className="gagcalc-tag gagcalc-tag--dmg">{dmg} dmg</span>}
                {healVal && <span className="gagcalc-tag gagcalc-tag--heal">+{healVal}</span>}
                {multi   && <span className="gagcalc-tag gagcalc-tag--multi">+20%</span>}
                {kb      && <span className="gagcalc-tag gagcalc-tag--kb">+50% KB</span>}
              </div>
            </div>
            <div className="gagcalc-sel-btns">
              {gag.damage > 0 && (
                <button className={`gagcalc-pres-btn${sg.isPrestige ? ' gagcalc-pres-btn--on' : ''}`}
                  onClick={() => onTogglePrestige(sg.id)} title={sg.isPrestige ? 'Remove Prestige' : 'Prestige'}>
                  <Image src="/icons/gags/PrestigeStar.webp" alt="Prestige" width={15} height={15} unoptimized />
                </button>
              )}
              <button className="gagcalc-remove-btn" onClick={() => onRemove(sg.id)} aria-label="Remove">&times;</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DamageResult({ totalDamage }: { totalDamage: number }) {
  const cogEntries = Object.entries(CC_COG_HP) as [string, number][];
  return (
    <div className="gagcalc-result">
      <div className="gagcalc-result-head">
        <span className="kicker">Total Damage</span>
        <span className="gagcalc-result-num">{totalDamage}</span>
      </div>
      <div className="gagcalc-hp-list">
        {cogEntries.map(([lvl, hp]) => {
          const kills = totalDamage >= hp;
          const pct = Math.min(100, Math.round((totalDamage / hp) * 100));
          return (
            <div key={lvl} className={`gagcalc-hp-row${kills ? ' gagcalc-hp-row--kill' : ''}`}>
              <span className="gagcalc-hp-lv">Lv {lvl}</span>
              <div className="gagcalc-hp-bar-wrap"><div className="gagcalc-hp-bar" style={{ width: `${pct}%` }} /></div>
              <span className="gagcalc-hp-num">{hp} HP</span>
              <span className={kills ? 'gagcalc-hp-kill' : 'gagcalc-hp-no'}>{kills ? '\u2713' : '\u2717'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}