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

export function SectionCollections() {
  const { toonNames, progress, toggle, isAllDone, toggleAll } = useTracker();
  const [filter, setFilter] = useState<CollectionType | 'All'>('All');

  const toonColor = (t: ToonIndex) =>
    ({ '--tc': TOON_COLORS[t] } as React.CSSProperties);

  return (
    <div className="tracker-section">
      {/* Filter bar */}
      <div className="coll-filter-bar">
        <button
          className={`coll-filter-btn${filter === 'All' ? ' coll-filter-btn--active' : ''}`}
          onClick={() => setFilter('All')}
        >All</button>
        {COLLECTION_TYPES.map(t => (
          <button
            key={t}
            className={`coll-filter-btn${filter === t ? ' coll-filter-btn--active' : ''}`}
            onClick={() => setFilter(t as CollectionType)}
          >
            {TYPE_ICONS[t]} {t}
          </button>
        ))}
      </div>

      {COLLECTIONS.map(section => {
        const visibleItems = filter === 'All'
          ? section.items
          : section.items.filter(item => item.type === filter);
        if (visibleItems.length === 0) return null;

        return (
          <div
            key={section.name}
            className="tracker-card coll-card"
            style={{'--dc': section.color, '--da': section.accent} as React.CSSProperties}
          >
            <div className="tracker-card-header">
              <span className="dc-icon">{section.icon}</span>
              <strong>{section.name}</strong>
              <span className="coll-count">{visibleItems.length} item{visibleItems.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="tracker-table-wrap">
              <table className="tracker-table">
                <thead>
                  <tr>
                    <th className="col-main">Item</th>
                    <th className="col-sm coll-type-col">Type</th>
                    <th className="col-reward">How to Obtain</th>
                    {toonNames.map((n, i) => (
                      <th key={i} className="col-toon" style={{color: TOON_COLORS[i]}}>{n}</th>
                    ))}
                    <th className="col-all">All</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item, idx) => {
                    const key = `c:${section.name}:${item.name}:${item.type}:${idx}`;
                    const allDone = isAllDone(key);
                    return (
                      <tr key={key} className={allDone ? 'row-coll-done' : ''}>
                        <td className="col-main">{item.name}</td>
                        <td className="col-sm coll-type-col">
                          <span className="coll-type-badge">{TYPE_ICONS[item.type]} {item.type}</span>
                        </td>
                        <td className="col-reward">{item.how}</td>
                        {([0,1,2,3] as ToonIndex[]).map(t => (
                          <td key={t} className="col-toon">
                            <button
                              className={`check-btn${progress[key]?.[t] ? ' check-btn--done' : ''}`}
                              style={progress[key]?.[t] ? toonColor(t) : {}}
                              onClick={() => toggle(key, t)}
                              aria-label={`${item.name} – ${toonNames[t]}`}
                            >✓</button>
                          </td>
                        ))}
                        <td className="col-all">
                          <button
                            className={`all-btn${allDone ? ' all-btn--done' : ''}`}
                            onClick={() => toggleAll(key)}
                            title={allDone ? 'Unmark all' : 'Mark all toons'}
                          >{allDone ? '★' : '☆'}</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
