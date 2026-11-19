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
  /** Real coordinates (town centre). */
  lat: number;
  lon: number;
  /** Which side of the marker the label sits on (keeps labels apart). */
  side?: 'left' | 'right';
  /** The central pin (Manchester) is drawn as a larger red marker. */
  main?: boolean;
  /** Hidden on small maps, where it would sit on top of the Manchester marker. */
  nearCentre?: boolean;
}

/**
 * Coverage map view: real OpenStreetMap tiles (zoom 11, drawn at 75%) in an 800×600 box,
 * centred so Wigan → Tameside and Rochdale → Altrincham all fit.
 */
export const mapView = { lat: 53.497, lon: -2.36, zoom: 11, width: 800, height: 600, scale: 0.75 } as const;

/** Towns pinned on the coverage map, at their real positions. */
export const mapPins: MapPin[] = [
  { label: 'Manchester', lat: 53.4794, lon: -2.2453, main: true },
  { label: 'Salford', lat: 53.4875, lon: -2.2901, side: 'left', nearCentre: true },
  { label: 'Bolton', lat: 53.5769, lon: -2.4282 },
  { label: 'Bury', lat: 53.5933, lon: -2.2966 },
  { label: 'Rochdale', lat: 53.6097, lon: -2.1561 },
  { label: 'Wigan', lat: 53.5448, lon: -2.6318 },
  { label: 'Oldham', lat: 53.5409, lon: -2.1114, side: 'left' },
  { label: 'Tameside', lat: 53.4894, lon: -2.0952 },
  { label: 'Stockport', lat: 53.4083, lon: -2.1494 },
  { label: 'Didsbury', lat: 53.4166, lon: -2.2312, side: 'left' },
  { label: 'Stretford', lat: 53.4466, lon: -2.3086, side: 'left' },
  { label: 'Altrincham', lat: 53.3838, lon: -2.353 },
];
