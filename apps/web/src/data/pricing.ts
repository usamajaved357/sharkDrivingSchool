import type { LessonTypeId } from '@shark/shared';

/**
 * Lesson prices for Greater Manchester.
 *
 * A price is either one string (same for both gearboxes) or a `byGearbox()` pair.
 * Pairs are rendered by `components/ui/GearboxText.astro` and switch with the
 * Manual/Automatic toggle.
 *
 * Confirmed by the owner (Nov 2026): automatic £40/hr single, £350 for a 10-hour block.
 * Manual is set £2/hr higher (£42 single, £370 block) at the owner's request, keeping
 * the same £50 block saving for both gearboxes.
 *
 * Everything else (Nov 2026) follows a local competitor's price structure, scaled to our
 * hourly rate (£40 automatic / £42 manual):
 * - double, assessment and mock test: the hourly rate × hours
 * - 5-hour block: ~5% off the hourly rate; 20-hour block: ~3% below the 10-hour block rate
 * - intensives: the full hourly rate × hours (no block discount, as the competitor does)
 * - Pass Plus: competitor £250 scaled; refresher: ~5% above the hourly rate
 * - test-day car hire: 2 hours at the hourly rate
 */

export interface GearboxPrice {
  manual: string;
  automatic: string;
}

/** A price that is the same for both gearboxes, or differs per gearbox. */
export type Price = string | GearboxPrice;

const byGearbox = (manual: string, automatic: string): GearboxPrice => ({ manual, automatic });

/** The price a learner sees first (the toggles default to manual). */
export const defaultPrice = (p: Price): string => (typeof p === 'string' ? p : p.manual);

export interface PackageCard {
  name: string;
  sub: string;
  price: Price;
  unit: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

/** Home page "Simple pricing" cards. */
export const homePackages: PackageCard[] = [
  { name: 'Single lesson', sub: '1 hour · pay as you go', price: byGearbox('£42', '£40'), unit: '/hr', features: ['Try us out first', 'Free pick-up & drop-off', 'Top up anytime'] },
  {
    name: '10-hour block',
    sub: 'Our best value',
    price: byGearbox('£370', '£350'),
    unit: 'total',
    popular: true,
    badge: 'MOST POPULAR',
    features: ['Save £50 vs single lessons', 'Same instructor every time', 'Progress report each lesson', 'Spread payments'],
  },
  { name: 'Intensive course', sub: '10 hours · test in weeks', price: byGearbox('£420', '£400'), unit: 'total', features: ['Daily lessons', 'Mock tests included', 'Test booking support'] },
  { name: 'Pass Plus', sub: '6 hours · after your test', price: byGearbox('£300', '£285'), unit: 'total', features: ['Motorway & night driving', 'Rural roads', 'May lower insurance'] },
];

export interface PriceRow {
  name: string;
  desc: string;
  hours: string;
  price: Price;
  per: Price;
  best?: boolean;
}

export interface PriceCategory {
  id: 'payg' | 'blocks' | 'intensive' | 'extras';
  label: string;
  intro: string;
  rows: PriceRow[];
}

/** Prices page tabs. */
export const priceCategories: PriceCategory[] = [
  {
    id: 'payg',
    label: 'Pay as you go',
    intro: 'No commitment. Pay per lesson and book as you need.',
    rows: [
      { name: 'Single lesson', desc: 'One hour, door-to-door pick-up', hours: '1 hour', price: byGearbox('£42', '£40'), per: 'per lesson' },
      { name: 'Double lesson', desc: 'Two hours, ideal for test routes', hours: '2 hours', price: byGearbox('£84', '£80'), per: 'per lesson' },
      { name: 'Assessment lesson', desc: 'Find your level and get a plan', hours: '1 hour', price: byGearbox('£42', '£40'), per: 'one-off' },
    ],
  },
  {
    id: 'blocks',
    label: 'Block bookings',
    intro: 'Book hours together and save. Same instructor throughout.',
    rows: [
      { name: '5-hour block', desc: 'A solid start or top-up', hours: '5 hours', price: byGearbox('£200', '£190'), per: byGearbox('£40/hr', '£38/hr') },
      {
        name: '10-hour block',
        desc: 'Our most popular option',
        hours: '10 hours',
        price: byGearbox('£370', '£350'),
        per: byGearbox('£37/hr', '£35/hr'),
        best: true,
      },
      { name: '20-hour block', desc: 'Most beginners start here', hours: '20 hours', price: byGearbox('£720', '£680'), per: byGearbox('£36/hr', '£34/hr') },
    ],
  },
  {
    id: 'intensive',
    label: 'Intensive courses',
    intro: 'Concentrated lessons to get you test-ready in weeks.',
    rows: [
      { name: '10-hour fast track', desc: 'Nearly test-ready or retesting', hours: '10 hours · ~1 week', price: byGearbox('£420', '£400'), per: 'total' },
      { name: '20-hour intensive', desc: 'Some experience already', hours: '20 hours · ~2 weeks', price: byGearbox('£840', '£800'), per: 'total', best: true },
      { name: '30-hour intensive', desc: 'Limited experience', hours: '30 hours · ~3 weeks', price: byGearbox('£1,260', '£1,200'), per: 'total' },
      { name: '40-hour intensive', desc: 'Complete beginners', hours: '40 hours · ~4 weeks', price: byGearbox('£1,680', '£1,600'), per: 'total' },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    intro: 'After your pass, or before your test day.',
    rows: [
      { name: 'Pass Plus', desc: 'Motorway, night, rural and dual carriageways', hours: '6 hours', price: byGearbox('£300', '£285'), per: 'total' },
      { name: 'Mock test', desc: 'Full test conditions with written debrief', hours: '1 hour', price: byGearbox('£42', '£40'), per: 'per test' },
      { name: 'Test-day car hire', desc: 'Warm-up lesson plus use of our car', hours: '2 hours', price: byGearbox('£84', '£80'), per: 'per test' },
      { name: 'Refresher lessons', desc: 'For returning or nervous drivers', hours: 'Flexible', price: byGearbox('£44', '£42'), per: 'per hour' },
    ],
  },
];

/** Cheapest price for a bookable lesson across both gearboxes (e.g. "£40"), for copy and SEO. */
export function fromPrice(id: LessonTypeId): string {
  const lesson = bookableLessons.find((l) => l.id === id);
  if (!lesson) return '';
  const p = lesson.price;
  if (typeof p === 'string') return p;
  const n = (v: string) => Number(v.replace(/[^\d.]/g, ''));
  return n(p.automatic) <= n(p.manual) ? p.automatic : p.manual;
}

/** Options in the booking wizard — ids must match LESSON_TYPE_IDS in @shark/shared. */
export const bookableLessons: { id: LessonTypeId; name: string; desc: string; price: Price }[] = [
  { id: 'single', name: 'Single lesson', desc: '1 hour · pay as you go', price: byGearbox('£42', '£40') },
  { id: 'block-10', name: '10-hour block', desc: 'Best value · same instructor', price: byGearbox('£370', '£350') },
  { id: 'intensive', name: 'Intensive course', desc: 'From 10 hours · test-ready in weeks', price: byGearbox('£420', '£400') },
  { id: 'pass-plus', name: 'Pass Plus', desc: '6 hours after your test', price: byGearbox('£300', '£285') },
];

export const weeklyVsIntensive = [
  { label: 'Time to test', weekly: 'A few months', intensive: 'A few weeks' },
  { label: 'Lesson pattern', weekly: '1–2 hours a week', intensive: 'Several hours a day' },
  { label: 'Best for', weekly: 'Steady learners, students, busy schedules', intensive: 'Deadlines, near test-ready, or retesting' },
  { label: 'Payment', weekly: 'Pay as you go or blocks', intensive: 'Upfront or deposit + balance' },
];
