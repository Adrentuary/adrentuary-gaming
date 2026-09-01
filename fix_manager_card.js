const fs = require('fs'), path = require('path');

// ── 1. Update PlaygroundInfoModal.tsx ────────────────────────────────────────
const tsxPath = path.join(__dirname, 'app/corporate-clash-personal-tracker/PlaygroundInfoModal.tsx');
let tsx = fs.readFileSync(tsxPath, 'utf8');

// Update interface: replace streetManagerRole with two fields
tsx = tsx.replace(
  `  streetManagerRole: string;`,
  `  streetManagerTitle: string;\n  streetManagerDept: string;\n  streetManagerStats: string;`
);

// Update TTC data
tsx = tsx.replace(
  `streetManagerRole: 'Toontown Central Street Manager \xc2\xb7 Cashbot \xc2\xb7 Level 5 \xc2\xb7 200 HP',`,
  `streetManagerTitle: 'Toontown Central Street Manager',\n    streetManagerDept: 'Cashbot',\n    streetManagerStats: 'Level 5 \xc2\xb7 200 HP',`
);
// fallback if encoding differs
tsx = tsx.replace(
  `streetManagerRole: 'Toontown Central Street Manager · Cashbot · Level 5 · 200 HP',`,
  `streetManagerTitle: 'Toontown Central Street Manager',\n    streetManagerDept: 'Cashbot',\n    streetManagerStats: 'Level 5 · 200 HP',`
);

// Update BB data
tsx = tsx.replace(
  `streetManagerRole: 'Barnacle Boatyard Street Manager \xc2\xb7 Boardbot \xc2\xb7 Level 7 \xc2\xb7 400 HP',`,
  `streetManagerTitle: 'Barnacle Boatyard Street Manager',\n    streetManagerDept: 'Boardbot',\n    streetManagerStats: 'Level 7 \xc2\xb7 400 HP',`
);
tsx = tsx.replace(
  `streetManagerRole: 'Barnacle Boatyard Street Manager · Boardbot · Level 7 · 400 HP',`,
  `streetManagerTitle: 'Barnacle Boatyard Street Manager',\n    streetManagerDept: 'Boardbot',\n    streetManagerStats: 'Level 7 · 400 HP',`
);

// Update the JSX render: replace the single role span with two new spans
tsx = tsx.replace(
  `              <div className="pgm-manager-info">\n                <span className="pgm-manager-name">{data.streetManager}</span>\n                <span className="pgm-manager-role">{data.streetManagerRole}</span>\n              </div>`,
  `              <div className="pgm-manager-info">\n                <span className="pgm-manager-name">{data.streetManager}</span>\n                <span className="pgm-manager-title">{data.streetManagerTitle}</span>\n                <span className="pgm-manager-dept">{data.streetManagerDept}</span>\n                <span className="pgm-manager-stats">{data.streetManagerStats}</span>\n              </div>`
);

fs.writeFileSync(tsxPath, tsx, 'utf8');
console.log('TSX updated');

// ── 2. Update globals.css ─────────────────────────────────────────────────────
const cssPath = path.join(__dirname, 'app/globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace the old single role rule with three new rules + update info padding/gap
css = css.replace(
  `.pgm-manager-info{padding:10px 12px;display:flex;flex-direction:column;gap:3px;border-top:1px solid #1e2e1e}`,
  `.pgm-manager-info{padding:12px 14px;display:flex;flex-direction:column;gap:2px;border-top:1px solid #1e2e1e}`
);
css = css.replace(
  `.pgm-manager-name{font-size:14px;font-weight:800;color:var(--ink)}`,
  `.pgm-manager-name{font-size:16px;font-weight:800;color:var(--ink);margin-bottom:4px}`
);
css = css.replace(
  `.pgm-manager-role{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--pgm-accent,#d86b10)}`,
  `.pgm-manager-title{font-size:10px;font-weight:700;letter-spacing:.10em;text-transform:uppercase;color:var(--pgm-accent,#d86b10);line-height:1.4}` +
  `.pgm-manager-dept{font-size:10px;font-weight:700;letter-spacing:.10em;text-transform:uppercase;color:var(--pgm-accent,#d86b10);margin-top:6px;line-height:1.4}` +
  `.pgm-manager-stats{font-size:10px;font-weight:700;letter-spacing:.10em;text-transform:uppercase;color:var(--pgm-accent,#d86b10);line-height:1.4}`
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS updated');
