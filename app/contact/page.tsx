import type {Metadata} from 'next';
import {InteriorHero,InteriorPage} from '../components/Interior';
import {ContactForm} from './ContactForm';
import {AnimateIn} from '../components/AnimateIn';
export const metadata:Metadata={title:'Contact',description:'Send questions, suggestions, corrections, and new ideas to Adrentuary.'};
export default function Contact(){return(
<InteriorPage>
  <InteriorHero eyebrow="Questions, suggestions, corrections" title="Contact me" description="Adrentuary Guides is a growing project. Community feedback helps make the guides, tools, and website better for everyone." image="/brand/pages/contact-stars.webp"/>
  <section className="contact-layout interior-section">
    <AnimateIn from="left">
    <div className="contact-copy">
      <img src="/brand/pages/contact-figure.webp" alt="Cosmic character artwork"/>
      <h2>Open and honest feedback is welcome.</h2>
      <p>Constructive criticism is encouraged&mdash;even if something isn&apos;t working well or you think it could be done differently.</p>
      <p>If your suggestion or idea is implemented, you&apos;ll be credited on the original post, guide, or feature whenever possible.</p>
      <a href="https://discord.com/users/475170798454177805" target="_blank" rel="noreferrer">Connect on Discord <span>&#x2197;</span></a>
      <div className="discord-help"><h3>Finding a Discord User ID</h3><p>Turn on Developer Mode, then right-click a username on desktop and choose <strong>Copy User ID</strong>. On mobile, open the profile, tap the menu, and select <strong>Copy User ID</strong>.</p></div>
    </div>
    </AnimateIn>
    <AnimateIn delay={120}>
      <ContactForm/>
    </AnimateIn>
  </section>
</InteriorPage>
)}
