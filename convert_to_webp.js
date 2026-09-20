/**
 * convert_to_webp.js
 * Converts all .png and .gif files in /public to .webp using sharp.
 * Then updates all code references (.ts, .tsx, .css) to point to .webp.
 *
 * SKIPS:
 *   - apple-touch-icon.png, icon-192.png, icon-512.png, og.png, logo.png
 *   - /public/wallpapers/ directory (user-downloadable files, must stay .png)
 *
 * Run:          node convert_to_webp.js
 * After verify: node convert_to_webp.js --cleanup
 */

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const ROOT       = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const APP_DIR    = path.join(ROOT, 'app');
const CLEANUP    = process.argv.includes('--cleanup');
const DRY_RUN    = process.argv.includes('--dry-run');

// Files that MUST stay .png
const SKIP_FILES = new Set([
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'og.png',
  'logo.png',
]);

// Entire dirs to skip (user-downloadable wallpapers must stay .png)
const SKIP_DIRS = [
  path.join(PUBLIC_DIR, 'wallpapers'),
];

// Code extensions to update
const CODE_EXTS = new Set(['.ts', '.tsx', '.css', '.js']);

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else results.push(full);
  }
  return results;
}

function isInSkipDir(filePath) {
  return SKIP_DIRS.some(d => filePath.startsWith(d + path.sep) || filePath === d);
}

async function convertFile(filePath) {
  const ext  = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath);

  if (!['.png', '.gif'].includes(ext)) return null;
  if (SKIP_FILES.has(base))      { console.log(`  SKIP  ${path.relative(PUBLIC_DIR, filePath)}`); return null; }
  if (isInSkipDir(filePath))     { return null; }
  if (filePath.endsWith('.bak')) { return null; }

  const dir     = path.dirname(filePath);
  const outPath = path.join(dir, path.basename(filePath, ext) + '.webp');
  const bakPath = filePath + '.bak';

  if (fs.existsSync(outPath) && !fs.existsSync(bakPath)) {
    console.log(`  EXIST ${path.relative(PUBLIC_DIR, outPath)}`);
    return null;
  }

  const origSize = fs.statSync(filePath).size;

  if (DRY_RUN) {
    console.log(`  DRY   ${path.relative(PUBLIC_DIR, filePath)} → .webp`);
    return { origSize, newSize: 0 };
  }

  try {
    const isBrand = filePath.includes(path.sep + 'brand' + path.sep);
    const img = sharp(filePath, { animated: ext === '.gif' });

    if (ext === '.gif') {
      await img.webp({ quality: 80, effort: 4 }).toFile(outPath);
    } else if (isBrand) {
      await img.webp({ quality: 90, effort: 4 }).toFile(outPath);
    } else {
      await img.webp({ lossless: true, effort: 4 }).toFile(outPath);
    }

    const newSize = fs.statSync(outPath).size;
    fs.renameSync(filePath, bakPath);

    const savedMB = ((origSize - newSize) / 1024 / 1024).toFixed(2);
    const pct     = (((origSize - newSize) / origSize) * 100).toFixed(0);
    console.log(
      `  OK    ${path.relative(PUBLIC_DIR, filePath).padEnd(65)}` +
      `${(origSize/1024/1024).toFixed(2)}MB → ${(newSize/1024/1024).toFixed(2)}MB  (-${savedMB}MB, ${pct}%)`
    );
    return { origSize, newSize };
  } catch (err) {
    console.error(`  ERROR ${path.relative(PUBLIC_DIR, filePath)}: ${err.message}`);
    return null;
  }
}

function updateCodeReferences() {
  const codeFiles = walk(APP_DIR).filter(f => CODE_EXTS.has(path.extname(f)));
  let filesChanged = 0, replacements = 0;

  for (const file of codeFiles) {
    let src = fs.readFileSync(file, 'utf8');
    const orig = src;

    const lines = src.split('\n');
    const newLines = lines.map(line => {
      // Don't touch the actual wallpaper download hrefs (files must stay .png)
      if (/\/wallpapers\/.*\.png.*download/.test(line)) return line;
      if (/href=.*wallpapers.*\.png/.test(line))        return line;
      return line
        .replace(/(\/[^\s"'`]+)\.png(?=["'`)\s])/g, '$1.webp')
        .replace(/(\/[^\s"'`]+)\.gif(?=["'`)\s])/g, '$1.webp');
    });

    src = newLines.join('\n');
    if (src !== orig) {
      if (!DRY_RUN) fs.writeFileSync(file, src, 'utf8');
      const count = (src.match(/\.webp/g)||[]).length - (orig.match(/\.webp/g)||[]).length;
      console.log(`  CODE  ${path.relative(ROOT, file)}  (+${count} refs)`);
      filesChanged++;
      replacements += count;
    }
  }
  console.log(`\nCode: ${replacements} replacements across ${filesChanged} files`);
}

async function cleanup() {
  console.log('\n--- CLEANUP: deleting .bak originals ---\n');
  const files = walk(PUBLIC_DIR).filter(f => f.endsWith('.bak'));
  if (!files.length) { console.log('No .bak files found.'); return; }
  for (const f of files) { fs.unlinkSync(f); console.log(`  DELETED  ${path.relative(PUBLIC_DIR, f)}`); }
  console.log(`\nDeleted ${files.length} .bak files.`);
}

async function main() {
  if (CLEANUP) { await cleanup(); return; }

  console.log(`\n=== Converting /public assets to WebP ===`);
  if (DRY_RUN) console.log('(DRY RUN — no files changed)\n');
  console.log();

  const files = walk(PUBLIC_DIR);
  let totalOrig = 0, totalNew = 0, converted = 0;

  for (const file of files) {
    const result = await convertFile(file);
    if (result && result.origSize > 0) {
      totalOrig += result.origSize;
      totalNew  += result.newSize;
      converted++;
    }
  }

  console.log('\n=== Updating code references ===\n');
  updateCodeReferences();

  console.log('\n=== Summary ===');
  console.log(`Files converted : ${converted}`);
  if (!DRY_RUN) {
    console.log(`Before          : ${(totalOrig / 1024 / 1024).toFixed(2)} MB`);
    console.log(`After           : ${(totalNew  / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Saved           : ${((totalOrig - totalNew) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\nOriginals renamed to .bak — run 'npm run dev' to verify, then:`);
    console.log(`  node convert_to_webp.js --cleanup`);
  }
}

main().catch(console.error);
