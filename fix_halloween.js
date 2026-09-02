const fs = require('fs');
const p = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c = fs.readFileSync(p, 'utf8');
// Find and replace the Halloween section name — remove the emoji prefix
const before = c.includes('{ name:"\uD83C\uDF83 Halloween"') ? '{ name:"\uD83C\uDF83 Halloween"' : null;
if (before) {
  c = c.replace('{ name:"\uD83C\uDF83 Halloween"', '{ name:"Halloween"');
  console.log('Replaced with emoji lookup');
} else {
  // Try without emoji
  c = c.replace(/\{ name:"[^"]*Halloween"/, '{ name:"Halloween"');
  console.log('Replaced with regex');
}
fs.writeFileSync(p, c, 'utf8');
const check = c.includes('{ name:"Halloween"');
console.log('Has Halloween:', check);
