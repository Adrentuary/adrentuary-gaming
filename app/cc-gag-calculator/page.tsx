import type { Metadata } from 'next';
import Link from 'next/link';
import { InteriorPage } from '../components/Interior';
import { GagCalculator } from './GagCalculator';

export const metadata: Metadata = {
  title: 'CC Gag Calculator',
  description: 'Calculate Corporate Clash gag damage combos and plan your gag build with the interactive Gag Calculator and Gag Builds tool.',
};

export default function CCGagCalculatorPage() {
  return (
    <InteriorPage>
      <section className="calculator-hero">
        <img src="/brand/pages/calculator.webp" alt="Corporate Clash Gag Calculator" />
        <div>
          <p className="kicker">Adrentuary tool</p>
          <h1>CC Gag Calculator</h1>
          <p>
            Build gag combos to calculate total damage against any cog level, apply prestige and knockback bonuses,
            and plan your ideal gag track build — all in one place.
          </p>
          <Link className="button button--ghost" href="/tools">&#8592; Back to tools</Link>
        </div>
      </section>
      <section className="interior-section gagcalc-section">
        <GagCalculator />
      </section>
    </InteriorPage>
  );
}
