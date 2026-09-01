const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/SectionLaff.tsx');
let txt = fs.readFileSync(p, 'utf8');

// Remove the account banner block
const bannerStart = `      <div className="tracker-account-banner">`;
const bannerEnd = `      </div>\r\n      <div className="tracker-card"`;
const bannerEndAlt = `      </div>\n      <div className="tracker-card"`;

const idxStart = txt.indexOf(bannerStart);
if (idxStart === -1) { console.error('banner not found'); process.exit(1); }

// Find the end of the banner (look for the tracker-card div after it)
let idxEnd = txt.indexOf(bannerEnd, idxStart);
if (idxEnd === -1) idxEnd = txt.indexOf(bannerEndAlt, idxStart);
if (idxEnd === -1) { console.error('banner end not found'); process.exit(1); }

// Remove from banner start to just before the tracker-card div
const endOfBanner = idxEnd + (txt[idxEnd + bannerEnd.length - 1] === '\r' ? bannerEnd.length : bannerEndAlt.length);
txt = txt.slice(0, idxStart) + `      <div className="tracker-card"` + txt.slice(endOfBanner);

// Remove unused Link import if no other usage
if (!txt.includes('<Link') && txt.includes(`import Link from 'next/link';`)) {
  txt = txt.replace(`import Link from 'next/link';\r\n`, '').replace(`import Link from 'next/link';\n`, '');
}

fs.writeFileSync(p, txt, 'utf8');
console.log('Banner removed from SectionLaff');
