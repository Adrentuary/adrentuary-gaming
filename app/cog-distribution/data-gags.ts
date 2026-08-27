export interface GagTrack { name: string; color: string; gags: string[] }
export const GAG_TRACKS: GagTrack[] = [
  { name: 'Toon-Up', color: '#7b2d8b', gags: ['Feather','Megaphone','Lipstick','Bamboo Cane','Pixie Dust','Juggling Cubes','Confetti Canon','High Dive'] },
  { name: 'Trap', color: '#a82020', gags: ['Banana Peel','Rake','Springboard','Marbles','Quicksand','Trapdoor','Wrecking Ball','TNT'] },
  { name: 'Lure', color: '#2e6e3f', gags: ['$1 Bill','Snail Magnet','$5 Bill','Big Magnet','$10 Bill','Hypno-goggles','$50 Bill','Presentation'] },
  { name: 'Throw', color: '#b05a10', gags: ['Cupcake','Fruit Pie Slice','Cream Pie Slice','Birthday Cake Slice','Whole Fruit Pie','Whole Cream Pie','Birthday Cake','Wedding Cake'] },
  { name: 'Squirt', color: '#1a5e9a', gags: ['Squirting Flower','Glass of Water','Squirt Gun','Water Balloon','Seltzer Bottle','Fire Hose','Storm Cloud','Geyser'] },
  { name: 'Zap', color: '#7a6a10', gags: ['Joybuzzer','Lightbulb','Broken Radio','Kart Battery','Broken Television','Stagelight','Tesla Coil','Lightning'] },
  { name: 'Sound', color: '#2a5080', gags: ['Kazoo','Blue Horn','Whistle','Bugle','Foghorn','Elephant Trunk','Opera Singer','—'] },
  { name: 'Drop', color: '#2a5030', gags: ['Flower Pot','Sandbag','Bowling Ball','Anvil','Big Weight','Safe','Boulder','Grand Piano'] },
];
export const GAG_XP = ['0 XP','20 XP','100 XP','500 XP','2,000 XP','6,000 XP','20,000 XP','40,000 XP'];
