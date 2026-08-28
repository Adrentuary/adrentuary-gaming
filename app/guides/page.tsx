import type {Metadata} from 'next';
import {InteriorHero,InteriorPage} from '../components/Interior';
import {AnimateIn} from '../components/AnimateIn';
export const metadata:Metadata={title:'Game Guides',description:'Featured walkthroughs, collection guides, strategies, and gaming resources from Adrentuary.'};
export default function Guides(){return(
<InteriorPage>
  <InteriorHero eyebrow="Play smarter" title="Guides" description="Not sure where to start? Explore walkthroughs, collection guides, strategies, and resources handpicked to help you spend less time searching and more time playing." image="/brand/pages/guides-stars.webp"/>
  <section className="interior-section">
    <AnimateIn>
      <div className="empty-filter" style={{margin:'80px 0 120px'}}>
        <p className="kicker">Nothing published here yet</p>
        <h2>New posts are on the way.</h2>
        <p>Check back as the library grows.</p>
      </div>
    </AnimateIn>
  </section>
</InteriorPage>
)}