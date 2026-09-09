import type { Metadata } from 'next';
import { InteriorPage } from '../components/Interior';
import { PetCalculator } from './PetCalculator';

export const metadata: Metadata = {
  title: 'W101 Pet Stat Calculator',
  description: "Calculate Wizard101 pet talent values from your pet's strength, intellect, agility, will, and power stats.",
};

export default function Calculator() {
  return (
    <InteriorPage>
      <div className="tool-banner">
        <p className="eyebrow">Wizard101</p>
        <h1>Pet Calculator</h1>
      </div>
      <section className="pet-calc-section">
        <h2>Enter pet stats</h2>
        <PetCalculator />
      </section>
    </InteriorPage>
  );
}
