'use client';
import Image from 'next/image';
import { SectionNote } from './SectionNote';
import { LAFF_BOOSTS } from './data-laff';
import { useTracker, TOON_COLORS } from './TrackerContext';
import type { ToonIndex } from './TrackerContext';
import { CheckBtn } from './CheckBtn';

// Playground icon map keyed by full playground name
const PG_ICON_MAP: Record<string, { img: string }> = {
  'Toontown Central': { img: '/icons/playground-emblems/TTC.png' },
  'Barnacle Boatyard': { img: '/icons/playground-emblems/BB.png' },
  'Ye Olde Toontowne': { img: '/icons/playground-emblems/YOTT.png' },
  'Daffodil Gardens':  { img: '/icons/playground-emblems/DG.png' },
  'Mezzo Melodyland':  { img: '/icons/playground-emblems/MML.png' },
  'The Brrrgh':        { img: '/icons/playground-emblems/TB.png' },
  'Acorn Acres':       { img: '/icons/playground-emblems/AA.png' },
  'Drowsy Dreamland':  { img: '/icons/playground-emblems/DDL.png' },
};

// Top-level collapsible groups
const LAFF_GROUPS = ['Kudos', 'Activities', 'Promotions', 'Directives'];

// Which data sections belong to each group
const GROUP_SECTIONS: Record<string, string[]> = {
  'Kudos':      ['Kudos Ranking'],
  'Activities': ['Fishing', 'Golfing', 'Racing', 'Trolly'],
  'Promotions': ['Sellbot Promotions', 'Cashbot Promotions', 'Lowbot Promotions', 'Bossbot Promotions'],
  'Directives': ['Directives'],
};

// Activity sub-sections get their own collapse toggle
const ACTIVITY_SECTIONS = ['Fishing', 'Golfing', 'Racing', 'Trolly'];

const LAFF_COLLAPSED_KEY = 'laff';

export function SectionLaff() {
  const { toonNames, toggleAll, isAllDone, collapsedUI, setCollapsedUI } = useTracker();

  // Top-level group open/closed (stored as closed set)
  const closedGroups = new Set<string>(collapsedUI[LAFF_COLLAPSED_KEY] ?? []);
  const openGroups = new Set<string>(LAFF_GROUPS.filter(g => !closedGroups.has(g)));
  const setOpenGroups = (updater: (prev: Set<string>) => Set<string>) => {
    setCollapsedUI(prev => {
      const currentClosed = new Set<string>(prev[LAFF_COLLAPSED_KEY] ?? []);
      const currentOpen = new Set<string>(LAFF_GROUPS.filter(g => !currentClosed.has(g)));
      const nextOpen = updater(currentOpen);
      const nextClosed = LAFF_GROUPS.filter(g => !nextOpen.has(g));
      return { ...prev, [LAFF_COLLAPSED_KEY]: nextClosed };
    });
  };
  const colCount = 2 + toonNames.length + 1; // first-col + +Laff + toons + All

  const toggleGroup = (g: string) => setOpenGroups(prev => {
    const next = new Set(prev); next.has(g) ? next.delete(g) : next.add(g); return next;
  });

  // Activity sub-sections collapse (stored under a separate key)
  const ACT_KEY = 'laff-activities';
  const closedActivities = new Set<string>(collapsedUI[ACT_KEY] ?? []);
  const openActivities = new Set<string>(ACTIVITY_SECTIONS.filter(s => !closedActivities.has(s)));
  const toggleActivity = (s: string) => {
    setCollapsedUI(prev => {
      const current = new Set<string>(prev[ACT_KEY] ?? []);
      current.has(s) ? current.delete(s) : current.add(s);
      return { ...prev, [ACT_KEY]: [...current] };
    });
  };

  // Helper: render data rows for a given section
  const renderRows = (section: string) =>
    LAFF_BOOSTS
      .filter(e => !e.isHeader && e.section === section)
      .map((entry, ri) => {
        if (entry.isHeader) return null;
        const key = `lb:${entry.section}:${entry.note}:${entry.source}`;
        const allDone = isAllDone(key);
        const pg = entry.playground ? PG_ICON_MAP[entry.playground] : null;
        return (
          <tr key={`${section}-${ri}`} className={allDone ? 'row-all-done' : ''}>
            {section === 'Kudos Ranking' ? (
              <td className="col-playground">
                {pg && <Image src={pg.img} alt={entry.playground!} width={18} height={18} className="laff-pg-icon" style={{marginRight:8,verticalAlign:'middle'}} />}
                <span>{entry.playground}</span>
              </td>
            ) : (
              <td className="col-sm">{entry.note}</td>
            )}
            <td className="col-sm" style={{textAlign:'center'}}>+{entry.laff}</td>
            {([0,1,2,3] as ToonIndex[]).map(t => (
              <td key={t} className="col-toon"><CheckBtn id={key} toon={t} label={`${toonNames[t]}: ${entry.section} ${entry.note}`} /></td>
            ))}
            <td className="col-all"><button className={`all-btn${allDone?' all-btn--done':''}`} onClick={() => toggleAll(key)} title={allDone?'Unmark all':'Mark all toons'}>{allDone?'★':'☆'}</button></td>
          </tr>
        );
      });

  // Shared thead for standard groups
  const standardThead = (
    <thead><tr>
      <th className="col-sm">Milestone</th>
      <th className="col-sm" style={{textAlign:'center'}}>+Laff</th>
      {toonNames.map((n,i) => <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>)}
      <th className="col-all">All</th>
    </tr></thead>
  );
  const kudosThead = (
    <thead><tr>
      <th className="col-playground">Playground</th>
      <th className="col-sm" style={{textAlign:'center'}}>+Laff</th>
      {toonNames.map((n,i) => <th key={i} className="col-toon" style={{color:TOON_COLORS[i]}}>{n}</th>)}
      <th className="col-all">All</th>
    </tr></thead>
  );

  return (
    <div className="tracker-section">
      <SectionNote
        description="All sources of laff boosts in Corporate Clash, grouped by Kudos rankings, activities, promotions, and directives. Max laff is 150. Sections can be collapsed using the dropdown arrows."
        status="Section design and interactive features are currently under development."
        lastUpdated="September 5th, 2026 · 9:00 PM"
        lastChanges="Rebuilt into 4 separate sections: Kudos, Activities, Promotions, Directives. Kudos shows playground icons and full names. Activity sub-sections are individually collapsible."
      />
      <div className="tracker-card" style={{'--dc':'#1a2a3a','--da':'#5ab0e0'} as React.CSSProperties}>
        <div className="tracker-card-header"><strong>Laff Boosts</strong><span className="tracker-card-sub">Max Laff: 150</span></div>

        {/* KUDOS */}
        <div className="laff-group-divider"><button className="laff-collapse-btn" onClick={() => toggleGroup('Kudos')}>
          <span className="quest-collapse-arrow">{openGroups.has('Kudos') ? '▼' : '▶'}</span>Kudos
        </button></div>
        {openGroups.has('Kudos') && (
          <div className="tracker-table-wrap"><table className="tracker-table">
            {kudosThead}<tbody>{renderRows('Kudos Ranking')}</tbody>
          </table></div>
        )}

        {/* ACTIVITIES */}
        <div className="laff-group-divider"><button className="laff-collapse-btn" onClick={() => toggleGroup('Activities')}>
          <span className="quest-collapse-arrow">{openGroups.has('Activities') ? '▼' : '▶'}</span>Activities
        </button></div>
        {openGroups.has('Activities') && (
          <div className="tracker-table-wrap"><table className="tracker-table">
            {standardThead}
            <tbody>
              {ACTIVITY_SECTIONS.map(act => {
                const isOpen = openActivities.has(act);
                return [
                  <tr key={`act-${act}`} className="laff-section-header"><td colSpan={colCount} style={{padding:0}}>
                    <button className="laff-collapse-btn laff-collapse-btn--sub" onClick={() => toggleActivity(act)}>
                      <span className="quest-collapse-arrow">{isOpen ? '▼' : '▶'}</span>{act}
                    </button>
                  </td></tr>,
                  ...(isOpen ? renderRows(act) : []),
                ];
              })}
            </tbody>
          </table></div>
        )}

        {/* PROMOTIONS */}
        <div className="laff-group-divider"><button className="laff-collapse-btn" onClick={() => toggleGroup('Promotions')}>
          <span className="quest-collapse-arrow">{openGroups.has('Promotions') ? '▼' : '▶'}</span>Promotions
        </button></div>
        {openGroups.has('Promotions') && (
          <div className="tracker-table-wrap"><table className="tracker-table">
            {standardThead}
            <tbody>
              {GROUP_SECTIONS['Promotions'].map(sec => [
                <tr key={`promo-${sec}`} className="laff-section-header"><td colSpan={colCount}>
                  <span className="laff-section-title">{sec}</span>
                </td></tr>,
                ...renderRows(sec),
              ])}
            </tbody>
          </table></div>
        )}

        {/* DIRECTIVES */}
        <div className="laff-group-divider"><button className="laff-collapse-btn" onClick={() => toggleGroup('Directives')}>
          <span className="quest-collapse-arrow">{openGroups.has('Directives') ? '▼' : '▶'}</span>Directives
        </button></div>
        {openGroups.has('Directives') && (
          <div className="tracker-table-wrap"><table className="tracker-table">
            {standardThead}<tbody>{renderRows('Directives')}</tbody>
          </table></div>
        )}

      </div>
    </div>
  );
}
