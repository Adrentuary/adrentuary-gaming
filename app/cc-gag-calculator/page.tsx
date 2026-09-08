'use client';
import { useState } from 'react';
import { InteriorPage } from '../components/Interior';
import { CalculatorTab } from './CalculatorTab';
import { BuildsTab } from './BuildsTab';

const TABS = ['Gag Calculator', 'TP Builds'] as const;
type Tab = typeof TABS[number];

export default function CCGagCalculatorPage() {
  const [tab, setTab] = useState<Tab>('Gag Calculator');

  return (
    <InteriorPage>
      <div className="tool-banner">
        <p className="eyebrow">Corporate Clash</p>
        <h1>Gag Calculator</h1>
      </div>
      <nav className="tracker-tabs gagcalc-page-tabs" role="tablist" aria-label="Gag Calculator sections">
        {TABS.map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`tracker-tab${tab === t ? ' tracker-tab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <section className="interior-section gagcalc-section">
        <div className="gagcalc-shell">
          <div className="gagcalc-tab-body">
            {tab === 'Gag Calculator' && <CalculatorTab />}
            {tab === 'TP Builds'      && <BuildsTab />}
          </div>
        </div>
      </section>
    </InteriorPage>
  );
}
