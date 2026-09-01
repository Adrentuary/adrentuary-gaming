const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/SectionLaff.tsx');
let txt = fs.readFileSync(p, 'utf8');
txt = txt.replace(`import { useState } from 'react';`, `import { useState, useEffect } from 'react';`);
if (!txt.includes('useEffect')) { console.error('not fixed'); process.exit(1); }
fs.writeFileSync(p, txt, 'utf8');
console.log('Done');
