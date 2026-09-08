'use client';
import { useState } from 'react';
import { CalculatorTab } from './CalculatorTab';
import { BuildsTab } from './BuildsTab';

const TABS = ['Gag Calculator', 'Gag Builds'] as const;
type Tab = typeof TABS[number];

export function GagCalculator() {
  const [tab, setTab] = useState<Tab>('Gag Calculator');
  return (
    <div className="gagcalc-shell">
      <div className="gagcalc-tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`gagcalc-tab${tab === t ? ' gagcalc-tab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="gagcalc-tab-body">
        {tab === 'Gag Calculator' && <CalculatorTab />}
        {tab === 'Gag Builds'     && <BuildsTab />}
      </div>
    </div>
  );
}
