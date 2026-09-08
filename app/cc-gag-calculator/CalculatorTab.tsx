'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  CC_GAG_TRACKS, COG_TYPES, COG_TYPE_LEVEL_RANGE,
  getCogHP, standardCogHP, type GagTrackKey, type CogType,
} from './data-cc-gags';
import { calcTotalDamage, getGagDamage, getKnockbackValue, trackGetsKnockback, trackCounts, type SelectedGag } from './calc-logic';

let nextId = 1;

export function CalculatorTab() {
  const [selectedGags, setSelectedGags] = useState<SelectedGag[]>([]);
  const [isLured, setIsLured] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [cogType, setCogType] = useState<CogType>('standard');
  const [cogLevel, setCogLevel] = useState<number>(12);
  const [manualHP, setManualHP] = useState<string>('');

  // Level range for the currently selected cog type
  const levelRange = COG_TYPE_LEVEL_RANGE[cogType];
  // Clamp cogLevel to the valid range whenever it would be out of bounds
  const clampedLevel = Math.max(levelRange.min, Math.min(levelRange.max, cogLevel));

  const breakdown = useMemo(
    () => calcTotalDamage(selectedGags, isLured, cogType),
    [selectedGags, isLured, cogType],
  );

  const needsManualHP = getCogHP(cogType, clampedLevel) === null;

  // Resolved HP: formula or manual entry
  const resolvedHP = useMemo(() => {
    const computed = getCogHP(cogType, clampedLevel);
    if (computed !== null) return computed;
    const manual = parseInt(manualHP, 10);
    return isNaN(manual) || manual <= 0 ? null : manual;
  }, [cogType, clampedLevel, manualHP]);

  // Skelecog HP range hint shown next to manual input
  const skelecogRange = useMemo(() => {
    if (cogType !== 'skelecog' && cogType !== 'virtual-skelecog') return null;
    const base = standardCogHP(clampedLevel);
    if (cogType === 'skelecog') return { min: Math.ceil(base * 0.90), max: Math.ceil(base * 1.25) };
    return { min: Math.ceil(base * 0.70), max: Math.ceil(base * 1.10) };
  }, [cogType, clampedLevel]);

  function handleCogTypeChange(newType: CogType) {
    const range = COG_TYPE_LEVEL_RANGE[newType];
    setCogType(newType);
    setManualHP('');
    // Clamp level into the new type's range
    setCogLevel(prev => Math.max(range.min, Math.min(range.max, prev)));
  }

  function handleLevelChange(raw: string) {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) return;
    setCogLevel(Math.max(levelRange.min, Math.min(levelRange.max, parsed)));
  }

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
                  <button key={gi}
                    className={`gagcalc-cell${hoveredCell === k ? ' gagcalc-cell--hov' : ''}`}
                    onClick={() => addGag(track.key, ti, gi)}
                    onMouseEnter={() => setHoveredCell(k)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{ background: track.color }}
                    title={`${gag.name} (Lv ${gag.level})${gag.damage > 0 ? ` — ${gag.damage} dmg` : gag.heal ? ` — +${gag.heal} heal` : ''}`}
                  >
                    <Image src={`/icons/gags/small/${track.key}/${gag.icon}`} alt={gag.name} width={36} height={36} unoptimized className="gagcalc-gag-img" />
                    <span className="gagcalc-gag-name">{gag.name}</span>
                    {gag.damage > 0
                      ? <span className="gagcalc-gag-stat" style={{ color: track.labelColor }}>{gag.damage}</span>
                      : gag.heal ? <span className="gagcalc-gag-stat gagcalc-gag-stat--heal">+{gag.heal}</span>
                      : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="gagcalc-cog-controls">
          <div className="gagcalc-cog-row">
            <label className="gagcalc-cog-label">Cog Type</label>
            <select className="gagcalc-cog-select" value={cogType}
              onChange={e => handleCogTypeChange(e.target.value as CogType)}>
              {COG_TYPES.map(ct => <option key={ct.key} value={ct.key}>{ct.label}</option>)}
            </select>
          </div>
          <div className="gagcalc-cog-row">
            <label className="gagcalc-cog-label">
              Level
              <span className="gagcalc-muted"> ({levelRange.min}–{levelRange.max})</span>
            </label>
            {cogType === 'manager'
              ? <span className="gagcalc-cog-input gagcalc-cog-input--static">—</span>
              : <input type="number"
                  min={levelRange.min} max={levelRange.max}
                  className="gagcalc-cog-input"
                  value={clampedLevel}
                  onChange={e => handleLevelChange(e.target.value)} />
            }
          </div>
          {needsManualHP && (
            <div className="gagcalc-cog-row">
              <label className="gagcalc-cog-label">
                {cogType === 'manager' ? 'HP' : 'Actual HP'}
                {skelecogRange && (
                  <span className="gagcalc-muted"> ({skelecogRange.min}–{skelecogRange.max})</span>
                )}
              </label>
              <input type="number" min={1} className="gagcalc-cog-input" placeholder="Enter HP…"
                value={manualHP} onChange={e => setManualHP(e.target.value)} />
            </div>
          )}
        </div>

        <label className="gagcalc-toggle">
          <input type="checkbox" checked={isLured} onChange={e => setIsLured(e.target.checked)} />
          <span className="gagcalc-toggle-box" />
          <span>Cog is Lured <span className="gagcalc-muted">(Throw/Squirt knockback · Drop misses · Trap triggers)</span></span>
        </label>
      </div>
      <div className="gagcalc-right">
        <ComboPanel
          gags={selectedGags} isLured={isLured} breakdown={breakdown}
          cogType={cogType} cogLevel={clampedLevel} resolvedHP={resolvedHP}
          onRemove={removeGag} onTogglePrestige={togglePrestige} onClear={clearAll}
        />
      </div>
    </div>
  );
}
function ComboPanel({ gags, isLured, breakdown, cogType, cogLevel, resolvedHP, onRemove, onTogglePrestige, onClear }: {
  gags: SelectedGag[]; isLured: boolean;
  breakdown: ReturnType<typeof calcTotalDamage>;
  cogType: CogType; cogLevel: number; resolvedHP: number | null;
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
      {breakdown.trapNeedsLure && (
        <p className="gagcalc-warn">⚠ Trap requires Lure to trigger — add a Lure gag or enable &ldquo;Cog is Lured&rdquo;.</p>
      )}
      {hasDmg && (
        <DamageResult breakdown={breakdown} cogType={cogType} cogLevel={cogLevel} resolvedHP={resolvedHP} />
      )}
    </>
  );
}

function SelectedList({ gags, isLured, onRemove, onTogglePrestige }: {
  gags: SelectedGag[]; isLured: boolean; onRemove(id: number): void; onTogglePrestige(id: number): void;
}) {
  const tc      = trackCounts(gags);
  const kbValue = getKnockbackValue(gags, isLured);
  const hasSound = gags.some(g => g.track === 'sound');
  return (
    <div className="gagcalc-sel-list">
      {gags.map(sg => {
        const track  = CC_GAG_TRACKS[sg.trackIdx];
        const gag    = track.gags[sg.gagIdx];
        const dmg    = getGagDamage(sg.track, sg.gagIdx, sg.isPrestige);
        const multi  = (tc[sg.track] ?? 0) >= 2 && !['toon-up','lure','trap','sound','zap'].includes(sg.track);
        const kb     = kbValue > 0 && trackGetsKnockback(sg.track) && !hasSound;
        const healVal  = gag.heal ? gag.heal : null;
        const selfHeal = gag.heal ? (sg.isPrestige ? Math.ceil(gag.heal * 0.45) : Math.ceil(gag.heal * 0.25)) : null;
        return (
          <div key={sg.id} className="gagcalc-sel-gag" style={{ borderLeftColor: track.color }}>
            <Image src={`/icons/gags/small/${sg.track}/${gag.icon}`} alt={gag.name} width={34} height={34} unoptimized className="gagcalc-sel-img" />
            <div className="gagcalc-sel-info">
              <span className="gagcalc-sel-name" style={{ color: track.labelColor }}>{gag.name}</span>
              <div className="gagcalc-sel-tags">
                {dmg > 0 && <span className="gagcalc-tag gagcalc-tag--dmg">{dmg} dmg</span>}
                {healVal && <span className="gagcalc-tag gagcalc-tag--heal">+{healVal} heal</span>}
                {selfHeal && <span className="gagcalc-tag gagcalc-tag--heal">+{selfHeal} self</span>}
                {multi && <span className="gagcalc-tag gagcalc-tag--multi">+{Math.round(track.comboBonus * 100)}% combo</span>}
                {kb && <span className="gagcalc-tag gagcalc-tag--kb">+{kbValue} KB</span>}
                {sg.isPrestige && <span className="gagcalc-tag gagcalc-tag--pres">★ Prestige</span>}
              </div>
            </div>
            <div className="gagcalc-sel-btns">
              {(gag.damage > 0 || gag.heal) && (
                <button className={`gagcalc-pres-btn${sg.isPrestige ? ' gagcalc-pres-btn--on' : ''}`}
                  onClick={() => onTogglePrestige(sg.id)} title={sg.isPrestige ? 'Remove Prestige' : 'Enable Prestige'}>
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

function DamageResult({ breakdown, cogType, cogLevel, resolvedHP }: {
  breakdown: ReturnType<typeof calcTotalDamage>;
  cogType: CogType; cogLevel: number; resolvedHP: number | null;
}) {
  const { total, knockback, execBonus, comboBonus } = breakdown;
  const cogTypeData = COG_TYPES.find(c => c.key === cogType)!;
  const isExec = cogTypeData.isExec;
  const needsManualHP = resolvedHP === null;
  const remaining = resolvedHP !== null ? resolvedHP - total : null;
  const kills = resolvedHP !== null && total >= resolvedHP;

  return (
    <div className="gagcalc-result">
      {/* Bonus breakdown chips */}
      {(knockback > 0 || execBonus > 0 || comboBonus > 0) && (
        <div className="gagcalc-breakdown">
          {knockback  > 0 && <span className="gagcalc-tag gagcalc-tag--kb">+{knockback} Knockback</span>}
          {execBonus  > 0 && <span className="gagcalc-tag gagcalc-tag--exec">+{execBonus} Exec Bonus</span>}
          {comboBonus > 0 && <span className="gagcalc-tag gagcalc-tag--multi">+{comboBonus} Combo</span>}
        </div>
      )}

      {/* Card — matches reference screenshot style */}
      <div className={`gagcalc-card${kills ? ' gagcalc-card--kill' : needsManualHP ? ' gagcalc-card--unknown' : ''}`}>
        {/* Cog portrait placeholder */}
        <div className="gagcalc-card-img">
          <div className="gagcalc-card-img-placeholder">
            {isExec && <span className="gagcalc-card-exec-badge">.exe</span>}
          </div>
        </div>

        {/* Level / HP / Remaining info box */}
        <div className="gagcalc-card-info">
          {cogType === 'manager'
            ? <span className="gagcalc-card-level">.mgr</span>
            : <span className="gagcalc-card-level">Level: {cogLevel}</span>
          }
          {resolvedHP !== null
            ? <>
                <span className="gagcalc-card-hp">HP: {resolvedHP}</span>
                <span className={`gagcalc-card-remaining${kills ? ' gagcalc-card-remaining--kill' : remaining! < 0 ? ' gagcalc-card-remaining--over' : ''}`}>
                  {kills ? 'Defeated!' : `Remaining: ${remaining}`}
                </span>
              </>
            : <span className="gagcalc-card-hp gagcalc-card-hp--unknown">HP: —</span>
          }
        </div>

        {/* Damage number */}
        <div className="gagcalc-card-dmg">
          <span className="gagcalc-card-dmg-num">{total}</span>
          <span className="gagcalc-card-dmg-label">Damage</span>
        </div>
      </div>

      {/* Exec note */}
      {isExec && (
        <p className="gagcalc-card-note">
          <span className="gagcalc-tag gagcalc-tag--exec" style={{ marginRight: 6 }}>Exec</span>
          Trap deals <strong>+30%</strong> damage vs. this cog type
          {breakdown.execBonus > 0 && <> (+{breakdown.execBonus} applied)</>}.
        </p>
      )}
    </div>
  );
}