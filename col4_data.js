const fs=require('fs');
const p='c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c=fs.readFileSync(p,'utf8');
function rep(from,to){if(!c.includes(from)){console.error('NOT FOUND:',from.slice(0,70));return;}c=c.replace(from,to);}

// Fix nametag unlocks per wiki
rep(`I("Zany","Nametag","Awarded after completing a Toontown Central task"`,`I("Zany","Nametag","Rewarded from the Monkey See Monkey Do sidetask"`);
rep(`I("Ice Cream","Nametag","Awarded after reaching Toontown Central Kudos Rank 8"`,`I("Ice Cream","Nametag","Rewarded for completing the Double Coil and Trouble Rank-Up Task (Kudos Rank 8, Toontown Central)"`);
rep(`I("Boardwalk","Nametag","Awarded after completing a Barnacle Boatyard task"`,`I("Boardwalk","Nametag","Rewarded from the Straight to Boardwalk sidetask"`);
rep(`I("Wonky","Nametag","Awarded after completing a Barnacle Boatyard task"`,`I("Wonky","Nametag","Rewarded from the First Mate Makeover sidetask"`);
rep(`I("Nautical","Nametag","Awarded after completing a Barnacle Boatyard task"`,`I("Nautical","Nametag","Rewarded from The Salty Spit-toon sidetask"`);
rep(`I("Pirate","Nametag","Awarded after completing a Barnacle Boatyard task"`,`I("Pirate","Nametag","Rewarded for completing the 7th Layer Wrapping Paper Rank-Up Task (Kudos Rank 8, Barnacle Boatyard)"`);
rep(`I("Poetic","Nametag","Awarded after completing a Ye Olde Toontowne task"`,`I("Poetic","Nametag","Rewarded from the Midlife Crisis sidetask"`);
rep(`I("Medieval","Nametag","Awarded after completing a Ye Olde Toontowne task"`,`I("Medieval","Nametag","Rewarded for completing the Fishing Fiasco Rank-Up Task (Kudos Rank 8, Ye Olde Toontowne)"`);
rep(`I("Calligraphy","Nametag","Awarded after completing a Daffodil Gardens task"`,`I("Calligraphy","Nametag","Rewarded for completing the Quaking and Breaking Rank-Up Task (Kudos Rank 8, Daffodil Gardens)"`);
rep(`I("Silly","Nametag","Awarded after completing a Daffodil Gardens task"`,`I("Silly","Nametag","Rewarded from the Not-So-Instant Film sidetask"`);
rep(`I("Fancy","Nametag","Awarded after completing a Mezzo Melodyland task"`,`I("Fancy","Nametag","Rewarded from the Got You Covered! sidetask"`);
rep(`I("Playful","Nametag","Awarded after completing a Mezzo Melodyland task"`,`I("Playful","Nametag","Rewarded for completing the Phonic Phraudulence Rank-Up Task (Kudos Rank 8, Mezzo Melodyland)"`);
rep(`I("Whimsical","Nametag","Awarded after completing a Mezzo Melodyland task"`,`I("Whimsical","Nametag","Rewarded from the Flat Notes & Profiles sidetask"`);
rep(`I("Comical","Nametag","Awarded after completing a The Brrrgh task"`,`I("Comical","Nametag","Rewarded from the Soup Served Sad sidetask"`);
rep(`I("Shivering","Nametag","Awarded after completing a The Brrrgh task"`,`I("Shivering","Nametag","Rewarded from the Stevey The Snowman! sidetask"`);
rep(`I("Arrogant","Nametag","Awarded after completing an Acorn Acres task"`,`I("Arrogant","Nametag","Rewarded from the Nathan's Nutrition sidetask"`);
rep(`I("Practical","Nametag","Awarded after completing an Acorn Acres task"`,`I("Practical","Nametag","Rewarded from the When Nature Calls sidetask"`);
rep(`I("Action","Nametag","Awarded after completing a Drowsy Dreamland task"`,`I("Action","Nametag","Rewarded from the Short Story sidetask"`);
rep(`I("Cinema","Nametag","Awarded after completing a Drowsy Dreamland task"`,`I("Cinema","Nametag","Rewarded for completing the Doze Were Mine! Rank-Up Task (Kudos Rank 8, Drowsy Dreamland)"`);
rep(`I("Western","Nametag","Awarded after completing a Drowsy Dreamland task"`,`I("Western","Nametag","Rewarded from the Ol' West sidetask"`);
rep(`I("Spooky","Nametag","Awarded during Halloween events"`,`I("Spooky","Nametag","Available in Elphabat's shop during Halloween events for 40 of every Shkrafting material"`);
rep(`I("Birthday Bash","Nametag","Special event reward"`,`I("Birthday Bash","Nametag","Rewarded during Corporate Clash's 6th Anniversary event"`);
// Rename Crochet
rep(`I("Crochet","Nameplate","Awarded from a special event",NP('Crochet.png'))`,`I("Crochet Lessons","Nameplate","Awarded for completing the Memo Mishap Directive",NP('Crochet.png'))`);
// Christmas → Toonsmas
rep(`{ name:"🎄 Christmas", icon:"🎄"`,`{ name:"Toonsmas", icon:"🎄"`);
// Fix Drowsy Dreamland BG image swap (wiki: PGBackground=progression, plain=sky)
rep(`BG('DrowsyDreamlandBackground.png')),\n    I("Drowsy Dreamland Sky","Background","Awarded for visiting Drowsy Dreamland",BG('DrowsyDreamlandPGBackground.png'))`,`BG('DrowsyDreamlandPGBackground.png')),\n    I("Drowsy Dreamland Sky","Background","Awarded for visiting Drowsy Dreamland",BG('DrowsyDreamlandBackground.png'))`);
// Fix Mezzo BG image swap (wiki: MezzoBackground=mainline, MezzoMelodylandBackground=sky)
rep(`BG('MezzoMelodylandBackground.png')),\n    I("Mezzo Melodyland Sky","Background","Awarded for visiting Mezzo Melodyland",BG('MezzoMelodylandSky.png'))`,`BG('MezzoBackground.png')),\n    I("Mezzo Melodyland Sky","Background","Awarded for visiting Mezzo Melodyland",BG('MezzoMelodylandBackground.png'))`);

fs.writeFileSync(p,c,'utf8');
console.log('col4_data done');
require('./col4_data2.js');
