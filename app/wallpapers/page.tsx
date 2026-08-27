import type {Metadata} from 'next';
import Link from 'next/link';
import {InteriorHero,InteriorPage} from '../components/Interior';
export const metadata:Metadata={title:'Wallpapers',description:'A library of high-quality gaming and sci-fi wallpapers from Adrentuary.'};

const sizes=[
  {label:'1920×1080',slug:'1920x1080'},
  {label:'2560×1440',slug:'2560x1440'},
  {label:'3840×2160',slug:'3840x2160'},
  {label:'3440×1440',slug:'3440x1440'},
];

const recent=[
  {title:'Wizard101 — School of Magic',image:'/brand/pages/wizard101-bg.png',file:'wizard101-school-of-magic'},
];

export default function Wallpapers(){return(
<InteriorPage>
  <InteriorHero eyebrow="Free desktop art" title="Wallpaper library" description="Download exclusive gaming-inspired wallpapers sized for your setup. New wallpapers added regularly." image="/brand/pages/guides-stars.webp"/>

  {/* ── Recently Added ── */}
  <section className="interior-section wp-recent">
    <p className="kicker">New additions</p>
    <h2 className="wp-section-title">Recently Added</h2>
    <div className="wp-recent-grid">
      {recent.map(item=>(
        <div className="wp-card" key={item.title}>
          <div className="wp-card__thumb">
            <img src={item.image} alt={item.title}/>
            <div className="wp-card__shade"/>
            <span className="wp-card__label">{item.title}</span>
          </div>
          <div className="wp-card__sizes">
            {sizes.map(sz=>(
              <a key={sz.slug} className="wp-size-pill" href={`/wallpapers/${item.file}-${sz.slug}.png`} download>{sz.label}</a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* ── Browse by Game ── */}
  <section className="browse-games">
    <div className="interior-section">
      <p className="kicker">Browse by game</p>
      <h2>Browse by Game</h2>
      <div className="game-tiles">
        <Link href="/wallpapers/wizard101">
          <img className="tile-bg" src="/brand/pages/wizard101-bg.png" alt=""/>
          <div className="tile-shade"/>
          <span>Wizard101</span>
        </Link>
      </div>
    </div>
  </section>

</InteriorPage>
)}
