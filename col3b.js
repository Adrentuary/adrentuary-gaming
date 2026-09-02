const fs = require('fs');
const p = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c = fs.readFileSync(p, 'utf8');
function rep(from, to) {
  if (!c.includes(from)) { console.error('NOT FOUND:', JSON.stringify(from).slice(0,100)); return; }
  c = c.replace(from, to);
}

// MISC: Insert all Cattlelog series emotions + Sad default after Birthday Bash nametag
rep(
  `I("Birthday Bash","Nametag","Special event reward",NT('Birthday_Bash_Nametag.png')),`,
  `I("Birthday Bash","Nametag","Special event reward",NT('Birthday_Bash_Nametag.png')),
    I("Sad","Emotion","Available at start of game",EM('negative/Sad.gif')),
    I("Shrug","Emotion","Purchasable from the Cattlelog (Series 1, #1 / Series 3, #1)",EM('neutral/Shrug.gif')),
    I("Think","Emotion","Purchasable from the Cattlelog (Series 4, #6)",EM('neutral/Think.gif')),
    I("Yawn","Emotion","Purchasable from the Cattlelog (Series 1, #1) — never goes to backorder",EM('neutral/Yawn.gif')),
    I("Laugh","Emotion","Purchasable from the Cattlelog (Series 1, #1) — never goes to backorder",EM('positive/Laugh.gif')),
    I("Dance","Emotion","Purchasable from the Cattlelog (Series 2, #5)",EM('positive/Dance.gif')),
    I("Applause","Emotion","Purchasable from the Cattlelog (Series 1, #5 / Series 3, #12)",EM('positive/Applause.gif')),
    I("Delighted","Emotion","Purchasable from the Cattlelog (Series 1, #1) — never goes to backorder",EM('positive/Delighted.gif')),
    I("Surprise","Emotion","Purchasable from the Cattlelog (Series 1, #1) — never goes to backorder",EM('positive/Surprise.gif')),
    I("Bow","Emotion","Purchasable from the Cattlelog (Series 1, #9 / Series 3, #8)",EM('positive/Bow.gif')),
    I("Furious","Emotion","Purchasable from the Cattlelog (Series 1, #1) — never goes to backorder",EM('negative/Furious.gif')),
    I("Cry","Emotion","Purchasable from the Cattlelog (Series 1, #1) — never goes to backorder",EM('negative/Cry.gif')),
    I("Cringe","Emotion","Purchasable from the Cattlelog (Series 4, #12)",EM('negative/Cringe.gif')),
    I("Confused","Emotion","Purchasable from the Cattlelog (Series 2, #1)",EM('negative/Confused.gif')),
    I("Belly Flop","Emotion","Purchasable from the Cattlelog (Series 7, #5)",EM('negative/BellyFlop.gif')),
    I("Banana Peel","Emotion","Purchasable from the Cattlelog (Series 7, #10)",EM('negative/BananaPeel.gif')),
    I("Bored","Emotion","Purchasable from the Cattlelog (Series 2, #9)",EM('negative/Bored.gif')),
    I("Taunt","Emotion","Purchasable from the Cattlelog (Series 1, #1) — never goes to backorder",EM('negative/Taunt.gif')),`
);

fs.writeFileSync(p, c, 'utf8');
const emCount = (c.match(/,"Emotion",/g)||[]).length;
const ntCount = (c.match(/,"Nametag",/g)||[]).length;
console.log('Part B done — Emotions:', emCount, '| Nametags:', ntCount);
