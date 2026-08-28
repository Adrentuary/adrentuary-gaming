// cogs array order: [SB%, CB%, LB%, BB%, BSB%]
export const STREETS = [
  {
    name: 'Toontown Central', pgKey: 'TTC', color: '#6b2f04', accent: '#d86b10',
    streets: [
      { location: 'Loopy Lane',      tunnel: 'Mezzo Melodyland', isHQ: false, levels: '1–4', exe: '5%',   cogs: [5,5,40,30,20] },
      { location: 'Punchline Place', tunnel: 'Barnacle Boatyard', isHQ: false, levels: '1–4', exe: '5%',   cogs: [40,40,5,5,10] },
      { location: 'Silly Street',    tunnel: 'Ye Olde Toontowne', isHQ: false, levels: '1–3', exe: '10%',  cogs: [20,20,20,20,20] },
      { location: 'Wacky Way',       tunnel: 'Daffodil Gardens',  isHQ: false, levels: '1–4', exe: '5%',   cogs: [5,5,20,30,40] },
    ],
  },
  {
    name: 'Barnacle Boatyard', pgKey: 'BB', color: '#5a1a05', accent: '#dc4a14',
    streets: [
      { location: 'Anchor Avenue',      tunnel: 'Construction',     isHQ: false, levels: '2–5', exe: '10%',  cogs: [55,0,0,35,10] },
      { location: 'Buccaneer Boulevard',tunnel: 'Toontown Central', isHQ: false, levels: '2–5', exe: '7.5%', cogs: [0,0,10,80,10] },
      { location: 'Lighthouse Lane',    tunnel: 'The Brrrgh',       isHQ: false, levels: '2–5', exe: '15%',  cogs: [5,5,35,0,55] },
      { location: 'Seaweed Street',     tunnel: 'Acorn Acres',      isHQ: false, levels: '2–5', exe: '10%',  cogs: [30,60,10,0,0] },
    ],
  },
  {
    name: 'Ye Olde Toontowne', pgKey: 'YOTT', color: '#33205e', accent: '#9b70cc',
    streets: [
      { location: 'Knight Knoll', tunnel: 'Daffodil Gardens',  isHQ: false, levels: '3–6', exe: '10%', cogs: [45,45,5,5,0] },
      { location: 'Noble Nook',   tunnel: 'Toontown Central',  isHQ: false, levels: '3–5', exe: '10%', cogs: [0,0,10,40,50] },
      { location: 'Wizard Way',   tunnel: '—',                 isHQ: false, levels: '3–6', exe: '12%', cogs: [5,5,70,20,0] },
    ],
  },
  {
    name: 'Daffodil Gardens', pgKey: 'DG', color: '#314600', accent: '#9bd31a',
    streets: [
      { location: 'Daisy Drive',     tunnel: 'Toontown Central',  isHQ: false, levels: '4–6', exe: '10%',  cogs: [10,10,0,15,65] },
      { location: 'Petunia Place',   tunnel: 'Ye Olde Toontowne', isHQ: false, levels: '4–7', exe: '7.5%', cogs: [5,50,45,0,0] },
      { location: 'Sunflower Street',tunnel: 'Acorn Acres',       isHQ: false, levels: '4–7', exe: '10%',  cogs: [10,10,10,60,10] },
      { location: 'Tulip Terrace',   tunnel: 'Sellbot HQ',        isHQ: true,  levels: '4–7', exe: '15%',  cogs: [80,5,5,5,5] },
    ],
  },
  {
    name: 'Mezzo Melodyland', pgKey: 'MML', color: '#482052', accent: '#bf62cb',
    streets: [
      { location: 'Alto Avenue',       tunnel: 'Toontown Central', isHQ: false, levels: '5–7', exe: '7.5%', cogs: [50,25,0,0,25] },
      { location: 'Baritone Boulevard',tunnel: 'The Brrrgh',       isHQ: false, levels: '5–8', exe: '10%',  cogs: [10,40,0,0,50] },
      { location: 'Soprano Street',    tunnel: 'Cashbot HQ',       isHQ: true,  levels: '5–8', exe: '25%',  cogs: [5,80,5,5,5] },
      { location: 'Tenor Terrace',     tunnel: 'Drowsy Dreamland', isHQ: false, levels: '5–8', exe: '15%',  cogs: [0,0,40,40,20] },
    ],
  },
  {
    name: 'The Brrrgh', pgKey: 'TB', color: '#003a46', accent: '#29b2dc',
    streets: [
      { location: 'Arctic Avenue', tunnel: 'Drowsy Dreamland',  isHQ: false, levels: '6–9', exe: '25%', cogs: [10,5,5,10,70] },
      { location: 'Polar Place',   tunnel: 'Lawbot HQ',         isHQ: true,  levels: '6–9', exe: '25%', cogs: [5,5,80,5,5] },
      { location: 'Sleet Street',  tunnel: 'Mezzo Melodyland',  isHQ: false, levels: '6–9', exe: '20%', cogs: [60,30,0,0,10] },
      { location: 'Walrus Way',    tunnel: 'Barnacle Boatyard', isHQ: false, levels: '6–8', exe: '20%', cogs: [0,0,5,75,20] },
    ],
  },
  {
    name: 'Acorn Acres', pgKey: 'AA', color: '#00451e', accent: '#20cf69',
    streets: [
      { location: 'Almond Avenue', tunnel: '—',                  isHQ: false, levels: '7–10', exe: '20%', cogs: [20,10,10,10,50] },
      { location: 'Legume Lane',   tunnel: 'Daffodil Gardens',   isHQ: false, levels: '7–10', exe: '20%', cogs: [20,40,40,20,0] },
      { location: 'Peanut Place',  tunnel: 'Buccaneer Boulevard',isHQ: false, levels: '7–10', exe: '20%', cogs: [30,30,30,0,10] },
      { location: 'Walnut Way',    tunnel: 'Bossbot HQ',         isHQ: true,  levels: '7–10', exe: '20%', cogs: [5,5,5,80,5] },
    ],
  },
  {
    name: 'Drowsy Dreamland', pgKey: 'DDL', color: '#1a1060', accent: '#7b68ee',
    streets: [
      { location: 'Lullaby Lane',    tunnel: 'Mezzo Melodyland', isHQ: false, levels: '8–10', exe: '25%', cogs: [40,40,5,5,10] },
      { location: 'Pajama Place',    tunnel: 'The Brrrgh',       isHQ: false, levels: '8–11', exe: '25%', cogs: [5,5,40,40,10] },
      { location: 'Twilight Terrace',tunnel: 'Boardbot HQ',      isHQ: true,  levels: '8–11', exe: '30%', cogs: [5,5,5,5,80] },
    ],
  },
];
