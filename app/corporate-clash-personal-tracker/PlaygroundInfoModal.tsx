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
  streetManagerRole: string;
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
    streetManagerRole: 'Toontown Central Street Manager',
    facts: [
      "Toontown Central's Street Manager is the Duck Shuffler.",
      '1–3 Story Cog Buildings can be found on a street.',
      'On Silly Street, only 1–2 Story Cog Buildings can be found.',
      'A maximum of 3 Cog Buildings are allowed on a street at any given time.',
      'The streets of Toontown Central are immune to Cog Invasions.',
    ],
    streets: [
      { name: 'Silly Street',    minStory: '1 Story', maxStory: '2 Story (Tier 2)' },
      { name: 'Punchline Place', minStory: '1 Story', maxStory: '3 Story (Tier 1)' },
      { name: 'Loopy Lane',      minStory: '1 Story', maxStory: '3 Story (Tier 1)' },
      { name: 'Wacky Way',       minStory: '1 Story', maxStory: '3 Story (Tier 1)' },
    ],
    maxBuildingsPerStreet: 3,
  },
};

const HIGHLIGHTS = [
  'Street Manager', 'Duck Shuffler',
  'Cog Buildings', 'Cog Invasions',
  '1–3 Story', '1–2 Story',
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
      <div className="pgm-box" onClick={e => e.stopPropagation()}>

        <div className="pgm-header" style={{ '--pgm-accent': data.color } as React.CSSProperties}>
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
                <span className="pgm-manager-role">{data.streetManagerRole}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
