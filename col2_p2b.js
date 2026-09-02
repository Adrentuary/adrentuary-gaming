// Sections 9-10: BB, YOTT
module.exports=function(parts,S,I,BG,NP,NT,PP,CE,EM){
parts.push(S('Barnacle Boatyard','⚓','#5a1a05','#dc4a14',[
  I('Barnacle Boatyard','Background','Awarded for progressing to Barnacle Boatyard in the Taskline',BG('BarnacleBoatyard.png')),
  I('Barnacle Boatyard Sky','Background','Awarded for visiting Barnacle Boatyard',BG('BarnacleBoatyardSkyBackground.png')),
  I('On The Dock','Background','Awarded after completing Silverware Sting Kudos Rank-Up Task',BG('OnTheDockBackground.png')),
  I('Barnacle Boatyard','Nameplate','Awarded for visiting Barnacle Boatyard',NP('BarnacleBoatyardNameplate.png')),
  I('Sandcastles','Nameplate','Awarded for riding the Boat for 20 Laps',NP('SandcastlesNameplate.png')),
  I('Boardwalk','Nametag','Awarded after completing a Barnacle Boatyard task'),
  I('Nautical','Nametag','Awarded after completing a Barnacle Boatyard task'),
  I('Pirate','Nametag','Awarded after completing a Barnacle Boatyard task'),
  I('Wonky','Nametag','Awarded after completing a Barnacle Boatyard task'),
  I('Diving','Profile Pose','Awarded after completing the task Swimming Kiwi',PP('Pose-diving.png')),
  I("I'm Outta Here!",'Profile Pose','Awarded after defeating the Land Acquisition Architect',PP("Pose-I'm_outta_here.png")),
  I('Treasure','Profile Pose','Awarded after reaching Barnacle Boatyard Kudos Rank 5',PP('Pose-Treasure.png')),
  I('Big Legs','Cheesy Effect','Awarded after completing The Salty Spit-toon sidetask',CE('CE_biglegs.png')),
]));
parts.push(S('Ye Olde Toontowne','👑','#33205e','#9b70cc',[
  I('Ye Olde Toontowne','Background','Awarded for progressing to Ye Olde Toontowne in the Taskline',BG('YeOleToontowneBackground.png')),
  I('Ye Olde Toontowne Sky','Background','Awarded for visiting Ye Olde Toontowne',BG('YOTTskyBackground.png')),
  I('Hearty Feast','Background','Awarded from a special event',BG('HeartyFeastBackground.png')),
  I('Ye Olde Toontowne','Nameplate','Awarded for visiting Ye Olde Toontowne',NP('YOTT.png')),
  I('The Doodragon','Nameplate','Awarded from a special event',NP('TheDoodragonNameplate.png')),
  I('Medieval','Nametag','Awarded after completing a Ye Olde Toontowne task'),
  I('Poetic','Nametag','Awarded after completing a Ye Olde Toontowne task'),
  I('At The Gate','Profile Pose','Awarded after reaching Ye Olde Toontowne Kudos Rank 5',PP('Pose-At_The_Gate.png')),
  I('Casting','Profile Pose','Awarded after completing the task The Golden Penny',PP('Pose-casting.png')),
  I('To Be or Not To Be?','Profile Pose','Awarded after defeating the Public Relations Representative',PP('Pose-To_be_or_not_to_be.png')),
  I('Small Head','Cheesy Effect','Purchasable or event reward',CE('CE_smallhead.png')),
  I('Transparent','Cheesy Effect','Purchasable or event reward',CE('CE_transparent.png')),
]));
};
