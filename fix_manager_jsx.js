const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/PlaygroundInfoModal.tsx');
let txt = fs.readFileSync(p, 'utf8');

// Replace the old single role span (handle both \r\n and \n)
const oldSpan = `<span className="pgm-manager-role">{data.streetManagerRole}</span>`;
const newSpans = `<span className="pgm-manager-title">{data.streetManagerTitle}</span>\r\n                <span className="pgm-manager-dept">{data.streetManagerDept}</span>\r\n                <span className="pgm-manager-stats">{data.streetManagerStats}</span>`;

if (!txt.includes(oldSpan)) { console.error('OLD SPAN NOT FOUND'); process.exit(1); }
txt = txt.replace(oldSpan, newSpans);
fs.writeFileSync(p, txt, 'utf8');
console.log('JSX spans updated');
