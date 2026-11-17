import type { LessonTypeId } from '@shark/shared';

/**
 * ALL prices are placeholders ([XX]) until the owner confirms rates.
 * Manual and automatic currently share prices; if they differ, add
 * `priceAuto` fields and render them via data-auto-text (see PricingPreview.astro).
 */

export interface PackageCard {
  name: string;
  sub: string;
  price: string;
  unit: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

/** Home page "Simple pricing" cards. */
export const homePackages: PackageCard[] = [
  { name: 'Single lesson', sub: '1 hour · pay as you go', price: '£[XX]', unit: '/hr', features: ['Try us out first', 'Free pick-up & drop-off', 'Top up anytime'] },
  {
    name: '10-hour block',
    sub: 'Our best value',
    price: '£[XXX]',
    unit: 'total',
    popular: true,
    badge: 'MOST POPULAR',
    features: ['Save £[XX] vs single lessons', 'Same instructor every time', 'Progress report each lesson', 'Spread payments'],
  },
  { name: 'Intensive course', sub: '[XX] hours · test in weeks', price: '£[XXX]', unit: 'total', features: ['Daily lessons', 'Mock tests included', 'Test booking support'] },
  { name: 'Pass Plus', sub: '6 hours · after your test', price: '£[XXX]', unit: 'total', features: ['Motorway & night driving', 'Rural roads', 'May lower insurance'] },
];

export interface PriceRow {
  name: string;
  desc: string;
  hours: string;
  price: string;
  per: string;
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
      { name: 'Single lesson', desc: 'One hour, door-to-door pick-up', hours: '1 hour', price: '£[XX]', per: 'per lesson' },
      { name: 'Double lesson', desc: 'Two hours, ideal for test routes', hours: '2 hours', price: '£[XX]', per: 'per lesson' },
      { name: 'Assessment lesson', desc: 'Find your level and get a plan', hours: '1 hour', price: '£[XX]', per: 'one-off' },
    ],
  },
  {
    id: 'blocks',
    label: 'Block bookings',
    intro: 'Book hours together and save. Same instructor throughout.',
    rows: [
      { name: '5-hour block', desc: 'A solid start or top-up', hours: '5 hours', price: '£[XXX]', per: '£[XX]/hr' },
      { name: '10-hour block', desc: 'Our most popular option', hours: '10 hours', price: '£[XXX]', per: '£[XX]/hr', best: true },
      { name: '20-hour block', desc: 'Most beginners start here', hours: '20 hours', price: '£[XXX]', per: '£[XX]/hr' },
    ],
  },
  {
    id: 'intensive',
    label: 'Intensive courses',
    intro: 'Concentrated lessons to get you test-ready in weeks.',
    rows: [
      { name: '10-hour fast track', desc: 'Nearly test-ready or retesting', hours: '10 hours · ~1 week', price: '£[XXX]', per: 'total' },
      { name: '20-hour intensive', desc: 'Some experience already', hours: '20 hours · ~2 weeks', price: '£[XXX]', per: 'total', best: true },
      { name: '30-hour intensive', desc: 'Limited experience', hours: '30 hours · ~3 weeks', price: '£[XXX]', per: 'total' },
      { name: '40-hour intensive', desc: 'Complete beginners', hours: '40 hours · ~4 weeks', price: '£[XXX]', per: 'total' },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    intro: 'After your pass, or before your test day.',
    rows: [
      { name: 'Pass Plus', desc: 'Motorway, night, rural and dual carriageways', hours: '6 hours', price: '£[XXX]', per: 'total' },
      { name: 'Mock test', desc: 'Full test conditions with written debrief', hours: '1 hour', price: '£[XX]', per: 'per test' },
      { name: 'Test-day car hire', desc: 'Warm-up lesson plus use of our car', hours: '2 hours', price: '£[XX]', per: 'per test' },
      { name: 'Refresher lessons', desc: 'For returning or nervous drivers', hours: 'Flexible', price: '£[XX]', per: 'per hour' },
    ],
  },
];

/** Options in the booking wizard — ids must match LESSON_TYPE_IDS in @shark/shared. */
export const bookableLessons: { id: LessonTypeId; name: string; desc: string; price: string }[] = [
  { id: 'single', name: 'Single lesson', desc: '1 hour · pay as you go', price: '£[XX]' },
  { id: 'block-10', name: '10-hour block', desc: 'Best value · same instructor', price: '£[XXX]' },
  { id: 'intensive', name: 'Intensive course', desc: 'Test-ready in weeks', price: '£[XXX]' },
  { id: 'pass-plus', name: 'Pass Plus', desc: '6 hours after your test', price: '£[XXX]' },
];

export const weeklyVsIntensive = [
  { label: 'Time to test', weekly: 'A few months', intensive: 'A few weeks' },
  { label: 'Lesson pattern', weekly: '1–2 hours a week', intensive: 'Several hours a day' },
  { label: 'Best for', weekly: 'Steady learners, students, busy schedules', intensive: 'Deadlines, near test-ready, or retesting' },
  { label: 'Payment', weekly: 'Pay as you go or blocks', intensive: 'Upfront or deposit + balance' },
];
