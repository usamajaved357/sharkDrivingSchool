/** Areas shown in the marquee and the "Areas we cover" chips. TODO(owner): confirm coverage. */
export const areas = [
  'Manchester City Centre',
  'Salford',
  'Stockport',
  'Trafford',
  'Bolton',
  'Oldham',
  'Rochdale',
  'Bury',
  'Wigan',
  'Tameside',
  'Didsbury',
  'Chorlton',
  'Sale',
  'Altrincham',
  'Levenshulme',
  'Rusholme',
] as const;

/** Pins on the decorative coverage map (percent positions). */
export const mapPins = [
  { label: 'Manchester', left: 42, top: 46 },
  { label: 'Salford', left: 22, top: 34 },
  { label: 'Stockport', left: 58, top: 72 },
  { label: 'Bolton', left: 18, top: 14 },
  { label: 'Oldham', left: 66, top: 22 },
  { label: 'Trafford', left: 14, top: 66 },
] as const;
