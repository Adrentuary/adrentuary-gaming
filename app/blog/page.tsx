import type {Metadata} from 'next';
import {InteriorHero,InteriorPage} from '../components/Interior';
import {BlogBrowser} from './BlogBrowser';
export const metadata:Metadata={title:'Blog',description:'Gaming guides, accessibility, tutorials, creative projects, and community updates from Adrentuary.'};
export default function Blog(){return <InteriorPage><InteriorHero eyebrow="Browse by strategy" title="Find exactly what you’re looking for." description="Browse by category to discover tips, strategies, collections, and helpful resources for your playstyle." image="/brand/pages/blog.webp"/><section className="blog-browser interior-section"><BlogBrowser/></section></InteriorPage>}
