import type { IconName } from '@/components/ui/icons';

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

/** Quick benefits shown above the area chips. */
export const areaPerks: { icon: IconName; label: string }[] = [
  { icon: 'map-pin', label: 'Free pick-up & drop-off' },
  { icon: 'checklist', label: 'Local test-centre routes' },
  { icon: 'clock', label: 'Early, late & weekend slots' },
];

export interface MapPin {
  label: string;
  /** Position on the map, in percent of its width/height. */
  left: number;
  top: number;
  /** Which side of the dot the label sits on (keeps labels inside the map and apart). */
  side?: 'left' | 'right';
  /** The central pin (Manchester) is drawn larger and red. */
  main?: boolean;
}

/**
 * Pins on the decorative coverage map. Positions roughly follow real geography
 * (north at the top), nudged so labels never overlap.
 */
export const mapPins: MapPin[] = [
  { label: 'Manchester', left: 50, top: 50, main: true },
  { label: 'Salford', left: 37, top: 40, side: 'left' },
  { label: 'Bolton', left: 22, top: 14 },
  { label: 'Bury', left: 46, top: 11 },
  { label: 'Rochdale', left: 69, top: 9 },
  { label: 'Wigan', left: 6, top: 25 },
  { label: 'Oldham', left: 82, top: 28, side: 'left' },
  { label: 'Tameside', left: 84, top: 62, side: 'left' },
  { label: 'Stockport', left: 70, top: 78 },
  { label: 'Didsbury', left: 47, top: 73, side: 'left' },
  { label: 'Trafford', left: 24, top: 60, side: 'left' },
  { label: 'Altrincham', left: 26, top: 87 },
];
