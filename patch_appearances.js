/**
 * patch_appearances.js
 * Adds appearance + storyAppearances fields to TTC, BB, YOTT shop entries
 * in data-street-shops.ts by doing targeted string replacements.
 * Run: node patch_appearances.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'app', 'corporate-clash-personal-tracker', 'data-street-shops.ts');

let src = fs.readFileSync(FILE, 'utf8');

// Helper: insert appearance/storyAppearances before `tasks:` on a specific shop line
// We match by owner name to be precise
function patch(ownerName, appearance, storyAppearances) {
  // Match the shop entry that has this exact owner string
  // We look for: owner: `<ownerName>`, ... tasks:
  // and insert appearance/storyAppearances before tasks:
  const escapedOwner = ownerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Check if already patched
  if (src.includes(`owner: \`${ownerName}\`, ownerImg`) && src.includes(`owner: \`${ownerName}\``) ) {
    const alreadyHasAppearance = new RegExp(`owner: \`${escapedOwner}\`[^}]*appearance:`).test(src);
    if (alreadyHasAppearance) {
      console.log(`  SKIP  ${ownerName} (already has appearance)`);
      return;
    }
  }

  const appearanceStr = appearance ? `appearance: \`${appearance}\`, ` : '';
  const storyStr = storyAppearances && storyAppearances.length > 0
    ? `storyAppearances: [${storyAppearances.map(s => `\`${s}\``).join(', ')}], `
    : '';
  const insertStr = appearanceStr + storyStr;

  if (!insertStr) return;

  // Find the pattern: owner: `<name>`, ownerImg: `...`, mapImg: `...`, shopImg: `...`, tasks:
  // We want to insert before tasks: (or before trivia: if it exists)
  const taskPattern = new RegExp(
    `(owner: \`${escapedOwner}\`, ownerImg: \`[^\`]*?\`, mapImg: \`[^\`]*?\`, shopImg: \`[^\`]*?\`, )` +
    `(?=(trivia:|role:|tasks:))`,
    'g'
  );
  
  const before = src;
  src = src.replace(taskPattern, `$1${insertStr}`);
  
  if (src === before) {
    // Try alternate pattern (with role: or trivia: already)
    const altPattern = new RegExp(
      `(owner: \`${escapedOwner}\`, ownerImg: \`[^\`]*?\`, mapImg: \`[^\`]*?\`, shopImg: \`[^\`]*?\`, (?:role: \`[^\`]*?\`, |trivia: \`[^\`]*?\`, )*)` +
      `(?=tasks:)`,
      'g'
    );
    src = src.replace(altPattern, `$1${insertStr}`);
    
    if (src === before) {
      console.log(`  WARN  Could not patch: ${ownerName}`);
    } else {
      console.log(`  OK    ${ownerName}`);
    }
  } else {
    console.log(`  OK    ${ownerName}`);
  }
}

// ── TTC Loopy Lane ──────────────────────────────────────────────────────────
// Sid Seltzer already patched manually
patch('Shorty Fuse', 'A yellow mouse who wears a red Bottom Stripe shirt, red High Pockets shorts, the Bird Hat, the TNT Backpack, and Red Sneakers.', ['Fire Safety (Sidetask)']);
patch('Sasha Sidesplitter', 'A sea green pig who wears the Pink Bow, Red Sneakers, the Nurse shirt, and a red Jean Pockets skirt.', []);
patch('Lucy Tires', 'A citrine cat who wears the Green Baseball Cap, the Small Magnet Backpack, Green Athletic Shoes, a citrine Bottom Stripe shirt, and the Pink Bow skirt.', []);
patch('Clovinia Cling', 'A cream koala who wears the Fancy Hat, the Giving Thanks Platepack, a red Dress shirt, and slate blue High Pockets shorts.', []);
patch('Jester Chester', 'A yellow rabbit who wears the Red Jester Outfit and Red Fancy Shoes.', ['An Oldie but a Goodie (Kudos Rank-Up Task)']);
patch('Sally Spittake', 'A red cat who wears a citrine Bottom Stripe shirt and the Peppermint skirt.', ['Musical Monstrosity (MML Kudos Rank-Up Task)']);
patch('Weird Warren', 'A blue cat who wears the Sombrero Hat, Alien Eyes, a blue Bottom Stripe shirt, and lime High Pockets shorts.', []);
patch('Rick Rockhead', 'A red rabbit who wears the Anvil Hat, a Kite Backpack, a purple Bottom Stripe shirt, and slate blue High Pockets shorts.', ['Easy As Pie In The Sky (Kudos Rank-Up Task)']);
patch('Tee Hee', 'A citrine horse who wears the Pink Bow, Cateye Glasses, Pink Sneakers, a peach Bottom Stripe shirt, and a periwinkle Polka Dot skirt.', []);
patch('Charlie Chortle', 'A periwinkle horse who wears the Bowler Hat, Aviator glasses, Black Sneakers, an aqua Bottom Stripe shirt, and royal blue High Pockets shorts.', []);
patch('Postmaster Pete', 'A lime dog who wears the Cop Hat, Black Sneakers, an unobtainable mailbox shirt, and blue Shorts with Belt.', ['Letter Rip! (Mainline Task)']);
patch('Sticky Lou', 'A maroon mouse who wears the Cauldron Hat, Aqua Toon Boots, an aqua Bottom Stripe shirt, and sienna High Pockets shorts.', ['Sticky Situation (Mainline Task)']);
patch('Chef Knucklehead', 'A yellow rabbit who wears a white Plain Shirt, Meatball Shorts, the Chef Hat, and the Spatula Backpack.', ['A Taste Of Toontown (Mainline Task)']);
patch('Will Wiseacre', 'A citrine mouse who wears the Jamboree Hat, Eye Spring Glasses, the Toonsmas Past Extinguisher, Red Sneakers, an unobtainable whistle shirt, and coral High Pockets shorts.', []);
patch('Sharky Jones', 'A maroon duck who wears the Fishing Hat, a Monocle, a Shark Fin, a purple Plain shirt, and aqua High Pockets shorts.', []);
patch('Paige Arthur', 'An aqua pig who wears the Black Top Hat, Square Frame Glasses, Black Fancy Shoes, the Newstoon Camera, a lavender Peplum shirt, and pink High Pockets shorts.', ['Scraping News (Kudos Rank-Up Task)', 'v1.1.0 Update blog post']);

// ── TTC Punchline Place ─────────────────────────────────────────────────────
patch('Nancy Gas', 'A coral duck wearing a red Bottom Stripe shirt, a rainbow skirt, and a scuba tank.', []);
patch('Big Bruce', 'A purple rabbit wearing a red Bottom Stripe shirt, brown High Pockets shorts, and a conquistador helmet.', []);
patch('Dr. Pulyurleg', 'A yellow cat who wears an orange tinted Lab Coat, yellow High Pockets shorts, a Doctor\'s Headband, and Nerd Glasses.', ['Smart Minds Think Unalike (Mainline Task)', 'The Mysterious Duck (Kudos Rank-Up Task)']);
patch('Chef E.Z. Bake', 'A yellow rabbit who wears the Chef Hat, the Spatula Backpack, and the Cook the Cogs shirt and shorts.', ['A Taste Of Toontown (Mainline Task)']);
patch('Crunchy Alfredo', 'A pink bat who wears the Chef Hat, a sienna Pocket Polo, and sienna High Pockets shorts.', ['Toonsmas Day Feast (Event Task)']);
patch('Dr. Sensitive', 'A pink mouse who wears the Doctor\'s Headband, the Daisy shirt, and a red Denim skirt.', ['Smart Minds Think Unalike (Mainline Task)']);
patch('Franz Neckvein', 'A tan mouse wearing a maroon Plain shirt, sea green High Pockets shorts, the Anvil Hat, and Black Athletic Shoes.', ['Zit\'s Time to Pump Iron (Mainline Task)']);
patch('Nurse Nancy', 'A lavender cat who wears the Doctor\'s Headband and the Nurse Outfit.', []);
patch('Tony Maroni', 'A slate blue dog who wears a yellow Bottom Stripe shirt, bright red High Pockets shorts, Groucho Glasses, and the Anti-Cog Control Hat.', ['Monkey See Monkey Do (Sidetask)']);
patch('Zippy', 'A sea green dog who wears the Propeller Hat, a lime Bottom Stripe shirt, and lime High Pockets shorts.', []);
patch('Ned Slinger', 'A tan horse who wears the Fruit Pie Hat, the Hang Glider, an orange Plain shirt, and coral Shorts with Belt.', ['Easy As Pie In The Sky (Kudos Rank-Up Task)']);
patch('Professor Wiggle', 'A red cat who wears the Jester Hat, Eye Spring Glasses, the Clown Bowtie, Red Sneakers, and a red tinted Scientist Outfit.', []);
patch('Chewy Morsel', 'A slate blue cat who wears the Chef Hat, the Flunky Glasses, an orange Plain shirt, and sienna Shorts with Belt.', ['A Taste Of Toontown (Mainline Task)']);
patch('Cindy Sprinkles', 'A green cat who wears a Purple Bow, a lime Plain shirt, and a citrine Pleated skirt.', ['A Taste of Toontown (Mainline Task)']);

// ── TTC Silly Street ────────────────────────────────────────────────────────
patch('T.P. Rolle', 'A slate blue dog who wears the Leaf Hat, the 2018 Hypno Goggles, a lime Plain shirt, and a purple Denim skirt.', ['Buck Ruffler Plushie Trailer (YouTube)']);
patch('Dentist Daniel', 'A green koala who wears the Doctor\'s Headband, Round Glasses, a blue Plain shirt, and sea green High Pockets shorts.', ['National Dentists Day 2026 (social media)']);
patch('Sir Babbles A Lot', 'A lime kangaroo who wears the Roman Helmet, a lime Vest, and brown High Pockets shorts.', ['Santa\'s Outfit (Toonsmas Event Task)']);
patch('Canary Coalmine', 'A tan cat who wears the Miner Hat, the Scuba Tank, a periwinkle Bottom Stripe shirt, and a maroon Bottom Stripe skirt.', ['An Oldie but a Goodie (Kudos Rank-Up Task)']);
patch('Dancing Diego', 'A beige turkey who wears Eye Spring Glasses, a green Pocket Polo, and lime High Pockets shorts.', []);
patch('Lazy Hal', 'A citrine dog who wears the Yellow Beanie, Hollywood Shades, the Vacation Froge shirt, and royal blue Side-striped shorts.', ['An Oldie but a Goodie (Kudos Rank-Up Task)', 'Buck Ruffler Plushie Trailer (YouTube)']);
patch('Feather Duster', 'A citrine rabbit who wears the Fancy Feathers Hat, Groucho Glasses, White Angel Wings, Pink Sneakers, an aqua Bottom Stripe shirt, and a pink Polka Dot skirt.', ['Double Coil and Trouble (Kudos Rank-Up Task)']);
patch('Dr. Foolery', 'A royal blue duck who wears the Doctor\'s Headband, Alien Glasses, the Small Magnet Backpack, a white Plain shirt, and blue High Pockets shorts.', []);
patch('Dr. Euphoric', 'A blue horse who wears the Doctor\'s Headband, Heart Glasses, Pink Tennis Shoes, a pink tinted Scientist shirt, and bright red tinted Hallowopolis Shorts.', []);
patch('Silent Simone', 'A pink beaver who wears the Homemade Ragdoll Hat, the Busted! shirt, and Black Sailor Shorts.', ['Sticky Situation (Mainline Task)']);
patch('Sneezy Kitty', 'A cat with a sienna head, an orange body, and coral legs. Wears the Beehive Hairdo, Groucho Glasses, a slate blue Plain shirt, and royal blue Big Pockets shorts.', ['Trashcat Troubles (Sidetask)']);
patch('Rollo The Amazing', 'A sea green duck who wears a Black Top Hat, Pink Hypno Goggles, the Dracula Cape, a bright red Plain shirt, and maroon High Pockets shorts.', []);
patch('Roz Berry', 'A brown duck who wears the Outback Slouch Hat, Yellow Star Glasses, a bright red Plain shirt, and the Snowman skirt.', []);
patch('Dan Dribbles', 'A pink duck who wears the Fancy Hat, the Giving Thanks Platepack, Pink Sneakers, and the Trashcat Outfit.', ['The Mysterious Duck (Kudos Rank-Up Task)']);
patch('Patty Papercut', 'A purple rabbit who wears the Anti-Cog Control Hat, a red Bottom Stripe shirt, and the Festive Winter skirt.', []);
patch('Sal Snicker', 'A blue cat who wears the Pilot Cat, Black Sneakers, the Racer Jumpsuit, and tan Jeans.', []);
patch('Mary', 'A red horse who wears the Propeller Hat, Cateye Glasses, the Plush Cat Backpack, Brown Fancy Shoes, a purple Plain shirt, and a pink Striped skirt.', []);
patch('Bruiser McDougal', 'A lime rabbit who wears the Party Hat, Movie Glasses, a red Bottom Stripe shirt, and brown High Pockets shorts.', []);
patch('Ma Putrid', 'A brown rabbit who wears the Fruit Pie Hat, a maroon Bottom Stripe shirt, and the Peppermint skirt.', ['Gathering Gags (Mainline Task)']);
patch('Jesse Jester', 'A royal blue mouse who wears the Red Jester Outfit.', ['Jokey Jam (Mainline Task)']);
patch('Daffy Don', 'A maroon duck who wears the Chef Hat, Round Glasses, the Potions Bag, Orange Stars Boots, the Candy Corn Shirt, and orange High Pockets shorts.', []);
patch('Happy Heikyung', 'A cream cat who wears a peach Plain shirt and the Snowflakes skirt.', []);
patch('Honey Haha', 'A lime horse who wears the Sun Hat, Groucho Glasses, an orange Bottom Stripe shirt, and a Daisy skirt.', []);
patch('Professor Binky', 'A sienna horse who wears the Rainbow Wacky Wig, Rainbow Hypno Goggles, the Pinwheel Bowtie, Pink Toon Boots, and a maroon tinted Scientist outfit.', []);
patch('Professor Guffaw', 'A maroon dog who wears a Party Hat, Heart Glasses, the Gag Attack Pack, a Mad Scientist shirt, and the Cog-Crusher Shorts.', ['Jokey Jam (Mainline Task)']);
patch('Woody Nickel', 'A periwinkle duck who wears the Bowler Hat, a Monocle, Oxfords, a green tinted Diamond Polo, and unobtainable green tinted Golf Shorts.', ['Pacesetter & Firestarter Plushie Trailer (YouTube)']);
patch('Loony Louis', 'A citrine duck who wears the Hollywood Shades, the Rainbow Wacky Wig, the TNT Backpack, the Racing Flag Shirt, the Racing Flag Shorts, and the Red Dots Rain Boots.', ['Letter Rip! (Mainline Task)', 'Reid-tirement Comic (Issue #12)']);
patch('Madam Chuckle', 'A slate blue cat who wears a yellow Plain shirt and a yellow Flowers skirt.', []);
patch('Frank Furter', 'A maroon rabbit who wears the Broken TV Hat, Round Glasses, a lime Bottom Stripe shirt, and blue Shorts with Belt.', []);
patch('Harry Ape', 'A lime monkey who wears the Black Top Hat, the Jamboree Pack, an orange Plain shirt, and sienna Shorts with Belt.', []);
patch('Joy Buzzer', 'A periwinkle rabbit who wears Bug Eye Glasses, the Button Backpack, a tan Lightning Bolt shirt, and a tan Denim skirt.', []);
patch('Muldoon', 'A red dog who wears the Jester Hat, Cateye Glasses, Brown Toon Boots, a maroon Plain shirt, and maroon Shorts with Belt.', []);
patch('Spamonia Biggles', 'A maroon cat who wears the Conquistador Helmet, a lime Plain shirt, and the Rainbow skirt.', ['Buck Ruffler Plushie Trailer (YouTube)']);

// ── TTC Wacky Way ───────────────────────────────────────────────────────────
patch('Wacky Wally', 'A yellow rabbit with white legs who wears the Blue Top Hat, the Blue Carnivale Mask, an unobtainable shirt with yellow Checkered Cowboy sleeves, and white High Pockets shorts.', ['Find The Rain (Mainline Task)']);
patch('Louise Connection', 'A sienna cat with white legs who wears a Denim Vest with Cuffed Blouse sleeves, a blue Jean Pockets skirt, and the Bug Antenna.', ['Find the Rain (Mainline Task)', 'Double Coil and Trouble (Kudos Rank-Up Task)', 'Brainiacs in the Basement (Kudos Rank-Up Task)']);
patch('Rancid Robert', 'A sienna dog with white legs who wears a purple Vest, purple High Pockets shorts, and the Frankenstein Head.', ['Gathering Gags (Mainline Task)']);
patch('Al Hare-ington', 'A cream rabbit who wears a blue and citrine Feather shirt and maroon Jeans.', []);
patch('Good Ol\' Honkin\' Sally', 'A slate blue duck who wears White Mini Blinds, a light blue Flower shirt, and an aqua Pleated skirt.', []);
patch('P.I. Multiply', 'A periwinkle cat who wears the Detective Hat, Round Glasses, a science themed shirt, and a royal blue Jean Pockets skirt.', ['The Numbers Mason... (Mainline Task)']);
patch('Bookworm Bork', 'A blue dog who wears Webster\'s Books, Nerd Glasses, The Chief, Aqua Toon Boots, a maroon Double Striped shirt, and maroon Jeans.', []);
patch('Professor Proton', 'A yellow monkey who wears the Fez Hat, the Button Backpack, Yellow Toon Boots, and an orange tinted Scientist Outfit.', []);
patch('B.R. Bea', 'A black bear who wears a red Striped shirt and blue High Pockets shorts.', []);
patch('Chef Foolery', 'A lime rabbit who wears the Chef Hat, White Mini Blinds, a lime Feather shirt, and periwinkle High Pockets shorts.', ['Give and Cake (Kudos Rank-Up Task)']);
patch('R.E. Versed', 'A pink mouse who wears Rainbow Hypno Goggles, a sea green Pocket Polo, and a royal blue Flowers skirt.', ['New Year, New Fashion! (New Years 2021 Event Task)']);
patch('Louis Laffon', 'A yellow kiwi who wears the Party Hat, Yellow Star Glasses, a red Plain shirt, and lime Shorts with Belt.', []);
patch('Spam Iam', 'A green pig with white legs who wears a green tinted Bee shirt and a sea green tinted Daisy skirt.', ['Taking Out The Trash (Kudos Rank-Up Task)']);
patch('Pants On Fire', 'An orange monkey who wears a slate blue Lightning Bolt Shirt and slate blue Side-striped shorts.', ['Monkey See Monkey Do (Sidetask)']);
patch('Liar Liar', 'A slate blue monkey who wears an orange Lightning Bolt shirt and an orange Flowers skirt.', ['Monkey See Monkey Do (Sidetask)']);

// ── BB Anchor Avenue ─────────────────────────────────────────────────────────
patch('Sir C. Saw', 'A cream deer who wears a red Plain Shirt and purple High Pockets shorts.', []);
patch('Helpful Harry', 'A tan bear who wears the Aqua Baseball Cap, the Gag Attack Pack, the Goldfish shirt, and the Gold Buckle shorts.', ['Contacting Live Support (Mainline Task)', 'Stopping the Scuttlebutt (Kudos Rank-Up Task)']);
patch('Chef Shea', 'A pink dog who wears the Chef Hat, a Clown Fish Shirt, and a Fishing skirt.', ['Toonsmas Day Feast (Toonsmas Event Task)']);
patch('Professor Pearl', 'A lavender cat who wears the unobtainable Toontask Complete #2 shirt and the Pink Bow skirt.', ['First Day of School! (Mainline Task)']);
patch('Greggory Goggles', 'An aqua rabbit who wears the Alchemist Goggles, Vintage Snow Goggles, and the Hypno Goggles outfit.', ['I Can See Clearly Now... (Mainline Task)', 'A Misty Mystery (Kudos Rank-Up Task)', 'Temperature Troubles (Lawbot HQ Directive)']);
patch('N.D. Skye', 'A black duck who wears the Pilot Cap hat, the Airplane Wings backpack, an Island shirt, and a Blue & Gold skirt.', ['Pilfering Propellers (Sidetask)']);
patch('Crafty Clyde', 'A purple deer who wears the Miner Hat, a royal blue Striped shirt, and tan Jean shorts.', ['Sandcastle Savings (Kudos Rank-Up Task)']);
patch('T. Shirley', 'A blue monkey who wears a Supertoon shirt and a Rainbow skirt.', []);
patch('Prince Beef', 'A bright red duck who wears a Blue Tiara, Burger Shirt, and Pirate shorts.', []);
patch('Captain Cheesy', 'A yellow mouse who wears the Napoleon Hat, a Golden Sailor Shirt and Golden Sailor Shorts.', []);
patch('Sandy Seasalt', 'A peach horse who wears a Button-Up shirt and High Pockets shorts.', ['Huge Oppor-tuna-ty (Kudos Rank-Up Task)']);
patch('Chef Chip', 'A yellow rabbit who wears the Chef Hat, a yellow Feather shirt, and green Jean shorts.', []);
patch('Postmaster Paul', 'An ice blue dog who wears an unobtainable shirt with Pot O\' Gold sleeves and green tinted Elf shorts.', ['Salt, Pepper, Paprika (Kudos Rank-Up Task)']);
patch('A.R. Ming', 'A yellow cat who wears the Roman Helmet, the Pirate Sword, the Traditional Tin Soldier Shirt, and the Pirate shorts.', ['Unite the Buccaneers! (Mainline Task)']);
patch('Ree Pare', 'A dark teal duck who wears the Sailor Hat, Goggles, a lime Double Striped shirt, and lime High Pockets shorts.', ['Big Binnacle Bash (Mainline Task)']);
patch('Reg', 'A cream alligator who wears a Bandana, Gem Eyepatch, Sailor Collar, royal-blue Striped shirt, maroon Jean shorts, and Aviator Boots.', ['The Salty Spit-toon (Sidetask)']);
// ── BB Buccaneer Boulevard ────────────────────────────────────────────────────
patch('Gary Glubglub', 'A royal blue cat who wears the Scuba Mask, the Scuba Tank, a light blue Bottom Stripe shirt, and royal blue High Pockets shorts.', []);
patch('Fishy Frank', 'A slate blue turkey who wears a Fishing Bubble shirt with Clown Fish sleeves and Jean shorts.', ['Dressing Sea-Lads and Lasses (Sidetask)']);
patch('Cal Estenicks', 'A white rabbit who wears the Red Baseball Cap, a sienna 19 shirt with sienna Button-Up sleeves, and sienna Athletic shorts.', ['Unite the Buccaneers! (Mainline Task)']);
patch('Mrs. Starch', 'A sea green bat who wears a red Flower shirt and a sea green Pleated skirt.', ['Santa\'s Outfit (Toonsmas Event Task)']);
patch('Electra Eel', 'A maroon raccoon who wears the Retro Robophones, the Button Backpack, a yellow Lightning Bolt shirt, and a yellow tinted unobtainable fishing skirt.', []);
patch('Admiral Hook', 'A brown rabbit who wears the Bobby Hat, a Monocle, the Golden Sailor Collar, the Outback Shoes, the Pirate shirt, and the Pirate shorts.', ['Big Binnacle Bash (Mainline Task)', '7th Layer Wrapping Paper (Kudos Rank-Up Task)']);
patch('Salty Stan', 'A citrine horse who wears a Bandana, a slate blue Plain shirt, and brown High Pockets shorts.', ['Big Binnacle Bash (Mainline Task)']);
patch('Lisa Luff', 'A lime dog who wears the Sun Hat, Goggles, a slate blue Bottom Stripe shirt, and a Pleated skirt.', []);
patch('Charlie Chum', 'A sienna dog who wears the Fishing Hat, the Fisherman shirt, and the unobtainable Fishing shorts.', []);
patch('Eileen Overboard', 'A citrine cat who wears the Sun Hat, a mint Bottom Stripe shirt, and the Green Sailor Skirt.', ['Baby\'s First Steps (Mainline Task)']);
patch('Billy Budd', 'A sea green duck who wears the Fishing Hat, an orange tinted Island shirt with orange Bottom Stripe sleeves, and blue Jean shorts.', ['Big Binnacle Bash (Mainline Task)']);
patch('Captain Carl', 'A tan duck who wears the Napoleon Hat, the Monocle, the BB Sailor shirt, and the Pirate shorts.', []);
patch('Sheila Squid, Atty', 'A slate blue duck who wears the Outback Slouch Hat, Square Frame Glasses, the Newstoon\'s Suitcase, a light grey Button-Up shirt with Bottom Stripe sleeves, and the BB Sailor skirt.', []);
patch('Captain Yucks', 'A sienna duck who wears the Pilot Cap, a Dotted Polo with Clown Fish sleeves, and purple High Pockets shorts.', []);
patch('Choppy McDougal', 'A periwinkle rabbit who wears the Beehive Hairdo, the Gem Eyepatch, the Outback Bandana, the Pirate shirt, Pirate shorts, and Pink Sneakers.', ['First Mate Makeover (Sidetask)']);
patch('Doctor Squall', 'A sea green deer who wears the Doctor\'s Headband, a Monocle, a red Pocket Polo, and brown High Pockets shorts.', ['I Can See Clearly Now... (Mainline Task)']);
patch('Flappy Docksplinter', 'A periwinkle cat who wears the Alchemist Goggles, a sienna tinted Old Boot shirt with slate blue Bottom Stripe sleeves, and sea green High Pockets shorts.', ['I Can See Clearly Now... (Mainline Task)', 'A Captain For Hire (Mainline Task)']);
patch('Linda Landlubber', 'A sea green koala who wears the Doctor\'s Headband, the Nerd Glasses, a lime tinted Nurse Shirt, and lime tinted Nurse Shorts.', ['A Captain For Hire (Mainline Task)', 'Straight to Boardwalk (Sidetask)', 'Sandcastle Savings (Kudos Rank-Up Task)']);
// ── BB Lighthouse Lane ────────────────────────────────────────────────────────
patch('Fred Flounder', 'A lime rabbit who wears the Detective Hat, Round Glasses, the Telescope Backpack, a maroon Bottom Stripe shirt, and sea green Shorts with Belt.', ['Butter Flippers (Mainline Task)']);
patch('Cindy Splat', 'A peach kangaroo who wears a Bird Hat, Cuffed Blouse, and Polka Dot skirt.', []);
patch('Shelly Seaweed', 'A maroon mouse who wears an orange Bottom Stripe shirt, Peppermint Skirt, and Witches Broom backpack.', []);
patch('Seafoam', 'A lavender duck who wears a Pink Bow, Cateye Glasses, a peach Plain shirt, and a purple Polka Dot Skirt.', []);
patch('Melville', 'A coral horse who wears the Pirate Hat, the Skull Eyepatch, the Pirate Sword, a sea green Bottom Stripe shirt, and lime High Pockets shorts.', ['A Captain For Hire (Mainline Task)']);
patch('Ted Tackle', 'A green duck who wears a Fishing Hat, Fisherman shirt, slate-blue High Pockets shorts, and Purple Backpack.', []);
patch('Svetlana', 'A green cat who wears the Anvil Hat, a blue Bottom Stripe shirt, and the Green Sailor Skirt.', ['Unite the Buccaneers! (Mainline Task)']);
patch('Topsy Turvey', 'A light blue beaver who wears the Anti-Cog Control Hat, a maroon Flowers shirt, and blue High Pockets shorts.', ['Someone\'s Been Drinking Saltwater... (Mainline Task)']);
patch('Ethan Keel', 'A slate-blue rabbit who wears a Fez Hat, Hollywood Shades, blue Bottom Stripe shirt and Fishing shorts.', []);
patch('William Wake', 'A sea-green rabbit who wears a Sandbag Hat, Square Frame Glasses, royal-blue Bottom Stripe shirt and light-blue High Pockets shorts.', []);
patch('Captain Jack Harrow', 'A royal-blue cat who wears a Pirate Hat, Skull Eyepatch, Sailor Collar, Black Sailor Shirt, Lazy Bones shorts, and Alchemist Shoes.', []);
patch('Davey Drydock', 'A sea-green cat who wears a Gardening shirt and plum High Pockets shorts.', ['Straight to Boardwalk (Sidetask)', 'Turnkey Day Preparation (Event Task)']);
patch('Barnacle Bessie', 'A lime duck who wears the Weight Hat, a Purple Bottom Stripe shirt, and a Lavender Polka Dot skirt.', ['Oh, Barnacles! (Mainline Task)', 'Unite the Buccaneers! (Mainline Task)', 'I Can See Clearly Now... (Mainline Task)', 'A Captain For Hire (Mainline Task)', 'The Office (Mainline Task)', 'A Misty Mystery (Kudos Rank-Up Task)', 'cogs.ink ARG Task']);
patch('Porter Hole', 'A periwinkle horse who wears a Black Top Hat, Monocle, black Vest with Guayabera sleeves, and Team Barnyard shorts.', []);
patch('Dinah Docker', 'A purple dog who wears a Chef Hat, Plain shirt, lime Jean Pockets skirt, and a Giving Thanks Platepack.', ['Turnkey Day Preparation (Event Task)']);
patch('Stinky Ned', 'A brown duck who wears the Anti-Cog Control Hat, Flunky Glasses, a lime Plain shirt, and yellow Shorts with Belt.', []);
patch('Ned Setter', 'A royal-blue dog who wears a Sailor Hat, green Pawprint shirt with Plain sleeves, and light-blue High Pockets shorts.', []);
patch('Pearl Diver', 'A purple duck who wears a Sailor Hat, Scuba Mask, red Plain shirt, and Blue & Gold skirt.', []);
patch('Felicia Chips', 'A brown rabbit who wears Square Frame Glasses, a Piano Tuna shirt, and a Blue & Gold skirt.', []);
patch('Claggart', 'A purple horse who wears a purple Vest with Button-Up sleeves and lavender High Pockets shorts.', []);
patch('Rudy Rudder', 'A citrine horse who wears a Sailor Hat, orange Plain shirt, and Trolley shorts.', []);

// ── BB Seaweed Street ─────────────────────────────────────────────────────────
patch('Emily Eel', 'An aqua mouse who wears a yellow Lightning Bolt shirt, Bee skirt, and Button Backpack.', []);
patch('Sid Squid', 'A bright red rabbit who wears the Green Baseball Cap, the Toonosaur Backpack, a dark green Plain shirt, and dark green Shorts with Belt.', ['Are You Squidding Me? (Kudos Rank-Up Task)']);
patch('Coral Reef', 'An aqua horse who wears a Sun Hat, Cateye Glasses, cream Plain shirt, and light-blue Pleated skirt.', []);
patch('Shep Ahoy', 'A yellow turkey who wears a Bandana, Pirate outfit, and Pirate Sword backpack.', []);
patch('Blisters McKee', 'A teal bat who wears the Fishing Hat, a yellow Guayabera, and brown Shorts with Belt.', ['Swimming Kiwi (Sidetask)', 'Stopping the Scuttlebutt (Kudos Rank-Up Task)', 'Fashion Fiasco (Lawbot HQ Directive)']);
patch('Carla Canal', 'A bright-red duck who wears a blue Bottom Stripe shirt, lime Jean Pockets skirt, and Seltzer Backpack.', ['Stopping the Scuttlebutt (Kudos Rank-Up Task)']);
patch('Brian Beachead', 'An orange duck who wears a Pilot Cap, yellow Pocket Polo, and brown Shorts with Belt.', []);
patch('Pacific Tim', 'An aqua dog who wears a Fedora, Flunky Glasses, sea-green Bottom Stripe shirt, orange Shorts with Belt, and The Book of Law backpack.', []);
patch('Heave Ho', 'A bright-red horse who wears a Pirate Hat, black Plain shirt, and bright-red Boardbot.exe Shorts.', []);
patch('Cyren', 'An amaranth kiwi who wears a Scuba Mask, lime Island shirt with Zip-Up Hoodie sleeves, and lime Bottom Stripe skirt.', []);
patch('Art', 'A maroon cat who wears the Fez Hat, Nerd Glasses, the unobtainable Toontask Completer shirt with bright red Double Striped sleeves, and red tinted Sellbot Crusher Shorts.', ['Charting Smart Charts (Mainline Task)']);
patch('Rod Reel', 'A yellow cat who wears a Fishing Hat, Fisherman shirt, and maroon Shorts with Belt.', []);
patch('Rocky Shores', 'A citrine dog who wears the Weight Hat, a light blue 19 shirt with citrine Plain sleeves, and light blue High Pockets shorts.', ['Unite the Buccaneers! (Mainline Task)']);
patch('Dinah Down', 'A blue cat who wears a Chef Hat, light-blue Plain shirt, Peppermint skirt, and Spatula Backpack.', []);
patch('Barnacle Barbara', 'A citrine cat who wears a Black Top Hat, Goldfish shirt, and light-blue Polka Dot skirt.', ['Barbarian Barbara (Kudos Rank-Up Task)']);
patch('Gusty Kate', 'A bright-red cat who wears a Propeller Hat, light-blue Plain shirt, purple Polka Dot skirt, and Angel Wings.', []);
patch('Bonzo Bilgepump', 'An orange mouse who wears a Napoleon Hat, blue Plain shirt, and sienna Shorts with Belt.', []);
patch('Dante Dolphin', 'A yellow horse who wears a Fishing Hat, Gift Glasses, yellow Plain shirt and tan High Pockets shorts.', ['7th Layer Wrapping Paper (Kudos Rank-Up Task)']);
patch('Toby Tonguestinger', 'A blue horse who wears a Chef Hat, Cook the Cogs Shirt, royal-blue Jean shorts, and Spatula Backpack.', ['Silverware Sting (Kudos Rank-Up Task)']);
patch('Wynn Bag', 'A maroon mouse who wears a Bird Hat, yellow Plain shirt, bright-red High Pockets shorts, and Kite Backpack.', []);
patch('Gang Wei', 'A coral kiwi who wears a BB Sailor shirt and Pirate shorts.', []);
patch('Ahab', 'A slate blue monkey who wears the Fishing Hat, the Old Boot shirt, and the Lucky Clover shorts.', ['Someone\'s Been Drinking Saltwater... (Mainline Task)']);
patch('Alice', 'A light-blue mouse who wears an aqua Bottom Stripe shirt and a Rainbow skirt.', []);
patch('Professor Plank', 'A periwinkle rabbit who wears Nerd Glasses, a blue Loony Labs shirt with Bike Horn sleeves, a Jean Heart Skirt, and an Orange Backpack.', []);

// ── YOTT Knight Knoll ─────────────────────────────────────────────────────────
patch('Epoch James', 'A fuchsia fox who wears an orange Dress shirt and royal-blue Jean shorts.', []);
patch('Jimmy Wallace', 'A paradiso dog who wears an aqua 19 shirt and blue Side-striped shorts.', []);
patch('Barber Caerbannog', 'An amaranth rabbit who wears a bright-red Plain shirt and tan Side-striped shorts.', []);
patch('Steward Selina', 'An amethyst bat who wears a white Plain shirt and a red Striped skirt.', []);
patch('Constable Conrad', 'A tan bear who wears a bright red Feather shirt and slate blue Big Pockets shorts.', ['Researching The Executed (Mainline Task)']);
patch('Little Prince', 'A sea green horse who wears the Blue Tiara, Square Frame Glasses, the Retro Winter Scarf, Black Athletic Shoes, a slate blue Striped shirt, and royal blue Shorts with Belt.', ['Crossword Crisis (Lawbot HQ Directive)']);
patch('Jongleur Jocelyn', 'A royal blue bat who wears a maroon Flower Stripe shirt and a purple Bottom Stripe skirt.', ['Executing The Executives (Mainline Task)']);
patch('Thea Troubadour', 'A brown raccoon who wears a royal-blue Dress shirt and brown Big Pockets shorts.', ['Not-So-Tall Tales (Sidetask)']);
patch('Serf Simon', 'A green-haze horse who wears a sea-green Pocket Polo and blue Feather shorts.', ['Fishing Fiasco (Kudos Rank-Up Task)']);
patch('Nichola Nomad', 'A white beaver who wears a cream Bottom Stripe shirt and a pink Pleated skirt.', []);
patch('Fletcher Frederick', 'A light blue alligator who wears an orange Bottom Stripe shirt and aqua Jeans.', ['Fashion Fiasco (Lawbot HQ Directive)']);
patch('Joker Juliana', 'A paradiso alligator who wears a maroon Flower shirt and a pink Bottom Stripe skirt.', []);
patch('Blacksmith Estoc', 'An aqua dog who wears the Anvil Hat, Goggles, the Pirate Sword, Alchemist Shoes, a black Guayabera shirt, and tan Jean shorts.', ['Executing The Executives (Mainline Task)', 'Reinforced Training (Kudos Rank-Up Task)']);
patch('Patsy', 'A beige deer who wears a red 19 shirt and maroon High Pockets shorts.', ['Ye Olde Cog Bash! (Mainline Task)', 'The Royal Grail (Kudos Rank-Up Task)']);
patch('Archduke Arthur', 'A light-blue bear who wears an aqua 19 shirt and orange High Pockets shorts.', ['Page Studying 101 (Sidetask)']);
patch('Moneyer Mason', 'A red bear who wears a maroon Two-Tone Button-Up shirt and slate blue Flower shorts.', ['Ye Olde Cog Bash! (Mainline Task)']);
patch('Marty Python', 'A lime bear who wears a sea green Two-Tone Button-Up shirt and aqua High Pockets shorts.', ['Researching The Executed (Mainline Task)']);
patch('Peasant Peter', 'A spring-green horse who wears a royal-blue Button-Up shirt and maroon High Pockets shorts.', []);
patch('Tim the Enchanter', 'A lime alligator who wears an aqua Feather shirt and maroon High Pockets shorts.', []);
patch('King Arture', 'A corn pig who wears a Crown, sea-green Plain shirt, and aqua High Pockets shorts.', []);

// ── YOTT Noble Nook ───────────────────────────────────────────────────────────
patch('Allan A. Dale', 'A lavender fox who wears a sea green Pocket Polo and tan High Pockets shorts.', ['The Magic Cap (Brrrgh Mainline Task)']);
patch('Dagger', 'A maroon raccoon who wears a purple Button-Up shirt and bright red High Pockets shorts.', ['Ye Olde Restoration Project (Mainline Task)']);
patch('Steamed Bams', 'A dark yellow cat who wears a maroon Feather shirt and maroon High Pockets shorts.', ['Ye Olde Cog Bash! (Mainline Task)', 'Dungeon Duty (Sidetask)']);
patch('Chef Lambert', 'A blizzard-blue bear who wears a sea-green Button-Up shirt and light-blue High Pockets shorts.', ['Doodragon Festival (Kudos Rank-Up Task)']);
patch('Gentry Gary', 'A yellow pig who wears a sea green Plain shirt and aqua High Pockets shorts.', ['Ye Olde Restoration Project (Mainline Task)']);
patch('Webster', 'A blue duck with orange legs who wears his own outfit.', ['Docket Dilemma (Lawbot HQ Directive)', 'Sky Clan Access (April Toons 2019 Event Task)']);
patch('Hind Harry', 'A green raccoon who wears a soccer shirt with blue sleeves and orange High Pockets shorts.', []);
patch('Pantler Peter', 'A kashmir-blue deer who wears a yellow Dress shirt and aqua Flower shorts.', []);
patch('Friar Richard', 'A yellow bear who wears a red Dress shirt and orange High Pockets shorts.', ['Doodragon Festival (Kudos Rank-Up Task)']);
patch('Bailey', 'A neon pink raccoon who wears a pink Flower Stripe shirt and a light blue Denim skirt.', ['Ye Olde Restoration Project (Mainline Task)']);
patch('Cleric Cecily', 'A yellow dog who wears a sea green Dress shirt and blue High Pockets shorts.', ['Ye Olde Restoration Project (Mainline Task)']);
patch('Will Rakespeare', 'A lavender cat who wears a white Two-Tone Button-Up shirt and maroon High Pockets shorts.', []);
patch('Merchant Margery', 'A green-haze rabbit who wears a periwinkle Flower Stripe shirt and peach Flower shorts.', []);
patch('Squire Simon', 'A green pig who wears a lime Striped shirt and aqua Big Pockets shorts.', []);
patch('Ariel Septim VII', 'A lavender beaver who wears an orange Plain shirt and red Athletic shorts.', ['Used To Be An Adventurer (Sidetask)']);
patch('Monsieur Fyre', 'A coral bear who wears a yellow Pocket Polo and royal-blue High Pockets shorts.', []);

// ── YOTT Wizard Way ───────────────────────────────────────────────────────────
patch('Nat Twenny', 'A royal-blue pig who wears a slate-blue Dress shirt and aqua Athletic shorts.', ['Box Machina (Kudos Rank-Up Task)']);
patch('Mad Ernage', 'A yellow bear who wears a maroon Pocket Polo and orange Big Pockets shorts.', ['Executing The Executives (Mainline Task)', 'Looming Lawbot (Kudos Rank-Up Task)']);
patch('Craig Plague', 'A brown raccoon who wears a royal blue Dress shirt and brown Big Pockets shorts.', ['Cog Flu (Mainline Task)']);
patch('Youthful Yannis', 'A sea-green bear who wears an orange Guayabera shirt and lime Shorts with Belt.', ['Midlife Crisis (Sidetask)']);
patch('Mac Breath', 'A blizzard-blue duck who wears a blue Dress shirt and Feather shorts.', []);
patch('Gerry Gemcutter', 'A coral bear who wears a red Guayabera shirt and slate-blue Athletic shorts.', []);
patch('Sir Owen', 'A green mouse who wears an orange Lightning Bolt shirt and purple Jean shorts.', ['Fishing Fiasco (Kudos Rank-Up Task)']);
patch('Merlin Ambrice', 'A neon pink raccoon who wears a royal blue Striped shirt and tan Athletic shorts.', ['Ye Olde Cog Bash! (Mainline Task)', 'The Golden Penny (Sidetask)', 'Looming Lawbot (Kudos Rank-Up Task)']);
patch('Dude El Dug', 'A yellow duck who wears a blue Button-Up shirt and magenta Jean shorts.', []);
patch('Lady Lotsalard', 'A pink deer who wears an aqua Button-Up shirt and a slate-blue Striped skirt.', []);
patch('Dr. Brewce', 'A plum duck who wears the Alchemist Goggles, a Monocle, the Potions Bag, Loafers, a black Dress shirt, and royal blue Jean shorts.', ['Researching The Executed (Mainline Task)']);
patch('Sparkle N. Sea', 'A green rabbit who wears a purple Peplum shirt and blue High Pockets shorts.', []);
patch('Sir Prysin', 'A coral deer who wears an aqua Button-Up shirt and sienna Fiery shorts.', ['Executing The Executives (Mainline Task)', 'At The Gate (Kudos Rank-Up Task)']);
patch('Mitch E.', 'A coral monkey who wears a blue Dress shirt and red Shorts with Belt.', []);
patch('Joan of Park', 'A lavender beaver who wears a peach Cuffed Blouse and a cream Denim skirt.', ['Ye Olde Restoration Project (Mainline Task)']);
patch('Sir Reezy', 'A lavender monkey who wears a sea-green Vest and sea-green Feather shorts.', []);
patch('Percy Lane', 'A dark yellow beaver who wears a citrine Peplum shirt and a bright red Denim skirt.', ['Ye Olde Restoration Project (Mainline Task)']);
patch('Magus Bizzy', 'A grey deer who wears a lime 19 shirt and royal blue Shorts with Belt.', ['Ye Olde Restoration Project (Mainline Task)', 'Crossword Crisis (Lawbot HQ Directive)', 'Needle Nonsense (Lawbot HQ Directive)']);

fs.writeFileSync(FILE, src, 'utf8');
console.log('\nDone patching appearances.');
