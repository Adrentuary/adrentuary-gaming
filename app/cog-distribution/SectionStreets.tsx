'use client';
import Image from 'next/image';
import { STREETS } from './data-streets';

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

function DistrictCard({ district }: { district: typeof STREETS[number] }) {
  // Compute the max value per cog column (index 0–4) across all streets
  const colMax = [0, 1, 2, 3, 4].map(ci =>
    Math.max(...district.streets.map(s => s.cogs[ci]))
  );

  return (
    <div
      className="tracker-card streets-card"
      style={{'--dc': district.color, '--da': district.accent} as React.CSSProperties}
    >
      {/* header */}
      <div className="tracker-card-header">
        <Image
          src={`/icons/playground-emblems/${district.pgKey}.png`}
          alt={district.name}
          width={28}
          height={28}
          className="pg-emblem"
        />
        <strong>{district.name}</strong>
      </div>

      {/* table */}
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
            {district.streets.map(s => (
              <tr key={s.location}>
                <td className="col-street">{s.location}</td>
                <td className={`col-tunnel${s.isHQ ? ' st-hq-tunnel' : ''}`}>
                  {s.tunnel}
                </td>
                <td className="col-sm">{s.levels}</td>
                <td className="col-sm">{s.exe}</td>
                {s.cogs.map((c, i) => {
                  const isColMax = c === colMax[i] && c > 0;
                  const isHQPct  = s.isHQ && isColMax;
                  const cls = `col-sm col-cog-pct${isColMax ? ' st-max-pct' : ''}${isHQPct ? ' st-hq-pct' : ''}`;
                  return (
                    <td key={i} className={cls}>
                      {c}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SectionStreets() {
  return (
    <div className="tracker-section">
      <p className="tracker-section-desc">Cog distribution per street. HQ tunnels are highlighted. Highest % per row is marked.</p>
      {PAIRS.map((pair, pi) => (
        <div key={pi} className="streets-pair">
          {pair.map(d => <DistrictCard key={d.name} district={d} />)}
        </div>
      ))}
    </div>
  );
}
