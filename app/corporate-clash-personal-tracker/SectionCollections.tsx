'use client';
import { useState } from 'react';
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
  'Misc': '📦',
};

const TYPE_COLORS: Record<string, string> = {
  'Background':   '#3a2800',
  'Nameplate':    '#2a1800',
  'Nametag':      '#001a30',
  'Profile Pose': '#002a14',
  'Cheesy Effect':'#2a1a00',
  'Misc':         '#1a1a1a',
};

const TYPE_ACCENTS: Record<string, string> = {
  'Background':   '#d4a010',
  'Nameplate':    '#e08030',
  'Nametag':      '#40a0e0',
  'Profile Pose': '#40c070',
  'Cheesy Effect':'#e0a030',
  'Misc':         '#888888',
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

      {/* Horizontal spreadsheet-style layout */}
      <div className="coll-grid-wrap">
        {/* Type column headers row */}
        <div className="coll-grid">
          {/* Zone label column header (empty) */}
          <div className="coll-zone-header-spacer" />
          {/* Type group headers */}
          {activeTypes.map(type => {
            const maxCount = Math.max(...COLLECTIONS.map(s => s.items.filter(i => i.type === type).length));
            if (maxCount === 0) return null;
            return (
              <div key={type} className="coll-type-header"
                style={{'--th-bg': TYPE_COLORS[type], '--th-acc': TYPE_ACCENTS[type]} as React.CSSProperties}>
                <span className="coll-type-header-icon">{TYPE_ICONS[type]}</span>
                <span className="coll-type-header-name">{type}s</span>
              </div>
            );
          })}
        </div>

        {/* Section rows */}
        {COLLECTIONS.map(section => {
          const hasAny = activeTypes.some(type => section.items.some(i => i.type === type));
          if (!hasAny) return null;

          return (
            <div key={section.name} className="coll-section-row"
              style={{'--sr-color': section.color, '--sr-acc': section.accent} as React.CSSProperties}>
              {/* Zone label */}
              <div className="coll-zone-label">
                <span className="coll-zone-icon">{section.icon}</span>
                <span className="coll-zone-name">{section.name}</span>
              </div>
              {/* Item groups per type */}
              {activeTypes.map(type => {
                const items = section.items.filter(i => i.type === type);
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
          );
        })}
      </div>
    </div>
  );
}
