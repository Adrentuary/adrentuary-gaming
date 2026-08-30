// Bootstrap: reads the TTC header, then concatenates all bb_seg_*.js files
const fs = require('fs'), path = require('path');
const tsPath = path.join(__dirname,'app/corporate-clash-personal-tracker/data-street-shops.ts');
const content = fs.readFileSync(tsPath,'utf8');
const lines = content.split('\n');
const header = lines.slice(0,141).join('\n');
let bb = '\n// ─────────────────────────────────────────────────────────────────────────────\n// BARNACLE BOATYARD\n// ─────────────────────────────────────────────────────────────────────────────\n';
const segs = ['bb_s1.js','bb_s2.js','bb_s3.js','bb_s4.js','bb_s5.js','bb_s6.js','bb_s7.js','bb_s8.js'];
for(const s of segs){ bb += require('./'+s); }
fs.writeFileSync(tsPath, header+bb, 'utf8');
console.log('Done. Lines:', (header+bb).split('\n').length);
