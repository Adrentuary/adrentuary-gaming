export interface TaskStep { text: string; sub?: string; }
export interface ShopTask { name: string; type: string; wikiUrl: string; steps: TaskStep[]; reward: string; }
export interface Shop { name: string; owner: string | null; ownerImg: string | null; mapImg: string; trivia?: string; tasks: ShopTask[]; }
export interface StreetShopData { streetName: string; mainMap: string; shopsBase: string; shops: Shop[]; }

const TTC_LOOPY: StreetShopData = {
  streetName: `Loopy Lane`,
  mainMap: `/icons/streets/Toontown-Central/Loopy-Lane/main-map.png`,
  shopsBase: `/icons/streets/Toontown-Central/Loopy-Lane`,
  shops: [
    { name: `Seltzer Bottles and Cans`, owner: `Sid Seltzer`, ownerImg: `SidSeltzer.png`, mapImg: `SeltzerBottlesAndCansMapLocation.png`, tasks: [{ name: `Gathering Gags`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#Gathering_Gags`, steps: [{ text: `Visit Rancid Robert at Slip and Slide on Wacky Way (36 XP, 2 JBS)` }, { text: `Return to Rancid Robert at Slip and Slide on Wacky Way (36 XP, 2 JBS)`, sub: `Defeat 3 Cogs on Wacky Way` }, { text: `Visit Lord Lowden Clear at Toon HQ (36 XP, 2 JBS)` }, { text: `Visit Ma Putrid at House of Bad Pies on Silly Street (36 XP, 2 JBS)` }, { text: `Return to Ma Putrid at House of Bad Pies on Silly Street (36 XP, 2 JBS)`, sub: `Recover 3 Pencil Shavings from Pencil Pushers in Toontown Central` }, { text: `Visit Lord Lowden Clear at Toon HQ (36 XP, 2 JBS)` }, { text: `Visit Sid Seltzer at Seltzer Bottles and Cans on Loopy Lane (36 XP, 2 JBS)` }, { text: `Return to Sid Seltzer at Seltzer Bottles and Cans on Loopy Lane (36 XP, 2 JBS)`, sub: `Recover 3 Springs from The Cogs in Toontown Central` }, { text: `Visit Lord Lowden Clear at Toon HQ (356 XP, 22 JBS)` }], reward: `356 XP - 22 JBS (final step)` }] },
    { name: `Vanishing Cream`, owner: `Nona Seeya`, ownerImg: `NonaSeeya.png`, mapImg: `VanishingCreamMapLocation.png`, tasks: [{ name: `Cream-Be-Gone`, type: `Sidetask`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Cream-Be-Gone`, steps: [{ text: `Visit Nona Seeya at Vanishing Cream on Loopy Lane` }, { text: `Return to Nona Seeya at Vanishing Cream on Loopy Lane`, sub: `Recover 5 Samples of Ink from The Lawbots Anywhere` }, { text: `Return to Nona Seeya at Vanishing Cream on Loopy Lane`, sub: `Go Fishing for 4 Bags of Salt Anywhere` }, { text: `Return to Nona Seeya at Vanishing Cream on Loopy Lane`, sub: `Recover 3 Plastic Containers from The Cogs Anywhere` }, { text: `Return to Nona Seeya at Vanishing Cream on Loopy Lane`, sub: `Defeat 10 Cogs Anywhere` }], reward: `516 XP - Invisible Toon Cheesy Effect` }] },
    { name: `Used Firecrackers`, owner: `Smokey Joe`, ownerImg: `SmokeyJoe.png`, mapImg: `UsedFirecrackersMapLocation.png`, tasks: [] },
    { name: `The Meatball Shoppe`, owner: `Papa Stahl`, ownerImg: `PapaStahl.png`, mapImg: `TheMeatballShoppeMapLocation.png`, trivia: `Originally named Loopy's Balls after YouTuber LoopyGoopyG, then Loopy's Meatballs, and finally renamed to The Meatball Shoppe in v1.0.13.`, tasks: [] },
    { name: `Unnamed Shop`, owner: `Sam Stain`, ownerImg: `SamStain.webp`, mapImg: `SamStainShopMapLocation.png`, trivia: `This is the only unnamed shop in the game to possess an NPC.`, tasks: [] },
    { name: `Visible Ink`, owner: `Inky Ivon`, ownerImg: `InkyIvon.png`, mapImg: `VisibleInkMaplocation.png`, tasks: [] },
    { name: `The Kaboomery`, owner: `Shorty Fuse`, ownerImg: `ShortyFuse.png`, mapImg: `TheKaboomeryMapLocation.png`, tasks: [{ name: `Fire Safety`, type: `Sidetask`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Fire_Safety`, steps: [{ text: `Visit Shorty Fuse at The Kaboomery on Loopy Lane` }, { text: `Return to Shorty Fuse at The Kaboomery on Loopy Lane`, sub: `Recover 5 Igniters from The Cogs Anywhere` }, { text: `Return to Shorty Fuse at The Kaboomery on Loopy Lane`, sub: `Recover 5 Metal Casings from The Cogs Anywhere` }, { text: `Return to Shorty Fuse at The Kaboomery on Loopy Lane`, sub: `Recover 5 Metal Plates from The Cogs Anywhere` }], reward: `230 XP - Firefighter Outfit` }] },
    { name: `Sidesplitter's Mending`, owner: `Sasha Sidesplitter`, ownerImg: `SashaSidesplitter.png`, mapImg: `Sidesplitter'sMendingMapLocation.png`, tasks: [] },
    { name: `Crack Up Auto Repair`, owner: `Lucy Tires`, ownerImg: `LucyTires.png`, mapImg: `CrackUpAutoRepairMapLocation.png`, tasks: [] },
    { name: `Suction Cups and Saucers`, owner: `Clovinia Cling`, ownerImg: `CloviniaCling.png`, mapImg: `SuctionCupsAndSaucersMapLocation.png`, tasks: [] },
    { name: `Jest for Laughs`, owner: `Jester Chester`, ownerImg: `JesterChester.png`, mapImg: `JestForLaughsMapLocation.png`, tasks: [{ name: `An Oldie but a Goodie`, type: `Kudos Rank-Up Task (Rank 6?7)`, wikiUrl: `https://corporateclash.wiki.gg/wiki/An_Oldie_but_a_Goodie`, steps: [{ text: `Visit Jester Chester at Jest for Laughs on Loopy Lane` }, { text: `Visit Canary Coalmine at One-Liner Miners on Silly Street` }, { text: `Laugh at a Joke Anywhere` }, { text: `Return to Jester Chester at Jest for Laughs on Loopy Lane` }, { text: `Visit Lazy Hal at All Fun and Games Shop on Silly Street` }, { text: `Defeat 10 Level 4+ Cogs Anywhere` }, { text: `Return to Jester Chester at Jest for Laughs on Loopy Lane` }], reward: `675 XP - TTC Rank 7 - +2 TTC Gag XP Multiplier` }] },
    { name: `Soup and Crack Ups`, owner: `Sally Spittake`, ownerImg: `SallySpittake.png`, mapImg: `SoupAndCrackUpsMapLocation.png`, tasks: [{ name: `Musical Monstrosity`, type: `Kudos Rank-Up Task (MML Rank 8?9)`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Musical_Monstrosity`, steps: [{ text: `Visit Wagner at Wagner's Vocational Violin Videos on Tenor Terrace` }, { text: `Visit Sally Spittake at Soup and Crack Ups on Loopy Lane` }, { text: `Defeat 10 Cold Callers Anywhere` }, { text: `Return to Sally Spittake at Soup and Crack Ups on Loopy Lane` }, { text: `Defeat a Cold Caller Anywhere` }, { text: `Return to Sally Spittake at Soup and Crack Ups on Loopy Lane` }, { text: `Visit Wagner at Wagner's Vocational Violin Videos on Tenor Terrace` }], reward: `5,673 XP - MML Rank 9 - 50% Cheaper Gags in MML - +1 MML G.U.M.B.A.L.L. Booster` }] },
    { name: `Bottled Cans`, owner: `Weird Warren`, ownerImg: `WeirdWarren.png`, mapImg: `BottledCansMapLocation.png`, tasks: [] },
    { name: `Cast-Iron Kites`, owner: `Rick Rockhead`, ownerImg: `RickRockhead.png`, mapImg: `CastIronKitesMapLocation.png`, tasks: [{ name: `Easy As Pie In The Sky`, type: `Kudos Rank-Up Task (Rank 5?6)`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Easy_As_Pie_In_The_Sky`, steps: [{ text: `Visit Ned Slinger at The Flying Pie on Punchline Place` }, { text: `Visit Rick Rockhead at Cast-Iron Kites on Loopy Lane` }, { text: `Defeat 8 Level 4+ Cogs Anywhere` }, { text: `Return to Rick Rockhead at Cast-Iron Kites on Loopy Lane` }, { text: `Visit Ned Slinger at The Flying Pie on Punchline Place` }, { text: `Defeat 5 Cogs in Toontown Central` }, { text: `Return to Ned Slinger at The Flying Pie on Punchline Place` }, { text: `Defeat 10 Cogs in Toontown Central` }, { text: `Return to Ned Slinger at The Flying Pie on Punchline Place` }], reward: `486 XP - TTC Rank 6 - 30% Cheaper Gags in TTC - +1 TTC G.U.M.B.A.L.L. Booster` }] },
    { name: `Kooky Cineplex`, owner: null, ownerImg: null, mapImg: `KookyCineplexMapLocation.png`, tasks: [] },
    { name: `Laughter Hours Cafe`, owner: `Tee Hee`, ownerImg: `TeeHee.png`, mapImg: `LaughterHoursCafeMapLocation.png`, tasks: [] },
    { name: `Chortle Cafe`, owner: `Charlie Chortle`, ownerImg: `CharlieChortle.png`, mapImg: `ChortleCafeMapLocation.png`, trivia: `Chortle Cafe was briefly mentioned in the Spa Day blog post on the Corporate Clash website.`, tasks: [] },
    { name: `Toontown Post Office`, owner: `Postmaster Pete`, ownerImg: `PostmasterPete.png`, mapImg: `ToontownPostOfficeMapLocation.png`, tasks: [{ name: `Letter Rip!`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#Letter_Rip!`, steps: [{ text: `Visit Postmaster Pete at Toontown Post Office on Loopy Lane (36 XP, 2 JBS)` }, { text: `Return to Postmaster Pete at Toontown Post Office on Loopy Lane (36 XP, 2 JBS)`, sub: `Recover 3 Stamps from The Cogs Anywhere` }, { text: `Visit Lord Lowden Clear at Toon HQ (316 XP, 22 JBS)` }], reward: `316 XP - 22 JBS (final step)` }] },
    { name: `Blue Glue Direct 2 You`, owner: `Sticky Lou`, ownerImg: `StickyLou.png`, mapImg: `BlueGlueMapLocation.png`, tasks: [{ name: `Sticky Situation`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#Sticky_Situation`, steps: [{ text: `Visit Sticky Lou at Blue Glue on Loopy Lane (31 XP, 2 JBS)` }, { text: `Obtain A Reservation Ticket from Silent Simone at The Merry Mimes on Silly Street (31 XP, 2 JBS)` }, { text: `Deliver A Reservation Ticket to Sticky Lou at Blue Glue on Loopy Lane (31 XP, 2 JBS)` }, { text: `Return to Sticky Lou at Blue Glue on Loopy Lane (31 XP, 2 JBS)`, sub: `Recover An Unsticking Object from The Cogs in Toontown Central` }], reward: `31 XP per step - continuing mainline chain` }] },
    { name: `Spaghetti and Goofballs`, owner: `Chef Knucklehead`, ownerImg: `ChefKnucklehead.png`, mapImg: `SpaghettiAndGoofballsMapLocation.png`, tasks: [{ name: `A Taste Of Toontown`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#A_Taste_Of_Toontown`, steps: [{ text: `Visit Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)` }, { text: `Return to Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)`, sub: `Recover 3 Noodles from The Cogs Anywhere` }, { text: `Visit Lord Lowden Clear at Toon HQ (36 XP, 2 JBS)` }], reward: `36 XP per step - continuing mainline chain` }] },
    { name: `Wiseacre's Noisemakers`, owner: `Will Wiseacre`, ownerImg: `WillWiseacre.png`, mapImg: `Wiseacre'sNoisemakersMapLocation.png`, tasks: [] },
    { name: `Movie Multiplex`, owner: null, ownerImg: null, mapImg: `MovieMultiplexMapLocation.png`, tasks: [] },
    { name: `14 Karat Goldfish`, owner: `Sharky Jones`, ownerImg: `SharkyJones.png`, mapImg: `14KaratGoldfishMapLocation.png`, tasks: [] },
    { name: `News for the Amused`, owner: `Paige Arthur`, ownerImg: `PaigeArthur.png`, mapImg: `NewsForTheAmusedMapLocation.png`, tasks: [{ name: `Scraping News`, type: `Kudos Rank-Up Task (Rank 8?9)`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Scraping_News`, steps: [{ text: `Visit Paige Arthur at News for the Amused on Loopy Lane` }, { text: `Recover 10 Memos from Level 4+ Cogs Anywhere` }, { text: `Return to Paige Arthur at News for the Amused on Loopy Lane` }, { text: `Recover A Memo from an Executive Cog Anywhere` }, { text: `Return to Paige Arthur at News for the Amused on Loopy Lane` }, { text: `Defeat A Sellbot Anywhere` }, { text: `Return to Paige Arthur at News for the Amused on Loopy Lane` }], reward: `946 XP - TTC Rank 9 - 50% Cheaper Gags in TTC - +1 TTC G.U.M.B.A.L.L. Booster` }] },
  ],
};

export const STREET_SHOPS: Record<string, StreetShopData> = {
  'TTC|Loopy Lane': TTC_LOOPY,
};

const TTC_PUNCHLINE: StreetShopData = {
  streetName: `Punchline Place`,
  mainMap: `/icons/streets/Toontown-Central/Punchline-Place/main-map.png`,
  shopsBase: `/icons/streets/Toontown-Central/Punchline-Place`,
  shops: [
    { name: `Sofa Whoopee Cushions`, owner: `Nancy Gas`, ownerImg: `NancyGas.png`, mapImg: `SofaWhoopeeMapLocation.png`, tasks: [] },
    { name: `Inflatable Wrecking Balls`, owner: `Big Bruce`, ownerImg: `BigBruce.png`, mapImg: `InflatableWreckingBallsMapLocation.png`, tasks: [] },
    { name: `The Karnival Kid`, owner: null, ownerImg: null, mapImg: `TheKarnivalKidMapLocation.png`, tasks: [] },
    { name: `Dr. Pulyurleg, Chiropractor`, owner: `Dr. Pulyurleg`, ownerImg: `DrPulyurleg.png`, mapImg: `DrPulyurlegMapLocation.png`, tasks: [
      { name: `Smart Minds Think Unalike`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#Smart_Minds_Think_Unalike`,
        steps: [
          { text: `Visit Flippy at Toon Hall (40 XP, 2 JBS)` },
          { text: `Visit Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place (40 XP, 2 JBS)` },
          { text: `Visit Dr. Sensitive at Hardy Harr Seminars on Punchline Place (40 XP, 2 JBS)` },
          { text: `Return to Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place (40 XP, 2 JBS)` },
          { text: `Return to Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place (40 XP, 2 JBS)`, sub: `Recover A Love Letter from Double Talkers Anywhere` },
          { text: `Return to Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place (40 XP, 2 JBS)`, sub: `Fish up A Supply of Ink in Toontown Central` },
          { text: `Deliver A Love Letter to Dr. Sensitive at Hardy Harr Seminars on Punchline Place (40 XP, 2 JBS)` },
          { text: `Visit Flippy at Toon Hall (362 XP, 22 JBS)` },
        ], reward: `362 XP - 22 JBS (final step)` },
      { name: `The Mysterious Duck`, type: `Kudos Rank-Up Task (Rank 4?5)`, wikiUrl: `https://corporateclash.wiki.gg/wiki/The_Mysterious_Duck`,
        steps: [
          { text: `Visit Dan Dribbles at Soup Forks on Silly Street` },
          { text: `Deliver A Medical Evaluation to Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place` },
          { text: `Recover A Rubber Ducky from Short Changes Anywhere` },
          { text: `Return to Dan Dribbles at Soup Forks on Silly Street` },
          { text: `Defeat The Duck Shuffler in Toontown Central` },
          { text: `Return to Dan Dribbles at Soup Forks on Silly Street` },
        ], reward: `432 XP - TTC Rank 5 - Become Duck Profile Pose - +6 TTC Playground Healing` },
    ]},
    { name: `Toontown Mess Hall`, owner: `Chef E.Z. Bake`, ownerImg: `ChefEZBake.png`, mapImg: `ToonTownMessHallMapLocation.png`, tasks: [
      { name: `A Taste Of Toontown`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#A_Taste_Of_Toontown`,
        steps: [
          { text: `Visit Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)` },
          { text: `Visit Chef E.Z. Bake at Toontown Mess Hall on Punchline Place (36 XP, 2 JBS)` },
          { text: `Visit Chewy Morsel at Rubber Chicken Sandwiches on Punchline Place (36 XP, 2 JBS)` },
          { text: `Visit Cindy Sprinkles at Sundae Funnies Ice Cream on Punchline Place (36 XP, 2 JBS)` },
          { text: `Return to Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)`, sub: `Recover 3 Noodles from The Cogs Anywhere` },
          { text: `Visit Lord Lowden Clear at Toon HQ (36 XP, 2 JBS)` },
        ], reward: `36 XP per step - continuing mainline chain` },
    ]},
    { name: `Barely Palatable Pasta`, owner: `Crunchy Alfredo`, ownerImg: `CrunchyAlfredo.png`, mapImg: `BarelyPalatablePastaMapLocation.png`, tasks: [
      { name: `Toonsmas Day Feast`, type: `Limited-Time Toonsmas Event Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toonsmas_Day_Feast`,
        steps: [
          { text: `Visit Perez Cent in the Toonseltown Village Square` },
          { text: `Visit Crunchy Alfredo at Barely Palatable Pasta on Punchline Place` },
          { text: `Defeat 5 Level 3+ Cogs on Punchline Place` },
          { text: `Return to Perez Cent at Toonseltown Village Square` },
          { text: `(continues across all playgrounds...)` },
        ], reward: `Toonsmas Present Outfit - Toonsmas Present Headband - Cornucopia` },
    ]},
    { name: `Hardy Harr Seminars`, owner: `Dr. Sensitive`, ownerImg: `DrSensitive.png`, mapImg: `HardyHarrSeminarsMapLocation.png`, tasks: [
      { name: `Smart Minds Think Unalike`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#Smart_Minds_Think_Unalike`,
        steps: [
          { text: `Visit Flippy at Toon Hall (40 XP, 2 JBS)` },
          { text: `Visit Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place (40 XP, 2 JBS)` },
          { text: `Visit Dr. Sensitive at Hardy Harr Seminars on Punchline Place (40 XP, 2 JBS)` },
          { text: `Return to Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place (40 XP, 2 JBS)`, sub: `Recover A Love Letter from Double Talkers Anywhere` },
          { text: `Return to Dr. Pulyurleg at Dr. Pulyurleg, Chiropractor on Punchline Place (40 XP, 2 JBS)`, sub: `Fish up A Supply of Ink in Toontown Central` },
          { text: `Deliver A Love Letter to Dr. Sensitive at Hardy Harr Seminars on Punchline Place (40 XP, 2 JBS)` },
          { text: `Visit Flippy at Toon Hall (362 XP, 22 JBS)` },
        ], reward: `362 XP - 22 JBS (final step)` },
    ]},
    { name: `The Punch Line Gym`, owner: `Franz Neckvein`, ownerImg: `FranzNeckvein.png`, mapImg: `ThePunchLineGymMapLocation.png`, tasks: [
      { name: `A Hairy Introduction`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#A_Hairy_Introduction`,
        steps: [
          { text: `Visit Franz Neckvein at The Punch Line Gym on Punchline Place (58 XP, 2 JBS)` },
        ], reward: `58 XP - 2 JBS` },
      { name: `Zit's Time to Pump Iron`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#Zit's_Time_to_Pump_Iron`,
        steps: [
          { text: `Return to Franz Neckvein at The Punch Line Gym on Punchline Place (58 XP, 2 JBS)`, sub: `Recover Some Exercise Supplies from The Cogs in Toontown Central` },
          { text: `Return to Franz Neckvein at The Punch Line Gym on Punchline Place (58 XP, 2 JBS)`, sub: `Defeat 3 Cogs in Toontown Central` },
          { text: `Visit Mata Hairy at Toon HQ (292 XP, 12 JBS)` },
        ], reward: `292 XP - 12 JBS (final step)` },
    ]},
    { name: `Toontown Theatre`, owner: null, ownerImg: null, mapImg: `ToonTownTheatreMapLocation.png`, tasks: [] },
    { name: `Funny Bone Emergency Room`, owner: `Nurse Nancy`, ownerImg: `NurseNancy.png`, mapImg: `FunnyBoneEmergencyRoomMapLocation.png`, tasks: [] },
    { name: `Phony Baloney`, owner: `Tony Maroni`, ownerImg: `TonyMaroni.png`, mapImg: `PhonyBaloneyMapLocation.png`, tasks: [
      { name: `Monkey See Monkey Do`, type: `Sidetask`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Monkey_See_Monkey_Do`,
        steps: [
          { text: `Visit Pants On Fire at The Building Beside Me is Lying to you on Wacky Way` },
          { text: `Visit Liar Liar at No, the Building Beside Me is Telling the Truth on Wacky Way` },
          { text: `Return to Pants On Fire at The Building Beside Me is Lying to you on Wacky Way` },
          { text: `Defeat 6 Cogs on Wacky Way` },
          { text: `Return to Pants On Fire at The Building Beside Me is Lying to you on Wacky Way` },
          { text: `Visit Tony Maroni at Phony Baloney on Punchline Place` },
          { text: `Return to Tony Maroni at Phony Baloney on Punchline Place`, sub: `Recover Some Baloney from Flunkies in Toontown Central` },
          { text: `Visit Pants On Fire at The Building Beside Me is Lying to you on Wacky Way` },
          { text: `Visit Liar Liar at No, the Building Beside Me is Telling the Truth on Wacky Way` },
        ], reward: `558 XP - Zany Nametag Font - 30 JBS` },
    ]},
    { name: `Zippy's Zingers`, owner: `Zippy`, ownerImg: `Zippy.png`, mapImg: `ZippysZingersMapLocation.png`, tasks: [] },
    { name: `The Flying Pie`, owner: `Ned Slinger`, ownerImg: `NedSlinger.png`, mapImg: `TheFlyingPieMapLocation.png`, tasks: [
      { name: `Easy As Pie In The Sky`, type: `Kudos Rank-Up Task (Rank 5?6)`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Easy_As_Pie_In_The_Sky`,
        steps: [
          { text: `Visit Ned Slinger at The Flying Pie on Punchline Place` },
          { text: `Visit Rick Rockhead at Cast-Iron Kites on Loopy Lane` },
          { text: `Defeat 8 Level 4+ Cogs Anywhere` },
          { text: `Return to Rick Rockhead at Cast-Iron Kites on Loopy Lane` },
          { text: `Visit Ned Slinger at The Flying Pie on Punchline Place` },
          { text: `Defeat 5 Cogs in Toontown Central` },
          { text: `Return to Ned Slinger at The Flying Pie on Punchline Place` },
          { text: `Defeat 10 Cogs in Toontown Central` },
          { text: `Return to Ned Slinger at The Flying Pie on Punchline Place` },
        ], reward: `486 XP - TTC Rank 6 - 30% Cheaper Gags in TTC - +1 TTC G.U.M.B.A.L.L. Booster` },
    ]},
    { name: `Professor Wiggle's House of Giggles`, owner: `Professor Wiggle`, ownerImg: `ProfessorWiggle.png`, mapImg: `ProfessorWigglesHouseOfGigglesMapLocation.png`, tasks: [] },
    { name: `Rubber Chicken Sandwiches`, owner: `Chewy Morsel`, ownerImg: `ChewyMorsel.png`, mapImg: `RubberChickenSandwichesMapLocation.png`, tasks: [
      { name: `A Taste Of Toontown`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#A_Taste_Of_Toontown`,
        steps: [
          { text: `Visit Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)` },
          { text: `Visit Chef E.Z. Bake at Toontown Mess Hall on Punchline Place (36 XP, 2 JBS)` },
          { text: `Visit Chewy Morsel at Rubber Chicken Sandwiches on Punchline Place (36 XP, 2 JBS)` },
          { text: `Visit Cindy Sprinkles at Sundae Funnies Ice Cream on Punchline Place (36 XP, 2 JBS)` },
          { text: `Return to Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)`, sub: `Recover 3 Noodles from The Cogs Anywhere` },
          { text: `Visit Lord Lowden Clear at Toon HQ (36 XP, 2 JBS)` },
        ], reward: `36 XP per step - continuing mainline chain` },
    ]},
    { name: `Punchline Movie Palace`, owner: null, ownerImg: null, mapImg: `PunchlineMoviePalaceMapLocation.png`, tasks: [] },
    { name: `Sundae Funnies Ice Cream`, owner: `Cindy Sprinkles`, ownerImg: `CindySprinkles.png`, mapImg: `SundaeFunniesIceCreamMapLocation.png`, tasks: [
      { name: `A Taste Of Toontown`, type: `Mainline Task`, wikiUrl: `https://corporateclash.wiki.gg/wiki/Toontown_Central_Tasks#A_Taste_Of_Toontown`,
        steps: [
          { text: `Visit Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)` },
          { text: `Visit Chef E.Z. Bake at Toontown Mess Hall on Punchline Place (36 XP, 2 JBS)` },
          { text: `Visit Chewy Morsel at Rubber Chicken Sandwiches on Punchline Place (36 XP, 2 JBS)` },
          { text: `Visit Cindy Sprinkles at Sundae Funnies Ice Cream on Punchline Place (36 XP, 2 JBS)` },
          { text: `Return to Chef Knucklehead at Spaghetti and Goofballs on Loopy Lane (36 XP, 2 JBS)`, sub: `Recover 3 Noodles from The Cogs Anywhere` },
          { text: `Visit Lord Lowden Clear at Toon HQ (36 XP, 2 JBS)` },
        ], reward: `36 XP per step - continuing mainline chain` },
    ]},
  ],
};

STREET_SHOPS[`TTC|Punchline Place`] = TTC_PUNCHLINE;
