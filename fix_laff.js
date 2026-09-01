const fs = require('fs'), path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/SectionLaff.tsx');
let txt = fs.readFileSync(p, 'utf8');

// 1. Add Link import after existing imports
txt = txt.replace(
  `'use client';\nimport { useState } from 'react';`,
  `'use client';\nimport { useState, useEffect } from 'react';\nimport Link from 'next/link';`
);

// 2. Replace openGroups useState with localStorage-persisted version
txt = txt.replace(
  `const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(LAFF_GROUPS));`,
  `const STORAGE_KEY = 'laff-open-groups';
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set(LAFF_GROUPS);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(LAFF_GROUPS);
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...openGroups])); } catch {}
  }, [openGroups]);`
);

// 3. Remove the section-header rows (progress bars) — the entire rows.push for laff-section-header
txt = txt.replace(
  /\s*if \(!renderedSections\.has\(entry\.section\)\) \{[\s\S]*?rows\.push\(<tr key=\{`sec-\$\{entry\.section\}`\} className="laff-section-header">[\s\S]*?<\/td><\/tr>\);\s*\}/,
  `\n                if (!renderedSections.has(entry.section)) {
                  renderedSections.add(entry.section);
                }`
);

// 4. Add account banner after the SectionNote closing />  in the return JSX
// Find the pattern:  lastChanges=.../>  \n      <div className="tracker-card"
txt = txt.replace(
  `      />\n      <div className="tracker-card"`,
  `      />\n      <div className="tracker-account-banner">\n        <span className="tracker-account-banner-text">\n          To reset all toon progress across all sections, visit your{' '}\n          <Link href="/account" className="tracker-account-banner-link">Account page</Link>.\n        </span>\n      </div>\n      <div className="tracker-card"`
);

fs.writeFileSync(p, txt, 'utf8');
console.log('SectionLaff updated');
