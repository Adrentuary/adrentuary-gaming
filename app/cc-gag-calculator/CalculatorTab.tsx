'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { CC_GAG_TRACKS, COG_TYPES, COG_TYPE_LEVEL_RANGE, type GagTrackKey, type CogType } from './data-cc-gags';
import { calcTotalDamage, getGagDamage, getKnockbackValue, trackGetsKnockback, trackCounts, type SelectedGag } from './calc-logic';

let nextId = 1;

export function CalculatorTab() {
  const [selectedGags, setSelectedGags] = useState<SelectedGag[]>([]);
  const [isLured, setIsLured] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [debuffCount, setDebuffCount] = useState<number>(0);

  const breakdown = useMemo(
    () => calcTotalDamage(selectedGags, isLured, 'standard', debuffCount),
    [selectedGags, isLured, debuffCount],
  );

  // Show debuff selector only when Prestige Drop is in the combo
  const hasPrestigeDrop = selectedGags.some(g => g.track === 'drop' && g.isPrestige);

  function addGag(track: GagTrackKey, trackIdx: number, gagIdx: number) {
    setSelectedGags(prev => [...prev, { id: nextId++, track, trackIdx, gagIdx, isPrestige: false }]);
  }
  function removeGag(id: number) { setSelectedGags(prev => prev.filter(g => g.id !== id)); }
  function togglePrestige(id: number) {
    setSelectedGags(prev => prev.map(g => g.id === id ? { ...g, isPrestige: !g.isPrestige } : g));
  }
  function setCustomDamage(id: number, dmg: number | undefined) {
    setSelectedGags(prev => prev.map(g => g.id === id ? { ...g, customDamage: dmg } : g));
  }
  function clearAll() { setSelectedGags([]); setIsLured(false); setDebuffCount(0); }

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

        {hasPrestigeDrop && (
          <div className="gagcalc-cog-controls" style={{ borderColor: '#107878' }}>
            <div className="gagcalc-cog-row">
              <label className="gagcalc-cog-label" style={{ color: '#40d0d0' }}>
                ★ Prestige Drop — Debuffs on Cog
              </label>
              <div className="gagcalc-debuff-btns">
                {[0, 1, 2, 3].map(n => (
                  <button
                    key={n}
                    className={`gagcalc-debuff-btn${debuffCount === n ? ' gagcalc-debuff-btn--on' : ''}`}
                    onClick={() => setDebuffCount(n)}
                  >
                    {n === 0 ? 'None' : `${n}`}
                  </button>
                ))}
              </div>
            </div>
            <p className="gagcalc-debuff-note">
              {debuffCount === 0 && <span className="gagcalc-muted">No debuff bonus applied.</span>}
              {debuffCount === 1 && <span>+10% damage (Dazed / Marked for Laugh / Soaked / other)</span>}
              {debuffCount === 2 && <span>+15% damage (2 active debuffs)</span>}
              {debuffCount === 3 && <span>+20% damage (3 active debuffs)</span>}
            </p>
          </div>
        )}

        <label className="gagcalc-toggle">
          <input type="checkbox" checked={isLured} onChange={e => setIsLured(e.target.checked)} />
          <span className="gagcalc-toggle-box" />
          <span>Cog is Lured <span className="gagcalc-muted">(Throw/Squirt knockback · Drop misses · Trap triggers)</span></span>
        </label>
      </div>
      <div className="gagcalc-right">
        <ComboPanel
          gags={selectedGags} isLured={isLured} breakdown={breakdown}
          onRemove={removeGag} onTogglePrestige={togglePrestige}
          onSetCustomDamage={setCustomDamage} onClear={clearAll}
        />
      </div>
    </div>
  );
}
function ComboPanel({ gags, isLured, breakdown, onRemove, onTogglePrestige, onSetCustomDamage, onClear }: {
  gags: SelectedGag[]; isLured: boolean;
  breakdown: ReturnType<typeof calcTotalDamage>;
  onRemove(id: number): void; onTogglePrestige(id: number): void;
  onSetCustomDamage(id: number, dmg: number | undefined): void; onClear(): void;
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
        : <SelectedList gags={gags} isLured={isLured} onRemove={onRemove} onTogglePrestige={onTogglePrestige} onSetCustomDamage={onSetCustomDamage} />
      }
      {breakdown.trapNeedsLure && (
        <p className="gagcalc-warn">⚠ Trap requires Lure to trigger — add a Lure gag or enable &ldquo;Cog is Lured&rdquo;.</p>
      )}
      {hasDmg && <DamageResult breakdown={breakdown} />}
    </>
  );
}

function SelectedList({ gags, isLured, onRemove, onTogglePrestige, onSetCustomDamage }: {
  gags: SelectedGag[]; isLured: boolean; onRemove(id: number): void;
  onTogglePrestige(id: number): void;
  onSetCustomDamage(id: number, dmg: number | undefined): void;
}) {
  const tc       = trackCounts(gags);
  const kbValue  = getKnockbackValue(gags, isLured);
  const hasSound = gags.some(g => g.track === 'sound');
  return (
    <div className="gagcalc-sel-list">
      {gags.map(sg => {
        const track    = CC_GAG_TRACKS[sg.trackIdx];
        const gag      = track.gags[sg.gagIdx];
        const maxDmg   = getGagDamage(sg.track, sg.gagIdx, sg.isPrestige);
        const dispDmg  = sg.customDamage !== undefined ? sg.customDamage : maxDmg;
        const multi    = (tc[sg.track] ?? 0) >= 2 && !['toon-up','lure','trap','sound','zap'].includes(sg.track);
        const kb       = kbValue > 0 && trackGetsKnockback(sg.track) && !hasSound;
        const healVal  = gag.heal ?? null;
        const selfHeal = gag.heal ? (sg.isPrestige ? Math.ceil(gag.heal * 0.45) : Math.ceil(gag.heal * 0.25)) : null;
        const isCustom = sg.customDamage !== undefined && sg.customDamage !== maxDmg;
        return (
          <div key={sg.id} className="gagcalc-sel-gag" style={{ borderLeftColor: track.color }}>
            <Image src={`/icons/gags/small/${sg.track}/${gag.icon}`} alt={gag.name} width={34} height={34} unoptimized className="gagcalc-sel-img" />
            <div className="gagcalc-sel-info">
              <span className="gagcalc-sel-name" style={{ color: track.labelColor }}>{gag.name}</span>
              <div className="gagcalc-sel-tags">
                {/* Editable damage tag */}
                {dispDmg > 0 && (
                  <EditableDmgTag
                    value={dispDmg} isCustom={isCustom}
                    onCommit={val => onSetCustomDamage(sg.id, val === maxDmg ? undefined : val)}
                    onReset={() => onSetCustomDamage(sg.id, undefined)}
                  />
                )}
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

/** Inline editable damage chip — click to edit, Enter or blur to confirm */
function EditableDmgTag({ value, isCustom, onCommit, onReset }: {
  value: number; isCustom: boolean;
  onCommit(val: number): void;
  onReset(): void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(String(value));
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing, value]);

  function commit() {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n > 0) onCommit(n);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="gagcalc-dmg-input"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') setEditing(false);
        }}
        type="number" min={1}
      />
    );
  }

  return (
    <button
      className={`gagcalc-tag gagcalc-tag--dmg gagcalc-tag--dmg-edit${isCustom ? ' gagcalc-tag--dmg-custom' : ''}`}
      onClick={() => setEditing(true)}
      title={isCustom ? 'Custom damage — click to edit, right-click to reset' : 'Click to set custom damage'}
      onContextMenu={e => { e.preventDefault(); onReset(); }}
    >
      {value} dmg
    </button>
  );
}

/** For a formula-based cog type, find the highest level the combo damage can defeat. */
function getMaxDefeatedLevel(cogType: CogType, damage: number): number | null {
  const range = COG_TYPE_LEVEL_RANGE[cogType];
  const typeData = COG_TYPES.find(c => c.key === cogType)!;
  // Only works for formula-based types (not skelecog, virtual-skelecog, manager)
  if (typeData.hpFormula(range.min) === null) return null;

  let maxDefeated: number | null = null;
  for (let lv = range.min; lv <= range.max; lv++) {
    const hp = typeData.hpFormula(lv);
    if (hp !== null && damage >= hp) maxDefeated = lv;
  }
  return maxDefeated;
}

function DamageResult({ breakdown }: { breakdown: ReturnType<typeof calcTotalDamage> }) {
  const { total, knockback, execBonus, comboBonus, debuffBonus } = breakdown;

  const formulaTypes: CogType[] = [
    'standard', 'executive', 'field-specialist', 'exec-field', 'ops-analyst', 'exec-ops',
  ];
  const maxDefeats = formulaTypes.map(ct => ({
    key: ct,
    label: COG_TYPES.find(c => c.key === ct)!.label,
    isExec: COG_TYPES.find(c => c.key === ct)!.isExec,
    maxLv: getMaxDefeatedLevel(ct, total),
    range: COG_TYPE_LEVEL_RANGE[ct],
  }));

  return (
    <div className="gagcalc-result">
      {/* Bonus breakdown chips */}
      {(knockback > 0 || execBonus > 0 || comboBonus > 0 || debuffBonus > 0) && (
        <div className="gagcalc-breakdown">
          {knockback   > 0 && <span className="gagcalc-tag gagcalc-tag--kb">+{knockback} Knockback</span>}
          {execBonus   > 0 && <span className="gagcalc-tag gagcalc-tag--exec">+{execBonus} Exec Bonus</span>}
          {debuffBonus > 0 && <span className="gagcalc-tag gagcalc-tag--debuff">+{debuffBonus} Debuff Boost</span>}
          {comboBonus  > 0 && <span className="gagcalc-tag gagcalc-tag--multi">+{comboBonus} Combo</span>}
        </div>
      )}

      {/* Damage card */}
      <div className="gagcalc-card">
        <div className="gagcalc-card-img">
          <div className="gagcalc-card-img-placeholder" />
        </div>
        <div className="gagcalc-card-info">
          <span className="gagcalc-card-level">Total Damage</span>
          <span className="gagcalc-card-hp">See breakdown below</span>
        </div>
        <div className="gagcalc-card-dmg">
          <span className="gagcalc-card-dmg-num">{total}</span>
          <span className="gagcalc-card-dmg-label">Damage</span>
        </div>
      </div>

      {/* Max defeat table */}
      <div className="gagcalc-maxdef">
        <p className="gagcalc-maxdef-heading">Highest level defeated</p>
        <div className="gagcalc-maxdef-grid">
          {maxDefeats.map(({ key, label, isExec: ie, maxLv, range }) => {
            const defeated = maxLv !== null;
            const atMax    = maxLv === range.max;
            return (
              <div key={key} className={`gagcalc-maxdef-row${defeated ? ' gagcalc-maxdef-row--hit' : ''}`}>
                <span className="gagcalc-maxdef-type">
                  {label}
                  {ie && <span className="gagcalc-maxdef-exec-dot" title="Executive — Trap +30%" />}
                </span>
                <span className={`gagcalc-maxdef-val${atMax ? ' gagcalc-maxdef-val--max' : ''}`}>
                  {defeated
                    ? <>Lv {maxLv}{atMax && <span className="gagcalc-maxdef-max-badge">MAX</span>}</>
                    : <span className="gagcalc-maxdef-none">—</span>
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}