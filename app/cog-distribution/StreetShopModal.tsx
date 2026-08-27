'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { StreetShopData, Shop, ShopTask } from './data-street-shops';

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

            {/* Owner + info — shown below map when a shop is selected */}
            {selected && (
              <div className="ssm-owner-panel">
                {selected.ownerImg ? (
                  <div className="ssm-owner-img-wrap">
                    <Image
                      src={`${data.shopsBase}/shop-owners/${selected.ownerImg}`}
                      alt={selected.owner ?? 'Shop owner'}
                      fill
                      className="ssm-owner-img"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="ssm-owner-img-wrap">
                    <Image src="/icons/misc/vacant-shop.png" alt="Vacant Shop"
                      fill
                      className="ssm-vacant-img"
                      unoptimized />
                  </div>
                )}
                <div className="ssm-owner-info">
                  <span className="ssm-owner-name">{selected.owner ?? 'Vacant Shop'}</span>
                  <span className="ssm-owner-role">{selected.owner ? 'Shopkeeper' : 'No shopkeeper'}</span>
                  <span className="ssm-shop-name">{selected.name}</span>
                </div>
                {selected.shopImg && (
                  <div className="ssm-shop-ext-wrap">
                    <Image
                      src={`${data.shopsBase}/shops/${selected.shopImg}`}
                      alt={`${selected.name} exterior`}
                      fill
                      className="ssm-shop-ext-img"
                      unoptimized
                    />
                  </div>
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
                  <span className="ssm-shop-row-owner">{shop.owner ?? 'Vacant Shop'}</span>
                </span>
                <span className="ssm-shop-arrow">›</span>
              </button>
            ))}
          </div>

        </div>

        {/* ── Info panel — shown below both columns when a shop is selected ── */}
        {selected && (
          <div className="ssm-info-panel">
            {/* Description */}
            <p className="ssm-info-desc">
              <strong>{selected.name}</strong> is a shop located on{' '}
              <strong>{data.streetName}</strong> in <strong>Toontown Central</strong>.{' '}
              {selected.owner
                ? <>This shop is owned by <strong>{selected.owner}</strong>.</>
                : <>This shop has no shopkeeper.</>}
            </p>

            {/* Trivia */}
            {selected.trivia && (
              <p className="ssm-info-trivia">💡 {selected.trivia}</p>
            )}

            {/* Tasks */}
            {selected.tasks.length > 0 ? (
              <div className="ssm-tasks">
                <p className="ssm-tasks-label">Players will need to visit this shop during the following tasks:</p>
                {selected.tasks.map((task, ti) => (
                  <TaskBlock key={ti} task={task} />
                ))}
              </div>
            ) : (
              <p className="ssm-info-notasks">This shop is not required for any known tasks.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function TaskBlock({ task }: { task: ShopTask }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ssm-task-block">
      <button className="ssm-task-header" onClick={() => setOpen(o => !o)}>
        <span className="ssm-task-name">{task.name}</span>
        <span className="ssm-task-type">{task.type}</span>
        <span className="ssm-task-toggle">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="ssm-task-body">
          <ol className="ssm-task-steps">
            {task.steps.map((step, si) => (
              <li key={si} className="ssm-task-step">
                {step.text}
                {step.sub && <div className="ssm-task-sub">➔ {step.sub}</div>}
              </li>
            ))}
          </ol>
          <div className="ssm-task-reward">
            🏆 <strong>Reward:</strong> {task.reward}
          </div>
          <a href={task.wikiUrl} target="_blank" rel="noopener noreferrer" className="ssm-task-wiki">
            View on Wiki ↗
          </a>
        </div>
      )}
    </div>
  );
}
