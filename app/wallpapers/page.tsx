import type {Metadata} from 'next';
import {InteriorHero,InteriorPage} from '../components/Interior';
export const metadata:Metadata={title:'Wallpapers',description:'A library of high-quality gaming and sci-fi wallpapers from Adrentuary.'};
const wallpapers=[
{n:'01',title:'Epic Cinematic Landscape',image:'/wallpapers/epic-landscape.webp',full:'https://static.wixstatic.com/media/13e686_90d6ac5aa8284476980725f927856024~mv2.jpg'},
{n:'02',title:'Cyberpunk City',image:'/wallpapers/cyberpunk-city.webp',full:'https://static.wixstatic.com/media/13e686_7fb46d03060d4044b2c8ed909fc5172b~mv2.jpg'},
{n:'03',title:'Fantasy Dragon',image:'/wallpapers/fantasy-dragon.webp',full:'https://static.wixstatic.com/media/13e686_bcd44a02c7ce4101999e12acec9b7824~mv2.jpg'},
{n:'04',title:'Pixel Art Adventure',image:'/wallpapers/pixel-adventure.webp',full:'https://static.wixstatic.com/media/13e686_e9c4c641ecf44cb1b8ac29a85b0476ec~mv2.jpg'},
{n:'05',title:'Sci-Fi Cockpit',image:'/wallpapers/scifi-cockpit.webp',full:'https://static.wixstatic.com/media/13e686_4cea9561272f43d0b18df33f60572924~mv2.jpg'},
{n:'06',title:'Minimalist Setup',image:'/wallpapers/minimalist-setup.webp',full:'https://static.wixstatic.com/media/13e686_ac2014a69a814089b37ada3775671541~mv2.jpg'}];
export default function Wallpapers(){return <InteriorPage><InteriorHero eyebrow="Free desktop art" title="Wallpaper library" description="Explore an exclusive collection of gaming-inspired wallpapers. Each is optimized for style and ready to level up your desktop."/><section className="wallpaper-grid interior-section">{wallpapers.map(item=><a href={item.full} target="_blank" rel="noreferrer" key={item.title}><div><img src={item.image} alt={item.title}/><span aria-hidden="true">↗</span></div><p>{item.n}</p><h2>{item.title}</h2><small>Open full resolution</small></a>)}</section></InteriorPage>}
