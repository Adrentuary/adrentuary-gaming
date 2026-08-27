export interface QuestRow {
  name: string;
  reward?: string;
  location?: string;
  isHeader?: boolean;
  headerLabel?: string;
}
export interface QuestPlayground {
  name: string; icon: string; color: string; accent: string;
  rows: QuestRow[];
}

export const H = (label: string): QuestRow => ({ name: '', isHeader: true, headerLabel: label });
export const Q = (name: string, reward?: string, location?: string): QuestRow => ({ name, reward: reward ?? 'N/A', location: location ?? 'N/A' });
export const S = (name: string, reward: string, location: string): QuestRow => ({ name, reward, location });
