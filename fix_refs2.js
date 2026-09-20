/**
 * fix_refs2.js — thorough pass to replace ALL remaining .png/.gif → .webp in code
 * Uses a simple string replace on every .png and .gif occurrence except protected ones.
 */
const fs   = require('fs');
const path = require('path');

const ROOT    = __dirname;
const APP_DIR = path.join(ROOT, 'app');

// Exact full strings that must NOT be replaced
const KEEP = [
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'og.png',
  'logo.png',
];

const CODE_EXTS = new Set(['.ts','.tsx','.css','.js']);

function walk(dir, results = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, results);
    else results.push(full);
  }
  return results;
}

// Skip node_modules inside app/
function shouldSkip(f) {
  return f.includes(path.sep + 'node_modules' + path.sep);
}

let totalFiles = 0, totalReps = 0;

const files = walk(APP_DIR).filter(f => CODE_EXTS.has(path.extname(f)) && !shouldSkip(f));

for (const file of files) {
  const orig = fs.readFileSync(file, 'utf8');
  let src = orig;

  // Process line by line
  const lines = src.split('\n').map(line => {
    // Skip wallpaper download lines entirely
    if (/wallpapers.*\.png.*download|href=.*wallpapers.*\.png/.test(line)) return line;

    // Temporarily protect KEEP strings by replacing them with a placeholder
    const saved = [];
    let l = line;
    for (const k of KEEP) {
      if (l.includes(k)) {
        const placeholder = `__KEEP${saved.length}__`;
        saved.push(k);
        l = l.split(k).join(placeholder);
      }
    }

    // Replace .png and .gif with .webp everywhere
    l = l.replace(/\.png(?=[^a-zA-Z0-9]|$)/g, '.webp');
    l = l.replace(/\.gif(?=[^a-zA-Z0-9]|$)/g, '.webp');

    // Restore protected strings
    for (let i = 0; i < saved.length; i++) {
      l = l.split(`__KEEP${i}__`).join(saved[i]);
    }

    return l;
  });

  src = lines.join('\n');

  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    // Count how many .png/.gif remain vs before
    const before = (orig.match(/\.(png|gif)(?=[^a-zA-Z0-9]|$)/g) || []).length;
    const after  = (src .match(/\.(png|gif)(?=[^a-zA-Z0-9]|$)/g) || []).length;
    const reps = before - after;
    console.log(`  ${path.relative(ROOT, file).padEnd(65)} (${reps} replaced)`);
    totalFiles++;
    totalReps += reps;
  }
}

console.log(`\nDone: ${totalReps} replacements across ${totalFiles} files`);
