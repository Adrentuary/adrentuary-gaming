const fs = require('fs');
const c = fs.readFileSync('c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts', 'utf8');
const re = /\{ name:"([^"]+)", icon:"([^"]+)"/g;
let m;
while ((m = re.exec(c)) !== null) {
  const name = m[1], icon = m[2];
  console.log(`name=${JSON.stringify(name)}  icon=${JSON.stringify(icon)}`);
}
