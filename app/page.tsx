import Link from 'next/link';
import {SiteFooter, SiteHeader} from './components/SiteChrome';


const resourceCards = [
  {number:'01',title:'Game guides',body:'Collection guides, checklists, locations, tips, and helpful resources designed to make completing your favorite games easier.',href:'/guides',label:'Explore guides'},
  {number:'02',title:'Site tools',body:'Useful calculators and interactive resources built to make gaming, planning, and everyday tasks simpler.',href:'/tools',label:'Explore tools'},
  {number:'03',title:'Blog posts',body:'Updates, gaming experiences, personal projects, accessibility, art, and ideas worth sharing.',href:'/blog',label:'Read the blog'},
  {number:'04',title:'Wallpapers',body:'An exclusive collection of gaming-inspired wallpapers, original visual experiments, and high-resolution desktop art.',href:'/wallpapers',label:'Explore wallpapers'},
];

const gear = [
  'Predator Helios Neo 16',
  'Intel® Core™ Ultra 9 275HX',
  'NVIDIA® GeForce RTX™ 5070Ti',
  '16″ WQXGA IPS · 240 Hz',
  '32 GB DDR5 · 2 TB SSD',
];

export default function Home() {
  return (
    <div className="site-page">
      <video className="home-video-bg" src="/brand/twinkling-stars.mp4" autoPlay loop muted playsInline aria-hidden="true" />
      <SiteHeader />
      <main className="home-main">
        <section className="home-hero" aria-label="Site introduction">
          <img className="home-hero__image" src="/brand/hero-banner.webp" alt="Adrentuary in a glowing green cosmic world" />
          <div className="home-hero__shade" />
          <div className="home-hero__content">
            <p className="kicker">Welcome to my little corner of the universe</p>
            <p className="home-hero__intro">Guides, blogs, and useful tools built for immersive games&mdash;and for the people who love getting delightfully lost in them.</p>
            <div className="button-row">
              <Link className="button button--primary" href="/resources">Explore resources <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <div className="home-section home-section--about">
        <section className="about-section section-shell" aria-labelledby="about-title">
          <div className="about-copy">
            <p className="kicker">About me</p>
            <h2 id="about-title">A disabled gamer, guide creator, and digital artist.</h2>
            <p>I&rsquo;m Skye&mdash;also known as Adrentuary. I love immersive worlds, great stories, and games that give me way too many things to collect.</p>
            <p>Outside of gaming, <strong>digital artwork and graphic design</strong> are my biggest creative passions. I&rsquo;ve been designing and creating digital art for <strong>15+ years</strong>, and it remains one of my favorite ways to express myself and bring ideas to life.</p>
            <p>I&rsquo;m also really passionate about <strong>3D printing and crafts</strong>. One of my favorite things is designing or printing useful everyday items&mdash;especially custom solutions that can make everyday tasks easier or more accessible for people with disabilities.</p>
            <p>I&rsquo;m a strong advocate for <span className="rainbow-text">disability rights</span> and a proud supporter of the <span className="rainbow-text">LGBTQ+ community</span>. As a disabled gamer living with many chronic conditions, accessibility and inclusion are especially important to me&mdash;both in gaming and everyday life.</p>
            <p>At the end of the day, I&rsquo;m here to <strong>play the games I love, create things I&rsquo;m proud of, share what I learn</strong>, and use my creativity to make things a little more accessible along the way.</p>
          </div>
          <div className="about-art">
            <div className="about-orbit" aria-hidden="true" />
            <img src="/brand/skyler.webp" alt="Portrait of Skyler holding a mobility cane" />
          </div>
        </section>
        </div>

        <div className="home-section home-section--profile">
        <section className="profile-section section-shell" aria-label="Creator and stream information">
          <div className="profile-card">
            <img src="/brand/profile.webp" alt="Adrentuary profile portrait" />
            <p className="kicker">Skye // Adrentuary</p>
            <h2>Disabled gamer<br />&amp; activist</h2>
            <p className="safe-zone">LGBTQ+ safe zone</p>
            <div className="social-row">
              <a href="https://discord.com/users/475170798454177805" target="_blank" rel="noreferrer" aria-label="Discord"><img src="/brand/discord.webp" alt="" /></a>
              <span aria-label="Twitch"><img src="/brand/twitch.webp" alt="" /></span>
              <a href="https://www.youtube.com/channel/UCG1aheIX6M2So1mlKxlUeQg" target="_blank" rel="noreferrer" aria-label="YouTube"><img src="/brand/youtube.webp" alt="" /></a>
            </div>
          </div>
          <div className="info-grid">
            <article><p className="kicker">Stream info</p><h3>2:00 PM &ndash; 8:00 PM</h3><p>Different days every week</p></article>
            <article><p className="kicker">Platforms</p><h3>PC and Switch &middot; Switch 2</h3></article>
            <article className="gear-card"><p className="kicker">PC &amp; peripherals</p>{gear.map(item => <p key={item}>{item}</p>)}<hr />
              <p>Crusher&reg; 1080 ANC &middot; ModMic Wireless &middot; Logitech G502 Lightspeed &middot; Powerplay Charging Pad &middot; Logitech G915 TKL</p>
            </article>
          </div>
        </section>
        </div>

        <div className="home-section home-section--wishlist">
        <section className="wishlist-banner section-shell">
          <div>
            <p className="kicker">Wishlist</p>
            <h2>No expectation&mdash;just a cosmic thank-you.</h2>
            <p>There&rsquo;s absolutely no expectation to purchase anything&mdash;being here, checking out my guides, and supporting what I create already means a lot to me.</p>
            <p>If you do decide to send something from the list, know that it truly makes a difference. It may help bring a future guide, a new 3D print project, or some ridiculously unnecessary idea to life.</p>
          </div>
          <a className="button button--primary" href="https://www.giftful.com/adrentuary" target="_blank" rel="noreferrer">Visit the wishlist <span aria-hidden="true">↗</span></a>
        </section>
        </div>

        <div className="home-section home-section--resources">
        <section className="resource-intro section-shell" aria-labelledby="resources-title">
          <div className="section-heading">
            <p className="kicker">Choose your route</p>
            <h2 id="resources-title">A growing collection for curious players.</h2>
            <p>Pro tips for immersive titles, personal updates about gaming and art, and utilities that make play&mdash;and daily life&mdash;a little easier.</p>
          </div>
          <div className="resource-grid">
            {resourceCards.map(card => (
              <article className="resource-card" key={card.title}>
                <span className="resource-card__number">{card.number}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <Link href={card.href}>{card.label}<span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
