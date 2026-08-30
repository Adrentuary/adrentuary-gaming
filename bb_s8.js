module.exports = `
const BB_SEAWEED: StreetShopData = {
  streetName: \`Seaweed Street\`, neighborhood: \`Barnacle Boatyard\`,
  mainMap: \`/icons/streets/Barnacle-Boatyard/Seaweed-Street/seaweed-street-main-map.png\`,
  shopsBase: \`/icons/streets/Barnacle-Boatyard/Seaweed-Street\`,
  fisherman: { name: \`Fisherman Reed\`, img: \`FishermanReed.png\` },
  shops: [
    { name: \`That's a Moray!\`, owner: \`Emily Eel\`, ownerImg: \`EmilyEel.png\`, mapImg: \`That'sAMorayMapLocation.png\`, shopImg: \`That'sAMoray.png\`, tasks: [] },
    { name: \`Squid's Seaweed\`, owner: \`Sid Squid\`, ownerImg: \`SidSquid.png\`, mapImg: \`Squid'sSeaweedMapLocation.png\`, shopImg: \`Squid'sSeaweed.png\`, tasks: [] },
    { name: \`Good Luck Horseshoe Crabs\`, owner: \`Coral Reef\`, ownerImg: \`CoralReef.png\`, mapImg: \`GoodLuckHorseshoeCrabsMapLocation.png\`, shopImg: \`GoodLuckHorseshoeCrabs.png\`, tasks: [] },
    { name: \`All for Nautical\`, owner: \`Shep Ahoy\`, ownerImg: \`ShepAhoy.png\`, mapImg: \`AllForNauticalMapLocation.png\`, shopImg: \`AllForNautical.png\`, tasks: [] },
    { name: \`The Reel Deal\`, owner: \`Blisters McKee\`, ownerImg: \`BlistersMcKee.png\`, mapImg: \`TheReelDealMapLocation.png\`, shopImg: \`TheReelDeal.png\`, tasks: [TASK_SWIM_KIWI] },
    { name: \`Duck's Back Water Company\`, owner: \`Carla Canal\`, ownerImg: \`CarlaCanal.png\`, mapImg: \`DucksBackWaterCompanyMapLocation.png\`, shopImg: \`DucksBackWaterCompany.png\`, tasks: [] },
    { name: \`Run Aground Taxi Service\`, owner: \`Brian Beachead\`, ownerImg: \`BrianBeachead.png\`, mapImg: \`RunAgroundTaxiServiceMapLocation.png\`, shopImg: \`RunAgroundTaxiService.png\`, tasks: [] },
    { name: \`Be More Pacific Ocean Notions\`, owner: \`Pacific Tim\`, ownerImg: \`PacificTim.png\`, mapImg: \`BeMorePacificOceanNotionsMapLocation.png\`, shopImg: \`BeMorePacificOceanNotions.png\`, tasks: [] },
    { name: \`This Oar That\`, owner: \`Heave Ho\`, ownerImg: \`HeaveHo.png\`, mapImg: \`ThisOarThatMapLocation.png\`, shopImg: \`ThisOarThat.png\`, tasks: [] },
    { name: \`Mermaid Swimwear\`, owner: \`Cyren\`, ownerImg: \`Cyren.png\`, mapImg: \`MermaidSwimwearMapLocation.png\`, shopImg: \`MermaidSwimwear.png\`, tasks: [] },
    { name: \`Art's Smart Chart Mart\`, owner: \`Art\`, ownerImg: \`Art.png\`, mapImg: \`Art'sSmartChartMartMapLocation.png\`, shopImg: \`Art'sSmartChartMart.png\`, tasks: [TASK_CHARTING] },
    { name: \`Reel 'Em Inn\`, owner: \`Rod Reel\`, ownerImg: \`RodReel.png\`, mapImg: \`Reel'EmInMapLocation.png\`, shopImg: \`Reel'EmIn.png\`, tasks: [] },
    { name: \`Able-Bodied Gym\`, owner: \`Rocky Shores\`, ownerImg: \`RockyShores.png\`, mapImg: \`Able-BodiedGymMapLocation.png\`, shopImg: \`Able-BodiedGym.png\`, tasks: [] },
    { name: \`Deep-Sea Diner\`, owner: \`Dinah Down\`, ownerImg: \`DinahDown.png\`, mapImg: \`Deep-SeaDinerMapLocation.png\`, shopImg: \`Deep-SeaDiner.png\`, tasks: [] },
    { name: \`Barnacle Bargains\`, owner: \`Barnacle Barbara\`, ownerImg: \`BarnacleBarbara.png\`, mapImg: \`BarnacleBargainsMapLocation.png\`, shopImg: \`BarnacleBargains.png\`, tasks: [] },
    { name: \`Windjammers and Jellies\`, owner: \`Gusty Kate\`, ownerImg: \`GustyKate.png\`, mapImg: \`WindjammersAndJelliesMapLocation.png\`, shopImg: \`WindjammersAndJellies.png\`, tasks: [] },
    { name: \`Root Beer Afloats\`, owner: \`Bonzo Bilgepump\`, ownerImg: \`BonzoBilgepump.png\`, mapImg: \`RootBeerAfloatsMapLocation.png\`, shopImg: \`RootBeerAfloats.png\`, tasks: [] },
    { name: \`Gifts With a Porpoise\`, owner: \`Dante Dolphin\`, ownerImg: \`DanteDolphin.png\`, mapImg: \`GiftsWithAPorpoiseMapLocation.png\`, shopImg: \`GiftsWithAPorpoise.png\`, tasks: [] },
    { name: \`Peanut Butter and Jellyfish\`, owner: \`Toby Tonguestinger\`, ownerImg: \`TobyTonguestinger.png\`, mapImg: \`PeanutButterandJellyfishMapLocation.png\`, shopImg: \`PeanutButterandJellyfish.png\`, tasks: [] },
    { name: \`Sails for Sale\`, owner: \`Wynn Bag\`, ownerImg: \`WynnBag.png\`, mapImg: \`SailsForSaleMapLocation.png\`, shopImg: \`SailsForSale.png\`, tasks: [] },
    { name: \`Wok the Plank Chinese Food\`, owner: \`Gang Wei\`, ownerImg: \`GangWei.png\`, mapImg: \`WokThePlankChineseFoodMapLocation.png\`, shopImg: \`WokThePlankChineseFood.png\`, tasks: [] },
    { name: \`Ahab's Prefab Sea Crab Center\`, owner: \`Ahab\`, ownerImg: \`Ahab.png\`, mapImg: \`Ahab'sPrefabSeaCrabCenterMapLocation.png\`, shopImg: \`Ahab'sPrefabSeaCrabCenter.png\`, tasks: [{ name: \`Someone's Been Drinking Saltwater...\`, type: \`Mainline Task\`, wikiUrl: \`https://corporateclash.wiki.gg/wiki/Barnacle_Boatyard_Tasks#Someone%27s_Been_Drinking_Saltwater...\`, steps: [{ text: \`Visit Ahab at Ahab's Prefab Sea Crab Center on Seaweed Street (288 XP, 10 JBS)\`, sub: \`Defeat 6 Cogs in Barnacle Boatyard\` }, { text: \`Return to Ahab at Ahab's Prefab Sea Crab Center on Seaweed Street (288 XP, 10 JBS)\` }, { text: \`Visit Topsy Turvey at the Cap Size Hat Store on Lighthouse Lane (288 XP, 10 JBS)\`, sub: \`Recover Some Suit Thread from Double Talkers Anywhere\` }, { text: \`Return to Topsy Turvey at the Cap Size Hat Store on Lighthouse Lane (1727 XP, 60 JBS, Pirate Hat)\` }, { text: \`Visit Wade at Toon HQ (242 XP, 8 JBS)\` }], reward: \`1727 XP - 60 JBS - Pirate Hat\` }] },
    { name: \`Buoys and Gulls Nursery School\`, owner: \`Professor Plank\`, ownerImg: \`ProfessorPlank.png\`, mapImg: \`BuoysAndGullsNurserySchoolMapLocation.png\`, shopImg: \`BuoysAndGullsNurserySchool.png\`, tasks: [] },
  ],
};
STREET_SHOPS[\`BB|Seaweed Street\`] = BB_SEAWEED;
`;
