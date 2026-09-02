// Sections 6-8: Halloween, Christmas, TTC
module.exports=function(parts,S,I,BG,NP,NT,PP,CE,EM){
parts.push(S('🎃 Halloween','🎃','#2a0e00','#ff6600',[
  I('The Golden Corridor','Background','Previously awarded for defeating Sads the Skelecog',BG('TheGoldenCorridorBackground.png')),
  I('Halloween Town','Background','Awarded during Halloween events',BG('HalloweenTown.png')),
  I('Halloween Night','Background','Awarded during Halloween events',BG('HalloweenNightBackground.png')),
  I('Lazy Bones','Nameplate','Previously awarded for defeating Sads the Skelecog',NP('LazyBonesNameplate.png')),
  I('Spooky Bat','Nameplate','Awarded during the Halloween 2020 event',NP('HW2020nameplate.png')),
  I('Halloween Night','Nameplate','Awarded during Halloween events',NP('HalloweenNightNameplate.png')),
  I('Halloween Candy (Blue)','Nameplate','Awarded during Halloween events',NP('HalloweenCandyBlue.png')),
  I('Halloween Candy (Green)','Nameplate','Awarded during Halloween events',NP('HalloweenCandyGreen.png')),
  I('Halloween Candy (Magenta)','Nameplate','Awarded during Halloween events',NP('HalloweenCandyMagenta.png')),
  I('Halloween Candy (Purple)','Nameplate','Awarded during Halloween events',NP('HalloweenCandyPurple.png')),
  I('Halloween Candy (Red)','Nameplate','Awarded during Halloween events',NP('HalloweenCandyRed.png')),
  I('Spooky','Nametag','Awarded during Halloween events'),
  I('Sinking','Profile Pose','Available from Reid Stock during Halloween/April Toons for 35 of each Shkrafting Material',PP('Pose-sinking.png')),
  I('Spooky','Profile Pose','Awarded after completing Halloween Organizer (Unobtainable)',PP('Pose-spooky.png')),
  I('Zombie','Profile Pose','Awarded after completing Spooky Storyteller (Unobtainable)',PP('Pose-zombie.png')),
  I('No Arms','Cheesy Effect','Available during Halloween for 35 of each Shkrafting Material',CE('CE_noarms.png')),
  I('Scapegourd','Cheesy Effect','Shkrafting Shop (Lynn Decisive)',CE('ScapegourdDouble.png')),
  I('Spirit','Cheesy Effect','Shkrafting Shop (Lynn Decisive)',CE('CE_spirit.png')),
  I('Stomped','Cheesy Effect','Shkrafting Shop (Lynn Decisive)',CE('CE_Stomped.png')),
  I("Yarr & Harr",'Cheesy Effect','Halloween event reward',CE('Yarr&HarrDouble.png')),
]));
parts.push(S('🎄 Christmas','🎄','#0a2010','#40d070',[
  I('Winter Cabin','Background','Drop from Toonseltown Present Thief Game (Toonsmas Update)',BG('WinterCabinBackground.png')),
  I('Fireplace','Background','Awarded after completing Stocking Stuffers Toontask',BG('Fireplace.png')),
  I('Night Lights','Nameplate','Toonsmas event reward',NP('LightsShowNameplate.png')),
  I('Wrapping','Nameplate','Awarded after completing Presidential Appreciation Toontask',NP('Wrappingpaper.png')),
  I('Tinsel','Nameplate','Drop from Toonseltown Present Thief Game (Toonsmas Event)',NP('TinselNameplate.png')),
  I('Snowman Head','Cheesy Effect','Caroling during Toonsmas',CE('SnowmanHeadDouble.png')),
]));
parts.push(S('Toontown Central','🍦','#5a2004','#d86b10',[
  I('Toontown Central','Background','Awarded for progressing to Toontown Central in the Taskline',BG('ToontownCentralBackground.png')),
  I('Toontown Central Sky','Background','Awarded for visiting Toontown Central',BG('ToontownCentralSkyBackground.png')),
  I('Congratulations','Background','Awarded after completing Give and Cake Kudos Rank-Up Task',BG('CongratulationsBackground.png')),
  I('Toontown Central','Nameplate','Awarded for visiting Toontown Central',NP('Ttcnameplate.png')),
  I("Slippin'",'Nameplate','Awarded for clicking the Banana Peel in Toon Hall',NP('SlippinNameplate.png')),
  I('You Did It','Nameplate','Awarded after completing Give and Cake Kudos Rank-Up Task',NP('YouDidItNameplate.png')),
  I('Ice Cream','Nametag','Awarded after reaching Toontown Central Kudos Rank 8'),
  I('Zany','Nametag','Awarded after completing a Toontown Central task'),
  I('Become Duck','Profile Pose','Awarded after reaching Toontown Central Kudos Rank 5',PP('Pose-Become_Duck.png')),
  I('Selfie','Profile Pose','Awarded after completing the task New Toony Tourist',PP('Pose-selfie.png')),
  I('Upset','Profile Pose','Awarded after defeating the Derrick Man',PP('Pose-upset.png')),
  I('Invisible','Cheesy Effect','Awarded from the Cream-Be-Gone sidetask in Toontown Central',CE('CE_invisible.png')),
]));
require('./col2_p2b.js')(parts,S,I,BG,NP,NT,PP,CE,EM);};
