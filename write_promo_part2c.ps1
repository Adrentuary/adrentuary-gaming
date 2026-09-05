$dest = 'C:\Users\skyle\OneDrive\Desktop\Website\app\corporate-clash-personal-tracker\PromoInfoModal.tsx'

$part2c = @'

      {tab === 'ladder' && (
        <div className="pim-scroll">

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>General Cogs</h3>
            <div className="pim-cog-grid">
              {SB_REGULAR.map(c => (
                <div key={c.name} className="pim-cog-card">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Levels {c.levels}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title" style={{color: accent}}>Special Cogs</h3>
            <div className="pim-cog-grid">
              {SB_SPECIAL.map(c => (
                <div key={c.name} className="pim-cog-card">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name" style={{color: accent}}>{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Level {c.level}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pim-section">
            <h3 className="pim-section-title pim-section-title--removed">Removed Cogs</h3>
            <div className="pim-cog-grid">
              {SB_REMOVED.map(c => (
                <div key={c.name} className="pim-cog-card pim-cog-card--removed">
                  <div className="pim-cog-img-wrap">
                    <Image src={c.img} alt={c.name} fill className="pim-cog-img" unoptimized />
                  </div>
                  <div className="pim-cog-info">
                    <span className="pim-cog-name pim-cog-name--removed">{c.name}</span>
                    <span className="pim-cog-tier">{c.tier}</span>
                    <span className="pim-cog-stat">Level {c.level}</span>
                    <span className="pim-cog-stat">Damage: {c.dmg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}


/* Main exported modal */
export function PromoInfoModal({ suitName, accent, onClose }: Props) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const isSellbot = suitName === 'Sellbot';

  return (
    <div className="pgm-backdrop" onClick={onClose}>
      <div
        className={`pgm-box pim-box${isSellbot ? ' pim-box--sb' : ''}`}
        style={{'--pgm-accent': accent} as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        {isSellbot && <div className="pim-bg-overlay" />}

        <div className="pgm-header pim-header-raised">
          <Image
            src="/icons/cog-emblems/SellbotEmblem.png"
            alt={suitName}
            width={36}
            height={36}
            className="pgm-emblem"
            unoptimized
          />
          <div className="pgm-header-text">
            <h2 className="pgm-title">{suitName}</h2>
            <span className="pgm-subtitle">{suitName} Additional Info</span>
          </div>
          <button className="pgm-close" onClick={onClose} aria-label="Close">&#x2715;</button>
        </div>

        <div className="pgm-body pgm-body--single pim-body-wrap">
          {isSellbot
            ? <SellbotContent accent={accent} />
            : <p className="pgm-info-placeholder">Additional information for {suitName} will be added here.</p>
          }
        </div>
      </div>
    </div>
  );
}
'@

$existing = [System.IO.File]::ReadAllText($dest, [System.Text.Encoding]::UTF8)
[System.IO.File]::WriteAllText($dest, $existing + $part2c, [System.Text.Encoding]::UTF8)
Write-Host "2c done: $((Get-Item $dest).Length) bytes"
