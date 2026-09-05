const fs = require('fs');
const path = require('path');

// Bad bytes: c3 a2 e2 82 ac e2 80 9d (mojibake for em dash)
// Replace with: e2 80 94 (UTF-8 em dash U+2014)
const bad = Buffer.from([0xc3, 0xa2, 0xe2, 0x82, 0xac, 0xe2, 0x80, 0x9d]);
const good = Buffer.from([0xe2, 0x80, 0x94]);

function fixFile(filePath) {
  let result = fs.readFileSync(filePath);
  let count = 0;
  while (true) {
    let idx = -1;
    for (let i = 0; i <= result.length - bad.length; i++) {
      let match = true;
      for (let j = 0; j < bad.length; j++) {
        if (result[i + j] !== bad[j]) { match = false; break; }
      }
      if (match) { idx = i; break; }
    }
    if (idx === -1) break;
    result = Buffer.concat([result.slice(0, idx), good, result.slice(idx + bad.length)]);
    count++;
  }
  fs.writeFileSync(filePath, result);
  console.log('Fixed ' + count + ' mojibake em-dashes in ' + path.basename(filePath));
}

fixFile(path.join(__dirname, 'app/corporate-clash-personal-tracker/PromoInfoModal.tsx'));
fixFile(path.join(__dirname, 'app/globals.css'));
