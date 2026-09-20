/**
 * fix_refs.js
 * 1. Converts remaining .gif files in /public to animated .webp
 * 2. Fixes all .gif and .png references in app/ code → .webp
 *    (handles both /path/to/file.gif AND bare 'filename.gif' patterns)
 *
 * Run: node fix_refs.js
 */

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const ROOT       = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const APP_DIR    = path.join(ROOT, 'app');

// These must always stay .png
const KEEP_PNG = new Set([
  'apple-touch-icon.png','icon-192.png','icon-512.png','og.png','logo.png',
]);

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else results.push(full);
  }
  return results;
}

// ── 1. Convert remaining GIFs ─────────────────────────────────────────────────
async function convertGifs() {
  console.log('\n=== Converting remaining GIFs to animated WebP ===\n');
  const gifs = walk(PUBLIC_DIR).filter(f => f.toLowerCase().endsWith('.gif'));
  let done = 0, errors = 0;

  for (const gif of gifs) {
    const outPath = gif.slice(0, -4) + '.webp';
    if (fs.existsSync(outPath)) {
      // Already converted — just remove the gif
      fs.unlinkSync(gif);
      console.log(`  SKIP (webp exists, removed gif): ${path.relative(PUBLIC_DIR, gif)}`);
      continue;
    }
    try {
      await sharp(gif, { animated: true }).webp({ quality: 80, effort: 4 }).toFile(outPath);
      fs.unlinkSync(gif);
      console.log(`  OK   ${path.relative(PUBLIC_DIR, gif)}`);
      done++;
    } catch (err) {
      console.error(`  ERR  ${path.relative(PUBLIC_DIR, gif)}: ${err.message}`);
      errors++;
    }
  }
  console.log(`\nGIFs converted: ${done}, errors: ${errors}`);
}

// ── 2. Fix code references ────────────────────────────────────────────────────
function fixCodeRefs() {
  console.log('\n=== Fixing .gif and .png references in code ===\n');
  const CODE_EXTS = new Set(['.ts','.tsx','.css','.js']);
  const files = walk(APP_DIR).filter(f => CODE_EXTS.has(path.extname(f)));

  let totalFiles = 0, totalReps = 0;

  for (const file of files) {
    const orig = fs.readFileSync(file, 'utf8');
    let src = orig;

    // Split to lines so we can skip wallpaper download lines
    const lines = src.split('\n').map(line => {
      // Never touch wallpaper download hrefs
      if (/wallpapers.*\.png.*download|href.*wallpapers.*\.png/.test(line)) return line;
      // Never replace system png filenames
      if (/apple-touch-icon|icon-192|icon-512|og\.png|logo\.png/.test(line)) return line;

      // Pattern A: /some/path/file.gif or /some/path/file.png  (URL-style with leading slash)
      line = line.replace(/(\/[^\s"'`()\[\]{}]+)\.(gif|png)(?=["'`)\s\]])/g, '$1.webp');

      // Pattern B: bare filename like 'SomeName.gif' or `SomeName.png`
      // (word chars, no slash prefix — used in data files)
      line = line.replace(/(['"` ]([A-Za-z0-9_'\-]+))\.(gif|png)(?=['"`\)])/g, '$1.webp');

      return line;
    });

    src = lines.join('\n');

    if (src !== orig) {
      fs.writeFileSync(file, src, 'utf8');
      // Count replacements
      const before = (orig.match(/\.(gif|png)(?=['"`)\s\]])/g) || []).length;
      const after  = (src .match(/\.(gif|png)(?=['"`)\s\]])/g) || []).length;
      const reps = before - after;
      console.log(`  ${path.relative(ROOT, file).padEnd(60)} (${reps} replaced)`);
      totalFiles++;
      totalReps += reps;
    }
  }

  console.log(`\nTotal: ${totalReps} replacements across ${totalFiles} files`);
}

async function main() {
  await convertGifs();
  fixCodeRefs();
  console.log('\nDone! Run: git add -A && git commit -m "Fix image refs + convert GIFs to WebP" && git push origin main');
}

main().catch(console.error);
