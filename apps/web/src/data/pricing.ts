import type { LessonTypeId } from '@shark/shared';

/**
 * Lesson prices for Greater Manchester.
 *
 * A price is either one string (same for both gearboxes) or a { manual, automatic } pair.
 * Pairs are rendered by `components/ui/GearboxText.astro` and switch with the
 * Manual/Automatic toggle.
 *
 * Nov 2026: at the owner's request, every price matches a local competitor's published
 * price list (astradrivingschool.com/pricing and /our-packages, read 20 Nov 2026), with the
 * same price for manual and automatic, as they do: £35/hr pay as you go, blocks from
 * £33.33/hr down to £30/hr, intensives at £35/hr, refreshers £37/hr, Pass Plus £250.
 * The competitor lists no test-day car hire price, so it isn't listed here (quote on request).
 */

export interface GearboxPrice {
  manual: string;
  automatic: string;
}

/** A price that is the same for both gearboxes, or differs per gearbox. */
export type Price = string | GearboxPrice;

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
  { name: 'Single lesson', sub: '1 hour · pay as you go', price: '£35', unit: '/hr', features: ['Try us out first', 'Free pick-up & drop-off', 'Top up anytime'] },
  {
    name: '10-hour block',
    sub: 'Our best seller',
    price: '£330',
    unit: 'total',
    popular: true,
    badge: 'MOST POPULAR',
    features: ['Save £20 vs single lessons', 'Same instructor every time', 'Progress report each lesson', 'Spread payments'],
  },
  { name: 'Intensive course', sub: '10 hours · about 1 week', price: '£350', unit: 'total', features: ['Daily lessons', 'Mock tests included', 'Test booking support'] },
  { name: 'Pass Plus', sub: '6 hours · after your test', price: '£250', unit: 'total', features: ['Motorway & night driving', 'Rural roads', 'May lower insurance'] },
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
      { name: 'Single lesson', desc: 'One hour, door-to-door pick-up', hours: '1 hour', price: '£35', per: 'per lesson' },
      { name: '1.5-hour lesson', desc: 'More time to build each skill', hours: '1.5 hours', price: '£53', per: 'per lesson' },
      { name: 'Double lesson', desc: 'Two hours, ideal for test routes', hours: '2 hours', price: '£70', per: 'per lesson' },
    ],
  },
  {
    id: 'blocks',
    label: 'Block bookings',
    intro: 'Book hours together and save. Same instructor throughout.',
    rows: [
      { name: '6-hour starter pack', desc: 'A solid start or top-up', hours: '6 hours', price: '£200', per: '£33.33/hr' },
      { name: '10-hour block', desc: 'Our best seller · save £20', hours: '10 hours', price: '£330', per: '£33/hr', best: true },
      { name: '15-hour block', desc: 'Steady weekly progress', hours: '15 hours', price: '£480', per: '£32/hr' },
      { name: '20-hour block', desc: 'Most beginners start here', hours: '20 hours', price: '£640', per: '£32/hr' },
      { name: '30-hour block', desc: 'Build real confidence', hours: '30 hours', price: '£930', per: '£31/hr' },
      { name: '40-hour block', desc: 'Complete beginners · best value', hours: '40 hours', price: '£1,200', per: '£30/hr' },
    ],
  },
  {
    id: 'intensive',
    label: 'Intensive courses',
    intro: 'Concentrated lessons to get you test-ready in weeks.',
    rows: [
      { name: '10-hour fast track', desc: 'Nearly test-ready or retesting', hours: '10 hours · ~1 week', price: '£350', per: 'total' },
      { name: '15-hour fast track', desc: 'Some experience already', hours: '15 hours · 1–2 weeks', price: '£525', per: 'total' },
      { name: '20-hour intensive', desc: 'A few lessons behind you', hours: '20 hours · 2–3 weeks', price: '£700', per: 'total', best: true },
      { name: '30-hour intensive', desc: 'Limited experience', hours: '30 hours · 4–5 weeks', price: '£1,050', per: 'total' },
      { name: '40-hour beginner course', desc: 'Complete beginners', hours: '40 hours · 6–7 weeks', price: '£1,400', per: 'total' },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    intro: 'Before your test, after your pass, or back behind the wheel.',
    rows: [
      { name: 'Pass Plus', desc: 'Motorway, night, rural and dual carriageways', hours: '6 hours', price: '£250', per: 'total' },
      { name: 'Mock test lesson', desc: 'Full test conditions with a debrief', hours: '2.5 hours', price: '£87.50', per: 'per lesson' },
      { name: 'Refresher lesson', desc: 'For returning or nervous drivers', hours: '1 hour', price: '£37', per: 'per hour' },
      { name: '5-hour refresher course', desc: 'Confidence back in 1–2 weeks', hours: '5 hours', price: '£185', per: '£37/hr' },
      { name: '10-hour refresher course', desc: 'Our most complete refresher', hours: '10 hours', price: '£370', per: '£37/hr' },
    ],
  },
];

/** Cheapest price for a bookable lesson across both gearboxes (e.g. "£35"), for copy and SEO. */
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
  { id: 'single', name: 'Single lesson', desc: '1 hour · pay as you go', price: '£35' },
  { id: 'block-10', name: '10-hour block', desc: 'Best seller · save £20', price: '£330' },
  { id: 'intensive', name: 'Intensive course', desc: 'From 10 hours · test-ready in weeks', price: '£350' },
  { id: 'pass-plus', name: 'Pass Plus', desc: '6 hours after your test', price: '£250' },
];

export const weeklyVsIntensive = [
  { label: 'Time to test', weekly: 'A few months', intensive: 'A few weeks' },
  { label: 'Lesson pattern', weekly: '1–2 hours a week', intensive: 'Several hours a day' },
  { label: 'Best for', weekly: 'Steady learners, students, busy schedules', intensive: 'Deadlines, near test-ready, or retesting' },
  { label: 'Payment', weekly: 'Pay as you go or blocks', intensive: 'Upfront or deposit + balance' },
];
