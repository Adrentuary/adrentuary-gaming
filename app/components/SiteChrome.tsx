import Link from 'next/link';

const navigation = [
  ['Home', '/'],
  ['Resources', '/resources'],
  ['Guides', '/guides'],
  ['Blog', '/blog'],
  ['Tools', '/tools'],
  ['Contact', '/contact'],
] as const;

export function SiteHeader() {
  return (
    <header className="global-header">
      <div className="global-header__inner">
        <Link className="brand" href="/" aria-label="Adrentuary Gaming home">
          <img src="/brand/logo.webp" alt="" />
          <span><strong>Adrentuary</strong><small>Gaming</small></span>
        </Link>
        <nav className="global-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link className="nav-support" href="/donate">Support</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="global-footer">
      <div className="global-footer__top">
        <div>
          <p className="kicker">Keep exploring</p>
          <h2>Guides, tools, and creative resources for gamers.</h2>
        </div>
        <div className="footer-links">
          <Link href="/resources">Explore resources</Link>
          <a href="https://www.giftful.com/adrentuary" target="_blank" rel="noreferrer">Wishlist</a>
          <a href="https://ko-fi.com/adrentuary" target="_blank" rel="noreferrer">Donate</a>
        </div>
      </div>
      <div className="global-footer__legal">
        <p>© 2026 Adrentuary Guides. All rights reserved.</p>
        <p>Adrentuary Guides is an independent fan-created resource and is not affiliated with or endorsed by the developers or publishers of the games featured.</p>
      </div>
    </footer>
  );
}
