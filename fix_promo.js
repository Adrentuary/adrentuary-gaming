const fs = require('fs');
const dp = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c = fs.readFileSync(dp, 'utf8');
c = c.replace('{ name:"Promotions / Directives / Overclocked"', '{ name:"Promotions & Directives"');
fs.writeFileSync(dp, c, 'utf8');
console.log('data renamed:', c.includes('{ name:"Promotions & Directives"'));

const sp = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\SectionCollections.tsx';
let s = fs.readFileSync(sp, 'utf8');
s = s.replace("'Promotions / Directives / Overclocked':", "'Promotions & Directives':");
fs.writeFileSync(sp, s, 'utf8');
console.log('component renamed:', s.includes("'Promotions & Directives':"));
