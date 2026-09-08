// ── Corporate Clash Gag Calculator Data ──────────────────────────────────────

export type GagTrackKey =
  | 'toon-up' | 'trap' | 'lure' | 'throw' | 'squirt' | 'zap' | 'sound' | 'drop';

// ── Cog Types ─────────────────────────────────────────────────────────────────
export type CogType =
  | 'standard' | 'executive' | 'field-specialist' | 'exec-field'
  | 'ops-analyst' | 'exec-ops' | 'skelecog' | 'virtual-skelecog' | 'manager';

export interface CogTypeOption {
  key: CogType;
  label: string;
  isExec: boolean;
  defenseOffset: number;
  hpFormula: (level: number) => number | null;
}

export const COG_TYPES: CogTypeOption[] = [
  { key: 'standard',         label: 'Standard Cog',              isExec: false, defenseOffset:   0, hpFormula: (x) => (x+1)*(x+2) },
  { key: 'executive',        label: 'Executive (.exe)',           isExec: true,  defenseOffset:   0, hpFormula: (x) => x===30 ? 1480 : Math.floor((x+1)*(x+2)*1.5) },
  { key: 'field-specialist', label: 'Field Specialist',           isExec: false, defenseOffset: -10, hpFormula: (x) => x*(x+1)+1 },
  { key: 'exec-field',       label: 'Exec Field Specialist',      isExec: true,  defenseOffset: -10, hpFormula: (x) => Math.floor((x*(x+1)+1)*1.5) },
  { key: 'ops-analyst',      label: 'Operations Analyst',         isExec: false, defenseOffset:  10, hpFormula: (x) => (x+2)*(x+3)-2 },
  { key: 'exec-ops',         label: 'Exec Operations Analyst',    isExec: true,  defenseOffset:  10, hpFormula: (x) => Math.floor(((x+2)*(x+3)-2)*1.5) },
  { key: 'skelecog',         label: 'Skelecog (90–125% HP)',       isExec: false, defenseOffset:   0, hpFormula: (_x) => null },
  { key: 'virtual-skelecog', label: 'Virtual Skelecog (70–110%)', isExec: false, defenseOffset:   0, hpFormula: (_x) => null },
  { key: 'manager',          label: 'Manager (.mgr)',              isExec: true,  defenseOffset:   0, hpFormula: (_x) => null },
];

export function getCogHP(cogType: CogType, level: number): number | null {
  const t = COG_TYPES.find(c => c.key === cogType);
  return t ? t.hpFormula(level) : null;
}

export function standardCogHP(level: number): number { return (level + 1) * (level + 2); }

// ── Lure gag-level data ───────────────────────────────────────────────────────
export interface LureGagData {
  rounds: number; knockback: number; knockbackPrestige: number;
  targets: 'one' | 'all'; accuracy: number;
}
export const LURE_GAG_DATA: LureGagData[] = [
  { rounds:2, knockback:5,   knockbackPrestige:6,   targets:'one', accuracy:0.80 },
  { rounds:2, knockback:10,  knockbackPrestige:13,  targets:'all', accuracy:0.75 },
  { rounds:3, knockback:25,  knockbackPrestige:29,  targets:'one', accuracy:0.80 },
  { rounds:3, knockback:30,  knockbackPrestige:38,  targets:'all', accuracy:0.75 },
  { rounds:4, knockback:65,  knockbackPrestige:75,  targets:'one', accuracy:0.85 },
  { rounds:4, knockback:50,  knockbackPrestige:63,  targets:'all', accuracy:0.80 },
  { rounds:5, knockback:100, knockbackPrestige:115, targets:'one', accuracy:0.85 },
  { rounds:5, knockback:75,  knockbackPrestige:94,  targets:'all', accuracy:0.85 },
];

// ── Gag interfaces ────────────────────────────────────────────────────────────
export interface CCGag {
  name: string; damage: number; heal?: number; icon: string; level: number;
}
export interface CCGagTrack {
  key: GagTrackKey; name: string; color: string; headerColor: string;
  labelColor: string; baseAccuracy: number; comboBonus: number;
  gags: CCGag[]; prestigeDesc: string;
}

// ── Cog HP lookup (standard, levels 1–35) ─────────────────────────────────────
export const CC_COG_HP: Record<number, number> = {
  1:6,    2:12,   3:20,   4:30,   5:42,
  6:56,   7:72,   8:90,   9:110,  10:132,
  11:156, 12:182, 13:210, 14:240, 15:272,
  16:306, 17:342, 18:380, 19:420, 20:462,
  21:506, 22:552, 23:600, 24:650, 25:702,
  26:756, 27:812, 28:870, 29:930, 30:992,
  31:1056,32:1122,33:1190,34:1260,35:1332,
};

const TOON_UP: CCGagTrack = {
  key: 'toon-up', name: 'Toon-Up',
  color: '#6b2880', headerColor: '#4a1858', labelColor: '#d080ff',
  baseAccuracy: 1.0, comboBonus: 0,
  prestigeDesc: 'Self-heal 25%→45% of gag heal; Cheer buff lasts 2 rounds',
  gags: [
    { name: 'Feather',         damage: 0, heal: 12,  icon: 'Feather.png',         level: 1 },
    { name: 'Megaphone',       damage: 0, heal: 24,  icon: 'Megaphone.png',       level: 2 },
    { name: 'Lipstick',        damage: 0, heal: 30,  icon: 'Lipstick.png',        level: 3 },
    { name: 'Bamboo Cane',     damage: 0, heal: 45,  icon: 'Bamboo Cane.png',     level: 4 },
    { name: 'Pixie Dust',      damage: 0, heal: 60,  icon: 'Pixie Dust.png',      level: 5 },
    { name: 'Juggling Cubes',  damage: 0, heal: 90,  icon: 'Juggling Cubes.png',  level: 6 },
    { name: 'Confetti Cannon', damage: 0, heal: 95,  icon: 'Confetti Cannon.png', level: 7 },
    { name: 'High Dive',       damage: 0, heal: 135, icon: 'High Dive.png',       level: 8 },
  ],
};

const TRAP: CCGagTrack = {
  key: 'trap', name: 'Trap',
  color: '#8a1010', headerColor: '#5a0808', labelColor: '#ff7070',
  baseAccuracy: 1.0, comboBonus: 0,
  prestigeDesc: '+15% damage to all cogs (+49.5% vs Executives/Managers)',
  gags: [
    { name: 'Banana Peel',   damage: 16,  icon: 'Banana Peel.png',   level: 1 },
    { name: 'Rake',          damage: 32,  icon: 'Rake.png',           level: 2 },
    { name: 'Springboard',   damage: 50,  icon: 'Springboard.png',    level: 3 },
    { name: 'Marbles',       damage: 80,  icon: 'Marbles.png',        level: 4 },
    { name: 'Quicksand',     damage: 120, icon: 'Quicksand.png',      level: 5 },
    { name: 'Trapdoor',      damage: 170, icon: 'Trapdoor.png',       level: 6 },
    { name: 'Wrecking Ball', damage: 230, icon: 'Wrecking Ball.png',  level: 7 },
    { name: 'TNT',           damage: 290, icon: 'TNT.png',            level: 8 },
  ],
};

const LURE: CCGagTrack = {
  key: 'lure', name: 'Lure',
  color: '#1a5430', headerColor: '#0e3520', labelColor: '#60e080',
  baseAccuracy: -1, comboBonus: 0,
  prestigeDesc: '+15% knockback (single-target) / +25% knockback (multi-target)',
  gags: [
    { name: '$1 Bill',       damage: 0, icon: '$1 Bill.png',       level: 1 },
    { name: 'Small Magnet',  damage: 0, icon: 'Small Magnet.png',  level: 2 },
    { name: '$5 Bill',       damage: 0, icon: '$5 Bill.png',       level: 3 },
    { name: 'Big Magnet',    damage: 0, icon: 'Big Magnet.png',    level: 4 },
    { name: '$10 Bill',      damage: 0, icon: '$10 Bill.png',      level: 5 },
    { name: 'Hypno-goggles', damage: 0, icon: 'Hypno-goggles.png', level: 6 },
    { name: '$50 Bill',      damage: 0, icon: '$50 Bill.png',      level: 7 },
    { name: 'Presentation',  damage: 0, icon: 'Presentation.png',  level: 8 },
  ],
};

const THROW: CCGagTrack = {
  key: 'throw', name: 'Throw',
  color: '#7a2a00', headerColor: '#501a00', labelColor: '#ff8844',
  baseAccuracy: 0.80, comboBonus: 0.20,
  prestigeDesc: 'Caramelize: self-heal 20% of base damage dealt',
  gags: [
    { name: 'Cupcake',             damage: 8,   icon: 'Cupcake.png',             level: 1 },
    { name: 'Fruit Pie Slice',     damage: 13,  icon: 'Fruit Pie Slice.png',     level: 2 },
    { name: 'Cream Pie Slice',     damage: 20,  icon: 'Cream Pie Slice.png',     level: 3 },
    { name: 'Birthday Cake Slice', damage: 35,  icon: 'Birthday Cake Slice.png', level: 4 },
    { name: 'Whole Fruit Pie',     damage: 56,  icon: 'Whole Fruit Pie.png',     level: 5 },
    { name: 'Whole Cream Pie',     damage: 90,  icon: 'Whole Cream Pie.png',     level: 6 },
    { name: 'Birthday Cake',       damage: 130, icon: 'Birthday Cake.png',       level: 7 },
    { name: 'Wedding Cake',        damage: 170, icon: 'Wedding Cake.png',        level: 8 },
  ],
};

const SQUIRT: CCGagTrack = {
  key: 'squirt', name: 'Squirt',
  color: '#0a3a7a', headerColor: '#061e4a', labelColor: '#58b0ff',
  baseAccuracy: 0.95, comboBonus: 0.20,
  prestigeDesc: 'Splash damage 33%→75% of base damage',
  gags: [
    { name: 'Squirting Flower', damage: 4,   icon: 'Squirting Flower.png', level: 1 },
    { name: 'Glass of Water',   damage: 8,   icon: 'Glass of Water.png',   level: 2 },
    { name: 'Squirt Gun',       damage: 12,  icon: 'Squirt Gun.png',       level: 3 },
    { name: 'Water Balloon',    damage: 21,  icon: 'Water Balloon.png',    level: 4 },
    { name: 'Seltzer Bottle',   damage: 30,  icon: 'Seltzer Bottle.png',   level: 5 },
    { name: 'Fire Hose',        damage: 60,  icon: 'Fire Hose.png',        level: 6 },
    { name: 'Storm Cloud',      damage: 90,  icon: 'Storm Cloud.png',      level: 7 },
    { name: 'Geyser',           damage: 120, icon: 'Geyser.png',           level: 8 },
  ],
};

const ZAP: CCGagTrack = {
  key: 'zap', name: 'Zap',
  color: '#7a6a00', headerColor: '#504500', labelColor: '#d4b800',
  baseAccuracy: -1, comboBonus: 0,
  prestigeDesc: 'Zap jump pool 80%→105%; jumps pass over unsoaked/dead cogs',
  gags: [
    { name: 'Joybuzzer',         damage: 12,  icon: 'Joybuzzer.png',         level: 1 },
    { name: 'Lightbulb',         damage: 20,  icon: 'Lightbulb.png',         level: 2 },
    { name: 'Broken Radio',      damage: 36,  icon: 'Broken Radio.png',      level: 3 },
    { name: 'Kart Battery',      damage: 60,  icon: 'Kart Battery.png',      level: 4 },
    { name: 'Broken Television', damage: 90,  icon: 'Broken Television.png', level: 5 },
    { name: 'Stagelight',        damage: 140, icon: 'Stagelight.png',        level: 6 },
    { name: 'Tesla Coil',        damage: 190, icon: 'Tesla Coil.png',        level: 7 },
    { name: 'Lightning',         damage: 240, icon: 'Lightning.png',         level: 8 },
  ],
};

const SOUND: CCGagTrack = {
  key: 'sound', name: 'Sound',
  color: '#1a3070', headerColor: '#101e4a', labelColor: '#6090e0',
  baseAccuracy: 0.95, comboBonus: 0,
  prestigeDesc: 'Encore damage boost 10%→20% on next gag',
  gags: [
    { name: 'Kazoo',          damage: 5,  icon: 'Kazoo.png',          level: 1 },
    { name: 'Bike Horn',      damage: 10, icon: 'Bike Horn.png',      level: 2 },
    { name: 'Whistle',        damage: 16, icon: 'Whistle.png',        level: 3 },
    { name: 'Bugle',          damage: 23, icon: 'Bugle.png',          level: 4 },
    { name: 'Aoogah',         damage: 30, icon: 'Aoogah.png',         level: 5 },
    { name: 'Elephant Trunk', damage: 50, icon: 'Elephant Trunk.png', level: 6 },
    { name: 'Foghorn',        damage: 70, icon: 'Foghorn.png',        level: 7 },
    { name: 'Opera Singer',   damage: 90, icon: 'Opera Singer.png',   level: 8 },
  ],
};

const DROP: CCGagTrack = {
  key: 'drop', name: 'Drop',
  color: '#107878', headerColor: '#065050', labelColor: '#40d0d0',
  baseAccuracy: 0.60, comboBonus: 0.30,
  prestigeDesc: '+10% damage per debuff on cog (+5% each additional debuff)',
  gags: [
    { name: 'Flower Pot',   damage: 12,  icon: 'Flower Pot.png',   level: 1 },
    { name: 'Sandbag',      damage: 20,  icon: 'Sandbag.png',      level: 2 },
    { name: 'Bowling Ball', damage: 35,  icon: 'Bowling Ball.png',  level: 3 },
    { name: 'Anvil',        damage: 56,  icon: 'Anvil.png',         level: 4 },
    { name: 'Big Weight',   damage: 90,  icon: 'Big Weight.png',    level: 5 },
    { name: 'Safe',         damage: 140, icon: 'Safe.png',          level: 6 },
    { name: 'Boulder',      damage: 200, icon: 'Boulder.png',       level: 7 },
    { name: 'Grand Piano',  damage: 250, icon: 'Grand Piano.png',   level: 8 },
  ],
};

export const CC_GAG_TRACKS: CCGagTrack[] = [
  TOON_UP, TRAP, LURE, THROW, SQUIRT, ZAP, SOUND, DROP,
];

export const TRAINING_POINTS_MAX = 12;
export const TP_PER_TRACK = 2;
export const TP_PER_PRESTIGE = 1;

export interface GagBuildPreset {
  label: string;
  tp: 11 | 12;
  tracks: number;
  prestiges: number;
}

export const GAG_BUILD_PRESETS: GagBuildPreset[] = [
  { label: '5/5', tp: 11, tracks: 5, prestiges: 5 },
  { label: '6/3', tp: 11, tracks: 6, prestiges: 3 },
  { label: '7/1', tp: 11, tracks: 7, prestiges: 1 },
  { label: '6/4', tp: 12, tracks: 6, prestiges: 4 },
  { label: '7/2', tp: 12, tracks: 7, prestiges: 2 },
  { label: '8/0', tp: 12, tracks: 8, prestiges: 0 },
];
