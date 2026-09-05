'use client';
import { useState } from 'react';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { COLLECTIONS, COLLECTION_TYPES } from './data-collections';
import type { CollectionType } from './data-collections';
import { useTracker } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { TOON_COLORS } from './TrackerContext';
import { CollectionsResetDrawer } from './CollectionsResetDrawer';

const TYPE_ICONS: Record<string, string> = {
  'Background':   '🖼️',
  'Nameplate':    '🏷️',
  'Nametag':      '✍️',
  'Profile Pose': '🧍',
  'Cheesy Effect':'🧀',
  'Emotion':      '😄',
};

const TYPE_COLORS: Record<string, string> = {
  'Background':   '#0A100A',
  'Nameplate':    '#0A100A',
  'Nametag':      '#0A100A',
  'Profile Pose': '#0A100A',
  'Cheesy Effect':'#0A100A',
  'Emotion':      '#0A100A',
};

const TYPE_ACCENTS: Record<string, string> = {
  'Background':   '#d4a010',
  'Nameplate':    '#e08030',
  'Nametag':      '#40a0e0',
  'Profile Pose': '#40c070',
  'Cheesy Effect':'#e0a030',
  'Emotion':      '#e060c0',
};

// Section name → image icon path (replaces emoji for visual sections)
const SECTION_ICON_IMG: Record<string, string> = {
  'Start of Game':                        '/icons/misc/TTCC_Icon.png',
  'Activities':                           '/icons/misc/TTCC_Icon.png',
  'Misc.':                                '/icons/misc/DiceSticker.png',
  'Cattlelog Purchases':                  '/icons/misc/DiceSticker.png',
  'G.U.M.B.A.L.L. Machine':              '/icons/misc/Gumballs.png',
  'Promotions & Directives':'/icons/misc/TTCC_Icon.png',
  'Halloween':                            '/icons/misc/TTCC_Halloween.png',
  'Toonsmas':                             '/icons/misc/TTCC_Toonsmas.png',
  'Toontown Central':                     '/icons/playground-emblems/TTC.png',
  'Barnacle Boatyard':                    '/icons/playground-emblems/BB.png',
  'Ye Olde Toontowne':                    '/icons/playground-emblems/YOTT.png',
  'Daffodil Gardens':                     '/icons/playground-emblems/DG.png',
  'Mezzo Melodyland':                     '/icons/playground-emblems/MML.png',
  'The Brrrgh':                           '/icons/playground-emblems/TB.png',
  'Acorn Acres':                          '/icons/playground-emblems/AA.png',
  'Drowsy Dreamland':                     '/icons/playground-emblems/DDL.png',
};

const COLLAPSED_KEY = 'collections';

const IMG_DIMS: Record<string, [number,number]> = {
  'Background':    [192, 108],
  'Nameplate':     [220,  86],
  'Nametag':       [220,  86],
  'Profile Pose':  [130, 130],
  'Cheesy Effect': [130, 130],
  'Emotion':       [130, 130],
};

export function SectionCollections() {
  const { toonNames, progress, toggle, collapsedUI, setCollapsedUI } = useTracker();
  const [filter, setFilter] = useState<CollectionType | 'All'>('All');
  const collapsed = new Set<string>(collapsedUI[COLLAPSED_KEY] ?? []);
  const toggleCollapse = (name: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[COLLAPSED_KEY] ?? []);
      current.has(name) ? current.delete(name) : current.add(name);
      return { ...prev, [COLLAPSED_KEY]: [...current] };
    });
  };
  const activeTypes = filter === 'All' ? COLLECTION_TYPES : [filter] as CollectionType[];
  return (
    <div className="tracker-section">
      <SectionNote
        description="Collectible items in Corporate Clash: backgrounds, nameplates, nametags, profile poses, cheesy effects, and emotions. Filter by type below."
        status="Accurate information, section design, and interactive features are currently being developed and refined."
        lastUpdated="September 1st, 2026"
        lastChanges="Reorganized sections with correct wiki unlock info. Cattlelog Purchases added. Collapsible sections persist. Section icons updated. A-Z sort for Nametags, Poses, Cheesy Effects, Emotions."
      />
      <CollectionsResetDrawer />
      <div className="coll-filter-bar">
        <button className={`coll-filter-btn${filter==='All'?' coll-filter-btn--active':''}`} onClick={() => setFilter('All')}>All</button>
        {COLLECTION_TYPES.map(t => (
          <button key={t} className={`coll-filter-btn${filter===t?' coll-filter-btn--active':''}`} onClick={() => setFilter(t as CollectionType)}>
            {TYPE_ICONS[t]} {t}
          </button>
        ))}
      </div>
      <div className="coll-sections">
        {COLLECTIONS.map(section => {
          const hasAny = activeTypes.some(type => section.items.some(i => i.type === type));
          if (!hasAny) return null;
          const isCollapsed = collapsed.has(section.name);
          const iconImg = SECTION_ICON_IMG[section.name];
          return (
            <div key={section.name} className="tracker-card coll-card"
              style={{'--dc': section.color, '--da': section.accent} as React.CSSProperties}>
              <button
                className={`tracker-card-header coll-section-header${isCollapsed?' coll-section-header--collapsed':''}`}
                onClick={() => toggleCollapse(section.name)}
                aria-expanded={!isCollapsed}>
                <span className="coll-section-arrow">{isCollapsed ? '▶' : '▼'}</span>
                {iconImg
                  ? <span className="coll-section-icon-wrap"><Image src={iconImg} alt={section.name} width={24} height={24} className="coll-section-icon" unoptimized /></span>
                  : <span className="dc-icon">{section.icon}</span>}
                <strong>{section.name}</strong>
              </button>
              {!isCollapsed && (
                <div className="coll-grid-wrap">
                  <div className="coll-grid-hdr">
                    {activeTypes.map(type => {
                      const items = section.items.filter(i => i.type === type);
                      if (items.length === 0) return null;
                      return (
                        <div key={type} className="coll-type-hdr-cell"
                          style={{'--th-bg': TYPE_COLORS[type], '--th-acc': TYPE_ACCENTS[type]} as React.CSSProperties}>
                          <span className="coll-type-hdr-icon">{TYPE_ICONS[type]}</span>
                          <span className="coll-type-hdr-name">{type}s</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="coll-grid-body">
                    {activeTypes.map(type => {
                      const items = section.items.filter(i => i.type === type);
                      if (items.length === 0) return null;
                      return (
                        <div key={type} className="coll-type-group"
                          style={{'--th-bg': TYPE_COLORS[type], '--th-acc': TYPE_ACCENTS[type]} as React.CSSProperties}>
                          {items.map((item, idx) => {
                            const key = `c:${section.name}:${item.name}:${item.type}:${idx}`;
                            const toonsDone = ([0,1,2,3] as ToonIndex[]).map(t => !!(progress[key]?.[t]));
                            const allDone = toonsDone.every(Boolean);
                            const [imgW, imgH] = IMG_DIMS[item.type] ?? [130, 72];
                            const howLines = item.how.split('\\n\\n');
                            return (
                              <div key={key} className={`coll-item-card${allDone?' coll-item-card--done':''}`} data-type={item.type}>
                                <div className="coll-item-name">{item.name}</div>
                                {item.img
                                  ? <div className="coll-item-img-wrap"><Image src={item.img} alt={item.name} width={imgW} height={imgH} className="coll-item-img" unoptimized /></div>
                                  : <div className="coll-item-img-placeholder" />}
                                <div className="coll-item-how">
                                  {howLines.map((line: string, li: number) => (
                                    <span key={li}>{line}</span>
                                  ))}
                                </div>
                                <div className="coll-item-checks">
                                  {([0,1,2,3] as ToonIndex[]).map(t => (
                                    <button key={t}
                                      className={`coll-chk${toonsDone[t]?' coll-chk--done':''}`}
                                      style={toonsDone[t]?{'--tc':TOON_COLORS[t]} as React.CSSProperties:{}}
                                      onClick={() => toggle(key, t)}
                                      aria-label={`${item.name} – ${toonNames[t]}`}
                                    >{toonsDone[t]?'✓':'—'}</button>
                                  ))}
                                  <button
                                    className={`coll-chk coll-chk--all${allDone?' coll-chk--done':''}`}
                                    style={allDone?{'--tc':'#ffffff'} as React.CSSProperties:{}}
                                    onClick={() => {
                                      if (allDone) {([0,1,2,3] as ToonIndex[]).forEach(t=>{if(progress[key]?.[t])toggle(key,t);});}
                                      else {([0,1,2,3] as ToonIndex[]).forEach(t=>{if(!progress[key]?.[t])toggle(key,t);});}
                                    }}
                                    title="Toggle all toons"
                                  >{allDone?'✓':'★'}</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
