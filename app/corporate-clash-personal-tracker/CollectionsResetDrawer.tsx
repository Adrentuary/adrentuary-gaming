'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { COLLECTIONS } from './data-collections';

const SECTION_ICON_IMG: Record<string, string> = {
  'Start of Game':                 '/icons/misc/TTCC_Icon.png',
  'Activities':                    '/icons/misc/TTCC_Icon.png',
  'Misc.':                         '/icons/misc/DiceSticker.png',
  'Cattlelog Purchases':           '/icons/misc/DiceSticker.png',
  'G.U.M.B.A.L.L. Machine':       '/icons/misc/Gumballs.png',
  'Promotions & Directives':       '/icons/misc/TTCC_Icon.png',
  'Halloween':                     '/icons/misc/TTCC_Halloween.png',
  'Toonsmas':                      '/icons/misc/TTCC_Toonsmas.png',
  'Toontown Central':              '/icons/playground-emblems/TTC.png',
  'Barnacle Boatyard':             '/icons/playground-emblems/BB.png',
  'Ye Olde Toontowne':             '/icons/playground-emblems/YOTT.png',
  'Daffodil Gardens':              '/icons/playground-emblems/DG.png',
  'Mezzo Melodyland':              '/icons/playground-emblems/MML.png',
  'The Brrrgh':                    '/icons/playground-emblems/TB.png',
  'Acorn Acres':                   '/icons/playground-emblems/AA.png',
  'Drowsy Dreamland':              '/icons/playground-emblems/DDL.png',
};

const CONFIRM_WORD = 'RESET';
type Target = ToonIndex | 'all';
interface ArmedState { section: string | 'ALL'; toon: Target }

export function CollectionsResetDrawer() {
  const { toonNames, resetToon, resetAll, resetSection } = useTracker();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState<ArmedState | null>(null);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState<string | null>(null);

  const arm = (section: string | 'ALL', toon: Target) => {
    setArmed({ section, toon }); setTyped(''); setDone(null);
  };
  const cancel = () => { setArmed(null); setTyped(''); };
  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const execute = () => {
    if (!confirmed || !armed) return;
    const { section, toon } = armed;
    const label = toon === 'all' ? 'All Toons' : toonNames[toon as ToonIndex];
    if (section === 'ALL') {
      toon === 'all' ? resetAll() : resetToon(toon as ToonIndex);
      setDone(`Reset ${label} across all collections.`);
    } else {
      resetSection(`c:${section}:`, toon);
      setDone(`Reset ${label} in ${section}.`);
    }
    setArmed(null); setTyped('');
  };

  const toonColor = (t: Target): React.CSSProperties =>
    t === 'all' ? {} : { '--tc': TOON_COLORS[t as ToonIndex] } as React.CSSProperties;
  const isArmed = (s: string | 'ALL', t: Target) =>
    armed?.section === s && armed?.toon === t;

  return (
    <div className="quest-reset-drawer">
      <button
        className={`quest-reset-toggle${open ? ' quest-reset-toggle--open' : ''}`}
        onClick={() => { setOpen(o => !o); setArmed(null); setTyped(''); setDone(null); }}
        aria-expanded={open}
      >
        <span className="quest-reset-toggle-icon">⚠</span>
        Reset Collections Progress
        <span className="quest-reset-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>

      {open && (
        <div className="quest-reset-body">
          <p className="quest-reset-desc">
            Select a toon button to arm it, then type <strong>{CONFIRM_WORD}</strong> and click Reset to confirm.
          </p>

          {COLLECTIONS.map(sec => (
            <div key={sec.name} className="quest-reset-row">
              <span className="quest-reset-row-label">
                {SECTION_ICON_IMG[sec.name]
                  ? <Image src={SECTION_ICON_IMG[sec.name]} alt={sec.name} width={20} height={20} className="quest-reset-row-icon" unoptimized />
                  : null}
                {sec.name === 'Unobtainable'
                  ? <><span style={{width:20,height:20,fontSize:16,lineHeight:'20px',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>🔒</span>Unobtainable</>
                  : sec.name}
              </span>
              <div className="quest-reset-row-btns">
                {([0,1,2,3] as ToonIndex[]).map(t => (
                  <button
                    key={t}
                    className={`reset-btn${isArmed(sec.name, t) ? ' reset-btn--armed' : ''}`}
                    style={toonColor(t)}
                    onClick={() => arm(sec.name, t)}
                  >{toonNames[t]}</button>
                ))}
                <button
                  className={`reset-btn reset-btn--all${isArmed(sec.name, 'all') ? ' reset-btn--armed' : ''}`}
                  onClick={() => arm(sec.name, 'all')}
                >All Toons</button>
              </div>
            </div>
          ))}

          <div className="quest-reset-row quest-reset-row--all">
            <span className="quest-reset-row-label quest-reset-row-label--danger">⚠ Reset ALL Collections</span>
            <div className="quest-reset-row-btns">
              {([0,1,2,3] as ToonIndex[]).map(t => (
                <button
                  key={t}
                  className={`reset-btn${isArmed('ALL', t) ? ' reset-btn--armed' : ''}`}
                  style={toonColor(t)}
                  onClick={() => arm('ALL', t)}
                >{toonNames[t]}</button>
              ))}
              <button
                className={`reset-btn reset-btn--all${isArmed('ALL', 'all') ? ' reset-btn--armed' : ''}`}
                onClick={() => arm('ALL', 'all')}
              >All Toons</button>
            </div>
          </div>

          {armed && (
            <div className="acct-danger-confirm">
              <p className="acct-danger-confirm-msg">
                You are about to reset{' '}
                <strong>{armed.toon === 'all' ? 'All Toons' : toonNames[armed.toon as ToonIndex]}</strong>
                {armed.section === 'ALL' ? ' across ALL collections' : ` in ${armed.section}`}.{' '}
                Type <strong>{CONFIRM_WORD}</strong> below to confirm.
              </p>
              <div className="acct-danger-confirm-row">
                <input
                  className="acct-danger-input"
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && confirmed) execute(); if (e.key === 'Escape') cancel(); }}
                  placeholder={`Type ${CONFIRM_WORD} to confirm`}
                  autoFocus
                  spellCheck={false}
                />
                <button className="acct-danger-go-btn" onClick={execute} disabled={!confirmed}>Reset</button>
                <button className="acct-danger-cancel-btn" onClick={cancel}>Cancel</button>
              </div>
            </div>
          )}

          {done && <p className="acct-danger-done">{done}</p>}
        </div>
      )}
    </div>
  );
}
