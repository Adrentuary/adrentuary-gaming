$dest = 'C:\Users\skyle\OneDrive\Desktop\Website\app\corporate-clash-personal-tracker\PromoInfoModal.tsx'

$part1 = @'
'use client';
import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';

interface Props {
  suitName: string;
  accent: string;
  onClose: () => void;
}

/* Highlight helper - longest phrases first for correct regex matching */
const SB_HIGHLIGHTS = [
  'Cold Caller Cog Disguise',
  'Senior Vice President',
  'Department Experience',
  'Sellbot Cog Buildings',
  'Sellbot Factories',
  'Sellbot Towers',
  'Department Levels',
  'Factory Foreman',
  'Sellbot HQ',
  'Mover and Shaker',
  'Mover & Shaker',
  'Merit Monday',
  'Cog Invasions',
  'Mr. Hollywood',
  'Boss Rewards',
  'Laff Points',
  'Laff Point',
  'Teleport access',
  'Cold Caller',
  'Boosters',
  'Sellbots',
  'Sellbot',
  'Invoices',
  'Invoice',
  'Factory',
  'Merits',
  'Merit',
  'V.P.',
  'IOU',
];

function SBHighlight({ text }: { text: string }) {
  const escaped = SB_HIGHLIGHTS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return (
    <>
      {parts.map((part, i) =>
        SB_HIGHLIGHTS.includes(part)
          ? <span key={i} className="pim-hl">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

/* Cog data */
const SB_REGULAR = [
  { name:'Cold Caller',    tier:'Tier 1 Employee', levels:'1-5',  dmg:'1-10',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Coldcaller_CG.gif' },
  { name:'Telemarketer',   tier:'Tier 2 Employee', levels:'2-6',  dmg:'1-12',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Telemarketer_CG.gif' },
  { name:'Name Dropper',   tier:'Tier 3 Employee', levels:'3-7',  dmg:'2-14',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Namedropper_CG.gif' },
  { name:'Glad Hander',    tier:'Tier 4 Employee', levels:'4-8',  dmg:'1-20',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Gladhander_CG.gif' },
  { name:'Mover & Shaker', tier:'Tier 5 Employee', levels:'5-10', dmg:'5-23',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mover&shaker_CG.gif' },
  { name:'Two-Face',       tier:'Tier 6 Employee', levels:'6-12', dmg:'5-22',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Twoface_CG.gif' },
  { name:'Mingler',        tier:'Tier 7 Employee', levels:'7-15', dmg:'7-32',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mingler_CG.gif' },
  { name:'Mr. Hollywood',  tier:'Tier 8 Employee', levels:'8-50', dmg:'8-60',  img:'/icons/promotions/Sellbot/corporate-ladder/regular/300px-Mrbollywood_CG.gif' },
];
const SB_SPECIAL = [
  { name:'Factory Foreman',                 tier:'Manager',          level:'11 (mgr)', dmg:'16-28',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-FactFore.gif' },
  { name:'Public Relations Representative', tier:'Manager',          level:'10 (mgr)', dmg:'13-24',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-PRR_CG.gif' },
  { name:'Director of Public Affairs',      tier:'Manager',          level:'30 (mgr)', dmg:'26-40',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-DOPA_CG.gif' },
  { name:'Bellringer',                      tier:'Regional Manager', level:'13 (mgr)', dmg:'10-15',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Bellringer_CG.gif' },
  { name:'Prethinker',                      tier:'Regional Manager', level:'12 (mgr)', dmg:'10-19',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Prethinker_CG.gif' },
  { name:'Multislacker',                    tier:'Regional Manager', level:'24 (mgr)', dmg:'18-25',  img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-Multislacker_CG.gif' },
  { name:'Senior Vice President',           tier:'Boss',             level:'VP',       dmg:'Varies', img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-SeniorVicePresident_CG.gif' },
  { name:'Robber Baron',                    tier:'Boss',             level:'???',      dmg:'???',    img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-RobberBaron_CG.gif' },
];
const SB_REMOVED = [
  { name:'Director of Public Relations', tier:'Manager', level:'Removed', dmg:'N/A', img:'/icons/promotions/Sellbot/corporate-ladder/removed/300px-DOPRGal.gif' },
];

/* XP table */
const SB_XP_ROWS = [
  { source:'Any Sellbot',           base:'1x Cog level',    boost:'Merit Monday, Invasions, Boosters' },
  { source:'Sellbot Factories',     base:'Varies by area',  boost:'Merit Monday, Invasions, Boosters' },
  { source:'Sellbot Cog Buildings', base:'Varies by floors', boost:'Merit Monday, Boosters only' },
  { source:'Sellbot Towers (V.P.)', base:'No Dept XP',      boost:'N/A' },
];
'@

[System.IO.File]::WriteAllText($dest, $part1, [System.Text.Encoding]::UTF8)
Write-Host "Part 1 written: $((Get-Item $dest).Length) bytes"
