'use client';
import { useEffect, useCallback } from 'react';

interface Props {
  suitName: string;
  accent: string;
  onClose: () => void;
}

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

  return (
    <div className="pgm-backdrop" onClick={onClose}>
      <div
        className="pgm-box"
        style={{ '--pgm-accent': accent } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <div className="pgm-header">
          <div className="pgm-header-text">
            <h2 className="pgm-title">{suitName}</h2>
            <span className="pgm-subtitle">{suitName} Additional Info</span>
          </div>
          <button className="pgm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="pgm-body pgm-body--single">
          <p className="pgm-info-placeholder">
            Additional information for {suitName} will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}
