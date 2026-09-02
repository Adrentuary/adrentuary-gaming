// Sections 11-13: DG, MML, Brrrgh
module.exports=function(parts,S,I,BG,NP,NT,PP,CE,EM){
parts.push(S('Daffodil Gardens','🌸','#314600','#9bd31a',[
  I('Daffodil Gardens','Background','Awarded for progressing to Daffodil Gardens in the Taskline',BG('DaffodilGardensBackground.png')),
  I('Daffodil Gardens Sky','Background','Awarded for visiting Daffodil Gardens',BG('DaffodilSkysBackground.png')),
  I('Tranquil Fountain','Background','Awarded from a special event',BG('TranquilFountainBackground.png')),
  I('Daffodil Gardens','Nameplate','Awarded for visiting Daffodil Gardens',NP('DaffodilNameplate.png')),
  I('Gardening','Nameplate','Awarded after completing a Daffodil Gardens Kudos Rank-Up Task',NP('GardeningNameplate.png')),
  I('Calligraphy','Nametag','Awarded after completing a Daffodil Gardens task'),
  I('Silly','Nametag','Awarded after completing a Daffodil Gardens task'),
  I('Elegance','Profile Pose','Awarded after reaching Daffodil Gardens Kudos Rank 5',PP('Pose-Elegance.png')),
  I('Running','Profile Pose','Awarded after completing the task Wedding Planner',PP('Pose-running.png')),
  I('Flat Portrait','Cheesy Effect','Purchasable or event reward',CE('CE_flatportrait.png')),
  I('Green Toon','Cheesy Effect','Awarded from the Monkey See Monkey Do sidetask',CE('CE_greentoon.png')),
]));
parts.push(S('Mezzo Melodyland','🎵','#482052','#bf62cb',[
  I('Mezzo Melodyland','Background','Awarded for progressing to Mezzo Melodyland in the Taskline',BG('MezzoMelodylandBackground.png')),
  I('Mezzo Melodyland Sky','Background','Awarded for visiting Mezzo Melodyland',BG('MezzoBackground.png')),
  I('Rock Concert','Background','Awarded from a special event',BG('RockConcertBackground.png')),
  I('Mezzo Melodyland','Nameplate','Awarded for visiting Mezzo Melodyland',NP('MezzoMelodylandNameplate.png')),
  I("Fire n' Flames",'Nameplate','Awarded from a special event',NP("FiresN'FlamesNameplate.png")),
  I('Fancy','Nametag','Awarded after completing a Mezzo Melodyland task'),
  I('Playful','Nametag','Awarded after completing a Mezzo Melodyland task'),
  I('Whimsical','Nametag','Awarded after completing a Mezzo Melodyland task'),
  I('Pick Up The Phone','Profile Pose','Awarded after reaching Mezzo Melodyland Kudos Rank 5',PP('Pose-Pick_Up_The_Phone.png')),
  I('Presenting...','Profile Pose','Awarded after completing the task Piano Player',PP('Pose-presenting.png')),
  I('Big Head','Cheesy Effect','Purchasable or event reward',CE('CE_bighead.png')),
  I('Flat Profile','Cheesy Effect','Purchasable or event reward',CE('CE_flatprofile.png')),
]));
parts.push(S('The Brrrgh','❄️','#003a46','#29b2dc',[
  I('The Brrrgh','Background','Awarded for progressing to The Brrrgh in the Taskline',BG('TheBrrrghBackground.png')),
  I('The Brrrgh Sky','Background','Awarded for visiting The Brrrgh',BG('BrrrghSkyBackground.png')),
  I('Doodlesledding','Background','Awarded from the Doodlesledding event',BG('DoodlesleddingBackground.png')),
  I('The Brrrgh','Nameplate','Awarded for visiting The Brrrgh',NP('BrrrghNameplate.png')),
  I('Snowball Fight','Nameplate','Awarded from a special event',NP('SnowballFightNameplate.png')),
  I('Scarf','Nameplate','Awarded after completing a The Brrrgh Kudos Rank-Up Task',NP('ScarfNameplate.png')),
  I('Comical','Nametag','Awarded after completing a The Brrrgh task'),
  I('Shivering','Nametag','Awarded after completing a The Brrrgh task'),
  I('Fire Hands','Profile Pose','Awarded after reaching The Brrrgh Kudos Rank 5',PP('Pose-fire-hands.gif')),
  I('Surprised','Profile Pose','Awarded after completing the task Gathering Warmth',PP('Pose-surprised.png')),
  I('Big White Toon','Cheesy Effect','Purchasable or event reward',CE('CE_bigwhitetoon.png')),
  I('No Color','Cheesy Effect','Purchasable or event reward',CE('CE_nocolor.png')),
  I('Wireframe','Cheesy Effect','Purchasable or event reward',CE('CE_wireframe.png')),
]));
require('./col2_p4.js')(parts,S,I,BG,NP,NT,PP,CE,EM);};
