module.exports = `
const BB_ANCHOR: StreetShopData = {
  streetName: \`Anchor Avenue\`, neighborhood: \`Barnacle Boatyard\`,
  mainMap: \`/icons/streets/Barnacle-Boatyard/Anchor-Avenue/anchor-avenue-main-map.png\`,
  shopsBase: \`/icons/streets/Barnacle-Boatyard/Anchor-Avenue\`,
  fisherman: { name: \`Fisherman Freshie\`, img: \`FreshieBoatyard.png\` },
  shops: [
    { name: \`Gone Fishin'\`, owner: null, ownerImg: null, mapImg: \`GoneFishin'MapLocation.png\`, shopImg: \`GoneFishin'.png\`, tasks: [] },
    { name: \`Seaside Seasaws\`, owner: \`Sir C. Saw\`, ownerImg: \`Sir_C._Saw.png\`, mapImg: \`SeasideSeasawsMapLocation.png\`, shopImg: \`SeasideSeasaws.png\`, tasks: [] },
    { name: \`Be Pacific! Customer Support\`, owner: \`Helpful Harry\`, ownerImg: \`HelpfulHarry.png\`, mapImg: \`BePacificMapLocation.png\`, shopImg: \`BePacific.png\`, tasks: [TASK_MEET_MISTY] },
    { name: \`I Sea Seafood\`, owner: \`Chef Shea\`, ownerImg: \`ChefShea.png\`, mapImg: \`ISeaSeafoodMapLocation.png\`, shopImg: \`ISeaSeafood.png\`, tasks: [] },
    { name: \`School of Fish Tutoring\`, owner: \`Professor Pearl\`, ownerImg: \`ProfessorPearl.png\`, mapImg: \`SchoolofFishMapLocation.png\`, shopImg: \`SchoolofFish.png\`, tasks: [{ name: \`First Day of School!\`, type: \`Mainline Task\`, wikiUrl: \`https://corporateclash.wiki.gg/wiki/Barnacle_Boatyard_Tasks#First_Day_of_School!\`, steps: [{ text: \`Visit Professor Pearl at School of Fish Tutoring on Anchor Avenue (242 XP, 8 JBS)\`, sub: \`Recover 3 Pencils from Pencil Pushers Anywhere\` }, { text: \`Return to Professor Pearl at School of Fish Tutoring on Anchor Avenue (242 XP, 8 JBS)\`, sub: \`Recover 2 Books from The Lawbots Anywhere\` }, { text: \`Return to Professor Pearl at School of Fish Tutoring on Anchor Avenue (242 XP, 8 JBS)\` }, { text: \`Visit Dover at Toon HQ (1696 XP, 58 JBS)\` }], reward: \`1696 XP - 58 JBS (final step)\` }] },
    { name: \`Goggle Defoggers\`, owner: \`Greggory Goggles\`, ownerImg: \`GreggoryGoggles.png\`, mapImg: \`GoggleDefoggersMapLocation.png\`, shopImg: \`GoggleDefoggers.png\`, tasks: [TASK_UNITE_1, TASK_I_CAN_SEE] },
    { name: \`Island, You Land! Airplanes\`, owner: \`N.D. Skye\`, ownerImg: \`N.D.Skye.png\`, mapImg: \`Island,YouLand!MapLocation.png\`, shopImg: \`Island,YouLand!.png\`, tasks: [TASK_PROPELLERS] },
    { name: \`Seacastle Contractors\`, owner: \`Crafty Clyde\`, ownerImg: \`CraftyClyde.png\`, mapImg: \`SeacastleContractorsMapLocation.png\`, shopImg: \`SeacastleContractors.png\`, tasks: [] },
    { name: \`Manatee Shirts\`, owner: \`T. Shirley\`, ownerImg: \`T.Shirley.png\`, mapImg: \`ManateeShirtsMapLocation.png\`, shopImg: \`ManateeShirts.png\`, tasks: [] },
    { name: \`Burger King Crabs\`, owner: \`Prince Beef\`, ownerImg: \`PrinceBeef.png\`, mapImg: \`BurgerKingCrabsMapLocation.png\`, shopImg: \`BurgerKingCrabs.png\`, tasks: [] },
    { name: \`Sailor Don't Sail!\`, owner: \`Captain Cheesy\`, ownerImg: \`CaptainCheesy.png\`, mapImg: \`SailorDon'tSail!MapLocation.png\`, shopImg: \`SailorDon'tSail!.png\`, tasks: [] },
    { name: \`Salty Sandy's Seriously Salty Seafood Shop\`, owner: \`Sandy Seasalt\`, ownerImg: \`SandySeasalt.png\`, mapImg: \`SaltySandy'sSeriouslySaltySeafoodShopMapLocation.png\`, shopImg: \`SaltySandy'sSeriouslySaltySeafoodShop.png\`, tasks: [] },
    { name: \`Fish and Chips on Ships\`, owner: \`Chef Chip\`, ownerImg: \`ChefChip.png\`, mapImg: \`FishandChipsonShipsMapLocation.png\`, shopImg: \`FishandChipsonShips.png\`, tasks: [] },
    { name: \`Pelican Package Company\`, owner: \`Postmaster Paul\`, ownerImg: \`PostmasterPaulBoatyard.png\`, mapImg: \`PelicanPackageCompanyMapLocation.png\`, shopImg: \`PelicanPackageCompany.png\`, tasks: [] },
    { name: \`Sad Vacant Building\`, owner: null, ownerImg: null, mapImg: \`SadVacantBuildingMapLocation.png\`, shopImg: \`SadVacantBuilding.png\`, tasks: [] },
    { name: \`Swordfish Armor and Weaponry\`, owner: \`A.R. Ming\`, ownerImg: \`A.R.Ming.png\`, mapImg: \`SwordfishArmorandWeaponryMapLocation.png\`, shopImg: \`SwordfishArmorandWeaponry.png\`, tasks: [] },
    { name: \`Flounder and Sink Ship Repair\`, owner: \`Ree Pare\`, ownerImg: \`ReePare.png\`, mapImg: \`FlounderandSinkShipRepairMapLocation.png\`, shopImg: \`FlounderandSinkShipRepair.png\`, tasks: [TASK_BIG_BINNACLE_BASH] },
    { name: \`The Salty Spit-toon\`, owner: \`Reg\`, ownerImg: \`Reg.png\`, mapImg: \`TheSaltySpit-toonMapLocation.png\`, shopImg: \`TheSaltySpit-toon.png\`, tasks: [TASK_SPIT_TOON] },
  ],
};
STREET_SHOPS[\`BB|Anchor Avenue\`] = BB_ANCHOR;
`;
