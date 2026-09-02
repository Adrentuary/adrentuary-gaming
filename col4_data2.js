const fs=require('fs');
const p='c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c=fs.readFileSync(p,'utf8');

// ── Replace entire Misc section + insert Cattlelog Purchases ────────────────
const miscStart=c.indexOf('{ name:"Misc."');
const miscEnd=c.indexOf('\n  { name:',miscStart+10);

const newMisc=`{ name:"Misc.", icon:"🌟", color:"#2a1a00", accent:"#ffaa00", items:[
    I("Pacesetter & Firestarter","Background","Awarded after using the code FIRESETTER",BG('Pacesetter&FirestarterBackground.png')),
    I("Game Show","Background","Awarded after defeating the High Roller 13 times",BG('GameShowBackground.png')),
    I("Duck Shuffler","Background","Awarded after defeating the Duck Shuffler",BG('DuckShufflerBackground.png')),
    I("Cybertoon","Background","Awarded from a special event",BG('CybertoonBackground.png')),
    I("Pacesetter & Firestarter","Nameplate","Awarded after using the code FIRESETTER",NP('Pacesetter&FirestarterNameplate.png')),
    I("Game Show","Nameplate","Awarded after defeating the High Roller 13 times",NP('GameShowNameplate.png')),
    I("Green Duck Shuffler","Nameplate","Awarded after defeating the Duck Shuffler",NP('GreenDuckShufflerNameplate.png')),
    I("Red Duck Shuffler","Nameplate","Awarded after defeating the Duck Shuffler",NP('RedDuckShufflerNameplate.png')),
    I("Cybertoon","Nameplate","Awarded from a special event",NP('CybertoonNameplate.png')),
    I("Birthday Bash","Nametag","Rewarded during Corporate Clash's 6th Anniversary event",NT('Birthday_Bash_Nametag.png')),
    I("Sad","Emotion","Available at start of game",EM('negative/Sad.gif')),
  ]},
  { name:"Cattlelog Purchases", icon:"📦", color:"#1a1020", accent:"#aa88ff", items:[
    I("Applause","Emotion","Purchasable from the Cattlelog (Series 1, #5 / Series 3, #12)",EM('positive/Applause.gif')),
    I("Banana Peel","Emotion","Purchasable from the Cattlelog (Series 7, #10)",EM('negative/BananaPeel.gif')),
    I("Belly Flop","Emotion","Purchasable from the Cattlelog (Series 7, #5)",EM('negative/BellyFlop.gif')),
    I("Bored","Emotion","Purchasable from the Cattlelog (Series 2, #9)",EM('negative/Bored.gif')),
    I("Bow","Emotion","Purchasable from the Cattlelog (Series 1, #9 / Series 3, #8)",EM('positive/Bow.gif')),
    I("Confused","Emotion","Purchasable from the Cattlelog (Series 2, #1)",EM('negative/Confused.gif')),
    I("Cringe","Emotion","Purchasable from the Cattlelog (Series 4, #12)",EM('negative/Cringe.gif')),
    I("Cry","Emotion","Purchasable from the Cattlelog (Series 1, #1)\\n\\nNever goes to backorder",EM('negative/Cry.gif')),
    I("Dance","Emotion","Purchasable from the Cattlelog (Series 2, #5)",EM('positive/Dance.gif')),
    I("Delighted","Emotion","Purchasable from the Cattlelog (Series 1, #1)\\n\\nNever goes to backorder",EM('positive/Delighted.gif')),
    I("Furious","Emotion","Purchasable from the Cattlelog (Series 1, #1)\\n\\nNever goes to backorder",EM('negative/Furious.gif')),
    I("Laugh","Emotion","Purchasable from the Cattlelog (Series 1, #1)\\n\\nNever goes to backorder",EM('positive/Laugh.gif')),
    I("Shrug","Emotion","Purchasable from the Cattlelog (Series 1, #1 / Series 3, #1)",EM('neutral/Shrug.gif')),
    I("Surprise","Emotion","Purchasable from the Cattlelog (Series 1, #1)\\n\\nNever goes to backorder",EM('positive/Surprise.gif')),
    I("Taunt","Emotion","Purchasable from the Cattlelog (Series 1, #1)\\n\\nNever goes to backorder",EM('negative/Taunt.gif')),
    I("Think","Emotion","Purchasable from the Cattlelog (Series 4, #6)",EM('neutral/Think.gif')),
    I("Yawn","Emotion","Purchasable from the Cattlelog (Series 1, #1)\\n\\nNever goes to backorder",EM('neutral/Yawn.gif')),
  ]},
  `;

c=c.slice(0,miscStart)+newMisc+c.slice(miscEnd+2);

// ── A-Z sort Nametag, Profile Pose, Cheesy Effect, Emotion lines ─────────────
const ALPHA=new Set(['Nametag','Profile Pose','Cheesy Effect','Emotion']);
const lines=c.split('\n');
const out=[];let buf=[];
for(const l of lines){
  const m=l.match(/^\s+I\("([^"]+)","([^"]+)",/);
  if(m&&ALPHA.has(m[2])){buf.push(l);}
  else{
    if(buf.length){
      buf.sort((a,b)=>{const na=a.match(/I\("([^"]+)"/)[1],nb=b.match(/I\("([^"]+)"/)[1];return na.localeCompare(nb,'en',{sensitivity:'base'});});
      out.push(...buf);buf=[];
    }
    out.push(l);
  }
}
if(buf.length){buf.sort((a,b)=>{const na=a.match(/I\("([^"]+)"/)[1],nb=b.match(/I\("([^"]+)"/)[1];return na.localeCompare(nb,'en',{sensitivity:'base'});});out.push(...buf);}
c=out.join('\n');

fs.writeFileSync(p,c,'utf8');
console.log('data2 done — items:',(c.match(/,"Emotion",/g)||[]).length,'emotions');
