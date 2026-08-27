// Street shop data — keyed by "PgKey/street-slug"
// mapImg: path under /icons/streets/
// shops: ordered list matching in-game street order

export interface Shop {
  name: string;
  owner: string | null;         // null = Vacant Shop (no owner image)
  ownerImg: string | null;      // filename in shop-owners/
  mapImg: string;               // filename in shop-maps/
}

export interface StreetShopData {
  streetName: string;
  mainMap: string;              // full public path
  shopsBase: string;            // base path for shop-maps + shop-owners
  shops: Shop[];
}

// ── Toontown Central ──────────────────────────────────────────────────────────

const TTC_LOOPY: StreetShopData = {
  streetName: 'Loopy Lane',
  mainMap: '/icons/streets/Toontown-Central/Loopy-Lane/main-map.png',
  shopsBase: '/icons/streets/Toontown-Central/Loopy-Lane',
  shops: [
    { name: 'Seltzer Bottles and Cans',  owner: 'Sid Seltzer',          ownerImg: 'SidSeltzer.png',          mapImg: 'SeltzerBottlesAndCansMapLocation.png' },
    { name: 'Vanishing Cream',           owner: 'Nona Seeya',           ownerImg: 'NonaSeeya.png',           mapImg: 'VanishingCreamMapLocation.png' },
    { name: 'Used Firecrackers',         owner: 'Smokey Joe',           ownerImg: 'SmokeyJoe.png',           mapImg: 'UsedFirecrackersMapLocation.png' },
    { name: 'The Meatball Shoppe',       owner: 'Papa Stahl',           ownerImg: 'PapaStahl.png',           mapImg: 'TheMeatballShoppeMapLocation.png' },
    { name: 'Unnamed Shop',             owner: 'Sam Stain',            ownerImg: 'SamStain.webp',           mapImg: 'SamStainShopMapLocation.png' },
    { name: 'Visible Ink',              owner: 'Inky Ivon',            ownerImg: 'InkyIvon.png',            mapImg: 'VisibleInkMaplocation.png' },
    { name: 'The Kaboomery',            owner: 'Shorty Fuse',          ownerImg: 'ShortyFuse.png',          mapImg: 'TheKaboomeryMapLocation.png' },
    { name: "Sidesplitter's Mending",   owner: 'Sasha Sidesplitter',   ownerImg: 'SashaSidesplitter.png',   mapImg: "Sidesplitter'sMendingMapLocation.png" },
    { name: 'Crack Up Auto Repair',     owner: 'Lucy Tires',           ownerImg: 'LucyTires.png',           mapImg: 'CrackUpAutoRepairMapLocation.png' },
    { name: 'Suction Cups and Saucers', owner: 'Clovinia Cling',       ownerImg: 'CloviniaCling.png',       mapImg: 'SuctionCupsAndSaucersMapLocation.png' },
    { name: 'Jest for Laughs',          owner: 'Jester Chester',       ownerImg: 'JesterChester.png',       mapImg: 'JestForLaughsMapLocation.png' },
    { name: 'Soup and Crack Ups',       owner: 'Sally Spittake',       ownerImg: 'SallySpittake.png',       mapImg: 'SoupAndCrackUpsMapLocation.png' },
    { name: 'Bottled Cans',             owner: 'Weird Warren',         ownerImg: 'WeirdWarren.png',         mapImg: 'BottledCansMapLocation.png' },
    { name: 'Cast-Iron Kites',          owner: 'Rick Rockhead',        ownerImg: 'RickRockhead.png',        mapImg: 'CastIronKitesMapLocation.png' },
    { name: 'Kooky Cineplex',           owner: null,                   ownerImg: null,                      mapImg: 'KookyCineplexMapLocation.png' },
    { name: 'Laughter Hours Cafe',      owner: 'Tee Hee',              ownerImg: 'TeeHee.png',              mapImg: 'LaughterHoursCafeMapLocation.png' },
    { name: 'Chortle Cafe',             owner: 'Charlie Chortle',      ownerImg: 'CharlieChortle.png',      mapImg: 'ChortleCafeMapLocation.png' },
    { name: 'Toontown Post Office',     owner: 'Postmaster Pete',      ownerImg: 'PostmasterPete.png',      mapImg: 'ToontownPostOfficeMapLocation.png' },
    { name: 'Blue Glue Direct 2 You',   owner: 'Sticky Lou',           ownerImg: 'StickyLou.png',           mapImg: 'BlueGlueMapLocation.png' },
    { name: 'Spaghetti and Goofballs',  owner: 'Chef Knucklehead',     ownerImg: 'ChefKnucklehead.png',     mapImg: 'SpaghettiAndGoofballsMapLocation.png' },
    { name: "Wiseacre's Noisemakers",   owner: 'Will Wiseacre',        ownerImg: 'WillWiseacre.png',        mapImg: "Wiseacre'sNoisemakersMapLocation.png" },
    { name: 'Movie Multiplex',          owner: null,                   ownerImg: null,                      mapImg: 'MovieMultiplexMapLocation.png' },
    { name: '14 Karat Goldfish',        owner: 'Sharky Jones',         ownerImg: 'SharkyJones.png',         mapImg: '14KaratGoldfishMapLocation.png' },
    { name: 'News for the Amused',      owner: 'Paige Arthur',         ownerImg: 'PaigeArthur.png',         mapImg: 'NewsForTheAmusedMapLocation.png' },
  ],
};

// ── Master lookup: key = "pgKey|streetName" ───────────────────────────────────
export const STREET_SHOPS: Record<string, StreetShopData> = {
  'TTC|Loopy Lane': TTC_LOOPY,
};
