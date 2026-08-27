import type {Metadata} from 'next';
import Link from 'next/link';
import {InteriorHero,InteriorPage} from '../components/Interior';
export const metadata:Metadata={title:'Resources',description:'Explore Adrentuary game guides, interactive tools, blog posts, and wallpapers.'};

const resourceCards=[
  {title:'Game Guides',body:'Collection guides, checklists, locations, tips, and helpful resources designed to make completing your favorite games easier.',href:'/guides',label:'Explore guides'},
  {title:'Site Tools',body:'Useful calculators and interactive resources built to make gaming, planning, and everyday tasks simpler.',href:'/tools',label:'Explore tools'},
  {title:'Blog Posts',body:'Updates, gaming experiences, personal projects, accessibility, art, and ideas worth sharing.',href:'/blog',label:'Read the blog'},
  {title:'Wallpapers',body:'An exclusive collection of gaming-inspired wallpapers, original visual experiments, and high-resolution desktop art.',href:'/wallpapers',label:'Explore wallpapers'},
];

export default function Resources(){return(
<InteriorPage>
  <InteriorHero eyebrow="Adrentuary library" title="Explore our resources" description="Choose a destination and spend less time searching—and more time playing." image="/brand/pages/resources.webp"/>
  <section className="interior-section resource-intro" aria-labelledby="resources-title">
    <div className="section-heading">
      <p className="kicker">Choose your route</p>
      <h2 id="resources-title">A growing collection for curious players.</h2>
      <p>Pro tips for immersive titles, personal updates about gaming and art, and utilities that make play—and daily life—a little easier.</p>
    </div>
    <div className="resource-grid">
      {resourceCards.map(card=>(
        <article className="resource-card" key={card.title}>
          <h3>{card.title}</h3>
          <p>{card.body}</p>
          <Link href={card.href}>{card.label}<span aria-hidden="true">→</span></Link>
        </article>
      ))}
    </div>
  </section>
</InteriorPage>
)}
