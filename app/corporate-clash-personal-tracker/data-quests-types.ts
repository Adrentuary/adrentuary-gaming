export type QuestSectionType = 'main' | 'side' | 'kudos-low' | 'kudos-high';

export interface QuestRow {
  name: string;
  reward?: string;
  location?: string;
  isHeader?: boolean;
  headerLabel?: string;
  /** Populated on data rows — which section this row belongs to */
  sectionType?: QuestSectionType;
}

export interface QuestPlayground {
  name: string; icon: string; pgKey: string; color: string; accent: string;
  rows: QuestRow[];
}

export const H = (label: string): QuestRow => ({ name: '', isHeader: true, headerLabel: label });

/** Main storyline quest */
export const Q = (name: string, reward?: string, location?: string): QuestRow =>
  ({ name, reward: reward ?? 'N/A', location: location ?? 'N/A', sectionType: 'main' });

/** Sidetask quest */
export const S = (name: string, reward: string, location: string): QuestRow =>
  ({ name, reward, location, sectionType: 'side' });

/** Kudos rank-up quest — low tier (1→2 through 5→6) */
export const KL = (name: string, reward?: string): QuestRow =>
  ({ name, reward: reward ?? 'N/A', location: 'N/A', sectionType: 'kudos-low' });

/** Kudos rank-up quest — high tier (6→7 and above) */
export const KH = (name: string, reward?: string): QuestRow =>
  ({ name, reward: reward ?? 'N/A', location: 'N/A', sectionType: 'kudos-high' });
