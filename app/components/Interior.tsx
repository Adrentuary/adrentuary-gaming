import type {ReactNode} from 'react';
import {SiteFooter,SiteHeader} from './SiteChrome';

export function InteriorPage({children}: {children:ReactNode}) {
  return <div className="site-page"><SiteHeader/><main className="interior-main">{children}</main><SiteFooter/></div>;
}

export function InteriorHero({eyebrow,title,description,image,children}: {eyebrow:string;title:string;description?:string;image?:string;children?:ReactNode}) {
  return <section className={`interior-hero${image?' interior-hero--image':''}`}>
    {image&&<img src={image} alt=""/>}<div className="interior-hero__veil"/>
    <div className="interior-hero__content"><p className="kicker">{eyebrow}</p><h1>{title}</h1>{description&&<p>{description}</p>}{children}</div>
  </section>;
}
