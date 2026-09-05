$dest = 'C:\Users\skyle\OneDrive\Desktop\Website\app\corporate-clash-personal-tracker\PromoInfoModal.tsx'

$part2b = @'

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Department Levels</h3>
            <p className="pim-section-sub">
              <SBHighlight text="Department Levels are separate from Promotions. Earn Dept XP by defeating Sellbots anywhere." />
            </p>
            <div className="pim-dept-levels">

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 40%,#1a0a14)`}}>
                  Level 10 &mdash; Sellbot Seeker
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Exclusive Sellbot Seeker outfit (shirt, shorts, and skirt options)" /></li>
                    <li><SBHighlight text="Unlocks access to higher-difficulty Sellbot content" /></li>
                  </ul>
                  <div className="pim-outfit-table-wrap">
                    <table className="pim-outfit-table">
                      <thead>
                        <tr>
                          <th className="pim-outfit-th" style={{color: accent}}>Shirt</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Shorts</th>
                          <th className="pim-outfit-th" style={{color: accent}}>Skirt</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerShirt.png" alt="Sellbot Seeker Shirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerShorts.png" alt="Sellbot Seeker Shorts" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                          <td className="pim-outfit-img-cell">
                            <Image src="/icons/promotions/Sellbot/level-rewards/SellbotSeekerSkirt.png" alt="Sellbot Seeker Skirt" width={80} height={80} style={{objectFit:'contain'}} unoptimized />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 30%,#1a0a14)`}}>
                  Level 20 &mdash; Sellbot Expert
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Boss Rewards — exclusive IOU note collectible" /></li>
                    <li><SBHighlight text="Grants access to advanced Sellbot encounters" /></li>
                  </ul>
                </div>
              </div>

              <div className="pim-dept-level-card">
                <div className="pim-dept-level-badge" style={{background: `color-mix(in srgb,${accent} 20%,#1a0a14)`}}>
                  Level 30 &mdash; Sellbot Master
                </div>
                <div className="pim-dept-level-body">
                  <ul className="pim-list">
                    <li><SBHighlight text="Reward: Boss Rewards — unlocks the Robber Baron encounter" /></li>
                    <li><SBHighlight text="Highest Sellbot Department Level milestone currently available" /></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Gaining Department XP</h3>
            <div className="pim-table-wrap">
              <table className="pim-xp-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Base XP</th>
                    <th>Boostable By</th>
                  </tr>
                </thead>
                <tbody>
                  {SB_XP_ROWS.map(r => (
                    <tr key={r.source}>
                      <td><span className="pim-xp-val"><SBHighlight text={r.source} /></span></td>
                      <td><SBHighlight text={r.base} /></td>
                      <td className="pim-muted"><SBHighlight text={r.boost} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pim-table-note">
              <SBHighlight text="Note: Cog Invasions do not boost Merits earned inside Sellbot Factories or Sellbot Cog Buildings. Only street Sellbots benefit from invasion multipliers." />
            </p>
          </div>

        </div>
      )}
'@

$existing = [System.IO.File]::ReadAllText($dest, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($dest, $existing + $part2b, [System.Text.Encoding]::UTF8)
Write-Host "2b done: $((Get-Item $dest).Length) bytes"
