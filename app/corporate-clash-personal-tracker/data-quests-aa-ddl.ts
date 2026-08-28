import type { QuestPlayground } from './data-quests-types';
import { H, Q, KL, KH } from './data-quests-types';
export const AA: QuestPlayground = {
  name: 'Acorn Acres', icon: '🌰', color: '#003a18', accent: '#20cf69',
  mainColor: '#1dd166', kudosHighColor: '#38985f',
  rows: [
    H('Main Storyline'),
    Q("Flippy's Message"), Q('First Draft Pick'), Q('Enlisting In The Army'),
  ],
};
export const DDL: QuestPlayground = {
  name: 'Drowsy Dreamland', icon: '💤', color: '#1a1060', accent: '#7b68ee',
  mainColor: '#a49bfa', kudosHighColor: '#6c62d8',
  rows: [
    H('Kudos Rank-Up Quests'),
    KL('4→5  Make Your Bed And Lie In It','⭐ Naptime – Profile Pose'),
    KL("5→6  What Night is It?",'30% Cheaper Gags in DDL | +1 DDL CUMBALL Booster'),
    KH('6→7  No Time for Beauty Sleep','+2 DDL Gag XP Multiplier'),
    KH('7→8  Doze Were Mine!','⭐ Cinema – Nametag Font'),
    KH('8→9  So Easy, You Could Do It In Your Sleep!','50% Cheaper Gags in DDL | +1 DDL CUMBALL Booster'),
    KH('9→10  Give it a Rest!','+1 Max Laff'),
    KH('10+  +70 Gumballs'),
  ],
};
