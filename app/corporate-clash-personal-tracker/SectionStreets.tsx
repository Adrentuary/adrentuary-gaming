'use client';
import { useState } from 'react';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { STREETS } from './data-streets';
import { STREET_SHOPS } from './data-street-shops';
import type { StreetShopData } from './data-street-shops';
import { StreetShopModal } from './StreetShopModal';
import { PlaygroundInfoModal } from './PlaygroundInfoModal';

// Playgrounds that have an info popup available
const PG_HAS_INFO = new Set(['TTC', 'BB']);

// cog emblem images — order matches cogs[] array: SB, CB, LB, BB, BSB
const COG_EMBLEMS = [
  { src: '/icons/cog-emblems/SellbotEmblem.png',  alt: 'Sellbot'  },
  { src: '/icons/cog-emblems/CashbotEmblem.png',  alt: 'Cashbot'  },
  { src: '/icons/cog-emblems/LawbotEmblem.png',   alt: 'Lawbot'   },
  { src: '/icons/cog-emblems/BossbotEmblem.png',  alt: 'Bossbot'  },
  { src: '/icons/cog-emblems/BoardbotEmblem.png', alt: 'Boardbot' },
];

// pair the 8 districts into 4 side-by-side rows
const PAIRS = [
  [STREETS[0], STREETS[1]], // TTC + BB
  [STREETS[2], STREETS[3]], // YOTT + DG
  [STREETS[4], STREETS[5]], // MML + TB
  [STREETS[6], STREETS[7]], // AA + DDL
];

function DistrictCard({ district, onShopClick, onTitleClick }: {
  district: typeof STREETS[number];
  onShopClick: (data: StreetShopData) => void;
  onTitleClick: (pgKey: string) => void;
}) {
  // Compute the max value per cog column (index 0-4) across all streets
  const colMax = [0, 1, 2, 3, 4].map(ci =>
    Math.max(...district.streets.map(s => s.cogs[ci]))
  );

  return (
    <div
      className="tracker-card streets-card"
      style={{'--dc': district.color, '--da': district.accent} as React.CSSProperties}
    >
      <div className="tracker-card-header">
        <Image
          src={`/icons/playground-emblems/${district.pgKey}.png`}
          alt={district.name}
          width={28}
          height={28}
          className="pg-emblem"
        />
        <strong>{district.name}</strong>
        {PG_HAS_INFO.has(district.pgKey) && (
          <button
            className="pgm-title-btn pgm-title-btn--right"
            onClick={() => onTitleClick(district.pgKey)}
            title={`View ${district.name} info`}
          >
            <span className="pgm-title-btn-badge">Playground Info</span>
          </button>
        )}
      </div>
      <div className="tracker-table-wrap">
        <table className="tracker-table">
          <thead>
            <tr>
              <th className="col-street">Street</th>
              <th className="col-tunnel">Tunnel</th>
              <th className="col-sm">Lvls</th>
              <th className="col-sm">EXE</th>
              {COG_EMBLEMS.map(e => (
                <th key={e.alt} className="col-sm col-cog-pct">
                  <Image src={e.src} alt={e.alt} width={20} height={20} className="cog-emblem" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {district.streets.map(s => {
              const shopKey = `${district.pgKey}|${s.location}`;
              const shopData = STREET_SHOPS[shopKey] ?? null;
              return (
                <tr key={s.location}>
                  <td className="col-street">
                    {shopData ? (
                      <button className="ssm-street-btn" onClick={() => onShopClick(shopData)}>
                        {s.location}
                      </button>
                    ) : (
                      s.location
                    )}
                  </td>
                  <td className={`col-tunnel${s.isHQ ? ' st-hq-tunnel' : ''}`}>
                    {s.tunnel}
                  </td>
                  <td className="col-sm">{s.levels}</td>
                  <td className="col-sm">{s.exe}</td>
                  {s.cogs.map((c, i) => {
                    const isColMax = c === colMax[i] && c > 0;
                    const isHQPct  = s.isHQ && isColMax;
                    const cls = `col-sm col-cog-pct${isColMax ? ' st-max-pct' : ''}${isHQPct ? ' st-hq-pct' : ''}`;
                    return <td key={i} className={cls}>{c}%</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SectionStreets() {
  const [modalData, setModalData] = useState<StreetShopData | null>(null);
  const [pgInfoKey, setPgInfoKey] = useState<string | null>(null);

  return (
    <div className="tracker-section">
      <SectionNote
        description="Corporate Clash cog spread per street. HQ tunnels are highlighted. Highest % per column is marked. Click a street name to explore its shops, owners, and tasks. Click a neighborhood title to view playground info."
        status="Interactive sections are currently being developed for Ye Olde Toontowne, Daffodil Gardens, Mezzo Melodyland, The Brrrgh, Acorn Acres, and Drowsy Dreamland."
        lastUpdated="September 1st, 2026"
        lastChanges="Added full BB street shop data (83 shops across 4 streets) with all mainline & sidetask info. Added BB + TTC Playground Info modals with street manager stats, cog building tiers, invasion immunity, and neighborhood connections."
      />
      {PAIRS.map((pair, pi) => (
        <div key={pi} className="streets-pair">
          {pair.map(d => (
            <DistrictCard
              key={d.name}
              district={d}
              onShopClick={setModalData}
              onTitleClick={setPgInfoKey}
            />
          ))}
        </div>
      ))}
      {modalData && (
        <StreetShopModal
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}
      {pgInfoKey && (
        <PlaygroundInfoModal
          pgKey={pgInfoKey}
          onClose={() => setPgInfoKey(null)}
        />
      )}
    </div>
  );
}
