'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { StreetShopData, Shop } from './data-street-shops';

interface Props {
  data: StreetShopData;
  onClose: () => void;
}

export function StreetShopModal({ data, onClose }: Props) {
  const [selected, setSelected] = useState<Shop | null>(null);

  // close on Escape
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

  const mapSrc = selected
    ? `${data.shopsBase}/shop-maps/${selected.mapImg}`
    : data.mainMap;

  return (
    <div className="ssm-backdrop" onClick={onClose}>
      <div className="ssm-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="ssm-header">
          <span className="ssm-title">{data.streetName}</span>
          {selected && (
            <button className="ssm-back-btn" onClick={() => setSelected(null)}>
              ← Back to map
            </button>
          )}
          <button className="ssm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Body ── */}
        <div className="ssm-body">

          {/* Left: map panel */}
          <div className="ssm-map-panel">
            <div className="ssm-map-wrap">
              <Image
                src={mapSrc}
                alt={selected ? `${selected.name} location` : `${data.streetName} map`}
                width={512}
                height={512}
                className="ssm-map-img"
                unoptimized
                priority
              />
            </div>

            {/* Owner portrait — shown below map when a shop is selected */}
            {selected && (
              <div className="ssm-owner-panel">
                {selected.ownerImg ? (
                  <>
                    <Image
                      src={`${data.shopsBase}/shop-owners/${selected.ownerImg}`}
                      alt={selected.owner ?? 'Shop owner'}
                      width={160}
                      height={160}
                      className="ssm-owner-img"
                      unoptimized
                    />
                    <div className="ssm-owner-info">
                      <span className="ssm-owner-name">{selected.owner}</span>
                      <span className="ssm-owner-role">Shopkeeper</span>
                      <span className="ssm-shop-name">{selected.name}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src="/icons/misc/vacant-shop.png"
                      alt="Vacant Shop"
                      width={80}
                      height={80}
                      className="ssm-vacant-img"
                      unoptimized
                    />
                    <div className="ssm-owner-info">
                      <span className="ssm-owner-name">Vacant Shop</span>
                      <span className="ssm-owner-role">No shopkeeper</span>
                      <span className="ssm-shop-name">{selected.name}</span>
                    </div>
                  </>
                )}
              </div>
            )}


          </div>

          {/* Right: shop list */}
          <div className="ssm-shop-list">
            <p className="ssm-list-label">{data.shops.length} shops on {data.streetName}</p>
            {data.shops.map((shop, i) => (
              <button
                key={i}
                className={`ssm-shop-row${selected?.name === shop.name ? ' ssm-shop-row--active' : ''}${shop.owner === null ? ' ssm-shop-row--vacant' : ''}`}
                onClick={() => setSelected(shop)}
              >
                <span className="ssm-shop-num">{i + 1}</span>
                <span className="ssm-shop-info">
                  <span className="ssm-shop-row-name">{shop.name}</span>
                  <span className="ssm-shop-row-owner">
                    {shop.owner ?? 'Vacant Shop'}
                  </span>
                </span>
                <span className="ssm-shop-arrow">›</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
