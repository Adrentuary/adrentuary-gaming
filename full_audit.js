// Full audit: parse all items from data file, check images exist, flag issues
const fs = require('fs'), path = require('path');
const pub = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\public\\icons\\collections';
const src = fs.readFileSync('c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts', 'utf8');

// Parse all I(...) calls
const itemRe = /I\("([^"]+)","([^"]+)","([^"]+)"(?:,(BG|NP|NT|PP|CE|EM)\('([^']+)'\))?\)/g;
let m;
const items = [];
while ((m = itemRe.exec(src)) !== null) {
  items.push({ name: m[1], type: m[2], how: m[3], fn: m[5], call: m[4] });
}

// Folder map
const folderMap = { BG:'profile-backgrounds', NP:'profile-nameplates', NT:'profile-nametags', PP:'profile-poses', CE:'profile-cheesy-effects', EM:'emotions' };

// Check each image exists
const missing = [], noImg = [];
for (const it of items) {
  if (it.fn && it.call) {
    const fp = path.join(pub, folderMap[it.call], it.fn);
    if (!fs.existsSync(fp)) missing.push(`${it.type} "${it.name}" -> ${it.call}('${it.fn}')`);
  } else {
    noImg.push(`${it.type} "${it.name}"`);
  }
}

// Summary
console.log(`\nTotal items: ${items.length}`);
console.log(`With images: ${items.length - noImg.length}`);
console.log(`Missing files: ${missing.length}`);
console.log(`No image assigned: ${noImg.length}`);

if (missing.length) { console.log('\nMISSING FILES:'); missing.forEach(x => console.log(' ', x)); }
if (noImg.length) { console.log('\nNO IMAGE (placeholder will show):'); noImg.forEach(x => console.log(' ', x)); }

// Per-section counts
const secRe = /\{ name:"([^"]+)"[^}]+items:\[([^\]]*(?:\[[^\]]*\][^\]]*)*)\]\}/gs;
let sm;
console.log('\nSECTION BREAKDOWN:');
const lines = src.split('\n');
let curSec = '';
const secCounts = {};
for (const l of lines) {
  const sm2 = l.match(/\{ name:"([^"]+)"/);
  if (sm2) curSec = sm2[1];
  if (l.includes('I(') && curSec) {
    const tm = l.match(/"([^"]+)","([^"]+)"/);
    if (tm) {
      const k = `${curSec}::${tm[2]}`;
      secCounts[k] = (secCounts[k]||0)+1;
    }
  }
}
for (const [k,v] of Object.entries(secCounts)) {
  const [sec,type] = k.split('::');
  console.log(`  ${sec.padEnd(30)} ${type.padEnd(14)} ${v}`);
}
