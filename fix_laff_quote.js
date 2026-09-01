const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/SectionLaff.tsx');
let txt = fs.readFileSync(p, 'utf8');
txt = txt.replace(`<div className="tracker-card"" style=`, `<div className="tracker-card" style=`);
fs.writeFileSync(p, txt, 'utf8');
console.log('Fixed double-quote');
