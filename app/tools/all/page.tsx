import type {Metadata} from 'next';
import Link from 'next/link';
import {InteriorHero,InteriorPage} from '../../components/Interior';
import {AnimateIn} from '../../components/AnimateIn';
import {TOOLS} from '../page';

export const metadata:Metadata={title:'All Tools',description:'Every custom-built calculator and interactive resource from Adrentuary Gaming.'};

// Derive unique games in order of first appearance
const games=[...new Set(TOOLS.map(t=>t.game))];

export default function AllTools(){return(
<InteriorPage>
  <InteriorHero eyebrow="All tools" title="Every tool, one place." description="Browse all custom-built calculators and interactive resources — organized by game." image="/brand/pages/tools.webp"/>
  <section className="interior-section tools-all-section">
    <AnimateIn from="left">
      <div className="section-heading">
        <p className="kicker">Browse by game</p>
        <h2>Find the right tool for your game.</h2>
      </div>
    </AnimateIn>

    {games.map(game=>{
      const gameTools=TOOLS.filter(t=>t.game===game);
      return(
        <AnimateIn key={game}>
          <div className="tools-all-game-group">
            <h3 className="tools-all-game-label">{game}</h3>
            <div className="tool-grid-inner tool-grid-inner--row">
              {gameTools.map((tool,i)=>(
                <article key={i}>
                  <div className="tool-status"><span/>Status: {tool.status}</div>
                  <h2>{tool.title}</h2>
                  <p className="tool-body">{tool.body}</p>
                  {tool.live
                    ?<Link href={tool.href} className="tool-launch-btn">Launch tool <span>↗</span></Link>
                    :<span className="tool-soon">Coming soon</span>
                  }
                </article>
              ))}
            </div>
          </div>
        </AnimateIn>
      );
    })}
  </section>
</InteriorPage>
)}