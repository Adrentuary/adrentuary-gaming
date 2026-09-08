import type { Metadata } from 'next';
import { InteriorPage } from '../components/Interior';
import { GagCalculator } from './GagCalculator';

export const metadata: Metadata = {
  title: 'Corporate Clash Gag Calculator',
  description: 'Calculate Corporate Clash gag damage combos and plan your gag build with the interactive Gag Calculator and Gag Builds tool.',
};

export default function CCGagCalculatorPage() {
  return (
    <InteriorPage>
      <div className="tool-banner">
        <p className="eyebrow">Corporate Clash</p>
        <h1>Gag Calculator</h1>
      </div>
      <section className="interior-section gagcalc-section">
        <GagCalculator />
      </section>
    </InteriorPage>
  );
}
