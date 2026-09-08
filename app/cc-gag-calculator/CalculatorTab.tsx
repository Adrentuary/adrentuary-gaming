'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  CC_GAG_TRACKS, COG_TYPES, COG_TYPE_LEVEL_RANGE, IOU_DATA, LURE_GAG_DATA,
  type GagTrackKey, type CogType, type IouTrackKey,
} from './data-cc-gags';
import { calcTotalDamage, getGagDamage, getKnockbackValue, trackGetsKnockback, trackCounts, type SelectedGag } from './calc-logic';

let nextId = 1;

// All gag tracks that have IOUs (for the selector panel order)
const IOU_GAG_TRACKS: GagTrackKey[] = ['toon-up','trap','lure','throw','squirt','zap','sound','drop'];

export function CalculatorTab() {
  const [selectedGags, setSelectedGags] = useState<SelectedGag[]>([]);
  const [isLured, setIsLured] = useState(false);
  // Which lure gag was used the previous round (-1 = unknown/generic)
  const [luredByGagIdx, setLuredByGagIdx] = useState<number>(-1);
  const [luredByPrestige, setLuredByPrestige] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [debuffCount, setDebuffCount] = useState<number>(0);
  // activeIous: track → total IOU bonus applied (selectedBonus × count, 0 = none) — fed into calc
  const [activeIous, setActiveIous] = useState<Partial<Record<IouTrackKey, number>>>({});
  // activeIouCounts: track → how many toons using this IOU (1–4)
  const [activeIouCounts, setActiveIouCounts] = useState<Partial<Record<IouTrackKey, number>>>({});
  // activeIouSelected: track → which IOU's bonus value is selected (for UI highlight)
  const [activeIouSelected, setActiveIouSelected] = useState<Partial<Record<IouTrackKey, number>>>({});
  const [rainActive, setRainActive] = useState(false);
  const [showIous, setShowIous] = useState(false);
  // Custom knockback override — undefined = use calc'd value from lure gags
  const [customKb, setCustomKb] = useState<number | undefined>(undefined);

  const rainBonus = rainActive ? 20 : 0;

  const breakdown = useMemo(
    () => calcTotalDamage(selectedGags, isLured, 'standard', debuffCount, activeIous, rainBonus, luredByGagIdx, luredByPrestige, customKb),
    [selectedGags, isLured, debuffCount, activeIous, rainBonus, luredByGagIdx, luredByPrestige, customKb],
  );

  // Show debuff selector only when Prestige Drop is in the combo
  const hasPrestigeDrop = selectedGags.some(g => g.track === 'drop' && g.isPrestige);

  // Total active IOUs: number of distinct tracks with an IOU selected + rain
  const activeIouCount = Object.values(activeIouCounts).filter(v => (v ?? 0) > 0).length + (rainActive ? 1 : 0);

  function toggleIou(track: IouTrackKey, bonus: number) {
    if (track === 'rain') { setRainActive(p => !p); return; }
    setActiveIouSelected(prevSel => {
      const currentSelected = prevSel[track] ?? 0;
      // If clicking a different IOU, reset count to 1 with new bonus; else cycle count up
      setActiveIouCounts(prevCounts => {
        const currentCount = currentSelected === bonus ? (prevCounts[track] ?? 0) : 0;
        const nextCount = currentCount >= 4 ? 0 : currentCount + 1;
        setActiveIous(prevBonus => ({ ...prevBonus, [track]: bonus * nextCount }));
        return { ...prevCounts, [track]: nextCount };
      });
      return { ...prevSel, [track]: bonus };
    });
  }

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
  function setCustomHeal(id: number, heal: number | undefined) {
    setSelectedGags(prev => prev.map(g => g.id === id ? { ...g, customHeal: heal } : g));
  }
  function clearAll() {
    setSelectedGags([]); setIsLured(false); setLuredByGagIdx(-1); setLuredByPrestige(false); setDebuffCount(0);
    setActiveIous({}); setActiveIouCounts({}); setActiveIouSelected({}); setRainActive(false); setCustomKb(undefined);
  }

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
                      : track.key === 'lure' ? <span className="gagcalc-gag-stat" style={{ color: track.labelColor }}>{LURE_GAG_DATA[gi].knockback} KB</span>
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
          <input type="checkbox" checked={isLured} onChange={e => {
            setIsLured(e.target.checked);
            if (!e.target.checked) { setLuredByGagIdx(-1); setLuredByPrestige(false); }
          }} />
          <span className="gagcalc-toggle-box" />
          <span>Cog is Lured <span className="gagcalc-muted">(Throw/Squirt knockback · Drop misses · Trap triggers)</span></span>
        </label>

        {/* Lure gag selector — only shown when "Cog is Lured" is active */}
        {isLured && (() => {
          const lureTrack = CC_GAG_TRACKS.find(t => t.key === 'lure')!;
          return (
            <div className="gagcalc-lure-picker">
              <span className="gagcalc-lure-picker-label">Which Lure was used last round?</span>
              <div className="gagcalc-lure-picker-chips">
                {lureTrack.gags.map((gag, gi) => {
                  const lureData = LURE_GAG_DATA[gi];
                  const isSelected = luredByGagIdx === gi;
                  const kbVal = isSelected && luredByPrestige ? lureData.knockbackPrestige : lureData.knockback;
                  return (
                    <button
                      key={gi}
                      className={`gagcalc-lure-chip${isSelected ? ' gagcalc-lure-chip--active' : ''}`}
                      onClick={() => {
                        if (isSelected) { setLuredByGagIdx(-1); setLuredByPrestige(false); }
                        else { setLuredByGagIdx(gi); setLuredByPrestige(false); }
                      }}
                      title={`${gag.name} — ${lureData.knockback} KB (prestige: ${lureData.knockbackPrestige} KB)`}
                    >
                      <Image src={`/icons/gags/small/lure/${gag.icon}`} alt={gag.name} width={22} height={22} unoptimized className="gagcalc-lure-chip-img" />
                      <span className="gagcalc-lure-chip-name">{gag.name}</span>
                      <span className="gagcalc-lure-chip-kb">{isSelected ? kbVal : lureData.knockback} KB</span>
                    </button>
                  );
                })}
              </div>
              {luredByGagIdx >= 0 && (
                <label className="gagcalc-lure-pres-toggle">
                  <input
                    type="checkbox"
                    checked={luredByPrestige}
                    onChange={e => setLuredByPrestige(e.target.checked)}
                  />
                  <span className="gagcalc-lure-pres-box" />
                  <span>Prestige Lure <span className="gagcalc-muted">({LURE_GAG_DATA[luredByGagIdx].knockbackPrestige} KB)</span></span>
                </label>
              )}
            </div>
          );
        })()}

        {/* IOU Panel */}
        <div className="gagcalc-iou-section">
          <button className="gagcalc-iou-toggle-btn" onClick={() => setShowIous(p => !p)}>
            <span className="gagcalc-iou-toggle-icon">📋</span>
            <span>IOUs in Effect</span>
            {activeIouCount > 0 && (
              <span className="gagcalc-iou-badge">{activeIouCount} active</span>
            )}
            <span className="gagcalc-iou-chevron">{showIous ? '▲' : '▼'}</span>
          </button>

          {showIous && (
            <div className="gagcalc-iou-panel">
              {/* Rain IOU — applies to all tracks */}
              <div className="gagcalc-iou-track-group">
                <div className="gagcalc-iou-track-header">
                  <span className="gagcalc-iou-track-name" style={{ color: '#a8d8ff' }}>Rain</span>
                  <span className="gagcalc-iou-track-sub">+20 to any gag</span>
                </div>
                <div className="gagcalc-iou-cards">
                  {IOU_DATA.filter(i => i.track === 'rain').map(iou => (
                    <IouCard
                      key={iou.key} iou={iou}
                      active={rainActive}
                      count={rainActive ? 1 : 0}
                      onToggle={() => toggleIou('rain', iou.bonus)}
                    />
                  ))}
                </div>
              </div>

              {/* Per-track IOUs */}
              {IOU_GAG_TRACKS.map(trackKey => {
                const trackData   = CC_GAG_TRACKS.find(t => t.key === trackKey)!;
                const trackIous   = IOU_DATA.filter(i => i.track === trackKey);
                const activeBonus   = activeIous[trackKey] ?? 0;
                const activeCount   = activeIouCounts[trackKey] ?? 0;
                const selectedBonus = activeIouSelected[trackKey] ?? 0;
                const isLureTrack   = trackKey === 'lure';
                return (
                  <div key={trackKey} className="gagcalc-iou-track-group">
                    <div className="gagcalc-iou-track-header">
                      <Image
                        src={`/icons/gags/large/${trackKey === 'toon-up' ? 'toon-up.png' : `${trackKey}-large.png`}`}
                        alt={trackData.name} width={14} height={14} unoptimized
                      />
                      <span className="gagcalc-iou-track-name" style={{ color: trackData.labelColor }}>
                        {trackData.name}
                      </span>
                      {isLureTrack && (
                        <span className="gagcalc-iou-track-sub">+KB</span>
                      )}
                      {activeBonus > 0 && (
                        <span className="gagcalc-iou-active-badge">
                          +{activeBonus} {isLureTrack ? 'KB' : trackKey === 'toon-up' ? 'heal' : 'dmg'}
                        </span>
                      )}
                    </div>
                    <div className="gagcalc-iou-cards">
                      {trackIous.map(iou => (
                        <IouCard
                          key={iou.key} iou={iou}
                          active={selectedBonus === iou.bonus && activeCount > 0}
                          count={selectedBonus === iou.bonus ? activeCount : 0}
                          onToggle={() => toggleIou(trackKey, iou.bonus)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="gagcalc-right">
        <ComboPanel
          gags={selectedGags} isLured={isLured} breakdown={breakdown}
          luredByGagIdx={luredByGagIdx} luredByPrestige={luredByPrestige}
          customKb={customKb}
          onRemove={removeGag} onTogglePrestige={togglePrestige}
          onSetCustomDamage={setCustomDamage} onSetCustomHeal={setCustomHeal}
          onSetCustomKb={val => setCustomKb(val)} onClear={clearAll}
        />
      </div>
    </div>
  );
}
function ComboPanel({ gags, isLured, luredByGagIdx, luredByPrestige, breakdown, customKb, onRemove, onTogglePrestige, onSetCustomDamage, onSetCustomHeal, onSetCustomKb, onClear }: {
  gags: SelectedGag[]; isLured: boolean; luredByGagIdx: number; luredByPrestige: boolean;
  breakdown: ReturnType<typeof calcTotalDamage>; customKb: number | undefined;
  onRemove(id: number): void; onTogglePrestige(id: number): void;
  onSetCustomDamage(id: number, dmg: number | undefined): void;
  onSetCustomHeal(id: number, heal: number | undefined): void;
  onSetCustomKb(val: number | undefined): void; onClear(): void;
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
        : <SelectedList gags={gags} isLured={isLured} luredByGagIdx={luredByGagIdx} luredByPrestige={luredByPrestige} customKb={customKb} onRemove={onRemove} onTogglePrestige={onTogglePrestige} onSetCustomDamage={onSetCustomDamage} onSetCustomHeal={onSetCustomHeal} onSetCustomKb={onSetCustomKb} />
      }
      {breakdown.trapNeedsLure && (
        <p className="gagcalc-warn">⚠ Trap requires Lure to trigger — add a Lure gag or enable &ldquo;Cog is Lured&rdquo;.</p>
      )}
      {breakdown.zapNeedsSoak && (
        <p className="gagcalc-warn">⚠ Zap requires the Cog to be Soaked — add a Squirt gag to this combo.</p>
      )}
      {hasDmg && <DamageResult breakdown={breakdown} />}
    </>
  );
}

function SelectedList({ gags, isLured, luredByGagIdx, luredByPrestige, customKb, onRemove, onTogglePrestige, onSetCustomDamage, onSetCustomHeal, onSetCustomKb }: {
  gags: SelectedGag[]; isLured: boolean; luredByGagIdx: number; luredByPrestige: boolean;
  customKb: number | undefined;
  onRemove(id: number): void; onTogglePrestige(id: number): void;
  onSetCustomDamage(id: number, dmg: number | undefined): void;
  onSetCustomHeal(id: number, heal: number | undefined): void;
  onSetCustomKb(val: number | undefined): void;
}) {
  const tc       = trackCounts(gags);
  const calcKb   = getKnockbackValue(gags, isLured, luredByGagIdx, luredByPrestige);
  const kbValue  = customKb !== undefined ? customKb : calcKb;
  const hasSound = gags.some(g => g.track === 'sound');
  return (
    <div className="gagcalc-sel-list">
      {gags.map(sg => {
        const track    = CC_GAG_TRACKS[sg.trackIdx];
        const gag      = track.gags[sg.gagIdx];
        const maxDmg      = getGagDamage(sg.track, sg.gagIdx, sg.isPrestige);
        const dispDmg     = sg.customDamage !== undefined ? sg.customDamage : maxDmg;
        const maxHeal     = gag.heal ?? null;
        const dispHeal    = sg.customHeal !== undefined ? sg.customHeal : maxHeal;
        const multi       = (tc[sg.track] ?? 0) >= 2 && !['toon-up','lure','trap','sound','zap'].includes(sg.track);
        const showKb      = kbValue > 0 && trackGetsKnockback(sg.track) && !hasSound;
        const selfHeal    = dispHeal ? (sg.isPrestige ? Math.ceil(dispHeal * 0.45) : Math.ceil(dispHeal * 0.25)) : null;
        const isCustomDmg  = sg.customDamage !== undefined && sg.customDamage !== maxDmg;
        const isCustomHeal = sg.customHeal !== undefined && sg.customHeal !== maxHeal;
        const isCustomKb   = customKb !== undefined && customKb !== calcKb;
        return (
          <div key={sg.id} className="gagcalc-sel-gag" style={{ borderLeftColor: track.color }}>
            <Image src={`/icons/gags/small/${sg.track}/${gag.icon}`} alt={gag.name} width={34} height={34} unoptimized className="gagcalc-sel-img" />
            <div className="gagcalc-sel-info">
              <span className="gagcalc-sel-name" style={{ color: track.labelColor }}>{gag.name}</span>
              <div className="gagcalc-sel-tags">
                {/* Editable damage tag */}
                {dispDmg > 0 && (
                  <EditableDmgTag
                    value={dispDmg} isCustom={isCustomDmg}
                    onCommit={val => onSetCustomDamage(sg.id, val === maxDmg ? undefined : val)}
                    onReset={() => onSetCustomDamage(sg.id, undefined)}
                  />
                )}
                {/* Editable heal tag */}
                {dispHeal !== null && dispHeal !== undefined && (
                  <EditableDmgTag
                    value={dispHeal} isCustom={isCustomHeal} label="heal" plusSign
                    onCommit={val => onSetCustomHeal(sg.id, val === maxHeal ? undefined : val)}
                    onReset={() => onSetCustomHeal(sg.id, undefined)}
                  />
                )}
                {selfHeal && <span className="gagcalc-tag gagcalc-tag--heal">+{selfHeal} self</span>}
                {multi && <span className="gagcalc-tag gagcalc-tag--multi">+{Math.round(track.comboBonus * 100)}% combo</span>}
                {/* Editable knockback tag */}
                {showKb && (
                  <EditableDmgTag
                    value={kbValue} isCustom={isCustomKb} label="KB" plusSign tagClass="gagcalc-tag--kb"
                    onCommit={val => onSetCustomKb(val === calcKb ? undefined : val)}
                    onReset={() => onSetCustomKb(undefined)}
                  />
                )}
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

/** Inline editable chip — click to edit, Enter or blur to confirm.
 *  label: text shown after value (default "dmg"). plusSign: prefix "+". tagClass: extra CSS class. */
function EditableDmgTag({ value, isCustom, onCommit, onReset, label = 'dmg', plusSign = false, tagClass }: {
  value: number; isCustom: boolean;
  onCommit(val: number): void;
  onReset(): void;
  label?: string;
  plusSign?: boolean;
  tagClass?: string;
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

  // For non-damage tags use their own colour class; damage uses the default --dmg class
  const baseClass = tagClass ?? 'gagcalc-tag--dmg';
  const editClass = tagClass ? '' : ' gagcalc-tag--dmg-edit';
  const customClass = (isCustom && !tagClass) ? ' gagcalc-tag--dmg-custom' : (isCustom ? ' gagcalc-tag--chip-custom' : '');

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
      className={`gagcalc-tag ${baseClass}${editClass}${customClass}`}
      onClick={() => setEditing(true)}
      title={isCustom ? `Custom ${label} — click to edit, right-click to reset` : `Click to set custom ${label}`}
      onContextMenu={e => { e.preventDefault(); onReset(); }}
    >
      {plusSign ? '+' : ''}{value} {label}
    </button>
  );
}

/** IOU card — shows toon name, bonus, uses, placeholder image, toggle active state */
function IouCard({ iou, active, count, onToggle }: {
  iou: import('./data-cc-gags').IouOption;
  active: boolean;
  count: number;
  onToggle(): void;
}) {
  return (
    <button
      className={`gagcalc-iou-card${active ? ' gagcalc-iou-card--active' : ''}`}
      onClick={onToggle}
      title={`${iou.toon}: +${iou.bonus} — click to add (up to ×4 toons)`}
    >
      {/* Placeholder image box */}
      <div className="gagcalc-iou-img-placeholder">
        <span className="gagcalc-iou-img-icon">👤</span>
      </div>
      <span className="gagcalc-iou-toon">{iou.toon}</span>
      <span className="gagcalc-iou-bonus">+{iou.bonus}</span>
      {count > 1 && <span className="gagcalc-iou-count">×{count}</span>}
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
  const { total, knockback, execBonus, comboBonus, debuffBonus, iouBonus } = breakdown;

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
      {(knockback > 0 || execBonus > 0 || comboBonus > 0 || debuffBonus > 0 || iouBonus > 0) && (
        <div className="gagcalc-breakdown">
          {iouBonus    > 0 && <span className="gagcalc-tag gagcalc-tag--iou">+{iouBonus} IOU</span>}
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