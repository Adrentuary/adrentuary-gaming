'use client';
import { useState } from 'react';
import { SiteHeader, SiteFooter } from '../components/SiteChrome';
import { useAuth } from '../components/AuthProvider';
import { TrackerProvider, useTracker, TOON_COLORS } from './TrackerContext';
import { SectionStreets } from './SectionStreets';
import { SectionQuests } from './SectionQuests';
import { SectionGags } from './SectionGags';
import { SectionPromotions } from './SectionPromotions';
import { SectionLeveling } from './SectionLeveling';
import { SectionLaff } from './SectionLaff';
import { SectionToons } from './SectionToons';

type TabId = 'streets'|'quests'|'gags'|'promotions'|'leveling'|'laff'|'toons';
const TABS: { id: TabId; label: string }[] = [
  { id: 'streets',    label: '🗺️ Streets' },
  { id: 'quests',     label: '📜 Quests' },
  { id: 'gags',       label: '🎪 Gags' },
  { id: 'promotions', label: '⚙️ Promotions' },
  { id: 'leveling',   label: '📈 Leveling' },
  { id: 'laff',       label: '❤️ Laff Boosts' },
  { id: 'toons',      label: '🐾 Toons' },
];

function TrackerInner() {
  const { user } = useAuth();
  const { toonNames, setToonNames, saving, saveMsg, commitToonName } = useTracker();
  const [activeTab, setActiveTab] = useState<TabId>('streets');
  const [editingToon, setEditingToon] = useState<number|null>(null);

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="tracker-page">
        <header className="tracker-header">
          <div>
            <p className="eyebrow">Corporate Clash</p>
            <h1>Personal Tracker</h1>
          </div>
          <div className="tracker-header-meta">
            <div className="toon-legend">
              {toonNames.map((name, i) => (
                <button key={i} className="toon-legend-item" style={{'--tc': TOON_COLORS[i]} as React.CSSProperties}
                  onClick={() => setEditingToon(editingToon === i ? null : i)}>
                  <span className="toon-dot" />
                  {editingToon === i
                    ? <input autoFocus value={name}
                        onChange={e => { const n=[...toonNames]; n[i]=e.target.value; setToonNames(n); }}
                        onBlur={() => { commitToonName(i, toonNames); setEditingToon(null); }}
                        onKeyDown={e => { if(e.key==='Enter'){commitToonName(i,toonNames);setEditingToon(null);}}}
                        className="toon-name-input" maxLength={20} onClick={e => e.stopPropagation()} />
                    : <span>{name}</span>}
                </button>
              ))}
            </div>
            {user
              ? <span className="save-status">{saving ? 'Saving…' : saveMsg}</span>
              : <span className="save-status save-status--warn">Log in to save progress</span>}
          </div>
        </header>
        <nav className="tracker-tabs" aria-label="Tracker sections">
          {TABS.map(t => (
            <button key={t.id} className={`tracker-tab${activeTab===t.id?' tracker-tab--active':''}`}
              onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </nav>
        {activeTab === 'streets'    && <SectionStreets />}
        {activeTab === 'quests'     && <SectionQuests />}
        {activeTab === 'gags'       && <SectionGags />}
        {activeTab === 'promotions' && <SectionPromotions />}
        {activeTab === 'leveling'   && <SectionLeveling />}
        {activeTab === 'laff'       && <SectionLaff />}
        {activeTab === 'toons'      && <SectionToons />}
      </main>
      <SiteFooter />
    </div>
  );
}

export default function TrackerPage() {
  return (
    <TrackerProvider>
      <TrackerInner />
    </TrackerProvider>
  );
}
