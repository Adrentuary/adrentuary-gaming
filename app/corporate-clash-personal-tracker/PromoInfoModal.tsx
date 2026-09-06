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
  { name:'Senior Vice President',           tier:'Boss',             level:'VP',       dmg:'Varies', img:'/icons/promotions/Sellbot/corporate-ladder/special/300px-VPGif.gif' },
];
const SB_REMOVED = [
  { name:'Director of Public Relations', tier:'Manager', level:'Removed', dmg:'N/A', img:'/icons/promotions/Sellbot/corporate-ladder/removed/300px-DOPRGal.gif' },
];

/* Detailed cog data: attacks, locations, invasions */
interface AttackRow { name: string; target: 'Single Toon'|'All Toons'|'Single Target'; levels: number[]; dmg: (number|'Limit')[]; acc: number[]; freq: number | number[]; }
interface StreetLoc  { name: string; color: string; accent: string; spawn: string; avg: string; }
interface BuildLoc   { label: string; spawn: string; avg: string; boss: string; bold?: boolean; }
interface CogDetail  { cogName: string; attacks: AttackRow[]; streets?: StreetLoc[]; hqLocs?: { label: string; spawn: string; avg: string }[]; buildings?: BuildLoc[]; invasions: string[]; }

const SB_COG_DETAILS: CogDetail[] = [
  {
    cogName: 'Cold Caller',
    attacks: [
      { name:'Freeze Assets', target:'Single Toon', levels:[1,2,3,4,5], dmg:[3,4,6,8,10],  acc:[50,50,50,50,50], freq:[5,10,15,20,25] },
      { name:'Pound Key',     target:'Single Toon', levels:[1,2,3,4,5], dmg:[2,2,3,4,5],   acc:[75,80,85,90,95], freq:25 },
      { name:'Mumbo Jumbo',   target:'Single Toon', levels:[1,2,3,4,5], dmg:[2,3,4,6,8],   acc:[50,55,60,65,70], freq:25 },
      { name:'Hot Air',       target:'Single Toon', levels:[1,2,3,4,5], dmg:[1,1,1,1,1],   acc:[90,90,90,90,90], freq:[45,40,35,30,25] },
    ],
    streets: [
      { name:'Punchline Place', color:'#5a2800', accent:'#e06020', spawn:'16%',   avg:'~4'   },
      { name:'Anchor Avenue',   color:'#5a1a05', accent:'#dc4a14', spawn:'15.7%', avg:'~4'   },
      { name:'Knight Knoll',    color:'#33205e', accent:'#9b70cc', spawn:'7.9%',  avg:'~2'   },
      { name:'Tulip Terrace',   color:'#314600', accent:'#9bd31a', spawn:'8.9%',  avg:'~2'   },
      { name:'Alto Avenue',     color:'#482052', accent:'#bf62cb', spawn:'3.5%',  avg:'~1'   },
    ],
    hqLocs: [
      { label:'SBHQ Courtyard',   spawn:'7.8%', avg:'~1' },
      { label:'Factory Exterior', spawn:'5%',   avg:'~1' },
    ],
    buildings: [
      { label:'1 Story',           spawn:'66.7%', avg:'~5-6', boss:'33.3%', bold:true },
      { label:'2 Story (Tier I)',  spawn:'40%',   avg:'~4',   boss:'25%' },
      { label:'2 Story (Tier II)', spawn:'28.6%', avg:'~3',   boss:'20%' },
      { label:'3 Story (Tier I)',  spawn:'14.3%', avg:'~2',   boss:'0%'  },
      { label:'3 Story (Tier II)', spawn:'6.7%',  avg:'~1',   boss:'0%'  },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens'],
  },
  {
    cogName: 'Telemarketer',
    attacks: [
      { name:'Clip On Tie',  target:'Single Toon', levels:[2,3,4,5,6], dmg:[2,2,3,3,4],   acc:[75,75,75,75,75], freq:15 },
      { name:'Rolodex',      target:'Single Toon', levels:[2,3,4,5,6], dmg:[4,6,7,9,12],  acc:[50,50,50,50,50], freq:20 },
      { name:'Finger Wag',   target:'Single Toon', levels:[2,3,4,5,6], dmg:[4,5,7,9,10],  acc:[60,65,70,75,80], freq:15 },
      { name:'Pound Key',    target:'Single Toon', levels:[2,3,4,5,6], dmg:[3,4,5,6,7],   acc:[55,65,70,75,80], freq:20 },
      { name:'Mumbo Jumbo',  target:'Single Toon', levels:[2,3,4,5,6], dmg:[4,6,7,9,12],  acc:[75,80,85,90,95], freq:15 },
      { name:'Pick Pocket',  target:'Single Toon', levels:[2,3,4,5,6], dmg:[1,1,1,1,1],   acc:[75,75,75,75,75], freq:15 },
    ],
    streets: [
      { name:'Punchline Place', color:'#5a2800', accent:'#e06020', spawn:'12%',   avg:'~3'   },
      { name:'Anchor Avenue',   color:'#5a1a05', accent:'#dc4a14', spawn:'15.7%', avg:'~4'   },
      { name:'Knight Knoll',    color:'#33205e', accent:'#9b70cc', spawn:'10.6%', avg:'~3'   },
      { name:'Tulip Terrace',   color:'#314600', accent:'#9bd31a', spawn:'13.3%', avg:'~3'   },
      { name:'Alto Avenue',     color:'#482052', accent:'#bf62cb', spawn:'7.2%',  avg:'~1-2' },
      { name:'Sleet Street',    color:'#003a46', accent:'#29b2dc', spawn:'4.3%',  avg:'~1'   },
    ],
    hqLocs: [
      { label:'SBHQ Courtyard',   spawn:'11.7%', avg:'~1' },
      { label:'Factory Exterior', spawn:'10%',   avg:'~2' },
    ],
    buildings: [
      { label:'1 Story',           spawn:'33.3%', avg:'~3',   boss:'33.3%', bold:true },
      { label:'2 Story (Tier I)',  spawn:'40%',   avg:'~4',   boss:'25%' },
      { label:'2 Story (Tier II)', spawn:'28.6%', avg:'~3',   boss:'20%' },
      { label:'3 Story (Tier I)',  spawn:'21.4%', avg:'~3',   boss:'0%'  },
      { label:'3 Story (Tier II)', spawn:'13.3%', avg:'~1-2', boss:'0%'  },
      { label:'4 Story (Tier I)',  spawn:'6.7%',  avg:'~1',   boss:'0%'  },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens','Mezzo Melodyland'],
  },
  {
    cogName: 'Name Dropper',
    attacks: [
      { name:'Razzle Dazzle', target:'Single Toon', levels:[3,4,5,6,7], dmg:[4,5,6,9,12],  acc:[75,80,85,90,95], freq:30 },
      { name:'Rolodex',       target:'Single Toon', levels:[3,4,5,6,7], dmg:[5,6,7,10,14], acc:[95,95,95,95,95], freq:40 },
      { name:'Synergy',       target:'All Toons',   levels:[3,4,5,6,7], dmg:[3,4,6,9,12],  acc:[50,50,50,50,50], freq:15 },
      { name:'Pick Pocket',   target:'Single Toon', levels:[3,4,5,6,7], dmg:[2,2,2,2,2],   acc:[95,95,95,95,95], freq:15 },
    ],
    streets: [
      { name:'Punchline Place', color:'#5a2800', accent:'#e06020', spawn:'8%',    avg:'~2'   },
      { name:'Anchor Avenue',   color:'#5a1a05', accent:'#dc4a14', spawn:'11.8%', avg:'~3'   },
      { name:'Knight Knoll',    color:'#33205e', accent:'#9b70cc', spawn:'10.6%', avg:'~3'   },
      { name:'Tulip Terrace',   color:'#314600', accent:'#9bd31a', spawn:'17.8%', avg:'~4-5' },
      { name:'Alto Avenue',     color:'#482052', accent:'#bf62cb', spawn:'10.7%', avg:'~2-3' },
      { name:'Sleet Street',    color:'#003a46', accent:'#29b2dc', spawn:'8.6%',  avg:'~2-3' },
      { name:'Peanut Place',    color:'#00451e', accent:'#20cf69', spawn:'2.7%',  avg:'~1'   },
    ],
    hqLocs: [
      { label:'SBHQ Courtyard',   spawn:'15.7%', avg:'~1-2' },
      { label:'Factory Exterior', spawn:'15%',   avg:'~3'   },
    ],
    buildings: [
      { label:'1 Story',           spawn:'0%',    avg:'~0-1', boss:'33.3%' },
      { label:'2 Story (Tier I)',  spawn:'20%',   avg:'~2',   boss:'25%'  },
      { label:'2 Story (Tier II)', spawn:'28.6%', avg:'~3',   boss:'20%'  },
      { label:'3 Story (Tier I)',  spawn:'21.4%', avg:'~3',   boss:'20%'  },
      { label:'3 Story (Tier II)', spawn:'20%',   avg:'~2-3', boss:'0%'   },
      { label:'4 Story (Tier I)',  spawn:'13.3%', avg:'~2',   boss:'0%'   },
      { label:'4 Story (Tier II)', spawn:'7.1%',  avg:'~1',   boss:'0%'   },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens','Mezzo Melodyland','The Brrrgh'],
  },
  {
    cogName: 'Glad Hander',
    attacks: [
      { name:'Rubber Stamp',  target:'Single Toon', levels:[4,5,6,7,8], dmg:[4,3,2,1,1],   acc:[90,70,50,30,10], freq:[40,30,20,10,5]  },
      { name:'Fountain Pen',  target:'Single Toon', levels:[4,5,6,7,8], dmg:[3,3,2,1,1],   acc:[70,60,50,40,30], freq:[40,30,20,10,5]  },
      { name:'Filibuster',    target:'Single Toon', levels:[4,5,6,7,8], dmg:[4,6,9,12,15], acc:[30,40,50,60,70], freq:[10,20,30,40,45] },
      { name:'Schmooze',      target:'Single Toon', levels:[4,5,6,7,8], dmg:[5,7,11,15,20],acc:[55,65,75,85,95], freq:[10,20,30,40,45] },
    ],
    streets: [
      { name:'Punchline Place', color:'#5a2800', accent:'#e06020', spawn:'4%',    avg:'~1'   },
      { name:'Anchor Avenue',   color:'#5a1a05', accent:'#dc4a14', spawn:'7.9%',  avg:'~2'   },
      { name:'Knight Knoll',    color:'#33205e', accent:'#9b70cc', spawn:'7.9%',  avg:'~2'   },
      { name:'Tulip Terrace',   color:'#314600', accent:'#9bd31a', spawn:'17.8%', avg:'~4-5' },
      { name:'Alto Avenue',     color:'#482052', accent:'#bf62cb', spawn:'10.7%', avg:'~2-3' },
      { name:'Sleet Street',    color:'#003a46', accent:'#29b2dc', spawn:'12.8%', avg:'~4'   },
      { name:'Peanut Place',    color:'#00451e', accent:'#20cf69', spawn:'5.5%',  avg:'~2'   },
      { name:'Lullaby Lane',    color:'#1a1060', accent:'#7b68ee', spawn:'5.7%',  avg:'~2'   },
    ],
    hqLocs: [
      { label:'SBHQ Courtyard',   spawn:'19.5%', avg:'~2' },
      { label:'Factory Exterior', spawn:'20%',   avg:'~4' },
    ],
    buildings: [
      { label:'2 Story (Tier I)',  spawn:'0%',    avg:'~0-1', boss:'25%'  },
      { label:'2 Story (Tier II)', spawn:'14.3%', avg:'~1-2', boss:'20%'  },
      { label:'3 Story (Tier I)',  spawn:'21.4%', avg:'~3',   boss:'20%'  },
      { label:'3 Story (Tier II)', spawn:'20%',   avg:'~2-3', boss:'20%'  },
      { label:'4 Story (Tier I)',  spawn:'20%',   avg:'~3-4', boss:'0%'   },
      { label:'4 Story (Tier II)', spawn:'14.3%', avg:'~2',   boss:'0%'   },
      { label:'5 Story (Tier I)',  spawn:'5.3%',  avg:'~1',   boss:'0%'   },
    ],
    invasions: ['Ye Olde Toontowne','Daffodil Gardens','Mezzo Melodyland','The Brrrgh','Acorn Acres'],
  },
  {
    cogName: 'Mover & Shaker',
    attacks: [
      { name:'Brain Storm',   target:'Single Toon', levels:[5,6,7,8,9,10], dmg:[5,6,8,10,12,14],   acc:[60,75,80,85,90,95], freq:15 },
      { name:'Half Windsor',  target:'Single Toon', levels:[5,6,7,8,9,10], dmg:[6,9,11,13,16,19],  acc:[50,65,70,75,80,85], freq:20 },
      { name:'Quake',         target:'All Toons',   levels:[5,6,7,8,9,10], dmg:[9,11,14,17,20,23], acc:[60,65,75,80,85,90], freq:20 },
      { name:'Shake',         target:'All Toons',   levels:[5,6,7,8,9,10], dmg:[6,8,10,12,14,16],  acc:[70,75,80,85,90,95], freq:25 },
      { name:'Tremor',        target:'All Toons',   levels:[5,6,7,8,9,10], dmg:[5,6,7,8,9,10],     acc:[50,50,50,50,50,50], freq:20 },
    ],
    streets: [
      { name:'Anchor Avenue',   color:'#5a1a05', accent:'#dc4a14', spawn:'3.9%',  avg:'~1'   },
      { name:'Knight Knoll',    color:'#33205e', accent:'#9b70cc', spawn:'5.3%',  avg:'~1-2' },
      { name:'Tulip Terrace',   color:'#314600', accent:'#9bd31a', spawn:'13.3%', avg:'~3'   },
      { name:'Alto Avenue',     color:'#482052', accent:'#bf62cb', spawn:'10.7%', avg:'~2-3' },
      { name:'Sleet Street',    color:'#003a46', accent:'#29b2dc', spawn:'17.2%', avg:'~5-6' },
      { name:'Peanut Place',    color:'#00451e', accent:'#20cf69', spawn:'10.9%', avg:'~3-4' },
      { name:'Lullaby Lane',    color:'#1a1060', accent:'#7b68ee', spawn:'17.2%', avg:'~5-6' },
    ],
    hqLocs: [
      { label:'SBHQ Courtyard',   spawn:'15.7%', avg:'~1-2' },
      { label:'Factory Exterior', spawn:'20%',   avg:'~4'   },
    ],
    buildings: [
      { label:'2 Story (Tier II)', spawn:'0%',    avg:'~0-1', boss:'20%' },
      { label:'3 Story (Tier I)',  spawn:'14.3%', avg:'~2',   boss:'20%' },
      { label:'3 Story (Tier II)', spawn:'20%',   avg:'~2-3', boss:'20%' },
      { label:'4 Story (Tier I)',  spawn:'20%',   avg:'~3-4', boss:'25%', bold:true },
      { label:'4 Story (Tier II)', spawn:'21.4%', avg:'~3-4', boss:'25%', bold:true },
      { label:'5 Story (Tier I)',  spawn:'15.8%', avg:'~3',   boss:'0%'  },
      { label:'5 Story (Tier II)', spawn:'12.5%', avg:'~3',   boss:'0%'  },
      { label:'6 Story (Tier I)',  spawn:'6.25%', avg:'~2-3', boss:'0%'  },
    ],
    invasions: ['Daffodil Gardens','Mezzo Melodyland','The Brrrgh','Acorn Acres','Drowsy Dreamland'],
  },
  {
    cogName: 'Two-Face',
    attacks: [
      { name:'Evil Eye',      target:'Single Toon', levels:[6,7,8,9,10,11,12], dmg:[10,12,14,16,18,20,22], acc:[60,75,80,85,90,90,90], freq:25 },
      { name:'Hang Up',       target:'Single Toon', levels:[6,7,8,9,10,11,12], dmg:[7,8,10,12,13,15,17],   acc:[50,60,70,80,90,90,90], freq:15 },
      { name:'Razzle Dazzle', target:'Single Toon', levels:[6,7,8,9,10,11,12], dmg:[8,10,12,14,16,18,20],  acc:[60,65,70,75,80,85,90], freq:25 },
      { name:'Re-Org',        target:'Single Toon', levels:[6,7,8,9,10,11,12], dmg:[5,8,11,13,15,17,19],   acc:[65,75,80,85,90,95,95], freq:15 },
      { name:'Red Tape',      target:'Single Toon', levels:[6,7,8,9,10,11,12], dmg:[6,7,8,9,10,11,12],     acc:[60,65,75,85,90,95,95], freq:20 },
    ],
    streets: [
      { name:'Knight Knoll',  color:'#33205e', accent:'#9b70cc', spawn:'2.7%',  avg:'~1'   },
      { name:'Tulip Terrace', color:'#314600', accent:'#9bd31a', spawn:'8.9%',  avg:'~2'   },
      { name:'Alto Avenue',   color:'#482052', accent:'#bf62cb', spawn:'7.2%',  avg:'~2'   },
      { name:'Sleet Street',  color:'#003a46', accent:'#29b2dc', spawn:'17.2%', avg:'~5-6' },
      { name:'Peanut Place',  color:'#00451e', accent:'#20cf69', spawn:'10.9%', avg:'~3-4' },
      { name:'Lullaby Lane',  color:'#1a1060', accent:'#7b68ee', spawn:'17.2%', avg:'~5-6' },
    ],
    hqLocs: [
      { label:'SBHQ Courtyard',   spawn:'11.7%', avg:'~1' },
      { label:'Factory Exterior', spawn:'15%',   avg:'~3' },
    ],
    buildings: [
      { label:'3 Story (Tier I)',  spawn:'7.1%',  avg:'~1',   boss:'20%' },
      { label:'3 Story (Tier II)', spawn:'13.3%', avg:'~2',   boss:'20%' },
      { label:'4 Story (Tier I)',  spawn:'20%',   avg:'~3-4', boss:'25%', bold:true },
      { label:'4 Story (Tier II)', spawn:'21.4%', avg:'~3-4', boss:'25%', bold:true },
      { label:'5 Story (Tier I)',  spawn:'26.3%', avg:'~5',   boss:'0%'  },
      { label:'5 Story (Tier II)', spawn:'25%',   avg:'~6',   boss:'0%'  },
      { label:'6 Story (Tier I)',  spawn:'18.75%',avg:'~7-8', boss:'0%'  },
      { label:'6 Story (Tier II)', spawn:'15.4%', avg:'~7',   boss:'0%'  },
    ],
    invasions: ['Mezzo Melodyland','The Brrrgh','Acorn Acres','Drowsy Dreamland'],
  },
  {
    cogName: 'Mingler',
    attacks: [
      { name:'Buzz Word',      target:'Single Toon', levels:[7,8,9,10,11,12,13,14,15], dmg:[10,11,13,15,16,18,20,22,24], acc:[60,75,80,85,90,95,95,95,95], freq:20 },
      { name:'Paradigm Shift', target:'All Toons',   levels:[7,8,9,10,11,12,13,14,15], dmg:[10,13,14,15,18,20,22,24,26], acc:[60,70,75,80,90,90,90,90,90], freq:25 },
      { name:'Schmooze',       target:'Single Toon', levels:[7,8,9,10,11,12,13,14,15], dmg:[7,8,12,15,16,17,18,19,20],  acc:[55,65,75,85,95,95,95,95,95], freq:15 },
      { name:'Mumbo Jumbo',    target:'Single Toon', levels:[7,8,9,10,11,12,13,14,15], dmg:[12,15,18,21,24,26,28,30,32],acc:[70,75,80,85,95,95,95,95,95], freq:30 },
      { name:'Tee Off',        target:'Single Toon', levels:[7,8,9,10,11,12,13,14,15], dmg:[8,9,10,11,12,13,14,16,16],  acc:[70,75,80,85,95,95,95,95,95], freq:10 },
    ],
    hqLocs: [
      { label:'SBHQ Courtyard',   spawn:'7.8%', avg:'~1' },
      { label:'Factory Exterior', spawn:'10%',  avg:'~2' },
    ],
    buildings: [
      { label:'3 Story (Tier I)',  spawn:'0%',    avg:'~0-1',  boss:'20%' },
      { label:'3 Story (Tier II)', spawn:'6.7%',  avg:'~1',    boss:'20%' },
      { label:'4 Story (Tier I)',  spawn:'13%',   avg:'~2-3',  boss:'25%' },
      { label:'4 Story (Tier II)', spawn:'21.4%', avg:'~3-4',  boss:'25%' },
      { label:'5 Story (Tier I)',  spawn:'26.3%', avg:'~5-6',  boss:'50%', bold:true },
      { label:'5 Story (Tier II)', spawn:'31.25%',avg:'~8',    boss:'50%', bold:true },
      { label:'6 Story (Tier I)',  spawn:'37.5%', avg:'~15-16',boss:'0%'  },
      { label:'6 Story (Tier II)', spawn:'38.5%', avg:'~18-19',boss:'0%'  },
    ],
    invasions: ['The Brrrgh','Acorn Acres','Drowsy Dreamland'],
  },
  {
    cogName: 'Mr. Hollywood',
    attacks: [
      { name:'Tee Off',        target:'Single Toon', levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], dmg:[10,12,15,18,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58], acc:[55,65,75,80,85,90,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95], freq:25 },
      { name:'Song and Dance', target:'All Toons',   levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], dmg:[14,16,18,20,22,23,24,25,26,27,28,29,30,30,31,32,33,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60], acc:[45,50,55,60,65,75,80,85,90,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95], freq:25 },
      { name:'Schmooze',       target:'Single Toon', levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], dmg:[16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58], acc:[55,65,70,75,80,85,90,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95], freq:25 },
      { name:'Razzle Dazzle',  target:'Single Toon', levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50], dmg:[8,11,14,17,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58], acc:[70,75,80,85,90,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95], freq:25 },
    ],
    hqLocs: [
      { label:'Factory Exterior', spawn:'5%', avg:'~1' },
    ],
    buildings: [
      { label:'3 Story (Tier II)', spawn:'0%',    avg:'~0-1',  boss:'20%' },
      { label:'4 Story (Tier I)',  spawn:'6.7%',  avg:'~1-2',  boss:'25%' },
      { label:'4 Story (Tier II)', spawn:'14.3%', avg:'~2-3',  boss:'25%' },
      { label:'5 Story (Tier I)',  spawn:'26.3%', avg:'~5-6',  boss:'50%' },
      { label:'5 Story (Tier II)', spawn:'31.25%',avg:'~8',    boss:'50%' },
      { label:'6 Story (Tier I)',  spawn:'37.5%', avg:'~16-17',boss:'100%', bold:true },
      { label:'6 Story (Tier II)', spawn:'46.1%', avg:'~23',   boss:'100%', bold:true },
    ],
    invasions: ['Acorn Acres','Drowsy Dreamland'],
  },
];

/* XP table */
const SB_XP_ROWS = [
  { source:'Any Sellbot',           base:'1x Cog level',    boost:'Merit Monday, Invasions, Boosters' },
  { source:'Sellbot Factories',     base:'Varies by area',  boost:'Merit Monday, Invasions, Boosters' },
  { source:'Sellbot Cog Buildings', base:'Varies by floors', boost:'Merit Monday, Boosters only' },
  { source:'Sellbot Towers (V.P.)', base:'No Dept XP',      boost:'N/A' },
];
/* Cog detail panel — attacks */
function CogDetailPanel({ detail, accent, dept = 'Sellbot' }: { detail: CogDetail; accent: string; dept?: string }) {
  return (
    <div className="pim-cog-detail-panel">
      <div className="pim-detail-section">
        <h4 className="pim-detail-heading" style={{color: accent}}>Attacks</h4>
        <p className="pim-detail-note">Executive Cogs deal 1.2× this amount.</p>
        <div className="pim-attack-grid">
          {detail.attacks.map(atk => (
            <div key={atk.name} className="pim-attack-card">
              <div className="pim-attack-title" style={{background: `color-mix(in srgb,${accent} 35%,#1a0a14)`}}>
                {atk.name}
                <span className={`pim-attack-target ${atk.target === 'All Toons' ? 'pim-attack-target--all' : ''}`}>
                  {atk.target}
                </span>
              </div>
              <div className="pim-attack-table-wrap">
                <table className="pim-attack-table">
                  <thead>
                    <tr>
                      <th className="pim-atk-th pim-atk-row-label">Level</th>
                      {atk.levels.map(l => <th key={l} className="pim-atk-th">{l}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pim-atk-label">Damage</td>
                      {atk.dmg.map((d,i) => <td key={i} className="pim-atk-val">{d}</td>)}
                    </tr>
                    <tr>
                      <td className="pim-atk-label">Accuracy</td>
                      {atk.acc.map((a,i) => <td key={i} className="pim-atk-val">{a}</td>)}
                    </tr>
                    <tr>
                      <td className="pim-atk-label">Frequency</td>
                      {atk.levels.map((_,i) => <td key={i} className="pim-atk-val">{Array.isArray(atk.freq) ? atk.freq[i] : atk.freq}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {((detail.streets && detail.streets.length > 0) || (detail.hqLocs && detail.hqLocs.length > 0)) && (
        <div className="pim-detail-section">
          <h4 className="pim-detail-heading" style={{color: accent}}>Best Locations</h4>
          {detail.streets && detail.streets.length > 0 && (
            <div className="pim-loc-table-wrap">
              <table className="pim-loc-table">
                <thead><tr>
                  <th className="pim-loc-th">Location</th>
                  <th className="pim-loc-th">Spawn Chance</th>
                  <th className="pim-loc-th">Avg Amount</th>
                </tr></thead>
                <tbody>
                  {detail.streets.map(s => (
                    <tr key={s.name}>
                      <td className="pim-loc-name" style={{background: s.color, color: s.accent}}>{s.name}</td>
                      <td className="pim-loc-val">{s.spawn}</td>
                      <td className="pim-loc-val">{s.avg}</td>
                    </tr>
                  ))}
                  {detail.hqLocs && detail.hqLocs.map(h => (
                    <tr key={h.label}>
                      <td className="pim-loc-name pim-loc-name--hq">{h.label}</td>
                      <td className="pim-loc-val">{h.spawn}</td>
                      <td className="pim-loc-val">{h.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {(!detail.streets || detail.streets.length === 0) && detail.hqLocs && (
            <div className="pim-loc-table-wrap">
              <table className="pim-loc-table">
                <thead><tr>
                  <th className="pim-loc-th">Location</th>
                  <th className="pim-loc-th">Spawn Chance</th>
                  <th className="pim-loc-th">Avg Amount</th>
                </tr></thead>
                <tbody>
                  {detail.hqLocs.map(h => (
                    <tr key={h.label}>
                      <td className="pim-loc-name pim-loc-name--hq">{h.label}</td>
                      <td className="pim-loc-val">{h.spawn}</td>
                      <td className="pim-loc-val">{h.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {detail.buildings && detail.buildings.length > 0 && (() => {
            const parseAvg = (s: string) => { const n = s.replace('~','').split('-'); return parseFloat(n[n.length-1]); };
            const maxSpawn = Math.max(...detail.buildings.map(b => parseFloat(b.spawn)));
            const maxAvg   = Math.max(...detail.buildings.map(b => parseAvg(b.avg)));
            const maxBoss  = Math.max(...detail.buildings.map(b => parseFloat(b.boss)));
            return (
            <><p className="pim-detail-sublabel" style={{marginTop:10}}>{dept} Cog Buildings</p>
            <div className="pim-loc-table-wrap">
              <table className="pim-loc-table">
                <thead><tr>
                  <th className="pim-loc-th">Building</th>
                  <th className="pim-loc-th">Spawn Chance</th>
                  <th className="pim-loc-th">Avg Amount</th>
                  <th className="pim-loc-th">Boss Chance</th>
                </tr></thead>
                <tbody>
                  {detail.buildings.map(b => {
                    const topSpawn = maxSpawn > 0 && parseFloat(b.spawn) === maxSpawn;
                    const topAvg   = maxAvg > 0 && parseAvg(b.avg) === maxAvg;
                    const topBoss  = maxBoss > 0 && parseFloat(b.boss) === maxBoss;
                    return (
                    <tr key={b.label} className={topBoss ? 'pim-loc-row--boss-top' : ''}>
                      <td className="pim-loc-name pim-loc-name--building">{b.label}</td>
                      <td className={`pim-loc-val${topSpawn ? ' pim-loc-val--top' : ''}`}>{b.spawn}</td>
                      <td className={`pim-loc-val${topAvg ? ' pim-loc-val--avg-top' : ''}`}>{b.avg}</td>
                      <td className={`pim-loc-val${topBoss ? ' pim-loc-val--boss-top' : ''}`}>{b.boss}</td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div></> );
          })()}
        </div>
      )}
      {detail.invasions.length > 0 && (
        <div className="pim-detail-section">
          <h4 className="pim-detail-heading" style={{color: accent}}>Cog Invasions</h4>
          <p className="pim-detail-note">Neighborhoods affected by {detail.cogName} invasions:</p>
          <ul className="pim-invasion-list">
            {detail.invasions.map(n => (
              <li key={n} className="pim-invasion-item">{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}



/* --- Sellbot HQ guide section --- */
function SellbotHQSection({ accent }: { accent: string }) {
  return (
    <div className="pim-hq-section" style={{'--hq-bg': 'url(/icons/promotions/Sellbot/wallpapers/Sellbot_HQ.png)'} as React.CSSProperties}>
      <div className="pim-hq-overlay" />
      <div className="pim-scroll pim-hq-content">

        <div className="pim-section">
          <p className="pim-para">
            <strong>Sellbot HQ (SBHQ)</strong> is the home base of the <span className="pim-hl">Sellbots</span>, unlocked through the <span className="pim-hl">Daffodil Gardens Taskline</span>. Collect <span className="pim-hl">Invoices</span> in the <span className="pim-hl">Sellbot Factory</span> to challenge the <span className="pim-hl">Senior Vice President</span> atop the Sellbot Towers.
          </p>
        </div>

        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Courtyard</h3>
          <p className="pim-para">A large gravel pit connecting the Factory Exterior and Sellbot Towers. Gloomy sky, gray hills, and scattered machinery set the scene.</p>
          <ul className="pim-list">
            <li>Levels <strong>4–8</strong> | <span className="pim-hl">Tier 1–7 Cogs</span> | ~10 Cogs active</li>
            <li><strong>92%</strong> Sellbot spawn rate (2% per other department)</li>
            <li>+1x <span className="pim-hl">Gag XP</span> &amp; Merit multiplier</li>
          </ul>
        </div>

        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Factory Exterior</h3>
          <p className="pim-para">Houses the two entrances to the <span className="pim-hl">Sellbot Factory</span>. The <strong>Side Entrance</strong> raises all Cog levels by +1 (excluding the <span className="pim-hl">Factory Foreman</span>). Complete 5 Factory runs — either entrance — to earn your <span className="pim-hl">Sellbot Cog Disguise</span>.</p>
          <ul className="pim-list">
            <li>Levels <strong>5–8</strong> | <span className="pim-hl">Tier 1–8 Cogs</span> | ~21 Cogs active</li>
            <li>Sellbot-only spawns</li>
            <li>+1x <span className="pim-hl">Gag XP</span> &amp; Merit multiplier</li>
          </ul>
        </div>

        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Sellbot Towers</h3>
          <p className="pim-para">Four tall buildings at the far end of the Courtyard — the V.P.&apos;s domain. Enter the HQ Lobby to queue up, take the elevator, and battle the <span className="pim-hl">Senior Vice President</span>. Requires a completed <span className="pim-hl">Sellbot Cog Disguise</span> to enter.</p>
        </div>

        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Junior Administration Lobby</h3>
          <p className="pim-para">Accessed from the left side of the HQ Lobby. A long staircase leads to the <span className="pim-hl">Multislacker</span> boss fight. Requires the <span className="pim-hl">The Couch Slouch</span> Kudos Rank-Up Task from <span className="pim-hl">Daffodil Gardens</span> to enter.</p>
        </div>

      </div>
    </div>
  );
}

/* Sellbot content */
function SellbotContent({ accent }: { accent: string }) {
  const [tab, setTab] = useState<'hq'|'promos'|'ladder'>('hq');
  const [detailCog, setDetailCog] = useState<string|null>(null);

  const openDetail  = (name: string) => setDetailCog(name);
  const closeDetail = () => setDetailCog(null);

  return (
    <div className="pim-inner">
      {/* Tab bar — replaced by back-nav when a cog detail is open */}
      {detailCog ? (
        <div className="pim-inner-tabs pim-detail-nav">
          <button className="pim-detail-back-btn" style={{'--pim-accent': accent} as React.CSSProperties} onClick={closeDetail}>
            &#8592; Back
          </button>
          <span className="pim-detail-nav-title" style={{color: accent}}>{detailCog}</span>
        </div>
      ) : (
        <div className="pim-inner-tabs">
          {(['hq','promos','ladder'] as const).map(t => (
            <button
              key={t}
              className={`pim-inner-tab${tab === t ? ' pim-inner-tab--active' : ''}`}
              style={tab === t ? {'--pim-accent': accent} as React.CSSProperties : undefined}
              onClick={() => setTab(t)}
            >
              {t === 'hq' ? 'Sellbot HQ' : t === 'promos' ? 'Sellbot Promotions' : 'Corporate Ladder'}
            </button>
          ))}
        </div>
      )}

      {/* Full-page cog detail view */}
      {detailCog && (() => {
        const detail = SB_COG_DETAILS.find(d => d.cogName === detailCog);
        const cogCard = SB_REGULAR.find(c => c.name === detailCog);
        if (!detail) return null;
        return (
          <div className="pim-scroll pim-detail-view">
            <div className="pim-detail-view-header">
              {cogCard && (
                <div className="pim-detail-view-img-wrap">
                  <Image src={cogCard.img} alt={cogCard.name} fill className="pim-cog-img" unoptimized />
                </div>
              )}
              <div className="pim-detail-view-meta">
                {cogCard && <span className="pim-cog-tier">{cogCard.tier}</span>}
                {cogCard && <span className="pim-cog-stat">Levels {cogCard.levels}</span>}
                {cogCard && <span className="pim-cog-stat">Damage: {cogCard.dmg}</span>}
              </div>
            </div>
            <CogDetailPanel detail={detail} accent={accent} />
          </div>
        );
      })()}

      {!detailCog && tab === 'hq' && (
        <SellbotHQSection accent={accent} />
      )}

      {!detailCog && tab === 'promos' && (
        <div className="pim-scroll">

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Suit Acquisition</h3>
            <div className="pim-info-block">
              <div className="pim-suit-header">
                <Image src="/icons/cog-emblems/SellbotEmblem.png" alt="Sellbot" width={32} height={32} className="pim-suit-emblem" unoptimized />
                <span className="pim-suit-name" style={{fontWeight:800}}>Sellbot Cog Suit</span>
              </div>
              <ul className="pim-list">
                <li><SBHighlight text="Earn the Cold Caller Cog Disguise by completing 5 Sellbot Factories." /></li>
                <li><SBHighlight text="Each Factory run defeats the Factory Foreman and rewards one suit part." /></li>
                <li><SBHighlight text="Run 5 short Factories for the quickest clear." /></li>
              </ul>
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Promotions Overview</h3>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>How promotions work:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Promotions are earned by defeating the Senior Vice President atop Sellbot Towers in Sellbot HQ." /></li>
                <li><SBHighlight text="Promotions are tracked separately from Department Levels." /></li>
                <li><SBHighlight text="The Sellbot equivalent of Merits is called Invoices." /></li>
                <li><SBHighlight text="Invoices are earned by defeating any Sellbots anywhere in the game." /></li>
                <li><SBHighlight text="A required number of Invoices must be collected before entering Sellbot Towers." /></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>Best ways to stack Invoices fast:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Sellbot Factories are the fastest method — many Sellbots are defeated per run." /></li>
                <li><SBHighlight text="Sellbot Cog Buildings also reward Invoices, but Invasions do not boost Merits inside buildings or facilities." /></li>
                <li><SBHighlight text="Boost earnings with Merit Monday, Cog Invasions, and Boosters." /></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>Milestone rewards:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Teleport access to Sellbot HQ is earned when a Toon reaches Mover and Shaker Level 5." /></li>
                <li><SBHighlight text="A Laff Point is earned at Mr. Hollywood Levels 8, 15, 20, 30, 40, and 50 — totaling 6 additional Laff Points." /></li>
              </ul>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Department Levels</h3>
            <p className="pim-section-sub">
              <SBHighlight text="Department Levels are separate from Promotions. Earn Dept XP by defeating Sellbots anywhere." />
            </p>
            <div className="pim-dept-levels">

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 40%,#1a0a14)`}}>
                  Level 10 &mdash; Sellbot Seeker
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Exclusive Sellbot Seeker outfit (shirt, shorts, and skirt options)" /></li>
                    <li><SBHighlight text="Unlocks access to higher-difficulty Sellbot content" /></li>
                  </ul>
                  <div className="pim-outfit-table-wrap">
                    <table className="pim-outfit-table">
                      <thead>
                        <tr>
                          <th className="pim-outfit-th" style={{color: accent}}>Shirt</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Shorts</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Skirt</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerShirt.png" alt="Sellbot Seeker Shirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerShorts.png" alt="Sellbot Seeker Shorts" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerSkirt.png" alt="Sellbot Seeker Skirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 30%,#1a0a14)`}}>
                  Level 20 &mdash; Sellbot Expert
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Boss Rewards — exclusive IOU note collectible" /></li>
                    <li><SBHighlight text="Grants access to advanced Sellbot encounters" /></li>
                  </ul>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 20%,#1a0a14)`}}>
                  Level 30 &mdash; Sellbot Master
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Boss Rewards — unlocks the Robber Baron encounter" /></li>
                    <li><SBHighlight text="Highest Sellbot Department Level milestone currently available" /></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Gaining Department Experience</h3>
            <div className="pim-table-wrap">
              <table className="pim-xp-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Base XP</th>
                    <th>Boostable By</th>
                  </tr>
                </thead>
                <tbody>
                  {SB_XP_ROWS.map(r => (
                    <tr key={r.source}>
                      <td><span className="pim-xp-val"><SBHighlight text={r.source} /></span></td>
                      <td><SBHighlight text={r.base} /></td>
                      <td className="pim-muted"><SBHighlight text={r.boost} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pim-table-note">
              <SBHighlight text="Note: Cog Invasions do not boost Merits earned inside Sellbot Factories or Sellbot Cog Buildings. Only street Sellbots benefit from invasion multipliers." />
            </p>
          </div>

        </div>
      )}
      {!detailCog && tab === 'ladder' && (
        <div className="pim-scroll">

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>General Cogs</h3>
            <div className="pim-cog-grid">
              {SB_REGULAR.map(c => {
                const detail = SB_COG_DETAILS.find(d => d.cogName === c.name);
                return (
                  <div key={c.name} className="pim-cog-card">
                    <div className="pim-cog-img-wrap">
                      <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                    </div>
                    <div className="pim-cog-info">
                      <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                      <span className="pim-cog-tier">{c.tier}</span>
                      <span className="pim-cog-stat">Levels {c.levels}</span>
                      <span className="pim-cog-stat">Damage: {c.dmg}</span>
                      {detail && (
                        <button
                          className="pim-cog-detail-btn"
                          style={{'--pim-accent': accent} as React.CSSProperties}
                          onClick={() => openDetail(c.name)}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Special Cogs</h3>
            <div className="pim-cog-grid">
              {SB_SPECIAL.map(c => (
                <div key={c.name} className="pim-cog-card">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Level {c.level}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title pim-section-title--removed">Removed Cogs</h3>
            <div className="pim-cog-grid">
              {SB_REMOVED.map(c => (
                <div key={c.name} className="pim-cog-card pim-cog-card--removed">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name pim-cog-name--removed">{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Level {c.level}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}


/* ─── Cashbot data ──────────────────────────────────────────────────────────── */
const CB_REGULAR = [
  { name:'Short Change',    tier:'Tier 1 Employee', levels:'1-5',  dmg:'1-11',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Shortchange_CG.gif' },
  { name:'Penny Pincher',   tier:'Tier 2 Employee', levels:'2-6',  dmg:'1-12',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Pennypincher_CG.gif' },
  { name:'Tightwad',        tier:'Tier 3 Employee', levels:'3-7',  dmg:'3-18',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Tightwad_CG.gif' },
  { name:'Bean Counter',    tier:'Tier 4 Employee', levels:'4-8',  dmg:'4-24',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Beancounter_CG.gif' },
  { name:'Number Cruncher', tier:'Tier 5 Employee', levels:'5-9',  dmg:'4-28',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Numbercruncher_CG.gif' },
  { name:'Money Bags',      tier:'Tier 6 Employee', levels:'6-10', dmg:'5-30',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Moneybags_CG.gif' },
  { name:'Loan Shark',      tier:'Tier 7 Employee', levels:'7-15', dmg:'9-32',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Loanshark_CG.gif' },
  { name:'Robber Baron',    tier:'Tier 8 Employee', levels:'8-50', dmg:'8-59',  img:'/icons/promotions/Cashbot/corporate-ladder/regular/300px-Robberbaron_CG.gif' },
];

const CB_SPECIAL = [
  { name:'Mint Supervisor',      tier:'Manager',          level:'13 (mgr)', dmg:'21-31',  img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-MintSuper2.gif' },
  { name:'Duck Shuffler',        tier:'Regional Manager', level:'5 (mgr)',  dmg:'3-6',    img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-Duckshuffler_CG.gif' },
  { name:'Treekiller',           tier:'Regional Manager', level:'24 (mgr)', dmg:'8-32',   img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-Treekiller_CG.gif' },
  { name:'Plutocrat',            tier:'Regional Manager', level:'38 (mgr)', dmg:'27-36',  img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-Plutocrat_CG.gif' },
  { name:'Satellite Investors',  tier:'Regional Managers',level:'20-35 (mgr)', dmg:'25-36', img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-Satelliteinvestors_CG.gif' },
  { name:'High Roller',          tier:'Regional Manager', level:'100 (mgr)',dmg:'150-225',img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-HighRoller_CG.gif' },
  { name:'Count Erfit',          tier:'Third Cousin Twice Removed', level:'20 (mgr) v2.0', dmg:'12-25', img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-CountErfit_CG.gif' },
  { name:'Chief Financial Officer', tier:'Boss',          level:'[CLASSIFIED]', dmg:'???', img:'/icons/promotions/Cashbot/corporate-ladder/special/300px-CFOGif.gif' },
];

const CB_REMOVED = [
  { name:'Chief of Dollars', tier:'Boss', level:'Removed', dmg:'???', img:'/icons/promotions/Cashbot/corporate-ladder/removed/300px-CODCogGalleryNOTREAL.gif' },
];

const CB_COG_DETAILS: CogDetail[] = [
  {
    cogName: 'Short Change',
    attacks: [
      { name:'Watercooler',  target:'Single Toon', levels:[1,2,3,4,5], dmg:[2,2,3,4,6],   acc:[50,50,50,50,50], freq:20 },
      { name:'Bounce Check', target:'Single Toon', levels:[1,2,3,4,5], dmg:[3,5,7,9,11],  acc:[75,80,85,90,95], freq:15 },
      { name:'Clip On Tie',  target:'Single Toon', levels:[1,2,3,4,5], dmg:[1,1,2,2,3],   acc:[50,50,50,50,50], freq:25 },
      { name:'Pick Pocket',  target:'Single Toon', levels:[1,2,3,4,5], dmg:[2,2,3,4,6],   acc:[95,95,95,95,95], freq:40 },
    ],
    streets: [
      { name:'Punchline Place',  color:'#7a2500', accent:'#ff9966', spawn:'16%',   avg:'~4'   },
      { name:'Seaweed Street',   color:'#5a1a05', accent:'#dc4a14', spawn:'17.2%', avg:'~4'   },
      { name:'Knight Knoll',     color:'#33205e', accent:'#9b70cc', spawn:'7.9%',  avg:'~2'   },
      { name:'Petunia Place',    color:'#314600', accent:'#9bd31a', spawn:'5.6%',  avg:'~1-2' },
      { name:'Soprano Street',   color:'#482052', accent:'#bf62cb', spawn:'4.7%',  avg:'~1-2' },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'3.8%', avg:'~1' }],
    buildings: [
      { label:'1 Story',           spawn:'66.7%', avg:'~5-6', boss:'33.3%', bold:true },
      { label:'2 Story (Tier I)',   spawn:'40%',   avg:'~4',   boss:'25%' },
      { label:'2 Story (Tier II)',  spawn:'28.6%', avg:'~3',   boss:'20%' },
      { label:'3 Story (Tier I)',   spawn:'14.3%', avg:'~2',   boss:'0%' },
      { label:'3 Story (Tier II)',  spawn:'6.7%',  avg:'~1',   boss:'0%' },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens'],
  },
  {
    cogName: 'Penny Pincher',
    attacks: [
      { name:'Bounce Check',  target:'Single Toon', levels:[2,3,4,5,6], dmg:[3,4,5,7,10],  acc:[75,75,75,75,75], freq:25 },
      { name:'Freeze Assets', target:'Single Toon', levels:[2,3,4,5,6], dmg:[2,3,4,6,9],   acc:[75,75,75,75,75], freq:20 },
      { name:'Finger Wag',    target:'Single Toon', levels:[2,3,4,5,6], dmg:[1,2,3,4,6],   acc:[50,50,50,50,50], freq:25 },
      { name:'Penny Pinch',   target:'Single Toon', levels:[2,3,4,5,6], dmg:[4,5,6,8,12],  acc:[75,75,75,75,75], freq:30 },
    ],
    streets: [
      { name:'Punchline Place',  color:'#7a2500', accent:'#ff9966', spawn:'12%',   avg:'~3'   },
      { name:'Seaweed Street',   color:'#5a1a05', accent:'#dc4a14', spawn:'17.2%', avg:'~4'   },
      { name:'Knight Knoll',     color:'#33205e', accent:'#9b70cc', spawn:'10.6%', avg:'~3'   },
      { name:'Petunia Place',    color:'#314600', accent:'#9bd31a', spawn:'8.4%',  avg:'~2'   },
      { name:'Soprano Street',   color:'#482052', accent:'#bf62cb', spawn:'9.4%',  avg:'~3'   },
      { name:'Sleet Street',     color:'#003a46', accent:'#29b2dc', spawn:'2.1%',  avg:'~1'   },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'7.5%', avg:'~1-2' }],
    buildings: [
      { label:'1 Story',           spawn:'33.3%', avg:'~3',   boss:'33.3%', bold:true },
      { label:'2 Story (Tier I)',   spawn:'40%',   avg:'~4',   boss:'25%' },
      { label:'2 Story (Tier II)',  spawn:'28.6%', avg:'~3',   boss:'20%' },
      { label:'3 Story (Tier I)',   spawn:'21.4%', avg:'~3',   boss:'0%' },
      { label:'3 Story (Tier II)',  spawn:'13.3%', avg:'~1-2', boss:'0%' },
      { label:'4 Story (Tier I)',   spawn:'6.7%',  avg:'~1',   boss:'0%' },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens','Mezzo Melodyland'],
  },
  {
    cogName: 'Tightwad',
    attacks: [
      { name:'Bounce Check',  target:'Single Toon', levels:[3,4,5,6,7], dmg:[4,6,9,12,15],  acc:[75,75,75,75,75], freq:25 },
      { name:'Finger Wag',    target:'Single Toon', levels:[3,4,5,6,7], dmg:[2,3,4,6,9],    acc:[50,50,50,50,50], freq:25 },
      { name:'Fired',         target:'Single Toon', levels:[3,4,5,6,7], dmg:[3,4,6,8,10],   acc:[75,75,75,75,75], freq:25 },
      { name:'Glower Power',  target:'Single Toon', levels:[3,4,5,6,7], dmg:[3,4,6,9,12],   acc:[95,95,95,95,95], freq:25 },
    ],
    streets: [
      { name:'Punchline Place',  color:'#7a2500', accent:'#ff9966', spawn:'9.6%',  avg:'~2-3' },
      { name:'Seaweed Street',   color:'#5a1a05', accent:'#dc4a14', spawn:'13.8%', avg:'~3-4' },
      { name:'Knight Knoll',     color:'#33205e', accent:'#9b70cc', spawn:'12.4%', avg:'~3'   },
      { name:'Petunia Place',    color:'#314600', accent:'#9bd31a', spawn:'11.2%', avg:'~3'   },
      { name:'Soprano Street',   color:'#482052', accent:'#bf62cb', spawn:'12.6%', avg:'~3-4' },
      { name:'Sleet Street',     color:'#003a46', accent:'#29b2dc', spawn:'4.1%',  avg:'~1'   },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'11.3%', avg:'~2-3' }],
    buildings: [
      { label:'2 Story (Tier I)',   spawn:'20%',   avg:'~2',   boss:'25%' },
      { label:'2 Story (Tier II)',  spawn:'28.6%', avg:'~3',   boss:'20%' },
      { label:'3 Story (Tier I)',   spawn:'28.6%', avg:'~4',   boss:'20%', bold:true },
      { label:'3 Story (Tier II)',  spawn:'26.7%', avg:'~3-4', boss:'20%', bold:true },
      { label:'4 Story (Tier I)',   spawn:'20%',   avg:'~3-4', boss:'0%' },
      { label:'4 Story (Tier II)',  spawn:'14.3%', avg:'~2-3', boss:'0%' },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens','Mezzo Melodyland','The Brrrgh'],
  },
  {
    cogName: 'Bean Counter',
    attacks: [
      { name:'Audit',     target:'Single Toon', levels:[4,5,6,7,8], dmg:[4,6,9,12,15], acc:[95,95,95,95,95], freq:20 },
      { name:'Calculate', target:'Single Toon', levels:[4,5,6,7,8], dmg:[4,6,9,12,15], acc:[75,75,75,75,75], freq:25 },
      { name:'Tabulate',  target:'Single Toon', levels:[4,5,6,7,8], dmg:[4,6,9,12,15], acc:[75,75,75,75,75], freq:25 },
      { name:'Write Off', target:'Single Toon', levels:[4,5,6,7,8], dmg:[4,6,9,12,15], acc:[95,95,95,95,95], freq:30 },
    ],
    streets: [
      { name:'Punchline Place',  color:'#7a2500', accent:'#ff9966', spawn:'7.7%',  avg:'~2'   },
      { name:'Seaweed Street',   color:'#5a1a05', accent:'#dc4a14', spawn:'6.9%',  avg:'~2'   },
      { name:'Knight Knoll',     color:'#33205e', accent:'#9b70cc', spawn:'13.3%', avg:'~3'   },
      { name:'Petunia Place',    color:'#314600', accent:'#9bd31a', spawn:'14%',   avg:'~3'   },
      { name:'Soprano Street',   color:'#482052', accent:'#bf62cb', spawn:'15.7%', avg:'~4'   },
      { name:'Sleet Street',     color:'#003a46', accent:'#29b2dc', spawn:'6.1%',  avg:'~1-2' },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'15.1%', avg:'~3' }],
    buildings: [
      { label:'2 Story (Tier II)',  spawn:'14.3%', avg:'~1-2', boss:'20%' },
      { label:'3 Story (Tier I)',   spawn:'28.6%', avg:'~4',   boss:'20%' },
      { label:'3 Story (Tier II)',  spawn:'33.3%', avg:'~4-5', boss:'20%', bold:true },
      { label:'4 Story (Tier I)',   spawn:'26.7%', avg:'~4-5', boss:'25%', bold:true },
      { label:'4 Story (Tier II)',  spawn:'21.4%', avg:'~3-4', boss:'25%' },
      { label:'5 Story (Tier I)',   spawn:'10.5%', avg:'~2',   boss:'0%' },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens','Mezzo Melodyland','The Brrrgh','Acorn Acres'],
  },
  {
    cogName: 'Number Cruncher',
    attacks: [
      { name:'Audit',     target:'Single Toon', levels:[5,6,7,8,9], dmg:[6,8,11,14,17], acc:[95,95,95,95,95], freq:20 },
      { name:'Calculate', target:'Single Toon', levels:[5,6,7,8,9], dmg:[6,8,11,14,17], acc:[75,75,75,75,75], freq:25 },
      { name:'Crunch',    target:'Single Toon', levels:[5,6,7,8,9], dmg:[6,8,11,14,17], acc:[95,95,95,95,95], freq:25 },
      { name:'Tabulate',  target:'Single Toon', levels:[5,6,7,8,9], dmg:[6,8,11,14,17], acc:[75,75,75,75,75], freq:30 },
    ],
    streets: [
      { name:'Seaweed Street',   color:'#5a1a05', accent:'#dc4a14', spawn:'3.4%',  avg:'~1'   },
      { name:'Knight Knoll',     color:'#33205e', accent:'#9b70cc', spawn:'10.6%', avg:'~2-3' },
      { name:'Petunia Place',    color:'#314600', accent:'#9bd31a', spawn:'11.2%', avg:'~2-3' },
      { name:'Soprano Street',   color:'#482052', accent:'#bf62cb', spawn:'13.4%', avg:'~3'   },
      { name:'Sleet Street',     color:'#003a46', accent:'#29b2dc', spawn:'10.3%', avg:'~2-3' },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'18.9%', avg:'~3-4' }],
    buildings: [
      { label:'3 Story (Tier I)',   spawn:'7.1%',  avg:'~1',   boss:'20%' },
      { label:'3 Story (Tier II)',  spawn:'13.3%', avg:'~1-2', boss:'20%' },
      { label:'4 Story (Tier I)',   spawn:'20%',   avg:'~3',   boss:'25%' },
      { label:'4 Story (Tier II)',  spawn:'28.6%', avg:'~4-5', boss:'25%', bold:true },
      { label:'5 Story (Tier I)',   spawn:'26.3%', avg:'~5',   boss:'50%', bold:true },
      { label:'5 Story (Tier II)',  spawn:'25%',   avg:'~6',   boss:'50%', bold:true },
      { label:'6 Story (Tier I)',   spawn:'18.75%',avg:'~8',   boss:'0%' },
    ],
    invasions: ['Barnacle Boatyard','Ye Olde Toontowne','Daffodil Gardens','Mezzo Melodyland','The Brrrgh','Acorn Acres','Drowsy Dreamland'],
  },
  {
    cogName: 'Money Bags',
    attacks: [
      { name:'Liquidate',    target:'Single Toon', levels:[6,7,8,9,10], dmg:[6,8,11,14,17],  acc:[75,75,75,75,75], freq:25 },
      { name:'Market Crash', target:'All Toons',   levels:[6,7,8,9,10], dmg:[5,7,9,12,15],   acc:[60,65,70,75,80], freq:25 },
      { name:'Power Trip',   target:'All Toons',   levels:[6,7,8,9,10], dmg:[6,8,11,14,17],  acc:[75,80,85,90,95], freq:25 },
      { name:'Tee Off',      target:'Single Toon', levels:[6,7,8,9,10], dmg:[8,10,13,16,20], acc:[75,75,80,80,80], freq:25 },
    ],
    streets: [
      { name:'Sleet Street',    color:'#003a46', accent:'#29b2dc', spawn:'12.4%', avg:'~3'   },
      { name:'Soprano Street',  color:'#482052', accent:'#bf62cb', spawn:'10.4%', avg:'~2-3' },
      { name:'Petunia Place',   color:'#314600', accent:'#9bd31a', spawn:'8.4%',  avg:'~2'   },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'22.6%', avg:'~4-5' }],
    buildings: [
      { label:'3 Story (Tier II)',  spawn:'6.7%',  avg:'~1',   boss:'20%' },
      { label:'4 Story (Tier I)',   spawn:'13.3%', avg:'~2',   boss:'25%' },
      { label:'4 Story (Tier II)',  spawn:'21.4%', avg:'~3-4', boss:'25%' },
      { label:'5 Story (Tier I)',   spawn:'26.3%', avg:'~5-6', boss:'50%', bold:true },
      { label:'5 Story (Tier II)',  spawn:'31.25%',avg:'~8',   boss:'50%', bold:true },
      { label:'6 Story (Tier I)',   spawn:'37.5%', avg:'~15',  boss:'0%' },
    ],
    invasions: ['Mezzo Melodyland','The Brrrgh','Acorn Acres','Drowsy Dreamland'],
  },
  {
    cogName: 'Loan Shark',
    attacks: [
      { name:'Bite',         target:'Single Toon',   levels:[7,8,9,10,11,12,13,14,15], dmg:[10,11,13,15,16,18,20,22,24], acc:[60,75,80,85,90,95,95,95,95], freq:30 },
      { name:'Chomp',        target:'Single Toon',   levels:[7,8,9,10,11,12,13,14,15], dmg:[12,15,18,21,24,26,28,30,32], acc:[60,70,75,80,90,95,95,95,95], freq:35 },
      { name:'Play Hardball',target:'Single Toon',   levels:[7,8,9,10,11,12,13,14,15], dmg:[9,11,13,15,17,19,21,23,25],  acc:[80,80,75,85,85,90,90,90,95], freq:20 },
      { name:'Write Off',    target:'Single Toon',   levels:[7,8,9,10,11,12,13,14,15], dmg:[6,8,10,12,14,16,18,20,22],   acc:[80,80,85,85,90,90,90,90,95], freq:15 },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'11.3%', avg:'~2' }],
    buildings: [
      { label:'3 Story (Tier I)',  spawn:'0%',     avg:'~0-1',  boss:'20%' },
      { label:'3 Story (Tier II)', spawn:'6.7%',   avg:'~1',    boss:'20%' },
      { label:'4 Story (Tier I)',  spawn:'13%',    avg:'~2-3',  boss:'25%' },
      { label:'4 Story (Tier II)', spawn:'21.4%',  avg:'~3-4',  boss:'25%' },
      { label:'5 Story (Tier I)',  spawn:'26.3%',  avg:'~5-6',  boss:'50%', bold:true },
      { label:'5 Story (Tier II)', spawn:'31.25%', avg:'~8',    boss:'50%', bold:true },
      { label:'6 Story (Tier I)',  spawn:'37.5%',  avg:'~15-16',boss:'0%'  },
      { label:'6 Story (Tier II)', spawn:'38.5%',  avg:'~18-19',boss:'0%'  },
    ],
    invasions: ['The Brrrgh','Acorn Acres','Drowsy Dreamland'],
  },
  {
    cogName: 'Robber Baron',
    attacks: [
      {
        name:'Synergy', target:'All Toons',
        levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
        dmg:   [11,14,16,18,20,21,22,23,24,25,26,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,'Limit'],
        acc:   [60,65,70,75,80,85,90,90,90,90,90,90,90,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95,95],
        freq:  25,
      },
      {
        name:'Cigar Smoke', target:'Single Toon',
        levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
        dmg:   [14,15,17,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,'Limit'],
        acc:   [60,65,70,75,80,85,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90],
        freq:  25,
      },
      {
        name:'Pick Pocket', target:'Single Target',
        levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
        dmg:   [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,'Limit','Limit'],
        acc:   [55,65,70,75,80,85,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90],
        freq:  25,
      },
      {
        name:'Tee Off', target:'Single Target',
        levels:[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
        dmg:   [10,12,14,16,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56],
        acc:   [60,65,75,85,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90],
        freq:  25,
      },
    ],
    hqLocs: [{ label:'CBHQ Courtyard', spawn:'7.5%', avg:'~1-2' }],
    buildings: [
      { label:'3 Story (Tier II)', spawn:'0%',     avg:'~0-1',  boss:'20%' },
      { label:'4 Story (Tier I)',  spawn:'6.7%',   avg:'~1-2',  boss:'25%' },
      { label:'4 Story (Tier II)', spawn:'14.3%',  avg:'~2-3',  boss:'25%' },
      { label:'5 Story (Tier I)',  spawn:'26.3%',  avg:'~5-6',  boss:'50%' },
      { label:'5 Story (Tier II)', spawn:'31.25%', avg:'~8',    boss:'50%' },
      { label:'6 Story (Tier I)',  spawn:'37.5%',  avg:'~16-17',boss:'100%', bold:true },
      { label:'6 Story (Tier II)', spawn:'46.1%',  avg:'~23',   boss:'100%', bold:true },
    ],
    invasions: ['Acorn Acres','Drowsy Dreamland'],
  },
];

const CB_XP_ROWS = [
  { source:'Stomping Goons',              base:'+45-165 (increases with stronger Goons)', boost:'N/A' },
  { source:'Damaging the C.F.O.',         base:'+8-75 XP (= \u00d71.5 damage dealt)',         boost:'N/A' },
  { source:'Teammate stuns the C.F.O.',   base:'+300 XP (depreciates each stun)',          boost:'N/A' },
  { source:'You stun C.F.O. (main crane)',base:'+532 XP (depreciates each stun)',         boost:'N/A' },
  { source:'You stun C.F.O. (side crane)',base:'+1,067 XP (depreciates each stun)',        boost:'N/A' },
];

const CB_HIGHLIGHTS = [
  'Cashbot Cog Buildings',
  'Short Change Suit Cog Disguise',
  'Number Cruncher',
  'Mint Supervisor',
  'Department Levels',
  'Cog Invasions',
  'Cog Buildings',
  'Robber Baron',
  'Bullion Mint',
  'Dollar Mint',
  'Coin Mint',
  'Cogbuck Monday',
  'Laff Points',
  'Laff Point',
  'Loan Shark',
  'Cashbot HQ',
  'Boss Rewards',
  'Cashbots',
  'Cashbot',
  'Cogbucks',
  'Cogbuck',
  'Boosters',
  'Merits',
  'C.F.O.',
];

function CBHighlight({ text }: { text: string }) {
  const escaped = CB_HIGHLIGHTS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return (
    <>
      {parts.map((part, i) =>
        CB_HIGHLIGHTS.includes(part)
          ? <span key={i} className="pim-hl">{part}</span>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}


/* --- Cashbot HQ guide section --- */
function CashbotHQSection({ accent }: { accent: string }) {
  return (
    <div className="pim-hq-section" style={{'--hq-bg': 'url(/icons/promotions/Cashbot/wallpapers/Cashbot_HQ.png)'} as React.CSSProperties}>
      <div className="pim-hq-overlay" />
      <div className="pim-scroll pim-hq-content">

        <div className="pim-section">
          <p className="pim-para">
            <strong>Cashbot HQ (CBHQ)</strong> is the home base of the <span className="pim-hl">Cashbots</span>, unlocked through the <span className="pim-hl">Mezzo Melodyland Taskline</span>. Collect <span className="pim-hl">Cogbucks</span> in the <span className="pim-hl">Cashbot Mints</span> to challenge the <span className="pim-hl">Chief Financial Officer</span> in the Cashbot Vault.
          </p>
        </div>

        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Train Yard</h3>
          <p className="pim-para">A massive outdoor area criss-crossed by four active train tracks. Mint entrances are at the front, middle, and back of the yard — the Vault sits at the far end.</p>
          <ul className="pim-list">
            <li>Levels <strong>5–9</strong> | <span className="pim-hl">Tier 1–8 Cogs</span> | ~21 Cogs active</li>
            <li><strong>92%</strong> Cashbot spawn rate (2% per other department)</li>
            <li>+1x <span className="pim-hl">Gag XP</span> &amp; Merit multiplier</li>
            <li>Trains deal <strong>-10 Laff</strong> on contact — use red cross sections to cross safely</li>
            <li>Use the <span className="pim-hl">Group Tracker</span> to teleport directly to a Mint or the Vault</li>
          </ul>
        </div>

        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Cashbot Mints</h3>
          <p className="pim-para">Three Mint types — <strong>Coin</strong>, <strong>Dollar</strong>, and <strong>Bullion</strong> — vary in length and Cogbuck reward. Complete <strong>2 Coin + 2 Dollar + 1 Bullion</strong> to build your <span className="pim-hl">Cashbot Cog Disguise</span>.</p>
        </div>

        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Cashbot Vault</h3>
          <p className="pim-para">A towering building of black marble at the end of the Train Yard. Inside is the CBHQ Lobby — queue up, take the elevator, and face the <span className="pim-hl">Chief Financial Officer</span>. Requires a completed <span className="pim-hl">Cashbot Cog Disguise</span> to enter.</p>
        </div>

      </div>
    </div>
  );
}

/* Cashbot content — XP table sub-component */
function CashbotXPSection({ accent }: { accent: string }) {
  return (
    <div className="pim-section">
      <h3 className="pim-section-title" style={{color: accent}}>Gaining Department Experience</h3>
      <div className="pim-table-wrap">
        <table className="pim-xp-table">
          <thead><tr><th>Method</th><th>Experience</th></tr></thead>
          <tbody>
            {CB_XP_ROWS.map(r => (
              <tr key={r.source}>
                <td><span className="pim-xp-val"><CBHighlight text={r.source} /></span></td>
                <td><CBHighlight text={r.base} /></td>
                  </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Cashbot content — Ladder tab sub-component */
function CashbotLadderSection({ accent, openDetail }: { accent: string; openDetail: (n:string)=>void }) {
  return (
    <div className="pim-scroll">
      <div className="pim-section">
        <h3 className="pim-section-title" style={{color: accent}}>General Cogs</h3>
        <div className="pim-cog-grid">
          {CB_REGULAR.map(c => {
            const detail = CB_COG_DETAILS.find(d => d.cogName === c.name);
            return (
              <div key={c.name} className="pim-cog-card">
                <div className="pim-cog-img-wrap">
                  <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                </div>
                <div className="pim-cog-info">
                  <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                  <span className="pim-cog-tier">{c.tier}</span>
                  <span className="pim-cog-stat">Levels {c.levels}</span>
                  <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  {detail && (
                    <button
                      className="pim-cog-detail-btn"
                      style={{'--pim-accent': accent} as React.CSSProperties}
                      onClick={() => openDetail(c.name)}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pim-section">
        <h3 className="pim-section-title" style={{color: accent}}>Special Cogs</h3>
        <div className="pim-cog-grid">
          {CB_SPECIAL.map(c => (
            <div key={c.name} className="pim-cog-card">
              <div className="pim-cog-img-wrap">
                <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
              </div>
              <div className="pim-cog-info">
                <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                <span className="pim-cog-tier">{c.tier}</span>
                <span className="pim-cog-stat">Level {c.level}</span>
                <span className="pim-cog-stat">Damage: {c.dmg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pim-section">
        <h3 className="pim-section-title pim-section-title--removed">Removed Cogs</h3>
        <div className="pim-cog-grid">
          {CB_REMOVED.map(c => (
            <div key={c.name} className="pim-cog-card pim-cog-card--removed">
              <div className="pim-cog-img-wrap">
                <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
              </div>
              <div className="pim-cog-info">
                <span className="pim-cog-name pim-cog-name--removed">{c.name}</span>
                <span className="pim-cog-tier">{c.tier}</span>
                <span className="pim-cog-stat">Level {c.level}</span>
                <span className="pim-cog-stat">Damage: {c.dmg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* Cashbot content — main component */
function CashbotContent({ accent }: { accent: string }) {
  const [tab, setTab] = useState<'hq'|'promos'|'ladder'>('hq');
  const [detailCog, setDetailCog] = useState<string|null>(null);
  const openDetail  = (name: string) => setDetailCog(name);
  const closeDetail = () => setDetailCog(null);

  return (
    <div className="pim-inner">
      {detailCog ? (
        <div className="pim-inner-tabs pim-detail-nav">
          <button className="pim-detail-back-btn" style={{'--pim-accent': accent} as React.CSSProperties} onClick={closeDetail}>
            &#8592; Back
          </button>
          <span className="pim-detail-nav-title" style={{color: accent}}>{detailCog}</span>
        </div>
      ) : (
        <div className="pim-inner-tabs">
          {(['hq','promos','ladder'] as const).map(t => (
            <button key={t}
              className={`pim-inner-tab${tab === t ? ' pim-inner-tab--active' : ''}`}
              style={tab === t ? {'--pim-accent': accent} as React.CSSProperties : undefined}
              onClick={() => setTab(t)}>
              {t === 'hq' ? 'Cashbot HQ' : t === 'promos' ? 'Cashbot Promotions' : 'Corporate Ladder'}
            </button>
          ))}
        </div>
      )}

      {detailCog && (() => {
        const detail  = CB_COG_DETAILS.find(d => d.cogName === detailCog);
        const cogCard = CB_REGULAR.find(c => c.name === detailCog);
        if (!detail) return null;
        return (
          <div className="pim-scroll pim-detail-view">
            <div className="pim-detail-view-header">
              {cogCard && (
                <div className="pim-detail-view-img-wrap">
                  <Image src={cogCard.img} alt={cogCard.name} fill className="pim-cog-img" unoptimized />
                </div>
              )}
              <div className="pim-detail-view-meta">
                {cogCard && <span className="pim-cog-tier">{cogCard.tier}</span>}
                {cogCard && <span className="pim-cog-stat">Levels {cogCard.levels}</span>}
                {cogCard && <span className="pim-cog-stat">Damage: {cogCard.dmg}</span>}
              </div>
            </div>
            <CogDetailPanel detail={detail} accent={accent} dept="Cashbot" />
          </div>
        );
      })()}

      {!detailCog && tab === 'hq' && (
        <CashbotHQSection accent={accent} />
      )}

      {!detailCog && tab === 'promos' && (
        <div className="pim-scroll">

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Suit Acquisition</h3>
            <div className="pim-info-block">
              <div className="pim-suit-header">
                <Image src="/icons/cog-emblems/CashbotEmblem.png" alt="Cashbot" width={32} height={32} className="pim-suit-emblem" unoptimized />
                <span className="pim-suit-name" style={{fontWeight:800}}>Cashbot Suit</span>
              </div>
              <p className="pim-para" style={{marginBottom:6}}>
                <CBHighlight text="Defeat the Mint Supervisor to gain 1 Cashbot Suit part. Each Mint rewards different suit parts. 5 parts are needed to complete the disguise." />
              </p>
              <ul className="pim-list">
                <li><CBHighlight text="Complete 2 Coin Mints (rewards leg parts)" /></li>
                <li><CBHighlight text="Complete 2 Dollar Mints (rewards arm parts)" /></li>
                <li><CBHighlight text="Complete 1 Bullion Mint (rewards chest part)" /></li>
              </ul>
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Promotions Overview</h3>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>How promotions work:</p>
              <ul className="pim-list">
                <li><CBHighlight text="Cashbot Promotions begin with the Short Change Suit Cog Disguise after defeating the Mint Supervisor in the Coin, Dollar, and Bullion Cashbot Mints." /></li>
                <li><CBHighlight text="Promotions are earned by defeating the C.F.O. at the Cashbot Vault in Cashbot HQ." /></li>
                <li><CBHighlight text="Cashbot Promotions are separate from the Department Levels." /></li>
                <li><CBHighlight text="The Cashbot equivalent of Merits is called Cogbucks." /></li>
                <li><CBHighlight text="Cogbucks are earned by defeating any Cashbots anywhere in the game." /></li>
                <li><CBHighlight text="Teleport access is earned when a Toon reaches Number Cruncher Level 5." /></li>
                <li><CBHighlight text="A Laff Point is earned at Robber Baron Levels 8, 15, 20, 30, 40, and 50 (6 total)." /></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>Best ways to stack Cogbucks fast:</p>
              <ul className="pim-list">
                <li><CBHighlight text="Completing Cashbot Mints is a quick way to defeat many Cashbots at once." /></li>
                <li><CBHighlight text="Cashbot Cog Buildings also reward Cogbucks, but Cog Invasions do not boost Merits inside buildings." /></li>
                <li><CBHighlight text="Boost earnings with Cogbuck Monday, Cog Invasions, and Boosters." /></li>
              </ul>
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Department Levels</h3>
            <p className="pim-para" style={{marginBottom:10}}>
              <CBHighlight text="Department Levels are separate from Cashbot Promotions and track your overall progress in the Cashbot Department." />
            </p>
            <div className="pim-dept-levels">

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 40%,#0a140a)`}}>
                  Level 10 &mdash; Cashbot Catcher
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><CBHighlight text="Reward: Exclusive Cashbot Catcher outfit (shirt, shorts, and skirt options)" /></li>
                    <li><CBHighlight text="Unlocks access to higher-difficulty Cashbot content" /></li>
                  </ul>
                  <div className="pim-outfit-table-wrap">
                    <table className="pim-outfit-table">
                      <thead>
                        <tr>
                          <th className="pim-outfit-th" style={{color: accent}}>Shirt</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Shorts</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Skirt</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Cashbot/level-rewards/CashbotCatcherShirt.png" alt="Cashbot Catcher Shirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Cashbot/level-rewards/CashbotCatcherShorts.png" alt="Cashbot Catcher Shorts" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Cashbot/level-rewards/CashbotCatcherSkirt.png" alt="Cashbot Catcher Skirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 30%,#0a140a)`}}>
                  Level 20 &mdash; Cashbot Expert
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><CBHighlight text="Reward: 50% of Merits carry over into the next Promotion for that Department." /></li>
                    <li><CBHighlight text="Note: Merits will not carry over if the previous Promotion's Merit requirement exceeds the next." /></li>
                  </ul>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 20%,#0a140a)`}}>
                  Level 30 &mdash; Cashbot Master
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><CBHighlight text="Reward: Boss Rewards — C.F.O. permanently grants +4 Counterfeits." /></li>
                    <li><CBHighlight text="Note: This stacks with Surplus Sunday and Boosters." /></li>
                    <li><CBHighlight text="Note: Unites gained are unaffected by Department Level 30." /></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <CashbotXPSection accent={accent} />

        </div>
      )}

      {!detailCog && tab === 'ladder' && (
        <CashbotLadderSection accent={accent} openDetail={openDetail} />
      )}
    </div>
  );
}

﻿/* --- Lawbot data --- */
const LB_HIGHLIGHTS = [
  'Bottom Feeder Cog Disguise','Chief Legal Officer','Department Experience',
  'Legal Administration','Executive Lawfice','Department Levels','Head Attorney',
  'Lawbot HQ','Laff Points','Laff Point','Lawfice A113','Lawfice B221','Lawfice C418',
  'Teleport access','Lawfice Lobby','Lawfices','Lawfice','Courtyard','Boosters',
  'Big Wig','Lawbots','Lawbot','Patents','Patent','O.C.L.O.','C.L.O.',
];
function LBHighlight({ text }: { text: string }) {
  const escaped = LB_HIGHLIGHTS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return (<>{parts.map((part, i) => LB_HIGHLIGHTS.includes(part) ? <span key={i} className="pim-hl">{part}</span> : <span key={i}>{part}</span>)}</>);
}
const LB_REGULAR = [
  { name:'Bottom Feeder',    tier:'Tier 1 Employee', levels:'1-5',  dmg:'2-12',  img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-BottomFeederGalv2.gif' },
  { name:'Bloodsucker',      tier:'Tier 2 Employee', levels:'2-6',  dmg:'2-14',  img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-BloodsuckerGalv2.gif' },
  { name:'Double Talker',    tier:'Tier 3 Employee', levels:'3-7',  dmg:'2-14',  img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-DoubleTalkerGal.gif' },
  { name:'Ambulance Chaser', tier:'Tier 4 Employee', levels:'4-8',  dmg:'3-18',  img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-AmbulanceChaserGal.gif' },
  { name:'Back Stabber',     tier:'Tier 5 Employee', levels:'5-9',  dmg:'5-22',  img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-BackstabberGal.gif' },
  { name:'Spin Doctor',      tier:'Tier 6 Employee', levels:'6-10', dmg:'6-24',  img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-SpindoctorGal.gif' },
  { name:'Legal Eagle',      tier:'Tier 7 Employee', levels:'7-11', dmg:'7-30',  img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-Legal_Eagle_Gal.gif' },
  { name:'Big Wig',          tier:'Tier 8 Employee', levels:'8-50', dmg:'10-56', img:'/icons/promotions/Lawbot/corporate-ladder/regular/300px-BigwigGal.gif' },
];
const LB_SPECIAL = [
  { name:'Head Attorney',       tier:'Manager',          level:'14 (mgr)', dmg:'18-30',  img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-HeadAttorneyGal.gif' },
  { name:'Litigator',           tier:'Manager',          level:'8 (mgr)',  dmg:'12-20',  img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-LitigatorGal.gif' },
  { name:'Stenographer',        tier:'Manager',          level:'7 (mgr)',  dmg:'6-16',   img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-StenographerGal.gif' },
  { name:'Case Manager',        tier:'Regional Manager', level:'11 (mgr)', dmg:'12-22',  img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-Case_Manager_Gal.gif' },
  { name:'Scapegoat',           tier:'Regional Manager', level:'13 (mgr)', dmg:'10-20',  img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-ScapegoatGal.gif' },
  { name:'Counterclaim',        tier:'Regional Manager', level:'28 (mgr)', dmg:'20-32',  img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-CountErclaimGal.gif' },
  { name:'Judy',                tier:'Secretary',        level:'28 (mgr)', dmg:'N/A',    img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-JudyGal.gif' },
  { name:'Mouthpiece',          tier:'Special',          level:'Varies',   dmg:'Varies', img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-Mouthpiece_CG.gif' },
  { name:'Rainmaker',           tier:'Special',          level:'Varies',   dmg:'Varies', img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-Rainmaker_CG.gif' },
  { name:'Witch Hunter',        tier:'Special',          level:'Varies',   dmg:'Varies', img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-Witchhunter_CG.gif' },
  { name:'Chief Legal Officer', tier:'Boss',             level:'C.L.O.',   dmg:'Varies', img:'/icons/promotions/Lawbot/corporate-ladder/special/300px-CLOGal.gif' },
];
const LB_REMOVED = [
  { name:'Chief Justice', tier:'Removed Boss',    level:'Removed', dmg:'N/A', img:'/icons/promotions/Lawbot/corporate-ladder/removed/300px-CJCogGalleryNOTREAL.gif' },
  { name:'Clerk',         tier:'Removed NPC',     level:'Removed', dmg:'N/A', img:'/icons/promotions/Lawbot/corporate-ladder/removed/300px-ClerkCogGalleryNOTREAL.gif' },
  { name:'Redd',          tier:'Removed Special', level:'Removed', dmg:'N/A', img:'/icons/promotions/Lawbot/corporate-ladder/removed/300px-ReddCogGalleryNOTREAL.gif' },
  { name:'S.A.D.S.',      tier:'Removed Special', level:'Removed', dmg:'N/A', img:'/icons/promotions/Lawbot/corporate-ladder/removed/300px-SadsGal.gif' },
  { name:'W.S.I.',        tier:'Removed Special', level:'Removed', dmg:'N/A', img:'/icons/promotions/Lawbot/corporate-ladder/removed/300px-WSICogGalleryNOTREAL.gif' },
];
const LB_XP_ROWS = [
  { source:'Destroying a level 1-5 Cog (Cannon Round)',       base:'+12 XP' },
  { source:'Destroying a level 6-10 Cog (Cannon Round)',      base:'+16 XP' },
  { source:'Destroying a level 11-15 Cog (Cannon Round)',     base:'+24 XP' },
  { source:'Destroying a level 1-5 Executive Cog',            base:'+80 XP' },
  { source:'Destroying a level 6-10 Executive Cog',           base:'+100 XP' },
  { source:'Destroying a level 11-15 Executive Cog',          base:'+160 XP' },
  { source:'Cog destroyed after full Sound bar',              base:'+100 XP' },
  { source:'Damaging the C.L.O. (Final Round)',               base:'Damage dealt x1.5' },
  { source:'Teammate stuns the C.L.O.',                       base:'+79 XP (depreciates each stun)' },
  { source:'You stun the C.L.O.',                             base:'+156 XP (depreciates each stun)' },
  { source:'Destroying a Cog (Final Round)',                  base:"Cog's level x8 (depreciates)" },
  { source:'Destroying an exe Cog breaking a trap',           base:"Cog's level x30* (depreciates)" },
  { source:'Destroying a Pettifogger shield',                 base:'+54 XP (depreciates each kill)' },
  { source:'Destroying a Conveyancer shield',                 base:'+61 XP (depreciates each kill)' },
  { source:'Destroying an Advocate shield',                   base:'+113 XP (depreciates each kill)' },
];
const LB_EXEC_ROWS = [
  { from:'Big Wig',                cogHead:'/icons/promotions/Lawbot/25px-BigWigHead.webp',      cogLevels:'50 → 2.exe', oclos:'1',     directive:'Report Roundup',       unlockedAt:'Big Wig Lvl 8',         rewardIcons:[{img:'/icons/promotions/Lawbot/25px-ExecutiveLobbyKey.webp',alt:'Key'}],                               rewardText:'Executive Lobby Key' },
  { from:'Pettifogger',            cogHead:'/icons/promotions/Lawbot/25px-PettifoggerHead.webp', cogLevels:'2-7.exe',       oclos:'5',     directive:'Crossword Crisis',     unlockedAt:'Pettifogger Lvl 7.exe', rewardIcons:[{img:'/icons/promotions/Lawbot/25px-ExecutiveCogDisguise.webp',alt:'Suit'}],                             rewardText:'Executive Suit Promotion, R.I.D.D.L.E Background' },
  { from:'Needlenose',             cogHead:'/icons/promotions/Lawbot/25px-NeedlenoseHead.webp',  cogLevels:'3-10.exe',      oclos:'7',     directive:'Needle Nonsense',      unlockedAt:'Needlenose Lvl 10.exe', rewardIcons:[{img:'/icons/promotions/Lawbot/25px-ExecutiveCogDisguise.webp',alt:'Suit'},{img:'/icons/promotions/25px-+1.webp',alt:'+1'}],    rewardText:'Executive Suit Promotion, A +1 Laff Boost' },
  { from:'Conveyancer',            cogHead:'/icons/promotions/Lawbot/25px-ConveyancerHead.webp', cogLevels:'4-8.exe',       oclos:'4',     directive:'Temperature Troubles', unlockedAt:'Conveyancer Lvl 8.exe', rewardIcons:[{img:'/icons/promotions/Lawbot/25px-ExecutiveCogDisguise.webp',alt:'Suit'}],                             rewardText:'Executive Suit Promotion, Megaphone Profile Pose' },
  { from:'Advocate',               cogHead:'/icons/promotions/Lawbot/25px-AdvocateHead.webp',    cogLevels:'5-15.exe',      oclos:'10',    directive:'Docket Dilemma',       unlockedAt:'Advocate Lvl 15.exe',   rewardIcons:[{img:'/icons/promotions/Lawbot/25px-ExecutiveCogDisguise.webp',alt:'Suit'},{img:'/icons/promotions/25px-+1.webp',alt:'+1'}],    rewardText:'Executive Suit Promotion, A +1 Laff Boost' },
  { from:'Shyster',                cogHead:'/icons/promotions/Lawbot/25px-ShysterHead.webp',     cogLevels:'6-12.exe',      oclos:'6',     directive:'Memo Mishap',          unlockedAt:'Shyster Lvl 12.exe',    rewardIcons:[{img:'/icons/promotions/Lawbot/25px-ExecutiveCogDisguise.webp',alt:'Suit'}],                             rewardText:'Executive Suit Promotion, Crocheting Nameplate' },
  { from:'Barrister',              cogHead:'/icons/promotions/Lawbot/25px-BarristerHead.webp',   cogLevels:'7-15.exe',      oclos:'7(+2)', directive:'Fashion Fiasco',       unlockedAt:'Barrister Lvl 14.exe',  rewardIcons:[{img:'/icons/promotions/25px-+1.webp',alt:'+1'}],                                rewardText:'A +1 Laff Boost, Lawbot Disguise Picker' },
];

﻿/* --- Lawbot HQ guide section --- */
function LawbotHQSection({ accent }: { accent: string }) {
  return (
    <div className="pim-hq-section" style={{"--hq-bg": "url(/icons/promotions/Lawbot/wallpapers/LawbotHQ.png)"} as React.CSSProperties}>
      <div className="pim-hq-overlay" />
      <div className="pim-scroll pim-hq-content">
        <div className="pim-section">
          <p className="pim-para">
            <strong>Lawbot HQ (LBHQ)</strong> is the home base of the <span className="pim-hl">Lawbots</span>, unlocked through the <span className="pim-hl">Brrrgh Taskline</span>. Collect <span className="pim-hl">Patents</span> in the <span className="pim-hl">Lawfices</span> to challenge the <span className="pim-hl">Chief Legal Officer</span> in the Executive Lawfice.
          </p>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Courtyard</h3>
          <p className="pim-para">A stone-walled courtyard with a central oil fountain. The Lawfice Lobby is on the left; the Legal Administration Foyer at the far end.</p>
          <ul className="pim-list">
            <li>Levels <strong>5-10</strong> | <span className="pim-hl">Tier 1-7 Cogs</span> | ~10 Cogs active</li>
            <li><strong>92%</strong> Lawbot spawn rate (2% per other department)</li>
            <li>+1x <span className="pim-hl">Gag XP</span> &amp; Merit multiplier</li>
            <li>Oil fountain deals <strong>-15 Laff</strong> on contact; staying deals -15 every 5 seconds</li>
          </ul>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Lawfice Lobby</h3>
          <p className="pim-para">Houses the three Lawfice entrances: <strong>A113</strong>, <strong>B221</strong>, and <strong>C418</strong>. Complete <strong>2 A113 + 2 B221 + 1 C418</strong> to earn your <span className="pim-hl">Lawbot Cog Disguise</span>. Legal Documents rain down continuously.</p>
          <ul className="pim-list">
            <li>Levels <strong>7-10</strong> | <span className="pim-hl">Tier 3-8 Cogs</span> | ~9 Cogs active</li>
            <li>Lawbot-only spawns</li>
            <li>+1x <span className="pim-hl">Gag XP</span> &amp; Merit multiplier</li>
          </ul>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Legal Administration Foyer</h3>
          <p className="pim-para">At the far end of the Courtyard — statues, spotlights, and golden floors. <span className="pim-hl">Lawbot Secretary Judy</span> resides inside. Requires a completed <span className="pim-hl">Lawbot Cog Disguise</span> to enter the elevator and battle the <span className="pim-hl">C.L.O.</span></p>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color: accent}}>Legal Administration Lounge</h3>
          <p className="pim-para">A separate elevator leads to the <span className="pim-hl">O.C.L.O.</span> (Overclocked C.L.O.) battle. Requires at least a Level 8 Big Wig disguise and completion of the <strong>Report Roundup Directive</strong> from Judy to unlock.</p>
        </div>
      </div>
    </div>
  );
}
function LawbotXPSection({ accent }: { accent: string }) {
  return (
    <div className="pim-section">
      <h3 className="pim-section-title" style={{color: accent}}>Gaining Department Experience</h3>
      <div className="pim-table-wrap">
        <table className="pim-xp-table">
          <colgroup><col style={{width:'75%'}} /><col style={{width:'25%'}} /></colgroup>
          <thead><tr><th>Method</th><th>XP</th></tr></thead>
          <tbody>
            <tr><td colSpan={2} style={{background:'rgba(255,255,255,.06)',fontWeight:800,fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',padding:'6px 12px',color:'rgba(255,255,255,.5)'}}>Cannon Round</td></tr>
            {LB_XP_ROWS.slice(0,7).map(r=>(<tr key={r.source}><td><span className="pim-xp-val">{r.source}</span></td><td>{r.base}</td></tr>))}
            <tr><td colSpan={2} style={{background:'rgba(255,255,255,.06)',fontWeight:800,fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',padding:'6px 12px',color:'rgba(255,255,255,.5)'}}>C.L.O. Final Round</td></tr>
            {LB_XP_ROWS.slice(7).map(r=>(<tr key={r.source}><td><span className="pim-xp-val">{r.source}</span></td><td>{r.base}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function LawbotLadderSection({ accent }: { accent: string; openDetail?: (n:string)=>void }) {
  return (
    <div className="pim-scroll">
      <div className="pim-section">
        <h3 className="pim-section-title" style={{color: accent}}>General Cogs</h3>
        <div className="pim-cog-grid">
          {LB_REGULAR.map(c => (<div key={c.name} className="pim-cog-card"><div className="pim-cog-img-wrap"><Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized /></div><div className="pim-cog-info"><span className="pim-cog-name" style={{color:accent}}>{c.name}</span><span className="pim-cog-tier">{c.tier}</span><span className="pim-cog-stat">Levels {c.levels}</span><span className="pim-cog-stat">Damage: {c.dmg}</span></div></div>))}
        </div>
      </div>
      <div className="pim-section">
        <h3 className="pim-section-title" style={{color: accent}}>Special Cogs</h3>
        <div className="pim-cog-grid">
          {LB_SPECIAL.map(c => (<div key={c.name} className="pim-cog-card"><div className="pim-cog-img-wrap"><Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized /></div><div className="pim-cog-info"><span className="pim-cog-name" style={{color:accent}}>{c.name}</span><span className="pim-cog-tier">{c.tier}</span><span className="pim-cog-stat">Level {c.level}</span><span className="pim-cog-stat">Damage: {c.dmg}</span></div></div>))}
        </div>
      </div>
      <div className="pim-section">
        <h3 className="pim-section-title pim-section-title--removed">Removed Cogs</h3>
        <div className="pim-cog-grid">
          {LB_REMOVED.map(c => (<div key={c.name} className="pim-cog-card pim-cog-card--removed"><div className="pim-cog-img-wrap"><Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized /></div><div className="pim-cog-info"><span className="pim-cog-name pim-cog-name--removed">{c.name}</span><span className="pim-cog-tier">{c.tier}</span><span className="pim-cog-stat">Level {c.level}</span><span className="pim-cog-stat">Damage: {c.dmg}</span></div></div>))}
        </div>
      </div>
    </div>
  );
}

﻿/* Lawbot content */
function LawbotContent({ accent }: { accent: string }) {
  const [tab, setTab] = useState<'hq'|'promos'|'ladder'>('hq');
  return (
    <div className="pim-inner">
      <div className="pim-inner-tabs">
        {(['hq','promos','ladder'] as const).map(t => (
          <button key={t} className={`pim-inner-tab${tab===t?' pim-inner-tab--active':''}`} style={tab===t?{'--pim-accent':accent} as React.CSSProperties:undefined} onClick={()=>setTab(t)}>
            {t==='hq'?'Lawbot HQ':t==='promos'?'Lawbot Promotions':'Corporate Ladder'}
          </button>
        ))}
      </div>
      {tab==='hq' && <LawbotHQSection accent={accent} />}
      {tab==='promos' && (
        <div className="pim-scroll">
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Suit Acquisition</h3>
            <div className="pim-info-block">
              <div className="pim-suit-header">
                <Image src="/icons/cog-emblems/LawbotEmblem.png" alt="Lawbot" width={32} height={32} className="pim-suit-emblem" unoptimized />
                <span className="pim-suit-name" style={{fontWeight:800}}>Lawbot Suit</span>
              </div>
              <p className="pim-para" style={{marginBottom:6}}>Defeat the <span className="pim-hl">Head Attorney</span> to gain 1 Lawbot Suit part. Each <span className="pim-hl">Lawfice</span> rewards different Suit parts. 5 parts are needed to complete the disguise.</p>
              <ul className="pim-list">
                <li>Complete <strong>2 Lawfice A113s</strong> (<em>rewards leg parts</em>)</li>
                <li>Complete <strong>2 Lawfice B221s</strong> (<em>rewards arm parts</em>)</li>
                <li>Complete <strong>1 Lawfice C418</strong> (<em>rewards chest part</em>)</li>
              </ul>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Promotions Overview</h3>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom:4}}>How promotions work:</p>
              <ul className="pim-list">
                <li><LBHighlight text="Lawbot Promotions begin with the Bottom Feeder Cog Disguise after defeating the Head Attorney in the Lawfices." /></li>
                <li><LBHighlight text="Promotions are earned by defeating the Chief Legal Officer in the Executive Lawfice in Lawbot HQ." /></li>
                <li><LBHighlight text="Lawbot Promotions are separate from Department Levels." /></li>
                <li><LBHighlight text="Lawbot Merits are called Patents and can be earned by defeating any Lawbots." /></li>
                <li><LBHighlight text="Toons must have a certain amount of Patents before entering the Executive Lawfice." /></li>
                <li><LBHighlight text="Teleport access is earned when a Toon reaches Back Stabber Level 5." /></li>
                <li><LBHighlight text="A Laff Point is earned at Big Wig Levels 8, 15, 20, 30, 40, and 50 -- totaling 6 additional Laff Points." /></li>
              </ul>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Executive Lawbot Disguise</h3>
            <div className="pim-info-block">
              <p className="pim-para">Executive Disguises are used in <span className="pim-hl">O.C.L.O.</span> (Overclocked Boss) progression.</p>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom:4}}>Obtaining an Executive Disguise:</p>
              <ul className="pim-list">
                <li>Reach <span className="pim-hl">Big Wig</span> disguise and speak with <strong>Judy</strong> to receive the first <strong>Report Roundup Directive</strong>.</li>
                <li>Completing the directive unlocks the <strong>Legal Administration Lounge</strong> key and access to the <span className="pim-hl">O.C.L.O.</span></li>
                <li>Defeating the <span className="pim-hl">O.C.L.O.</span> as a Level 50 <span className="pim-hl">Big Wig</span> promotes to the <strong>Executive Pettifogger Disguise</strong>.</li>
                <li>If defeated below Level 50 <span className="pim-hl">Big Wig</span>, it counts as a standard promotion with <strong>50% Merit carryover</strong> (stacks with Dept Level 20 Boost).</li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom:4}}>Executive Disguise Rewards:</p>
              <ul className="pim-list">
                <li>A +1 Laff Point boost is earned after completing the Directives for <span className="pim-hl">Needlenose</span> Lvl 10, <span className="pim-hl">Advocate</span> Lvl 15, and <span className="pim-hl">Barrister</span> Lvl 14 (3 total).</li>
                <li>At <strong>Level 15.exe Barrister</strong>, change the Executive Cog Disguise to any Employee or Specialist Lawbot Suit from the Shtickerbook. Status becomes &quot;Maxed.exe&quot;.</li>
              </ul>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Executive Promotions Table</h3>
            <div className="pim-table-wrap pim-exec-table-wrap">
              <table className="pim-xp-table pim-exec-table">
                <thead><tr><th>Suit Progression</th><th>Cog Levels</th><th>OCLOs Needed</th><th>Directive</th><th>Unlocked At</th><th>Directive Reward</th></tr></thead>
                <tbody>{LB_EXEC_ROWS.map(r=>(
                  <tr key={r.from}>
                    <td style={{whiteSpace:'nowrap'}}>
                      {r.cogHead && <Image src={r.cogHead} alt={r.from} width={20} height={20} style={{verticalAlign:'middle',marginRight:6}} unoptimized />}
                      <strong>{r.from}</strong>
                    </td>
                    <td>{r.cogLevels}</td>
                    <td style={{textAlign:'center'}}>{r.oclos}</td>
                    <td><span className="pim-hl">{r.directive}</span></td>
                    <td style={{whiteSpace:'nowrap'}}>{r.unlockedAt}</td>
                    <td><span style={{display:'flex',flexDirection:'row',alignItems:'center',gap:5,flexWrap:'wrap'}}>{r.rewardIcons.map((ic,i)=>(<Image key={i} src={ic.img} alt={ic.alt} width={18} height={18} style={{flexShrink:0,verticalAlign:'middle'}} unoptimized />))}<span style={{fontSize:'12px'}}>{r.rewardText}</span></span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Department Levels</h3>
            <p className="pim-section-sub">Department Levels are separate from Promotions. Earn Dept XP by defeating <span className="pim-hl">Lawbots</span> anywhere.</p>
            <div className="pim-dept-levels">
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:`color-mix(in srgb,${accent} 40%,#0a0a1a)`}}>Level 10 &mdash; Lawbot Liberator</div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list"><li>Reward: Exclusive Lawbot Liberator outfit (shirt, shorts, and skirt options)</li></ul>
                  <div className="pim-outfit-table-wrap"><table className="pim-outfit-table"><thead><tr><th className="pim-outfit-th" style={{color:accent}}>Shirt</th><th className="pim-outfit-th" style={{color:accent}}>Shorts</th><th className="pim-outfit-th" style={{color:accent}}>Skirt</th></tr></thead><tbody><tr><td className="pim-outfit-img-cell"><Image src="/icons/promotions/Lawbot/level-rewards/LawbotLiberatorShirt.png" alt="Lawbot Liberator Shirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized /></td><td className="pim-outfit-img-cell"><Image src="/icons/promotions/Lawbot/level-rewards/LawbotLiberatorShorts.png" alt="Lawbot Liberator Shorts" width={80} height={80} style={{objectFit:'contain'}} unoptimized /></td><td className="pim-outfit-img-cell"><Image src="/icons/promotions/Lawbot/level-rewards/LawbotLiberatorSkirt.png" alt="Lawbot Liberator Skirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized /></td></tr></tbody></table></div>
                </div>
              </div>
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:`color-mix(in srgb,${accent} 30%,#0a0a1a)`}}>Level 20 &mdash; Lawbot Expert</div>
                <div className="pim-dept-level-body"><ul className="pim-list"><li>Reward: 50% of Merits carry over into the next Promotion for that Department.</li><li>Note: Merits will not carry over if the previous Merit requirement exceeds the next.</li></ul></div>
              </div>
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:`color-mix(in srgb,${accent} 20%,#0a0a1a)`}}>Level 30 &mdash; Lawbot Master</div>
                <div className="pim-dept-level-body"><ul className="pim-list"><li>Reward: Boss Rewards -- <span className="pim-hl">C.L.O.</span>/<span className="pim-hl">O.C.L.O.</span> permanently grants +2 Cease &amp; Desists.</li><li>Note: This stacks with Surplus Sunday and Boosters.</li><li>Note: Unites gained are unaffected by Department Level 30.</li></ul></div>
              </div>
            </div>
          </div>
          <LawbotXPSection accent={accent} />
        </div>
      )}
      {tab==='ladder' && <LawbotLadderSection accent={accent} />}
    </div>
  );
}

﻿/* --- Bossbot data --- */
const BB_HIGHLIGHTS = [
  'Flunky Cog Disguise','Chief Executive Officer','Department Experience',
  'Cog Golf Courses','Department Levels','Diamond Dynamo','Silver Sprocket',
  'Club President','Golden Gear','Bossbot HQ','Laff Points','Laff Point',
  'Teleport access','Country Club','The Clubhouse','Big Cheese','Downsizer',
  'Boosters','Bossbots','Bossbot','Stock Options','C.E.O.',
];
function BBHighlight({ text }: { text: string }) {
  const escaped = BB_HIGHLIGHTS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return (<>{parts.map((part, i) => BB_HIGHLIGHTS.includes(part) ? <span key={i} className="pim-hl">{part}</span> : <span key={i}>{part}</span>)}</>);
}
const BB_REGULAR = [
  { name:'Flunky',           tier:'Tier 1 Employee', levels:'1-5',  dmg:'2-12',  img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Flunky_CG.gif' },
  { name:'Pencil Pusher',    tier:'Tier 2 Employee', levels:'2-6',  dmg:'2-12',  img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Pencilpusher_CG.gif' },
  { name:'Yesman',           tier:'Tier 3 Employee', levels:'3-7',  dmg:'2-16',  img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Yesman_CG.gif' },
  { name:'Micromanager',     tier:'Tier 4 Employee', levels:'4-8',  dmg:'3-18',  img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Micromanager_CG.gif' },
  { name:'Downsizer',        tier:'Tier 5 Employee', levels:'5-9',  dmg:'4-22',  img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Downsizer_CG.gif' },
  { name:'Head Hunter',      tier:'Tier 6 Employee', levels:'6-11', dmg:'6-24',  img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Headhunter_CG.gif' },
  { name:'Corporate Raider', tier:'Tier 7 Employee', levels:'7-12', dmg:'8-28',  img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Corporateraider_CG.gif' },
  { name:'Big Cheese',       tier:'Tier 8 Employee', levels:'8-50', dmg:'12-60', img:'/icons/promotions/Bossbot/corporate-ladder/regular/300px-Bigcheese_CG.gif' },
];
const BB_SPECIAL = [
  { name:'Club President',          tier:'Manager',          level:'14 (mgr)', dmg:'18-30',  img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-ClubPresident2.gif' },
  { name:'Autocaddie',              tier:'Regional Manager', level:'6 (mgr)',  dmg:'4-10',   img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-Autocaddie_CG.gif' },
  { name:'Featherbedder',           tier:'Regional Manager', level:'8 (mgr)',  dmg:'6-14',   img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-Featherbedder_CG.gif' },
  { name:'Major Player',            tier:'Regional Manager', level:'32 (mgr)', dmg:'24-38',  img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-Majorplayer_CG.gif' },
  { name:'Derrick Man',             tier:'Regional Manager', level:'16 (mgr)', dmg:'14-24',  img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-Derrickman_CG.gif' },
  { name:'Derrick Hand',            tier:'Regional Manager', level:'20 (mgr)', dmg:'16-28',  img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-Derrickhand_CG.gif' },
  { name:'Firestarter',             tier:'Special',          level:'Varies',   dmg:'Varies', img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-Firestarter_CG.gif' },
  { name:'Chainsaw Consultant',     tier:'Special',          level:'Varies',   dmg:'Varies', img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-Chainsawconsultant_CG.gif' },
  { name:'Chief Executive Officer', tier:'Boss',             level:'C.E.O.',   dmg:'Varies', img:'/icons/promotions/Bossbot/corporate-ladder/special/300px-CEOGif.gif' },
];
const BB_XP_ROWS = [
  { source:'Cog explodes in Feeding Round',             base:'+20 XP' },
  { source:'3-18 Damage Seltzer',                       base:'+15-90 XP (5x the damage dealt)' },
  { source:'Teammate stuns the C.E.O.',                 base:'+100 XP (depreciates each stun)' },
  { source:'You stun the C.E.O.',                       base:'+190 XP (depreciates each stun)' },
  { source:'Hitting C.E.O. with golf ball (low power)', base:'+32 XP' },
  { source:'Hitting C.E.O. with golf ball (mid power)', base:'+64 XP' },
  { source:'Hitting C.E.O. with golf ball (high power)',base:'+96 XP' },
];

﻿/* --- Bossbot HQ guide section --- */
function BossbotHQSection({ accent }: { accent: string }) {
  return (
    <div className="pim-hq-section" style={{"--hq-bg":"url(/icons/promotions/Bossbot/wallpapers/BossbotHQ.png)"} as React.CSSProperties}>
      <div className="pim-hq-overlay" />
      <div className="pim-scroll pim-hq-content">
        <div className="pim-section">
          <p className="pim-para"><strong>Bossbot HQ (BBHQ)</strong> is the home base of the <span className="pim-hl">Bossbots</span>, unlocked through the <span className="pim-hl">Acorn Acres Taskline</span>. Collect <span className="pim-hl">Stock Options</span> in the <span className="pim-hl">Cog Golf Courses</span> to challenge the <span className="pim-hl">Chief Executive Officer</span> inside <span className="pim-hl">The Clubhouse</span>.</p>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color:accent}}>Country Club</h3>
          <p className="pim-para">The outdoor area of BBHQ -- large hedges, dead trees, and a gloomy overcast sky. Golf Course entrances are scattered across the grounds. The Clubhouse sits at the far end.</p>
          <ul className="pim-list">
            <li>Levels <strong>5-11</strong> | <span className="pim-hl">Tier 1-8 Cogs</span> | ~10 Cogs active</li>
            <li><strong>92%</strong> Bossbot spawn rate (2% per other department)</li>
            <li>+1x <span className="pim-hl">Gag XP</span> &amp; Merit multiplier</li>
          </ul>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color:accent}}>Cog Golf Courses</h3>
          <p className="pim-para">Three types: <strong>Silver Sprocket</strong>, <strong>Golden Gear</strong>, and <strong>Diamond Dynamo</strong> -- each varies in difficulty, length, and <span className="pim-hl">Stock Options</span> rewarded. Complete <strong>2 Silver Sprockets + 2 Golden Gears + 1 Diamond Dynamo</strong> to build your <span className="pim-hl">Bossbot Cog Disguise</span>.</p>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color:accent}}>The Clubhouse</h3>
          <p className="pim-para">A large, dark castle at the far end of the <span className="pim-hl">Country Club</span>. Enter the Clubhouse Foyer to queue up, ride the elevator, and battle the <span className="pim-hl">Chief Executive Officer</span>. Requires a completed <span className="pim-hl">Bossbot Cog Disguise</span> to enter.</p>
        </div>
        <div className="pim-section">
          <h3 className="pim-section-title" style={{color:accent}}>The C.E.O.&#39;s Office</h3>
          <p className="pim-para">A spiral staircase on the right side of the Clubhouse Foyer leads to the <span className="pim-hl">C.E.O.</span>&#39;s Office where The Directors fight takes place. Requires completing the &quot;The Final Battle. For Now.&quot; task in the Drowsy Dreamland Taskline.</p>
        </div>
      </div>
    </div>
  );
}
function BossbotXPSection({ accent }: { accent: string }) {
  return (
    <div className="pim-section">
      <h3 className="pim-section-title" style={{color:accent}}>Gaining Department Experience</h3>
      <div className="pim-table-wrap">
        <table className="pim-xp-table">
          <thead><tr><th>Method</th><th>Experience</th></tr></thead>
          <tbody>{BB_XP_ROWS.map(r=>(<tr key={r.source}><td><span className="pim-xp-val">{r.source}</span></td><td>{r.base}</td></tr>))}</tbody>
        </table>
      </div>
      <p className="pim-detail-note" style={{marginTop:6}}><em>Note: The player will gain experience for any Cog destroyed in the feeding round, including those destroyed by other players.</em></p>
    </div>
  );
}
function BossbotLadderSection({ accent }: { accent: string }) {
  return (
    <div className="pim-scroll">
      <div className="pim-section">
        <h3 className="pim-section-title" style={{color:accent}}>General Cogs</h3>
        <div className="pim-cog-grid">
          {BB_REGULAR.map(c=>(<div key={c.name} className="pim-cog-card"><div className="pim-cog-img-wrap"><Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized /></div><div className="pim-cog-info"><span className="pim-cog-name" style={{color:accent}}>{c.name}</span><span className="pim-cog-tier">{c.tier}</span><span className="pim-cog-stat">Levels {c.levels}</span><span className="pim-cog-stat">Damage: {c.dmg}</span></div></div>))}
        </div>
      </div>
      <div className="pim-section">
        <h3 className="pim-section-title" style={{color:accent}}>Special Cogs</h3>
        <div className="pim-cog-grid">
          {BB_SPECIAL.map(c=>(<div key={c.name} className="pim-cog-card"><div className="pim-cog-img-wrap"><Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized /></div><div className="pim-cog-info"><span className="pim-cog-name" style={{color:accent}}>{c.name}</span><span className="pim-cog-tier">{c.tier}</span><span className="pim-cog-stat">Level {c.level}</span><span className="pim-cog-stat">Damage: {c.dmg}</span></div></div>))}
        </div>
      </div>
    </div>
  );
}
function BossbotContent({ accent }: { accent: string }) {
  const [tab, setTab] = useState<'hq'|'promos'|'ladder'>('hq');
  return (
    <div className="pim-inner">
      <div className="pim-inner-tabs">
        {(['hq','promos','ladder'] as const).map(t=>(
          <button key={t} className={`pim-inner-tab${tab===t?' pim-inner-tab--active':''}`} style={tab===t?{'--pim-accent':accent} as React.CSSProperties:undefined} onClick={()=>setTab(t)}>
            {t==='hq'?'Bossbot HQ':t==='promos'?'Bossbot Promotions':'Corporate Ladder'}
          </button>
        ))}
      </div>
      {tab==='hq' && <BossbotHQSection accent={accent} />}
      {tab==='promos' && (
        <div className="pim-scroll">
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Suit Acquisition</h3>
            <div className="pim-info-block">
              <div className="pim-suit-header">
                <Image src="/icons/cog-emblems/BossbotEmblem.png" alt="Bossbot" width={32} height={32} className="pim-suit-emblem" unoptimized />
                <span className="pim-suit-name" style={{fontWeight:800}}>Bossbot Suit</span>
              </div>
              <p className="pim-para" style={{marginBottom:6}}>Defeat the <span className="pim-hl">Club President</span> to gain 1 Bossbot Suit part. Each <span className="pim-hl">Cog Golf Courses</span> rewards different Suit parts. 5 parts are needed.</p>
              <ul className="pim-list">
                <li>Complete <strong>2 Silver Sprockets</strong> (<em>rewards leg parts</em>)</li>
                <li>Complete <strong>2 Golden Gears</strong> (<em>rewards arm parts</em>)</li>
                <li>Complete <strong>1 Diamond Dynamo</strong> (<em>rewards chest part</em>)</li>
              </ul>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Promotions Overview</h3>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom:4}}>How promotions work:</p>
              <ul className="pim-list">
                <li><BBHighlight text="Bossbot Promotions begin with the Flunky Cog Disguise after defeating the Club President in the Silver Sprocket, Golden Gear, and Diamond Dynamo Cog Golf Courses." /></li>
                <li><BBHighlight text="Promotions are earned by defeating the Chief Executive Officer inside the Bossbot Clubhouse in Bossbot HQ." /></li>
                <li><BBHighlight text="Bossbot Promotions are separate from the Department Levels." /></li>
                <li><BBHighlight text="Bossbot Merits are called Stock Options and can be earned by defeating any Bossbots." /></li>
                <li><BBHighlight text="Toons must have a certain amount of Stock Options before entering the Bossbot Clubhouse." /></li>
                <li><BBHighlight text="Teleport access is earned when a Toon reaches Downsizer Level 5." /></li>
                <li><BBHighlight text="A Laff Point is earned at Big Cheese Levels 8, 15, 20, 30, 40, and 50 -- totaling 6 additional Laff Points." /></li>
              </ul>
            </div>
          </div>
          <div className="pim-section">
            <h3 className="pim-section-title" style={{color:accent}}>Department Levels</h3>
            <p className="pim-section-sub">Department Levels are separate from Promotions. Earn Dept XP by defeating <span className="pim-hl">Bossbots</span> anywhere.</p>
            <div className="pim-dept-levels">
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:`color-mix(in srgb,${accent} 40%,#100a04)`}}>Level 10 &mdash; Bossbot Basher</div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list"><li>Reward: Exclusive Bossbot Basher outfit (shirt, shorts, and skirt options)</li></ul>
                  <div className="pim-outfit-table-wrap"><table className="pim-outfit-table"><thead><tr><th className="pim-outfit-th" style={{color:accent}}>Shirt</th><th className="pim-outfit-th" style={{color:accent}}>Shorts</th><th className="pim-outfit-th" style={{color:accent}}>Skirt</th></tr></thead><tbody><tr><td className="pim-outfit-img-cell"><Image src="/icons/promotions/Bossbot/level-rewards/BossbotBasherShirt.png" alt="Bossbot Basher Shirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized /></td><td className="pim-outfit-img-cell"><Image src="/icons/promotions/Bossbot/level-rewards/BossbotBasherShorts.png" alt="Bossbot Basher Shorts" width={80} height={80} style={{objectFit:'contain'}} unoptimized /></td><td className="pim-outfit-img-cell"><Image src="/icons/promotions/Bossbot/level-rewards/BossbotBasherSkirt.png" alt="Bossbot Basher Skirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized /></td></tr></tbody></table></div>
                </div>
              </div>
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:`color-mix(in srgb,${accent} 30%,#100a04)`}}>Level 20 &mdash; Bossbot Expert</div>
                <div className="pim-dept-level-body"><ul className="pim-list"><li>Reward: 50% of Merits carry over into the next Promotion for that Department.</li><li>Note: Merits will not carry over if the previous Merit requirement exceeds the next.</li></ul></div>
              </div>
              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background:`color-mix(in srgb,${accent} 20%,#100a04)`}}>Level 30 &mdash; Bossbot Master</div>
                <div className="pim-dept-level-body"><ul className="pim-list"><li>Reward: Boss Rewards -- <span className="pim-hl">C.E.O.</span> permanently grants +2 Pink Slips.</li><li>Note: This stacks with Surplus Sunday and <span className="pim-hl">Boosters</span>.</li><li>Note: Unites gained are unaffected by Department Level 30.</li></ul></div>
              </div>
            </div>
          </div>
          <BossbotXPSection accent={accent} />
        </div>
      )}
      {tab==='ladder' && <BossbotLadderSection accent={accent} />}
    </div>
  );
}

/* Main exported modal */
export function PromoInfoModal({ suitName, accent, onClose }: Props) {
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

  const isSellbot  = suitName === 'Sellbot';
  const isCashbot  = suitName === 'Cashbot';
  const isLawbot   = suitName === 'Lawbot';
  const isBossbot  = suitName === 'Bossbot';
  const hasContent = isSellbot || isCashbot || isLawbot || isBossbot;

  return (
    <div className="pgm-backdrop" onClick={onClose}>
      <div
        className={`pgm-box pim-box${isSellbot ? ' pim-box--sb' : ''}${isCashbot ? ' pim-box--cb' : ''}${isLawbot ? ' pim-box--lb' : ''}${isBossbot ? ' pim-box--bb' : ''}`}
        style={{'--pgm-accent': accent} as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        {(isSellbot || isCashbot || isLawbot || isBossbot) && <div className="pim-bg-overlay" />}

        <div className="pgm-header pim-header-raised">
          <Image
            src={`/icons/cog-emblems/${suitName}Emblem.png`}
            alt={suitName}
            width={36}
            height={36}
            className="pgm-emblem"
            unoptimized
          />
          <div className="pgm-header-text">
            <h2 className="pgm-title">{suitName}</h2>
            <span className="pgm-subtitle">{suitName} Additional Info</span>
          </div>
          <button className="pgm-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        <div className="pgm-body pgm-body--single pim-body-wrap">
          {isSellbot  && <SellbotContent  accent={accent} />}
          {isCashbot  && <CashbotContent  accent={accent} />}
          {isLawbot   && <LawbotContent   accent={accent} />}
          {isBossbot  && <BossbotContent  accent={accent} />}
          {!hasContent && <p className="pgm-info-placeholder">Additional information for {suitName} will be added here.</p>}
        </div>
      </div>
    </div>
  );
}