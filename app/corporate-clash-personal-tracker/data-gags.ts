// ─── Stat row types ────────────────────────────────────────────────
export type StatRowType = 'label' | 'values-neg' | 'values-pos';

export interface StatRow {
  label: string;
  values: (string | null)[];
  type?: StatRowType;
  /** If true, renders a prestige star icon before the label */
  prestige?: boolean;
}

export interface GagTrack {
  name: string;
  /** folder name under /icons/gags/small/ and suffix of large icon */
  trackKey: string;
  /** filename of the large icon under /icons/gags/large/ */
  largeIcon: string;
  color: string;
  headerColor: string;
  labelColor: string;
  xpMin: string[];
  xpMax: string[];
  /** Must exactly match the PNG filename (without .png) inside gags-small-icons/{trackKey}/ */
  gags: string[];
  stats: StatRow[];
}

export const GAG_XP_MIN = ['0','20','100','500','2,000','5,000','9,000','14,000'];
export const GAG_XP_MAX = ['20','100','500','2,000','5,000','9,000','14,000','20,000'];

export const RECOMMENDED_ZONES = [
  { name: 'Toontown Central', color: '#5a2004', accent: '#d86b10', pgKey: 'TTC', span: 2, icon: '🍦' },
  { name: 'Barnacle Boatyard', color: '#2a1a04', accent: '#c8890a', pgKey: 'BB', span: 1, icon: '⚓' },
  { name: 'Ye Olde Toontowne', color: '#2a0d2a', accent: '#9b4fb0', pgKey: 'YOTT', span: 1, icon: '👑' },
  { name: 'Daffodil Gardens',  color: '#1a2a08', accent: '#6ea830', pgKey: 'DG', span: 1, icon: '🌸' },
  { name: 'Mezzo Melodyland',  color: '#1a0a2a', accent: '#7c54d0', pgKey: 'MML', span: 1, icon: '🎵' },
  { name: 'The Brrrgh',        color: '#082030', accent: '#4ab8d8', pgKey: 'TB', span: 1, icon: '❄️' },
  { name: 'Acorn Acres',       color: '#1a1005', accent: '#a07830', pgKey: 'AA', span: 1, icon: '🌰' },
  { name: 'Drowsy Dreamland',  color: '#1a0a30', accent: '#6060d0', pgKey: 'DDL', span: 1, icon: '💤' },
];

// ─── Track definitions ─────────────────────────────────────────────

const TOONUP: GagTrack = {
  name: 'Toon-Up', trackKey: 'toon-up', largeIcon: 'toon-up.png',
  color: '#6b2880', headerColor: '#4a1858', labelColor: '#d080ff',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Feather','Megaphone','Lipstick','Bamboo Cane','Pixie Dust','Juggling Cubes','Confetti Cannon','High Dive'],
  stats: [
    { label: 'Affects',    values: ['1 Toon','All Toons','1 Toon','All Toons','1 Toon','All Toons','1 Toon','All Toons'], type: 'label' },
    { label: 'Total Heal', values: ['+12','+24 \\ +12 \\ +8','+30','+45 \\ +23 \\ +15','+60','+90 \\ +45 \\ +30','+95','+135 \\ +68 \\ +45'], type: 'values-pos' },
    { label: 'Self-Heal',  values: ['+3','+6','+8','+12','+15','+23','+24','+34'], type: 'values-pos' },
    { label: 'Self-Heal',  values: ['+6','+11','+14','+21','+27','+41','+43','+61'], type: 'values-pos', prestige: true },
    { label: 'XP to Max',  values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

const TRAP: GagTrack = {
  name: 'Trap', trackKey: 'trap', largeIcon: 'trap-large.png',
  color: '#8a1010', headerColor: '#5a0808', labelColor: '#ff7070',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Banana Peel','Rake','Springboard','Marbles','Quicksand','Trapdoor','Wrecking Ball','TNT'],
  stats: [
    { label: 'Damage',         values: ['-16','-32','-50','-80','-120','-170','-230','-290'], type: 'values-neg' },
    { label: 'Damage (Exe)',   values: ['-21','-42','-65','-104','-156','-221','-299','-377'], type: 'values-neg' },
    { label: 'Damage',         values: ['-19','-37','-58','-92','-138','-196','-265','-334'], type: 'values-neg', prestige: true },
    { label: 'Damage (Exe)',   values: ['-25','-49','-75','-120','-180','-255','-345','-435'], type: 'values-neg', prestige: true },
    { label: 'XP to Max',      values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

const LURE: GagTrack = {
  name: 'Lure', trackKey: 'lure', largeIcon: 'lure-large.png',
  color: '#1a5430', headerColor: '#0e3520', labelColor: '#60e080',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['$1 Bill','Small Magnet','$5 Bill','Big Magnet','$10 Bill','Hypno-goggles','$50 Bill','Presentation'],
  stats: [
    { label: 'Rounds Lured', values: ['2 Rounds','2 Rounds','3 Rounds','3 Rounds','4 Rounds','4 Rounds','5 Rounds','5 Rounds'], type: 'label' },
    { label: 'Knockback',    values: ['-5','-10','-25','-30','-65','-50','-100','-75'], type: 'values-neg' },
    { label: 'Knockback',    values: ['-6','-13','-29','-38','-75','-63','-115','-94'], type: 'values-neg', prestige: true },
    { label: 'Targets',      values: ['One Cog','All Cogs','One Cog','All Cogs','One Cog','All Cogs','One Cog','All Cogs'], type: 'label' },
    { label: 'Accuracy',     values: ['80%','75%','80%','75%','85%','80%','85%','85%'], type: 'label' },
    { label: 'XP to Max',    values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

const THROW: GagTrack = {
  name: 'Throw', trackKey: 'throw', largeIcon: 'throw-large.png',
  color: '#8a3a08', headerColor: '#5a2404', labelColor: '#e08040',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Cupcake','Fruit Pie Slice','Cream Pie Slice','Birthday Cake Slice','Whole Fruit Pie','Whole Cream Pie','Birthday Cake','Wedding Cake'],
  stats: [
    { label: 'Damage',     values: ['-8','-13','-20','-35','-56','-90','-130','-170'], type: 'values-neg' },
    { label: 'Self-Heal',  values: ['+2','+3','+4','+7','+12','+18','+26','+34'], type: 'values-pos', prestige: true },
    { label: 'XP to Max',  values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

const SQUIRT: GagTrack = {
  name: 'Squirt', trackKey: 'squirt', largeIcon: 'squirt-large.png',
  color: '#8020a0', headerColor: '#550e70', labelColor: '#d060ff',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Squirting Flower','Glass of Water','Squirt Gun','Water Balloon','Seltzer Bottle','Fire Hose','Storm Cloud','Geyser'],
  stats: [
    { label: 'Damage',         values: ['-4','-8','-12','-21','-30','-60','-90','-120'], type: 'values-neg' },
    { label: 'Splash Damage',  values: ['-2','-3','-4','-7','-10','-20','-30','-40'], type: 'values-neg' },
    { label: 'Splash Damage',  values: ['-3','-6','-9','-16','-23','-45','-68','-90'], type: 'values-neg', prestige: true },
    { label: 'Rounds Soaked',  values: ['3 Rounds','3 Rounds','3 Rounds','3 Rounds','4 Rounds','4 Rounds','4 Rounds','4 Rounds'], type: 'label' },
    { label: 'XP to Max',      values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

const ZAP: GagTrack = {
  name: 'Zap', trackKey: 'zap', largeIcon: 'zap-large.png',
  color: '#7a6a00', headerColor: '#504500', labelColor: '#d4b800',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Joybuzzer','Lightbulb','Broken Radio','Kart Battery','Broken TV','Stagelight','Tesla Coil','Lightning'],
  stats: [
    { label: 'Direct Damage',  values: ['-12','-20','-36','-60','-90','-140','-190','-240'], type: 'values-neg' },
    { label: 'Jump Damage',    values: ['-10 \\ -5','-16 \\ -8','-29 \\ -15','-48 \\ -24','-72 \\ -36','-112 \\ -56','-152 \\ -76','-192 \\ -96'], type: 'values-neg' },
    { label: 'Jump Damage',    values: ['-13 \\ -7','-21 \\ -11','-38 \\ -19','-63 \\ -32','-95 \\ -48','-147 \\ -74','-200 \\ -100','-252 \\ -126'], type: 'values-neg', prestige: true },
    { label: 'XP to Max',      values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

const SOUND: GagTrack = {
  name: 'Sound', trackKey: 'sound', largeIcon: 'sound-large.png',
  color: '#1a3070', headerColor: '#101e4a', labelColor: '#6090e0',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Kazoo','Bike Horn','Whistle','Bugle','Aoogah','Elephant Trunk','Foghorn','Opera Singer'],
  stats: [
    { label: 'Damage',          values: ['-5','-10','-16','-23','-30','-50','-70','-90'], type: 'values-neg' },
    { label: 'Damage (Encore)', values: ['-6','-11','-18','-26','-33','-55','-77','-99'], type: 'values-neg' },
    { label: 'Damage (Winded)', values: ['-3','-5','-8','-12','-15','-25','-35','-45'], type: 'values-neg' },
    { label: 'Damage (Encore)', values: ['-6','-12','-20','-28','-36','-60','-84','-108'], type: 'values-neg', prestige: true },
    { label: 'XP to Max',       values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

const DROP: GagTrack = {
  name: 'Drop', trackKey: 'drop', largeIcon: 'drop-large.png',
  color: '#107878', headerColor: '#065050', labelColor: '#40d0d0',
  xpMin: GAG_XP_MIN, xpMax: GAG_XP_MAX,
  gags: ['Flower Pot','Sandbag','Bowling Ball','Anvil','Big Weight','Safe','Boulder','Grand Piano'],
  stats: [
    { label: 'Damage',           values: ['-12','-20','-35','-56','-90','-140','-200','-250'], type: 'values-neg' },
    { label: 'DMG (1 Debuff)',   values: ['-13','-22','-38','-61','-99','-154','-220','-275'], type: 'values-neg', prestige: true },
    { label: 'DMG (2 Debuffs)',  values: ['-13','-23','-40','-64','-103','-161','-230','-287'], type: 'values-neg', prestige: true },
    { label: 'DMG (3 Debuffs)',  values: ['-14','-24','-42','-67','-108','-168','-240','-300'], type: 'values-neg', prestige: true },
    { label: 'XP to Max',        values: ['20','100','500','2,000','5,000','9,000','14,000','20,000'], type: 'label' },
  ],
};

export const GAG_TRACKS: GagTrack[] = [TOONUP, TRAP, LURE, THROW, SQUIRT, ZAP, SOUND, DROP];

// Legacy compat — old SectionGags used GAG_XP as a simple string array
export const GAG_XP = GAG_XP_MIN.map((mn, i) => `${mn}-${GAG_XP_MAX[i]} XP`);

