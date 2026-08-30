module.exports = `
const BB_BUCCANEER: StreetShopData = {
  streetName: \`Buccaneer Boulevard\`, neighborhood: \`Barnacle Boatyard\`,
  mainMap: \`/icons/streets/Barnacle-Boatyard/Buccaneer-Boulevard/buccaneer-boulevard-main-map.png\`,
  shopsBase: \`/icons/streets/Barnacle-Boatyard/Buccaneer-Boulevard\`,
  fisherman: { name: \`Fisherman Barney\`, img: \`Barney.png\` },
  shops: [
    { name: \`Used Life Preservers\`, owner: \`Gary Glubglub\`, ownerImg: \`GaryGlubglub.png\`, mapImg: \`UsedLifePreserversMapLocation.png\`, shopImg: \`UsedLifePreservers.png\`, tasks: [] },
    { name: \`Salmon Chanted Evening Formal Wear\`, owner: \`Fishy Frank\`, ownerImg: \`FishyFrank.png\`, mapImg: \`SalmonChantedEveningFormalWearMapLocation.png\`, shopImg: \`SalmonChantedEveningFormalWear.png\`, tasks: [TASK_SEA_LADS] },
    { name: \`Poop Deck Gym\`, owner: \`Cal Estenicks\`, ownerImg: \`CalEstenicks.png\`, mapImg: \`PoopDeckGymMapLocation.png\`, shopImg: \`PoopDeckGym.png\`, tasks: [TASK_CONTACTING, TASK_UNITE_1] },
    { name: \`Wet Suit Dry Cleaners\`, owner: \`Mrs. Starch\`, ownerImg: \`Mrs.Starch.png\`, mapImg: \`WetSuitDryCleanersMapLocation.png\`, shopImg: \`WetSuitDryCleaners.png\`, tasks: [] },
    { name: \`Bait and Switches Electrical Shop\`, owner: \`Electra Eel\`, ownerImg: \`ElectraEel.png\`, mapImg: \`BaitAndSwitchElectricalShopMapLocation.png\`, shopImg: \`BaitAndSwitchElectricalShop.png\`, tasks: [] },
    { name: \`Hook's Clock Repair\`, owner: \`Admiral Hook\`, ownerImg: \`AdmiralHook.png\`, mapImg: \`Hook'sClockRepairMapLocation.png\`, shopImg: \`Hook'sClockRepair.png\`, tasks: [TASK_BIG_BINNACLE_BASH] },
    { name: \`From Fore to Aft\`, owner: \`Salty Stan\`, ownerImg: \`SaltyStan.png\`, mapImg: \`FromForeToAftMapLocation.png\`, shopImg: \`FromForeToAft.png\`, tasks: [TASK_BIG_BINNACLE_BASH] },
    { name: \`Luff 'N Stuff\`, owner: \`Lisa Luff\`, ownerImg: \`LisaLuff.png\`, mapImg: \`Luff'NStuffMapLocation.png\`, shopImg: \`Luff'NStuff.png\`, tasks: [] },
    { name: \`Every Little Bait\`, owner: \`Charlie Chum\`, ownerImg: \`CharlieChum.png\`, mapImg: \`EveryLittleBaitMapLocation.png\`, shopImg: \`EveryLittleBait.png\`, tasks: [] },
    { name: \`Piano Tuna Works for Scale\`, owner: \`Eileen Overboard\`, ownerImg: \`EileenOverboard.png\`, mapImg: \`PianoTunaWorksForScaleMapLocation.png\`, shopImg: \`PianoTunaWorksForScale.png\`, tasks: [TASK_CONTACTING] },
    { name: \`Billy Budd's Big Bargain Binnacle Barn\`, owner: \`Billy Budd\`, ownerImg: \`BillyBudd.png\`, mapImg: \`BillyBudd'sBigBargainBinnacleBarnMapLocation.png\`, shopImg: \`BillyBudd'sBigBargainBinnacleBarn.png\`, tasks: [TASK_BIG_BINNACLE_BASH] },
    { name: \`Dime & Quarterdeck Bank\`, owner: \`Captain Carl\`, ownerImg: \`CaptainCarl.png\`, mapImg: \`Dime&QuarterdeckBankMapLocation.png\`, shopImg: \`Dime&QuarterdeckBank.png\`, tasks: [] },
    { name: \`Squid Pro Quo Attorneys at Law\`, owner: \`Sheila Squid, Atty\`, ownerImg: \`SheilaSquidAtty.png\`, mapImg: \`SquidProQuoAttorneysAtLawMapLocation.png\`, shopImg: \`SquidProQuoAttorneysAtLaw.png\`, tasks: [] },
    { name: \`Trim the Nail Boutique\`, owner: null, ownerImg: null, mapImg: \`TrimTheNailBoutiqueMapLocation.png\`, shopImg: \`TrimTheNailBoutique.png\`, tasks: [] },
    { name: \`Yacht's All, Folks!\`, owner: \`Captain Yucks\`, ownerImg: \`CaptainYucks.png\`, mapImg: \`Yacht'sAll,FolksMapLocation.png\`, shopImg: \`Yacht'sAll,Folks.png\`, tasks: [] },
    { name: \`Blackbeard's Beauty Parlor\`, owner: \`Choppy McDougal\`, ownerImg: \`ChoppyMcDougal.png\`, mapImg: \`Blackbeard'sBeautyParlorMapLocation.png\`, shopImg: \`Blackbeard'sBeautyParlor.png\`, tasks: [TASK_MATE_MAKEOVER] },
    { name: \`Out to See Optics\`, owner: \`Doctor Squall\`, ownerImg: \`DoctorSquall.png\`, mapImg: \`OutToSeeOpticsMapLocation.png\`, shopImg: \`OutToSeeOptics.png\`, tasks: [TASK_I_CAN_SEE] },
    { name: \`Soles Repaired While U Wait\`, owner: \`Flappy Docksplinter\`, ownerImg: \`FlappyDocksplinter.png\`, mapImg: \`SolesRepairedWhileUWaitMapLocation.png\`, shopImg: \`SolesRepairedWhileUWait.png\`, tasks: [TASK_I_CAN_SEE, TASK_CAPTAIN] },
    { name: \`Disembark! Tree Surgeons\`, owner: \`Linda Landlubber\`, ownerImg: \`LindaLandlubber.png\`, mapImg: \`Disembark!TreeSurgeonsMapLocation.png\`, shopImg: \`Disembark!TreeSurgeons.png\`, tasks: [TASK_CAPTAIN, TASK_BOARDWALK] },
  ],
};
STREET_SHOPS[\`BB|Buccaneer Boulevard\`] = BB_BUCCANEER;
`;
