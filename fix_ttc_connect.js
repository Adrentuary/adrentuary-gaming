const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'app/corporate-clash-personal-tracker/PlaygroundInfoModal.tsx');
let txt = fs.readFileSync(p, 'utf8');

const oldLine = `'TTC connects to Barnacle Boatyard, Ye Olde Toontowne, Daffodil Gardens, and Mezzo Melodyland.'`;
const newLine = `'TTC connects to Barnacle Boatyard (Punchline Place), Ye Olde Toontowne (Silly Street), Daffodil Gardens (Wacky Way), and Mezzo Melodyland (Loopy Lane).'`;

if (!txt.includes(oldLine)) { console.error('OLD LINE NOT FOUND'); process.exit(1); }
txt = txt.replace(oldLine, newLine);
fs.writeFileSync(p, txt, 'utf8');
console.log('Done.');
