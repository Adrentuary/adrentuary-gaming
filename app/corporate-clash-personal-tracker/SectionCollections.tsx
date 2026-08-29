'use client';
import { useState } from 'react';
import Image from 'next/image';
import { COLLECTIONS, COLLECTION_TYPES } from './data-collections';
import type { CollectionType } from './data-collections';
import { useTracker } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { TOON_COLORS } from './TrackerContext';

const TYPE_ICONS: Record<string, string> = {
  'Background': '🖼️',
  'Nameplate': '🏷️',
  'Nametag': '✍️',
  'Profile Pose': '🧍',
  'Cheesy Effect': '🧀',
};

const TYPE_COLORS: Record<string, string> = {
  'Background':   '#0A100A',
  'Nameplate':    '#0A100A',
  'Nametag':      '#0A100A',
  'Profile Pose': '#0A100A',
  'Cheesy Effect':'#0A100A',
};

const TYPE_ACCENTS: Record<string, string> = {
  'Background':   '#d4a010',
  'Nameplate':    '#e08030',
  'Nametag':      '#40a0e0',
  'Profile Pose': '#40c070',
  'Cheesy Effect':'#e0a030',
};

export function SectionCollections() {
  const { toonNames, progress, toggle } = useTracker();
  const [filter, setFilter] = useState<CollectionType | 'All'>('All');

  // Build active types based on filter
  const activeTypes = filter === 'All' ? COLLECTION_TYPES : [filter] as CollectionType[];

  return (
    <div className="tracker-section">
      {/* Filter bar */}
      <div className="coll-filter-bar">
        <button className={`coll-filter-btn${filter==='All'?' coll-filter-btn--active':''}`}
          onClick={() => setFilter('All')}>All</button>
        {COLLECTION_TYPES.map(t => (
          <button key={t}
            className={`coll-filter-btn${filter===t?' coll-filter-btn--active':''}`}
            onClick={() => setFilter(t as CollectionType)}>
            {TYPE_ICONS[t]} {t}
          </button>
        ))}
      </div>

      {/* One card per section, each with a horizontal type-grouped row inside */}
      <div className="coll-sections">
        {COLLECTIONS.map(section => {
          const hasAny = activeTypes.some(type => section.items.some(i => i.type === type));
          if (!hasAny) return null;

          return (
            <div key={section.name} className="tracker-card coll-card"
              style={{'--dc': section.color, '--da': section.accent} as React.CSSProperties}>
              {/* Section header — same pattern as Streets */}
              <div className="tracker-card-header">
                <span className="dc-icon">{section.icon}</span>
                <strong>{section.name}</strong>
              </div>

              {/* Horizontal scrollable type grid */}
              <div className="coll-grid-wrap">
                {/* Type column headers */}
                <div className="coll-grid-hdr">
                  {activeTypes.map(type => {
                    const items = section.items.filter(i => i.type === type);
                    if (items.length === 0 && filter !== 'All') return null;
                    return (
                      <div key={type} className="coll-type-hdr-cell"
                        style={{'--th-bg': TYPE_COLORS[type], '--th-acc': TYPE_ACCENTS[type]} as React.CSSProperties}>
                        <span className="coll-type-hdr-icon">{TYPE_ICONS[type]}</span>
                        <span className="coll-type-hdr-name">{type}s</span>
                      </div>
                    );
                  })}
                </div>

                {/* Items row */}
                <div className="coll-grid-body">
                  {activeTypes.map(type => {
                    const items = section.items.filter(i => i.type === type);
                    if (items.length === 0 && filter !== 'All') return null;
                    return (
                      <div key={type} className="coll-type-group"
                        style={{'--th-bg': TYPE_COLORS[type], '--th-acc': TYPE_ACCENTS[type]} as React.CSSProperties}>
                        {items.length === 0 ? (
                          <div className="coll-item-empty">—</div>
                        ) : (
                          items.map((item, idx) => {
                            const key = `c:${section.name}:${item.name}:${item.type}:${idx}`;
                            const toonsDone = ([0,1,2,3] as ToonIndex[]).map(t => !!(progress[key]?.[t]));
                            const allDone = toonsDone.every(Boolean);
                            return (
                              <div key={key} className={`coll-item-card${allDone?' coll-item-card--done':''}`}>
                                <div className="coll-item-name">{item.name}</div>
                                {item.img
                                  ? <div className="coll-item-img-wrap"><Image src={item.img} alt={item.name} width={130} height={72} className="coll-item-img" unoptimized /></div>
                                  : <div className="coll-item-img-placeholder" />
                                }
                                <div className="coll-item-how">{item.how}</div>
                                <div className="coll-item-checks">
                                  {([0,1,2,3] as ToonIndex[]).map(t => (
                                    <button key={t}
                                      className={`coll-chk${toonsDone[t]?' coll-chk--done':''}`}
                                      style={toonsDone[t]?{'--tc':TOON_COLORS[t]} as React.CSSProperties:{}}
                                      onClick={() => toggle(key, t)}
                                      aria-label={`${item.name} – ${toonNames[t]}`}
                                    >{toonsDone[t]?'✓':'—'}</button>
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
