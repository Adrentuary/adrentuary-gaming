import type {Metadata} from 'next';
import Link from 'next/link';
import {InteriorHero,InteriorPage} from '../components/Interior';
export const metadata:Metadata={title:'Resources',description:'Explore Adrentuary game guides, interactive tools, blog posts, and wallpapers.'};
const resources=[
  {n:'01',title:'Game Guides',body:'Collection guides, checklists, locations, tips, and helpful resources designed to make completing your favorite games easier.',href:'/guides',label:'Explore guides'},
  {n:'02',title:'Site Tools',body:'Useful tools and interactive resources built to make gaming, planning, and everyday tasks a little easier and more convenient.',href:'/tools',label:'Explore tools'},
  {n:'03',title:'Blog Posts',body:'Updates, thoughts, gaming experiences, and other topics worth sharing—a home for news, ideas, projects, and everything in between.',href:'/blog',label:'Explore posts'},
  {n:'04',title:'Wallpapers',body:'An exclusive collection of gaming-inspired wallpapers, original visual experiments, and high-resolution desktop art.',href:'/wallpapers',label:'Explore wallpapers'},
];
export default function Resources(){return <InteriorPage><InteriorHero eyebrow="Adrentuary library" title="Explore our resources" description="Choose a destination and spend less time searching—and more time playing." image="/brand/pages/resources.webp"/><section className="interior-section"><div className="resource-list">{resources.map(item=><article key={item.title}><span>{item.n}</span><div><h2>{item.title}</h2><p>{item.body}</p></div><Link href={item.href}>{item.label}<b aria-hidden="true">↗</b></Link></article>)}</div></section></InteriorPage>}
