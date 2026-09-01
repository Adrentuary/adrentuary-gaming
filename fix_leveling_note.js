const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/SectionLeveling.tsx');
let txt = fs.readFileSync(p, 'utf8');

// Fix garbled en-dash in lastChanges (â€" is mangled UTF-8 of –)
txt = txt.replace(
  /Levels 2.{1,6}85 with full reward data\. Clicking a level auto-marks all prior levels for that toon\./,
  'Levels 2-85 with full reward data. Clicking a level auto-marks all previous levels for that toon.'
);

if (!txt.includes('Levels 2-85')) { console.error('replacement not found'); process.exit(1); }
fs.writeFileSync(p, txt, 'utf8');
console.log('Done.');
