$dest = 'C:\Users\skyle\OneDrive\Desktop\Website\app\corporate-clash-personal-tracker\PromoInfoModal.tsx'

$part2a = @'

/* Sellbot content */
function SellbotContent({ accent }: { accent: string }) {
  const [tab, setTab] = useState<'promos'|'ladder'>('promos');

  return (
    <div className="pim-inner">
      <div className="pim-inner-tabs">
        {(['promos','ladder'] as const).map(t => (
          <button
            key={t}
            className={`pim-inner-tab${tab === t ? ' pim-inner-tab--active' : ''}`}
            style={tab === t ? {'--pim-accent': accent} as React.CSSProperties : undefined}
            onClick={() => setTab(t)}
          >
            {t === 'promos' ? 'Sellbot Promotions' : 'Corporate Ladder'}
          </button>
        ))}
      </div>

      {tab === 'promos' && (
        <div className="pim-scroll">

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Suit Acquisition</h3>
            <div className="pim-info-block">
              <div className="pim-suit-header">
                <Image src="/icons/cog-emblems/SellbotEmblem.png" alt="Sellbot" width={32} height={32} className="pim-suit-emblem" unoptimized />
                <span className="pim-suit-name" style={{fontWeight:800}}>Sellbot Cog Suit</span>
              </div>
              <ul className="pim-list">
                <li><SBHighlight text="Earn the Cold Caller Cog Disguise by completing 5 Sellbot Factories." /></li>
                <li><SBHighlight text="Each Factory run defeats the Factory Foreman and rewards one suit part." /></li>
                <li><SBHighlight text="Run 5 short Factories for the quickest clear." /></li>
              </ul>
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Promotions Overview</h3>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>How promotions work:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Promotions are earned by defeating the Senior Vice President atop Sellbot Towers in Sellbot HQ." /></li>
                <li><SBHighlight text="Promotions are tracked separately from Department Levels." /></li>
                <li><SBHighlight text="The Sellbot equivalent of Merits is called Invoices." /></li>
                <li><SBHighlight text="Invoices are earned by defeating any Sellbots anywhere in the game." /></li>
                <li><SBHighlight text="A required number of Invoices must be collected before entering Sellbot Towers." /></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>Best ways to stack Invoices fast:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Sellbot Factories are the fastest method — many Sellbots are defeated per run." /></li>
                <li><SBHighlight text="Sellbot Cog Buildings also reward Invoices, but Invasions do not boost Merits inside buildings or facilities." /></li>
                <li><SBHighlight text="Boost earnings with Merit Monday, Cog Invasions, and Boosters." /></li>
              </ul>
            </div>
            <div className="pim-info-block">
              <p className="pim-para pim-note" style={{marginBottom: 4}}>Milestone rewards:</p>
              <ul className="pim-list">
                <li><SBHighlight text="Teleport access to Sellbot HQ is earned when a Toon reaches Mover and Shaker Level 5." /></li>
                <li><SBHighlight text="A Laff Point is earned at Mr. Hollywood Levels 8, 15, 20, 30, 40, and 50 — totaling 6 additional Laff Points." /></li>
              </ul>
            </div>
          </div>
'@

$existing = [System.IO.File]::ReadAllText($dest, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($dest, $existing + $part2a, [System.Text.Encoding]::UTF8)
Write-Host "2a done: $((Get-Item $dest).Length) bytes"
