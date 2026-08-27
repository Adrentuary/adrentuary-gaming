import type {Metadata} from 'next';
import Link from 'next/link';
import {InteriorHero,InteriorPage} from '../components/Interior';
import {AnimateIn} from '../components/AnimateIn';
export const metadata:Metadata={title:'Game Guides',description:'Featured walkthroughs, collection guides, strategies, and gaming resources from Adrentuary.'};
export default function Guides(){return(
<InteriorPage>
  <InteriorHero eyebrow="Play smarter" title="Guides" description="Not sure where to start? Explore walkthroughs, collection guides, strategies, and resources handpicked to help you spend less time searching and more time playing." image="/brand/pages/guides-stars.webp"/>
  <section className="featured-guide interior-section">
    <AnimateIn from="left"><div className="featured-guide__art"><img src="/brand/pages/guide-card.webp" alt="Toontown Corporate Clash guide artwork"/></div></AnimateIn>
    <AnimateIn delay={100}><div className="featured-guide__copy"><p className="kicker">Featured guide</p><h2>Toontown Corporate Clash: Personal Guide</h2><p>Navigate Toontown streets with helpful tips, locations, tasks, progression tracking, and everything you need along the way.</p><div className="button-row"><Link className="button button--ghost" href="/cog-distribution">Open Cog Distribution</Link></div></div></AnimateIn>
  </section>
  <section className="browse-games">
    <div className="interior-section">
      <AnimateIn from="left"><p className="kicker">Browse by game</p><h2>Browse by Game</h2></AnimateIn>
      <AnimateIn delay={80}>
        <div className="game-tiles"><Link href="/cog-distribution"><img className="tile-bg" src="/brand/pages/toontown-bg.png" alt=""/><div className="tile-shade"/><span>Toontown: Corporate Clash</span></Link></div>
      </AnimateIn>
    </div>
  </section>
</InteriorPage>
)}