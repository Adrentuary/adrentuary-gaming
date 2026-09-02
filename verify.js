const fs = require('fs'), path = require('path');
const pub = 'c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\public';
const src = fs.readFileSync('c:\\Users\\skyle\\OneDrive\\Desktop\\Website\\app\\corporate-clash-personal-tracker\\data-collections.ts', 'utf8');
// Extract all image paths from BG(), NP(), NT(), PP(), CE(), EM() calls
const re = /(?:BG|NP|NT|PP|CE|EM)\(['"]([^'"]+)['"]\)/g;
let m, missing = [], ok = 0;
while ((m = re.exec(src)) !== null) {
  // EM paths include subfolder like 'neutral/Agree.gif'
  const fn = m[1];
  // determine folder from the call type
  const callType = src.slice(m.index, m.index + 2);
  const folderMap = { BG: 'profile-backgrounds', NP: 'profile-nameplates', NT: 'profile-nametags', PP: 'profile-poses', CE: 'profile-cheesy-effects', EM: 'emotions' };
  const folder = folderMap[callType];
  const fp = path.join(pub, 'icons', 'collections', folder, fn);
  if (fs.existsSync(fp)) ok++;
  else missing.push(`${callType}('${fn}') -> ${fp}`);
}
console.log(`\nOK: ${ok} | MISSING: ${missing.length}`);
missing.forEach(x => console.log('  MISSING:', x));
