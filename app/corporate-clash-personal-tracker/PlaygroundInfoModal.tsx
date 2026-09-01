'use client';
import { useEffect, useCallback } from 'react';
import Image from 'next/image';

interface StreetBuildingInfo {
  name: string;
  minStory: string;
  maxStory: string;
}

interface PlaygroundData {
  name: string;
  pgKey: string;
  emblem: string;
  color: string;
  streetManager: string;
  streetManagerImg: string;
  streetManagerTitle: string;
  streetManagerDept: string;
  streetManagerStats: string;
  facts: string[];
  streets: StreetBuildingInfo[];
  maxBuildingsPerStreet: number;
}

const PG_DATA: Record<string, PlaygroundData> = {
  TTC: {
    name: 'Toontown Central',
    pgKey: 'TTC',
    emblem: '/icons/playground-emblems/TTC.png',
    color: '#d86b10',
    streetManager: 'Duck Shuffler',
    streetManagerImg: '/icons/streets/Toontown-Central/DuckShuffler.png',
    streetManagerTitle: 'Toontown Central Street Manager',
    streetManagerDept: 'Cashbot',
    streetManagerStats: 'Level 5 · 200 HP',
    facts: [
      "Toontown Central's Street Manager is the Duck Shuffler — a Cashbot Regional Manager.",
      'Toontown Central streets are fully immune to Cog Invasions.',
      '1–3 Story Cog Buildings can be found on a street.',
      'On Silly Street, only 1–2 Story Cog Buildings can be found (Cog levels 1–3 only).',
      'A maximum of 3 Cog Buildings are allowed on a street at any given time.',
      'TTC streets are commonly used when training low-level Gags.',
      'TTC connects to Barnacle Boatyard (Punchline Place), Ye Olde Toontowne (Silly Street), Daffodil Gardens (Wacky Way), and Mezzo Melodyland (Loopy Lane).',
    ],
    streets: [
      { name: 'Silly Street',    minStory: '1 Story', maxStory: '2 Story (Tier 2)' },
      { name: 'Punchline Place', minStory: '1 Story', maxStory: '3 Story (Tier 1)' },
      { name: 'Loopy Lane',      minStory: '1 Story', maxStory: '3 Story (Tier 1)' },
      { name: 'Wacky Way',       minStory: '1 Story', maxStory: '3 Story (Tier 1)' },
    ],
    maxBuildingsPerStreet: 3,
  },
  BB: {
    name: 'Barnacle Boatyard',
    pgKey: 'BB',
    emblem: '/icons/playground-emblems/BB.png',
    color: '#dc4a14',
    streetManager: 'Deep Diver',
    streetManagerImg: '/icons/streets/Barnacle-Boatyard/DeepDiver.png',
    streetManagerTitle: 'Barnacle Boatyard Street Manager',
    streetManagerDept: 'Boardbot',
    streetManagerStats: 'Level 7 · 400 HP',
    facts: [
      "Barnacle Boatyard's Street Manager is the Deep Diver — a Boardbot Regional Manager.",
      '2–3 Story Cog Buildings can be found on a street.',
      'A maximum of 5 Cog Buildings are allowed on a street at any given time.',
      'Cog Invasions of Cogs ranging from Tiers 1–3 will affect Barnacle Boatyard.',
      'Anchor Avenue is the only BB street with a Toon HQ (required for the BB taskline).',
      'BB connects to Toontown Central (Punchline Place), The Brrrgh (Walrus Way), and Acorn Acres (Peanut Place).',
    ],
    streets: [
      { name: 'Anchor Avenue',      minStory: '2 Story', maxStory: '3 Story (Tier 2)' },
      { name: 'Buccaneer Boulevard', minStory: '2 Story', maxStory: '3 Story (Tier 2)' },
      { name: 'Lighthouse Lane',    minStory: '2 Story', maxStory: '3 Story (Tier 2)' },
      { name: 'Seaweed Street',     minStory: '2 Story', maxStory: '3 Story (Tier 2)' },
    ],
    maxBuildingsPerStreet: 5,
  },
};

const HIGHLIGHTS = [
  // Manager names
  'Street Manager', 'Duck Shuffler', 'Deep Diver',
  // Manager departments
  'Cashbot Regional Manager', 'Boardbot Regional Manager',
  // Building info
  'Cog Buildings', 'Cog Invasions',
  '1–3 Story', '1–2 Story', '2–3 Story', '2-3 Story', 'Tiers 1-3', 'Tiers 1–3',
  // Immunity
  'fully immune',
  // TTC connections
  'Barnacle Boatyard', 'Ye Olde Toontowne', 'Daffodil Gardens', 'Mezzo Melodyland',
  // TTC misc
  'low-level Gags',
  // BB misc
  'Toon HQ', 'The Brrrgh', 'Acorn Acres',
];

function HighlightedText({ text }: { text: string }) {
  const pattern = new RegExp(
    `(${HIGHLIGHTS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g'
  );
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        HIGHLIGHTS.includes(part)
          ? <span key={i} className="pgm-highlight">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

interface Props {
  pgKey: string;
  onClose: () => void;
}

export function PlaygroundInfoModal({ pgKey, onClose }: Props) {
  const data = PG_DATA[pgKey];

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!data) return null;

  return (
    <div className="pgm-backdrop" onClick={onClose}>
      <div className="pgm-box" style={{ '--pgm-accent': data.color } as React.CSSProperties} onClick={e => e.stopPropagation()}>

        <div className="pgm-header">
          <Image src={data.emblem} alt={data.name} width={40} height={40} className="pgm-emblem" unoptimized />
          <div className="pgm-header-text">
            <h2 className="pgm-title">{data.name}</h2>
            <span className="pgm-subtitle">Playground Info</span>
          </div>
          <button className="pgm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="pgm-body">

          <div className="pgm-left">
            <ul className="pgm-facts">
              {data.facts.map((f, i) => (
                <li key={i} className="pgm-fact">
                  <HighlightedText text={f} />
                </li>
              ))}
            </ul>

            <div className="pgm-table-wrap">
              <table className="pgm-table">
                <thead>
                  <tr>
                    <th>Neighborhood</th>
                    <th>Street</th>
                    <th>Min Story</th>
                    <th>Max Story</th>
                    <th>Max Bldgs*</th>
                  </tr>
                </thead>
                <tbody>
                  {data.streets.map((s, i) => (
                    <tr key={s.name}>
                      {i === 0 && (
                        <td className="pgm-td-pg" rowSpan={data.streets.length}>
                          {data.name}
                        </td>
                      )}
                      <td className="pgm-td-street">{s.name}</td>
                      <td className="pgm-td-center">{s.minStory}</td>
                      <td className="pgm-td-center">{s.maxStory}</td>
                      {i === 0 && (
                        <td className="pgm-td-center pgm-td-max" rowSpan={data.streets.length}>
                          {data.maxBuildingsPerStreet}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pgm-table-note">* Maximum Cog Buildings allowed on a street at any given time</p>
            </div>
          </div>

          <div className="pgm-right">
            <p className="pgm-manager-label">Street Manager</p>
            <div className="pgm-manager-card" style={{ '--pgm-accent': data.color } as React.CSSProperties}>
              <div className="pgm-manager-img-wrap">
                <Image
                  src={data.streetManagerImg}
                  alt={data.streetManager}
                  fill
                  className="pgm-manager-img"
                  unoptimized
                />
              </div>
              <div className="pgm-manager-info">
                <span className="pgm-manager-name">{data.streetManager}</span>
                <span className="pgm-manager-title">{data.streetManagerTitle}</span>
                <span className="pgm-manager-dept">{data.streetManagerDept}</span>
                <span className="pgm-manager-stats">{data.streetManagerStats}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
