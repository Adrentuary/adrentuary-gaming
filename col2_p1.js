// Sections 1-5: Start of Game, Activities, Misc, GUMBALL, Promotions/Directives
module.exports=function(parts,S,I,BG,NP,NT,PP,CE,EM){
parts.push(S('Start of Game','🎮','#1a1a2a','#8888ff',[
  I('Default','Background','Available at start of game',BG('DefaultBackground.png')),
  I('Default Blue','Nameplate','Available at start of game',NP('DefaultBlue.png')),
  I('Default Dark Blue','Nameplate','Available at start of game',NP('DefaultDarkBlue.png')),
  I('Default Dark Green','Nameplate','Available at start of game',NP('DefaultDarkGreen.png')),
  I('Default Green','Nameplate','Available at start of game',NP('DefaultGreen.png')),
  I('Default Light Blue','Nameplate','Available at start of game',NP('DefaultLightBlue.png')),
  I('Default Orange','Nameplate','Available at start of game',NP('DefaultOrange.png')),
  I('Default Purple','Nameplate','Available at start of game',NP('DefaultPurple.png')),
  I('Default Red','Nameplate','Available at start of game',NP('DefaultRed.png')),
  I('Default Yellow','Nameplate','Available at start of game',NP('DefaultYellow.png')),
  I('Basic','Nametag','Available at start of game'),
  I('Plain','Nametag','Available at start of game'),
  I('Applause','Profile Pose','Available at start of game',PP('Pose-applause.png')),
  I('Neutral','Profile Pose','Available at start of game',PP('Pose-neutral.png')),
  I('Sit','Profile Pose','Available at start of game',PP('Pose-sit.png')),
  I('Wave','Profile Pose','Available at start of game',PP('Pose-wave.png')),
  I('Agree','Emotion','Available at start of game',EM('neutral/Agree.gif')),
  I('Angry','Emotion','Available at start of game',EM('negative/Angry.gif')),
  I('Disagree','Emotion','Available at start of game',EM('neutral/Disagree.gif')),
  I('Happy','Emotion','Available at start of game',EM('positive/Happy.gif')),
  I('Sleepy','Emotion','Available at start of game',EM('neutral/Sleepy.gif')),
  I('Wave','Emotion','Available at start of game',EM('neutral/Wave.gif')),
]));
parts.push(S('Activities','🎣','#0a2a1a','#3dd68c',[
  I('Jellybeans','Background','Awarded for completing the Trolley for the first time',BG('JellybeansBackground.png')),
  I('Aquarium','Background','Awarded rarely when Fishing',BG('AquariumBackground.png')),
  I('Golfing','Background','Awarded for completing a round of Golf for the first time',BG('GolfingBackground.png')),
  I('Chequered Flag','Background','Awarded for completing a Race for the first time',BG('FlagBackground.png')),
  I('The Trolley','Nameplate','Awarded after completing Trolley games',NP('Trolley.png')),
  I('Under the Sea','Nameplate','Awarded after catching a rare fish',NP('UnderTheSea.png')),
  I('Golfing','Nameplate','Awarded for completing a round of Golf',NP('GolfingNameplate.png')),
  I('Racing','Nameplate','Awarded for completing a Race',NP('RacingNameplate.png')),
]));
parts.push(S('Misc.','🌟','#2a1a00','#ffaa00',[
  I('Pacesetter & Firestarter','Background','Awarded after using the code FIRESETTER',BG('Pacesetter&FirestarterBackground.png')),
  I('Game Show','Background','Awarded after defeating the High Roller 13 times',BG('GameShowBackground.png')),
  I('Duck Shuffler','Background','Awarded after defeating the Duck Shuffler',BG('DuckShufflerBackground.png')),
  I('Pacesetter & Firestarter','Nameplate','Awarded after using the code FIRESETTER',NP('Pacesetter&FirestarterNameplate.png')),
  I('Game Show','Nameplate','Awarded after defeating the High Roller 13 times',NP('GameShowNameplate.png')),
  I('Green Duck Shuffler','Nameplate','Awarded after defeating the Duck Shuffler',NP('GreenDuckShufflerNameplate.png')),
  I('Red Duck Shuffler','Nameplate','Awarded after defeating the Duck Shuffler',NP('RedDuckShufflerNameplate.png')),
  I('Birthday Bash','Nametag','Special event reward'),
]));
parts.push(S('G.U.M.B.A.L.L. Machine','🔮','#2a102a','#cc44cc',[
  I('Outback','Background','Purchasable from the G.U.M.B.A.L.L. Machine',BG('OutbackBackground.png')),
  I('Outback','Nameplate','Purchasable from the G.U.M.B.A.L.L. Machine',NP('OutbackNameplate.png')),
  I('Stars','Nameplate','Purchasable from the G.U.M.B.A.L.L. Machine'),
  I('Silent Treatment','Profile Pose','Purchasable from the G.U.M.B.A.L.L. Machine for 450 Gumballs',PP('Pose-Silent_Treatment.png')),
  I('Banana','Profile Pose','Purchasable from the G.U.M.B.A.L.L. Machine for 500 Gumballs',PP('Pose-Banana.png')),
  I('Seltzer Bottle','Profile Pose','Purchasable from the G.U.M.B.A.L.L. Machine for 500 Gumballs',PP('Pose-Seltzer_Bottle.png')),
  I('Gag Button','Profile Pose','Purchasable from the G.U.M.B.A.L.L. Machine for 500 Gumballs',PP('Pose-Gag_Button.png')),
  I('Pie Toss','Profile Pose','Purchasable from the G.U.M.B.A.L.L. Machine for 500 Gumballs',PP('Pose-Pie_Toss.png')),
  I('Megaphone','Profile Pose','Awarded after completing the Temperature Troubles Directive',PP('Pose-megaphone.png')),
]));
parts.push(S('Promotions / Directives / Overclocked','⚙️','#1a1a1a','#aaaaaa',[
  I('R.I.D.D.L.E','Background','Awarded from a special event',BG('Riddle.png')),
  I('Paint Mixer','Background','Awarded from a special event',BG('PaintMixerBackground.png')),
  I('Sellbot HQ','Background','Awarded for reaching the Sellbot HQ Playground',BG('SellbotHQBackground.png')),
  I('Cashbot HQ','Background','Awarded for reaching the Cashbot HQ Playground',BG('CashbotHQBackground.png')),
  I('Lawbot HQ','Background','Awarded for reaching the Lawbot HQ Playground',BG('LawbotHQBackground.png')),
  I('Bossbot HQ','Background','Awarded for reaching the Bossbot HQ Playground',BG('BossbotHQBackground.png')),
  I('Turning It Up To 11','Nameplate','Awarded after completing a Mezzo Melodyland Kudos Rank-Up Task',NP('Turningitupto11.png')),
  I('Resistance Salute','Profile Pose','Awarded after defeating The Directors',PP('Pose-Resistance_Salute.png')),
]));
};
