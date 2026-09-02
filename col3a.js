const fs = require('fs');
const p = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c = fs.readFileSync(p, 'utf8');
function rep(from, to) {
  if (!c.includes(from)) { console.error('NOT FOUND:', JSON.stringify(from).slice(0,100)); return; }
  c = c.replace(from, to);
}

// 1. MISC: Add Cybertoon BG after Duck Shuffler BG
rep(
  `I("Duck Shuffler","Background","Awarded after defeating the Duck Shuffler",BG('DuckShufflerBackground.png')),`,
  `I("Duck Shuffler","Background","Awarded after defeating the Duck Shuffler",BG('DuckShufflerBackground.png')),\n    I("Cybertoon","Background","Awarded from a special event",BG('CybertoonBackground.png')),`
);
// 2. MISC: Add Cybertoon NP after Game Show NP
rep(
  `I("Game Show","Nameplate","Awarded after defeating the High Roller 13 times",NP('GameShowNameplate.png')),`,
  `I("Game Show","Nameplate","Awarded after defeating the High Roller 13 times",NP('GameShowNameplate.png')),\n    I("Cybertoon","Nameplate","Awarded from a special event",NP('CybertoonNameplate.png')),`
);
// 3. GUMBALL: Stars → Stars.png
rep(
  `I("Stars","Nameplate","Purchasable from the G.U.M.B.A.L.L. Machine"),`,
  `I("Stars","Nameplate","Purchasable from the G.U.M.B.A.L.L. Machine",NP('Stars.png')),`
);
// 4. HALLOWEEN: Spooky Bat → Spookybat.png
rep(`NP('HW2020nameplate.png')`, `NP('Spookybat.png')`);
// 5. CHRISTMAS: Night Lights → dedicated NightLights.png
rep(
  `I("Night Lights","Nameplate","Toonsmas event reward",NP('LightsShowNameplate.png')),`,
  `I("Night Lights","Nameplate","Toonsmas event reward",NP('NightLights.png')),`
);
// 6. MEZZO: Sky BG → MezzoMelodylandSky.png
rep(`BG('MezzoBackground.png')`, `BG('MezzoMelodylandSky.png')`);
// 7. PROMOTIONS: Add Sellbot Paint + Crochet NP
rep(
  `I("Sellbot HQ","Background","Awarded for reaching the Sellbot HQ Playground",BG('SellbotHQBackground.png')),`,
  `I("Sellbot HQ","Background","Awarded for reaching the Sellbot HQ Playground",BG('SellbotHQBackground.png')),\n    I("Sellbot Paint","Nameplate","Awarded after completing Overclocked Find the Foreman (April Toons 2022)",NP('SellbotPaintNameplate.png')),`
);
rep(
  `I("Turning It Up To 11","Nameplate","Awarded after completing a Mezzo Melodyland Kudos Rank-Up Task",NP('Turningitupto11.png')),`,
  `I("Turning It Up To 11","Nameplate","Awarded after completing a Mezzo Melodyland Kudos Rank-Up Task",NP('Turningitupto11.png')),\n    I("Crochet","Nameplate","Awarded from a special event",NP('Crochet.png')),`
);
// 8. UNOBTAINABLE: Candy → Candy.png
rep(
  `I("Candy","Nameplate","Unobtainable event reward"),`,
  `I("Candy","Nameplate","Unobtainable event reward",NP('Candy.png')),`
);
// 9. DROWSY DREAMLAND: Add Resistance Salute emotion
rep(
  `I("Naptime","Profile Pose","Awarded after reaching Drowsy Dreamland Kudos Rank 5"`,
  `I("Resistance Salute","Emotion","Say SpeedChat \\"Would you like some help?\\" under Friendly to Whispering Willow in Talking In Your Sleep Voice Training on Pajama Place, Drowsy Dreamland",EM('neutral/Resistance_Salute.gif')),\n    I("Naptime","Profile Pose","Awarded after reaching Drowsy Dreamland Kudos Rank 5"`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Part A done');
require('./col3b.js');
