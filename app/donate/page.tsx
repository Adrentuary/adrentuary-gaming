import type {Metadata} from 'next';
import {InteriorPage} from '../components/Interior';
export const metadata:Metadata={title:'Donate',description:'Support Adrentuary Gaming and future guides, tools, and creative resources.'};
export default function Donate(){
  return (
    <InteriorPage>
      <section className="donate-hero">
        <img src="/brand/pages/donate.webp" alt="Cosmic green landscape"/>
        <div className="donate-hero__veil"/>
        <div className="donate-hero__content">
          <p className="kicker">Cosmic community</p>
          <h1>Support is never expected.<br/><span>But every bit helps Adrentuary grow.</span></h1>
          <p>I&apos;m incredibly grateful to everyone who chooses to support Adrentuary. Every contribution helps me continue creating guides, improving the quality of my content, maintaining the site, and building new resources for the community.</p>
          <p className="donate-para">Your support also helps with everyday expenses along the way. Whether you donate or simply enjoy what I create, thank you for being part of Adrentuary.</p>
          <a className="button button--primary" href="https://ko-fi.com/adrentuary" target="_blank" rel="noreferrer">Donate now <span>&#8599;</span></a>
        </div>
      </section>
    </InteriorPage>
  );
}
