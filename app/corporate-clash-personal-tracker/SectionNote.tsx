import React from 'react';

interface Props {
  description: string;
  status: string;
  lastUpdated: string;
}

export function SectionNote({ description, status, lastUpdated }: Props) {
  return (
    <div className="section-note">
      <p className="section-note-desc">{description}</p>
      <p className="section-note-status">
        <strong>Section Status:</strong>{' '}
        {status}{' '}
        Notice something incorrect or outdated?{' '}
        Let us know by filling out our{' '}
        <a href="https://adrentuary-gaming.vercel.app/contact" target="_blank" rel="noopener noreferrer">
          contact form
        </a>.
      </p>
      <p className="section-note-updated">Last updated: {lastUpdated}</p>
    </div>
  );
}
