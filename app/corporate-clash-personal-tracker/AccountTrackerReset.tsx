'use client';
import { TrackerProvider } from './TrackerContext';
import { ResetPanel } from './ResetPanel';

export function AccountTrackerReset() {
  return (
    <TrackerProvider>
      <ResetPanel label="Reset progress by toon:" />
    </TrackerProvider>
  );
}
