import type {Metadata} from 'next';
import {InteriorHero,InteriorPage} from '../../components/Interior';
export const metadata:Metadata={title:'Toontown Wallpapers',description:'Download free Toontown: Corporate Clash desktop wallpapers in 1920×1080, 2560×1440, 3840×2160, and 3440×1440.'};

const sizes=[
  {label:'1920×1080',slug:'1920x1080'},
  {label:'2560×1440',slug:'2560x1440'},
  {label:'3840×2160',slug:'3840x2160'},
  {label:'3440×1440',slug:'3440x1440'},
];

const wallpapers=[
  {title:'Corporate Clash',image:'/brand/pages/toontown-bg.png',file:'toontown-corporate-clash'},
];

export default function ToontownWallpapers(){return(
<InteriorPage>
  <InteriorHero eyebrow="Toontown wallpapers" title="Toontown" description="Download free Toontown: Corporate Clash desktop wallpapers. Choose your resolution below." image="/brand/pages/toontown-bg.png"/>
  <section className="interior-section wp-recent">
    <p className="kicker">All wallpapers</p>
    <h2 className="wp-section-title">Toontown: Corporate Clash</h2>
    <div className="wp-recent-grid">
      {wallpapers.map(item=>(
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
</InteriorPage>
)}