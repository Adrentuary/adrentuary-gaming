const fs = require('fs');
const p = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c = fs.readFileSync(p, 'utf8');
c = c.replace("PP('Pose-I'm_outta_here.png')", 'PP("Pose-I\'m_outta_here.png")');
c = c.replace("NP('FiresN'FlamesNameplate.png')", "NP(\"FiresN'FlamesNameplate.png\")");
fs.writeFileSync(p, c, 'utf8');
console.log('Patched OK');
