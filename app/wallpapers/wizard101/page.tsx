import type {Metadata} from 'next';
import {InteriorHero,InteriorPage} from '../../components/Interior';
export const metadata:Metadata={title:'Wizard101 Wallpapers',description:'Download free Wizard101 desktop wallpapers in 1920×1080, 2560×1440, 3840×2160, and 3440×1440.'};

const sizes=[
  {label:'1920×1080',slug:'1920x1080'},
  {label:'2560×1440',slug:'2560x1440'},
  {label:'3840×2160',slug:'3840x2160'},
  {label:'3440×1440',slug:'3440x1440'},
];

const wallpapers=[
  {title:'School of Magic',image:'/wallpapers/wizard101-preview.webp',file:'wizard101-school-of-magic'},
];

export default function Wizard101Wallpapers(){return(
<InteriorPage>
  <InteriorHero eyebrow="Wizard101 wallpapers" title="Wizard101" description="Download free Wizard101 desktop wallpapers. Choose your resolution below." image="/brand/pages/wizard101-bg.png"/>
  <section className="interior-section wp-recent">
    <p className="kicker">All wallpapers</p>
    <h2 className="wp-section-title">Wizard101</h2>
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
              <a key={sz.slug} className="wp-size-pill" href={`/wallpapers/${item.file}-${sz.slug}.jpg`} download>{sz.label}</a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
</InteriorPage>
)}