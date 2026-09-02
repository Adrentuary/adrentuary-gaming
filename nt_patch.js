const fs = require('fs');
const p = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts';
let c = fs.readFileSync(p, 'utf8');

// Map: exact name string in data => filename on disk
const map = {
  'Basic':        'Basic_Nametag.png',
  'Plain':        'Plain_Nametag.png',
  'Birthday Bash':'Birthday_Bash_Nametag.png',
  'Spooky':       'Spooky_Nametag.png',
  'Ice Cream':    'Ice_Cream_Nametag.png',
  'Zany':         'Nametag-Zany.png',
  'Boardwalk':    'Boardwalk.png',
  'Nautical':     'Nautical_Nametag.png',
  'Pirate':       'Pirate_Nametag.png',
  'Wonky':        'Wonky.png',
  'Medieval':     'Medieval_Nametag.png',
  'Poetic':       'Poetic.png',
  'Calligraphy':  'Calligraphy_Nametag.png',
  'Silly':        'Silly_Nametag.png',
  'Fancy':        'Fancy_Nametag.png',
  'Playful':      'Playful_Nametag.png',
  'Whimsical':    'Whimsical_Nametag.png',
  'Comical':      'Comical_Nametag.png',
  'Shivering':    'Shivering_Nametag.png',
  'Arrogant':     'Arrogant_Nametag.png',
  'Practical':    'PracticalNametag.png',
  'Action':       'ActionNametag.png',
  'Cinema':       'CinemaNametag.png',
  'Western':      'WesternNametag.png',
};

let count = 0;
for (const [name, file] of Object.entries(map)) {
  // Match lines like: I("Name","Nametag","...<how>"),
  // Replace trailing ), with ,NT('file')),
  const re = new RegExp(
    `(I\\(${JSON.stringify(name)},"Nametag","[^"]*"\\))`,
    'g'
  );
  const replaced = c.replace(re, `$1`.replace('$1', `$1`) );
  // Actually do the replacement properly:
  const pattern = `I(${JSON.stringify(name)},"Nametag",`;
  const idx = c.indexOf(pattern);
  if (idx === -1) { console.log('NOT FOUND:', name); continue; }
  // Find the closing ) of this I(...) call
  const closeIdx = c.indexOf('),', idx);
  const before = c.slice(0, closeIdx);
  const after = c.slice(closeIdx);
  c = before + `,NT('${file}')` + after;
  count++;
}

fs.writeFileSync(p, c, 'utf8');
console.log(`Patched ${count} nametag entries`);
