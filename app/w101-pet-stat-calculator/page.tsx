import type { Metadata } from 'next';
import Link from 'next/link';
import { InteriorPage } from '../components/Interior';
import { PetCalculator } from './PetCalculator';

export const metadata: Metadata = {
  title: 'W101 Pet Stat Calculator',
  description: "Calculate Wizard101 pet talent values from your pet's strength, intellect, agility, will, and power stats.",
};

export default function Calculator() {
  return (
    <InteriorPage>
      <section className="calculator-hero">
        <img src="/brand/pages/calculator.webp" alt="Wizard101-inspired pet calculator artwork" />
        <div>
          <p className="kicker">Adrentuary tool</p>
          <h1>W101 Pet Stat Calculator</h1>
          <p>Enter your pet&apos;s five core stats to instantly calculate every talent value. Useful for comparing hatches and planning your ideal pet build.</p>
          <Link className="button button--ghost" href="/tools">← Back to tools</Link>
        </div>
      </section>
      <section className="interior-section pet-calc-section">
        <p className="kicker">Calculator</p>
        <h2>Enter pet stats</h2>
        <PetCalculator />
      </section>
    </InteriorPage>
  );
}
