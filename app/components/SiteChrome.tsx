'use client';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

const navigation = [
  ['Home', '/'],
  ['Resources', '/resources'],
  ['Guides', '/guides'],
  ['Blog', '/blog'],
  ['Tools', '/tools'],
  ['Contact', '/contact'],
] as const;

export function SiteHeader() {
  const { user, loading } = useAuth();

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
        <div className="nav-right">
          {!loading && (
            user
              ? <Link className="nav-account" href="/account" aria-label="Your account">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  <span>Account</span>
                </Link>
              : <Link className="nav-account" href="/login">Log in</Link>
          )}
          <Link className="nav-support" href="/donate">Support</Link>
        </div>
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
        <p>© 2026 Adrentuary Gaming. All rights reserved.</p>
        <p>Adrentuary Gaming is an independent fan-created resource and is not affiliated with or endorsed by the developers or publishers of the games featured.</p>
      </div>
    </footer>
  );
}
