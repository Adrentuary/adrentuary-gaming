const fs=require('fs'),path=require('path');
const p=path.join(__dirname,'app/corporate-clash-personal-tracker/data-collections.ts');
const BG=f=>`BG('${f}')`,NP=f=>`NP('${f}')`,NT=f=>`NT('${f}')`,PP=f=>`PP('${f}')`,CE=f=>`CE('${f}')`,EM=f=>`EM('${f}')`;
const J=s=>JSON.stringify(s);
const I=(n,t,h,img)=>img?`    I(${J(n)},${J(t)},${J(h)},${img}),\n`:`    I(${J(n)},${J(t)},${J(h)}),\n`;
const S=(nm,ic,cl,ac,it)=>`  { name:${J(nm)}, icon:${J(ic)}, color:${J(cl)}, accent:${J(ac)}, items:[\n${it.join('')}  ]},\n`;
const parts=[];
parts.push(
`export interface CollectionItem { name: string; type: string; how: string; img?: string; }
export interface CollectionSection { name: string; icon: string; color: string; accent: string; items: CollectionItem[]; }
const I = (name: string, type: string, how: string, img?: string): CollectionItem => ({ name, type, how, img });
const BG = (f: string) => \`/icons/collections/profile-backgrounds/\${f}\`;
const NP = (f: string) => \`/icons/collections/profile-nameplates/\${f}\`;
const NT = (f: string) => \`/icons/collections/profile-nametags/\${f}\`;
const PP = (f: string) => \`/icons/collections/profile-poses/\${f}\`;
const CE = (f: string) => \`/icons/collections/profile-cheesy-effects/\${f}\`;
const EM = (f: string) => \`/icons/collections/emotions/\${f}\`;

export const COLLECTIONS: CollectionSection[] = [
`);
require('./col2_p1.js')(parts,S,I,BG,NP,NT,PP,CE,EM);
require('./col2_p2.js')(parts,S,I,BG,NP,NT,PP,CE,EM);
require('./col2_p3.js')(parts,S,I,BG,NP,NT,PP,CE,EM);
parts.push(
`];
export const COLLECTION_TYPES = ['Background','Nameplate','Nametag','Profile Pose','Cheesy Effect','Emotion'] as const;
export type CollectionType = typeof COLLECTION_TYPES[number];
`);
fs.writeFileSync(p,parts.join(''),'utf8');
console.log('Done. Lines:',parts.join('').split('\n').length);
