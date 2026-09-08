// ── Corporate Clash Gag Calculator Data ──────────────────────────────────────

export type GagTrackKey =
  | 'toon-up' | 'trap' | 'lure' | 'throw' | 'squirt' | 'zap' | 'sound' | 'drop';

export interface CCGag {
  name: string;
  damage: number;
  heal?: number;
  icon: string;
}

export interface CCGagTrack {
  key: GagTrackKey;
  name: string;
  color: string;
  headerColor: string;
  labelColor: string;
  gags: CCGag[];
}

export const CC_COG_HP: Record<number, number> = {
  1:6, 2:12, 3:20, 4:30, 5:42, 6:56, 7:72, 8:90,
  9:110, 10:132, 11:156, 12:196, 13:224, 14:254,
  15:286, 16:320, 17:356, 18:394, 19:434, 20:476,
};

const TOON_UP: CCGagTrack = {
  key: 'toon-up', name: 'Toon-Up',
  color: '#6b2880', headerColor: '#4a1858', labelColor: '#d080ff',
  gags: [
    { name: 'Feather',         damage: 0, heal: 12,  icon: 'Feather.png' },
    { name: 'Megaphone',       damage: 0, heal: 24,  icon: 'Megaphone.png' },
    { name: 'Lipstick',        damage: 0, heal: 30,  icon: 'Lipstick.png' },
    { name: 'Bamboo Cane',     damage: 0, heal: 45,  icon: 'Bamboo Cane.png' },
    { name: 'Pixie Dust',      damage: 0, heal: 60,  icon: 'Pixie Dust.png' },
    { name: 'Juggling Cubes',  damage: 0, heal: 90,  icon: 'Juggling Cubes.png' },
    { name: 'Confetti Cannon', damage: 0, heal: 95,  icon: 'Confetti Cannon.png' },
    { name: 'High Dive',       damage: 0, heal: 135, icon: 'High Dive.png' },
  ],
};

const TRAP: CCGagTrack = {
  key: 'trap', name: 'Trap',
  color: '#8a1010', headerColor: '#5a0808', labelColor: '#ff7070',
  gags: [
    { name: 'Banana Peel',   damage: 14  , icon: 'Banana Peel.png' },
    { name: 'Rake',          damage: 28  , icon: 'Rake.png' },
    { name: 'Springboard',   damage: 45  , icon: 'Springboard.png' },
    { name: 'Marbles',       damage: 75  , icon: 'Marbles.png' },
    { name: 'Quicksand',     damage: 115 , icon: 'Quicksand.png' },
    { name: 'Trapdoor',      damage: 160 , icon: 'Trapdoor.png' },
    { name: 'Wrecking Ball', damage: 220 , icon: 'Wrecking Ball.png' },
    { name: 'TNT',           damage: 280 , icon: 'TNT.png' },
  ],
};

const LURE: CCGagTrack = {
  key: 'lure', name: 'Lure',
  color: '#1a5430', headerColor: '#0e3520', labelColor: '#60e080',
  gags: [
    { name: '$1 Bill',       damage: 0, icon: '$1 Bill.png' },
    { name: 'Small Magnet',  damage: 0, icon: 'Small Magnet.png' },
    { name: '$5 Bill',       damage: 0, icon: '$5 Bill.png' },
    { name: 'Big Magnet',    damage: 0, icon: 'Big Magnet.png' },
    { name: '$10 Bill',      damage: 0, icon: '$10 Bill.png' },
    { name: 'Hypno-goggles', damage: 0, icon: 'Hypno-goggles.png' },
    { name: '$50 Bill',      damage: 0, icon: '$50 Bill.png' },
    { name: 'Presentation',  damage: 0, icon: 'Presentation.png' },
  ],
};

const THROW: CCGagTrack = {
  key: 'throw', name: 'Throw',
  color: '#7a2a00', headerColor: '#501a00', labelColor: '#ff8844',
  gags: [
    { name: 'Cupcake',             damage: 8  , icon: 'Cupcake.png' },
    { name: 'Fruit Pie Slice',     damage: 16 , icon: 'Fruit Pie Slice.png' },
    { name: 'Cream Pie Slice',     damage: 25 , icon: 'Cream Pie Slice.png' },
    { name: 'Whole Fruit Pie',     damage: 40 , icon: 'Whole Fruit Pie.png' },
    { name: 'Whole Cream Pie',     damage: 60 , icon: 'Whole Cream Pie.png' },
    { name: 'Birthday Cake',       damage: 100, icon: 'Birthday Cake.png' },
    { name: 'Birthday Cake Slice', damage: 140, icon: 'Birthday Cake Slice.png' },
    { name: 'Wedding Cake',        damage: 200, icon: 'Wedding Cake.png' },
  ],
};

const SQUIRT: CCGagTrack = {
  key: 'squirt', name: 'Squirt',
  color: '#0a3a7a', headerColor: '#061e4a', labelColor: '#58b0ff',
  gags: [
    { name: 'Squirting Flower', damage: 4  , icon: 'Squirting Flower.png' },
    { name: 'Water Balloon',    damage: 8  , icon: 'Water Balloon.png' },
    { name: 'Glass of Water',   damage: 12 , icon: 'Glass of Water.png' },
    { name: 'Squirt Gun',       damage: 21 , icon: 'Squirt Gun.png' },
    { name: 'Seltzer Bottle',   damage: 30 , icon: 'Seltzer Bottle.png' },
    { name: 'Fire Hose',        damage: 60 , icon: 'Fire Hose.png' },
    { name: 'Storm Cloud',      damage: 90 , icon: 'Storm Cloud.png' },
    { name: 'Geyser',           damage: 120, icon: 'Geyser.png' },
  ],
};

const ZAP: CCGagTrack = {
  key: 'zap', name: 'Zap',
  color: '#7a6a00', headerColor: '#504500', labelColor: '#d4b800',
  gags: [
    { name: 'Joybuzzer',         damage: 12 , icon: 'Joybuzzer.png' },
    { name: 'Lightbulb',         damage: 20 , icon: 'Lightbulb.png' },
    { name: 'Broken Radio',      damage: 36 , icon: 'Broken Radio.png' },
    { name: 'Kart Battery',      damage: 60 , icon: 'Kart Battery.png' },
    { name: 'Broken Television', damage: 90 , icon: 'Broken Television.png' },
    { name: 'Stagelight',        damage: 140, icon: 'Stagelight.png' },
    { name: 'Tesla Coil',        damage: 190, icon: 'Tesla Coil.png' },
    { name: 'Lightning',         damage: 240, icon: 'Lightning.png' },
  ],
};

const SOUND: CCGagTrack = {
  key: 'sound', name: 'Sound',
  color: '#1a3070', headerColor: '#101e4a', labelColor: '#6090e0',
  gags: [
    { name: 'Kazoo',          damage: 5 , icon: 'Kazoo.png' },
    { name: 'Bike Horn',      damage: 10, icon: 'Bike Horn.png' },
    { name: 'Whistle',        damage: 16, icon: 'Whistle.png' },
    { name: 'Bugle',          damage: 23, icon: 'Bugle.png' },
    { name: 'Aoogah',         damage: 30, icon: 'Aoogah.png' },
    { name: 'Elephant Trunk', damage: 50, icon: 'Elephant Trunk.png' },
    { name: 'Foghorn',        damage: 70, icon: 'Foghorn.png' },
    { name: 'Opera Singer',   damage: 90, icon: 'Opera Singer.png' },
  ],
};

const DROP: CCGagTrack = {
  key: 'drop', name: 'Drop',
  color: '#107878', headerColor: '#065050', labelColor: '#40d0d0',
  gags: [
    { name: 'Flower Pot',   damage: 12 , icon: 'Flower Pot.png' },
    { name: 'Sandbag',      damage: 20 , icon: 'Sandbag.png' },
    { name: 'Bowling Ball', damage: 35 , icon: 'Bowling Ball.png' },
    { name: 'Anvil',        damage: 56 , icon: 'Anvil.png' },
    { name: 'Big Weight',   damage: 90 , icon: 'Big Weight.png' },
    { name: 'Safe',         damage: 140, icon: 'Safe.png' },
    { name: 'Boulder',      damage: 200, icon: 'Boulder.png' },
    { name: 'Grand Piano',  damage: 250, icon: 'Grand Piano.png' },
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
