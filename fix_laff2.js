const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/SectionLaff.tsx');
let txt = fs.readFileSync(p, 'utf8');

// Add the account banner — find the tracker-card div and insert before it
const target = `      <div className="tracker-card"`;
const replacement = `      <div className="tracker-account-banner">\r\n        <span className="tracker-account-banner-text">\r\n          To reset all toon progress across all sections, visit your{' '}\r\n          <Link href="/account" className="tracker-account-banner-link">Account page</Link>.\r\n        </span>\r\n      </div>\r\n      <div className="tracker-card"`;

if (!txt.includes(target)) { console.error('target not found'); process.exit(1); }
txt = txt.replace(target, replacement);

// Also add Link import if not present
if (!txt.includes("import Link from 'next/link'")) {
  txt = txt.replace(`import { useState`, `import Link from 'next/link';\nimport { useState`);
}

fs.writeFileSync(p, txt, 'utf8');
console.log('Banner added');
