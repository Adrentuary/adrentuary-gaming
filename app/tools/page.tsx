import type {Metadata} from 'next';
import Link from 'next/link';
import {InteriorHero,InteriorPage} from '../components/Interior';
import {AnimateIn} from '../components/AnimateIn';
export const metadata:Metadata={title:'Tools',description:'Custom-built calculators and interactive resources from Adrentuary Gaming.'};

export type ToolStatus='coming-soon'|'wip'|'live'|'update-in-progress';

export const STATUS_META:{[K in ToolStatus]:{label:string;desc:string}}={
  'coming-soon':  {label:'Coming Soon',         desc:'Design and general idea in the works, launching soon.'},
  'wip':          {label:'Work In Progress',    desc:'Work is actively underway.'},
  'live':         {label:'Live',                desc:'Completed and ready to use.'},
  'update-in-progress':{label:'Update In Progress',desc:'An update is currently underway.'},
};

export const TOOLS:{status:ToolStatus;title:string;body:string;href:string;game:string}[]=[
  {status:'wip', title:'Corporate Clash Personal Tracker',body:'Navigate Toontown streets with helpful tips, locations, tasks, progression tracking, and everything you need along the way.',href:'/corporate-clash-personal-tracker',game:'Toontown: Corporate Clash'},
  {status:'live',title:'Wizard101 Pet Calculator',body:'Optimize your pet hatching and training cycles with a dedicated stat-calculation workspace.',href:'/w101-pet-stat-calculator',game:'Wizard101'},
];

export function ToolCard({tool,i}:{tool:(typeof TOOLS)[number];i:number}){
  const meta=STATUS_META[tool.status];
  const isLaunchable=tool.status==='live'||tool.status==='update-in-progress';
  return(
    <article key={`${tool.title}-${i}`}>
      <div className={`tool-status tool-status--${tool.status}`}>
        <span aria-hidden="true"/>
        <span className="tool-status__label">{meta.label}</span>
        <span className="tool-status__desc">{meta.desc}</span>
      </div>
      <h2>{tool.title}</h2>
      <p className="tool-body">{tool.body}</p>
      {isLaunchable
        ?<Link href={tool.href} className="tool-launch-btn">Launch tool <span>↗</span></Link>
        :<span className="tool-soon">{meta.label}</span>
      }
    </article>
  );
}

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
      <ToolCard key={`${tool.title}-${i}`} tool={tool} i={i}/>
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
