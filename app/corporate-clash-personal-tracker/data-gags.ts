// --- Stat row types
export type StatRowType = 'label' | 'values-neg' | 'values-pos';

export interface StatRow {
  label: string;
  values: (string | null)[];
  type?: StatRowType;
  prestige?: boolean;
}

export interface GagTrack {
  name: string;
  trackKey: string;
  largeIcon: string;
  color: string;
  headerColor: string;
  labelColor: string;
  xpMin: string[];
  xpMax: string[];
  gags: string[];
  stats: StatRow[];
}

export const GAG_XP_MIN = ['0','20','100','500','2,000','5,000','9,000','14,000'];
export const GAG_XP_MAX = ['20','100','500','2,000','5,000','9,000','14,000','20,000'];

export const RECOMMENDED_ZONES = [
  { name: 'Toontown Central', color: '#5a2004', accent: '#d86b10', pgKey: 'TTC', },
  { name: 'Barnacle Boatyard', color: '#2a1a04', accent: '#c8890a', pgKey: 'BB',  },
  { name: 'Ye Olde Toontowne', color: '#2a0d2a', accent: '#9b4fb0', pgKey: 'YOTT', },
  { name: 'Daffodil Gardens',  color: '#1a2a08', accent: '#6ea830', pgKey: 'DG',  },
  { name: 'Mezzo Melodyland',  color: '#1a0a2a', accent: '#7c54d0', pgKey: 'MML', },
  { name: 'The Brrrgh',        color: '#082030', accent: '#4ab8d8', pgKey: 'TB',  },
  { name: 'Acorn Acres',       color: '#1a1005', accent: '#a07830', pgKey: 'AA',  },
  { name: 'Drowsy Dreamland',  color: '#1a0a30', accent: '#6060d0', pgKey: 'DDL', },
];

// --- Track definitions

const TOONUP: GagTrack = {
  name: 'Toon-Up', trackKey: 'toon-up', largeIcon: 'toon-up.png',
  color: '#6b2880', headerColor: '#4a1858', labelColor: '#d080ff',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Feather','Megaphone','Lipstick','Bamboo Cane','Pixie Dust','Juggling Cubes','Confetti Cannon','High Dive'],
  stats: [
    { label: 'Affects',    values: ['1 Toon','All Toons','1 Toon','All Toons','1 Toon','All Toons','1 Toon','All Toons'], type: 'label' },
    { label: 'Total Heal', values: ['+12','+24 \ +12 \ +8','+30','+45 \ +23 \ +15','+60','+90 \ +45 \ +30','+95','+135 \ +68 \ +45'], type: 'values-pos' },
    { label: 'Self-Heal',  values: ['+3','+6','+8','+12','+15','+23','+24','+34'], type: 'values-pos' },
    { label: 'Self-Heal',  values: ['+6','+11','+14','+21','+27','+41','+43','+61'], type: 'values-pos', prestige: true },
  ],
};

const TRAP: GagTrack = {
  name: 'Trap', trackKey: 'trap', largeIcon: 'trap-large.png',
  color: '#8a1010', headerColor: '#5a0808', labelColor: '#ff7070',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Banana Peel','Rake','Springboard','Marbles','Quicksand','Trapdoor','Wrecking Ball','TNT'],
  stats: [
    { label: 'Affects',    values: ['1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog'], type: 'label' },
    { label: 'Damage',     values: ['-14','-28','-45','-75','-115','-160','-220','-280'], type: 'values-neg' },
    { label: 'EXE Damage', values: ['-19','-37','-59','-117','-150','-208','-286','-364'], type: 'values-neg' },
    { label: 'Damage',     values: ['-17','-34','-54','-90','-138','-192','-264','-336'], type: 'values-neg', prestige: true },
    { label: 'EXE Damage', values: ['-22','-44','-71','-117','-180','-250','-344','-437'], type: 'values-neg', prestige: true },
  ],
};

const LURE: GagTrack = {
  name: 'Lure', trackKey: 'lure', largeIcon: 'lure-large.png',
  color: '#1a5430', headerColor: '#0e3520', labelColor: '#60e080',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['$1 Bill','Small Magnet','$5 Bill','Big Magnet','$10 Bill','Hypno-goggles','$50 Bill','Presentation'],
  stats: [
    { label: 'Affects',      values: ['1 Cog','All Cogs','1 Cog','All Cogs','1 Cog','All Cogs','1 Cog','All Cogs'], type: 'label' },
    { label: 'Rounds Lured', values: ['2 Rounds','2 Rounds','3 Rounds','3 Rounds','4 Rounds','4 Rounds','5 Rounds','5 Rounds'], type: 'label' },
    { label: 'Knockback',    values: ['-5','-10','-25','-30','-65','-50','-100','-75'], type: 'values-neg' },
    { label: 'Knockback',    values: ['-6','-13','-29','-38','-75','-63','-115','-94'], type: 'values-neg', prestige: true },
  ],
};

const THROW: GagTrack = {
  name: 'Throw', trackKey: 'throw', largeIcon: 'throw-large.png',
  color: '#8a3a08', headerColor: '#5a2404', labelColor: '#e08040',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Cupcake','Fruit Pie Slice','Cream Pie Slice','Birthday Cake Slice','Whole Fruit Pie','Whole Cream Pie','Birthday Cake','Wedding Cake'],
  stats: [
    { label: 'Affects',   values: ['1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog'], type: 'label' },
    { label: 'Damage',    values: ['-8','-13','-20','-35','-56','-90','-130','-170'], type: 'values-neg' },
    { label: 'Self-Heal', values: ['+2','+3','+4','+7','+12','+18','+26','+34'], type: 'values-pos', prestige: true },
  ],
};

const SQUIRT: GagTrack = {
  name: 'Squirt', trackKey: 'squirt', largeIcon: 'squirt-large.png',
  color: '#8020a0', headerColor: '#550e70', labelColor: '#d060ff',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Squirting Flower','Glass of Water','Squirt Gun','Water Balloon','Seltzer Bottle','Fire Hose','Storm Cloud','Geyser'],
  stats: [
    { label: 'Affects',       values: ['1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs'], type: 'label' },
    { label: 'Rounds Soaked', values: ['3 Rounds','3 Rounds','3 Rounds','3 Rounds','4 Rounds','4 Rounds','4 Rounds','4 Rounds'], type: 'label' },
    { label: 'Damage',        values: ['-4','-8','-12','-21','-30','-60','-90','-120'], type: 'values-neg' },
    { label: 'Splash Damage', values: ['-2','-3','-4','-7','-10','-20','-30','-40'], type: 'values-neg' },
    { label: 'Splash Damage', values: ['-3','-6','-9','-16','-23','-45','-70','-90'], type: 'values-neg', prestige: true },
  ],
};

const ZAP: GagTrack = {
  name: 'Zap', trackKey: 'zap', largeIcon: 'zap-large.png',
  color: '#7a6a00', headerColor: '#504500', labelColor: '#d4b800',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Joybuzzer','Lightbulb','Broken Radio','Kart Battery','Broken Television','Stagelight','Tesla Coil','Lightning'],
  stats: [
    { label: 'Affects',     values: ['1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs','1 - 3 Cogs'], type: 'label' },
    { label: 'Damage',      values: ['-12','-20','-36','-60','-90','-140','-190','-240'], type: 'values-neg' },
    { label: 'Jump Damage', values: ['-10 \ -5','-16 \ -8','-29 \ -15','-48 \ -24','-72 \ -36','-112 \ -56','-152 \ -76','-192 \ -96'], type: 'values-neg' },
    { label: 'Jump Damage', values: ['-13 \ -7','-21 \ -11','-38 \ -19','-63 \ -32','-95 \ -48','-147 \ -74','-200 \ -100','-252 \ -126'], type: 'values-neg', prestige: true },
  ],
};

const SOUND: GagTrack = {
  name: 'Sound', trackKey: 'sound', largeIcon: 'sound-large.png',
  color: '#1a3070', headerColor: '#101e4a', labelColor: '#6090e0',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Kazoo','Bike Horn','Whistle','Bugle','Aoogah','Elephant Trunk','Foghorn','Opera Singer'],
  stats: [
    { label: 'Affects',         values: ['All Cogs','All Cogs','All Cogs','All Cogs','All Cogs','All Cogs','All Cogs','All Cogs'], type: 'label' },
    { label: 'Damage',          values: ['-5','-10','-16','-23','-30','-50','-70','-90'], type: 'values-neg' },
    { label: 'Damage (Encore)', values: ['-6','-11','-18','-25','-33','-54','-76','-98'], type: 'values-neg' },
    { label: 'Damage (Encore)', values: ['-6','-12','-19','-27','-35','-58','-82','-105'], type: 'values-neg', prestige: true },
    { label: 'Damage (Winded)', values: ['-3','-5','-8','-12','-15','-25','-35','-45'], type: 'values-neg' },
  ],
};

const DROP: GagTrack = {
  name: 'Drop', trackKey: 'drop', largeIcon: 'drop-large.png',
  color: '#107878', headerColor: '#065050', labelColor: '#40d0d0',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Flower Pot','Sandbag','Bowling Ball','Anvil','Big Weight','Safe','Boulder','Grand Piano'],
  stats: [
    { label: 'Affects',          values: ['1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog','1 Cog'], type: 'label' },
    { label: 'Damage',           values: ['-12','-20','-35','-56','-90','-140','-200','-250'], type: 'values-neg' },
    { label: 'Damage +1 Debuff', values: ['-14','-22','-39','-62','-99','-154','-220','-275'], type: 'values-neg', prestige: true },
    { label: 'Damage +2 Debuff', values: ['-14','-23','-41','-65','-104','-161','-230','-288'], type: 'values-neg', prestige: true },
    { label: 'Damage +3 Debuff', values: ['-15','-24','-42','-68','-108','-168','-240','-300'], type: 'values-neg', prestige: true },
    { label: 'Damage +4 Debuff', values: ['-15','-25','-44','-70','-113','-175','-250','-313'], type: 'values-neg', prestige: true },
  ],
};

export const GAG_TRACKS: GagTrack[] = [TOONUP, TRAP, LURE, THROW, SQUIRT, ZAP, SOUND, DROP];

export const GAG_XP = GAG_XP_MIN.map((mn, i) => `${mn}-${GAG_XP_MAX[i]} XP`);
