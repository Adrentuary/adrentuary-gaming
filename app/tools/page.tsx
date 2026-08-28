import type {Metadata} from 'next';
import Link from 'next/link';
import {InteriorHero,InteriorPage} from '../components/Interior';
import {AnimateIn} from '../components/AnimateIn';
export const metadata:Metadata={title:'Tools',description:'Custom-built calculators and interactive resources from Adrentuary Gaming.'};

export const TOOLS=[
  {status:'Live',title:'Corporate Clash Personal Tracker',body:'Navigate Toontown streets with helpful tips, locations, tasks, progression tracking, and everything you need along the way.',href:'/corporate-clash-personal-tracker',live:true,game:'Toontown: Corporate Clash'},
  {status:'Optimized',title:'Wizard101 Pet Calculator',body:'Optimize your pet hatching and training cycles with a dedicated stat-calculation workspace.',href:'/w101-pet-stat-calculator',live:true,game:'Wizard101'},
];

const MAX_HOME=4;

export default function Tools(){
  const visible=TOOLS.slice(0,MAX_HOME);
  const hasMore=TOOLS.length>MAX_HOME;
  return(
<InteriorPage>
  <InteriorHero eyebrow="Custom utilities" title="Which tool would you like to use?" description="Enhance your gameplay with focused calculators and resources." image="/brand/pages/tools.webp"/>
  <AnimateIn>
  <section className="tool-grid interior-section">
    <div className="tool-grid-inner tool-grid-inner--row">
    {visible.map((tool,i)=>(
      <article key={`${tool.title}-${i}`}>
        <div className="tool-status"><span/>Status: {tool.status}</div>
        <p className="tool-number">0{i+1}</p>
        <h2>{tool.title}</h2>
        <p>{tool.body}</p>
        <Link href={tool.href}>Launch tool <span>↗</span></Link>
      </article>
    ))}
    </div>
    {hasMore&&(
      <div className="tool-see-all-wrap">
        <Link href="/tools/all" className="tool-see-all-btn">See all tools <span>→</span></Link>
      </div>
    )}
  </section>
  </AnimateIn>
</InteriorPage>
)}
