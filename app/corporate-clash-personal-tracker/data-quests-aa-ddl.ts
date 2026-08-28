import type { QuestPlayground } from './data-quests-types';
import { H, Q } from './data-quests-types';
export const AA: QuestPlayground = {
  name: 'Acorn Acres', icon: '🌰', color: '#003a18', accent: '#20cf69',
  rows: [
    H('Main Storyline'),
    Q("Flippy's Message"), Q('First Draft Pick'), Q('Enlisting In The Army'),
  ],
};
export const DDL: QuestPlayground = {
  name: 'Drowsy Dreamland', icon: '💤', color: '#1a1060', accent: '#7b68ee',
  rows: [
    H('Kudos Rank-Up Quests'),
    Q('4→5  Make Your Bed And Lie In It','⭐ Naptime – Profile Pose'),
    Q("5→6  What Night is It?",'30% Cheaper Gags in DDL | +1 DDL CUMBALL Booster'),
    Q('6→7  No Time for Beauty Sleep','+2 DDL Gag XP Multiplier'),
    Q('7→8  Doze Were Mine!','⭐ Cinema – Nametag Font'),
    Q('8→9  So Easy, You Could Do It In Your Sleep!','50% Cheaper Gags in DDL | +1 DDL CUMBALL Booster'),
    Q('9→10  Give it a Rest!','+1 Max Laff'),
    Q('10+  +70 Gumballs'),
  ],
};
