import type { IconName } from '@/components/ui/icons';

export interface Stat {
  value: string;
  label: string;
  tone: 'blue' | 'red';
}

/**
 * Stats band. [Placeholders] must be replaced with real figures before launch.
 * Local dev shows sample figures instead (data/preview-data.ts); production uses these.
 */
export const stats: Stat[] = [
  { value: '[XX]%', label: 'First-time pass rate', tone: 'blue' },
  { value: '[X,XXX]+', label: 'Learners on the road', tone: 'blue' },
  { value: '[X.X]★', label: 'Average Google rating', tone: 'blue' },
  { value: '2 in 1', label: 'Manual & automatic cars', tone: 'red' },
];

export const heroTrust: { icon: IconName; label: string }[] = [
  { icon: 'shield-check', label: 'DVSA-approved' },
  { icon: 'clock', label: 'Early, late & weekend slots' },
  { icon: 'map-pin', label: 'Home, work or college pick-up' },
];

export const steps = [
  { n: '01', title: 'Book online or call', text: 'Pick manual or automatic, your area and a time that suits you.', tone: 'red' },
  { n: '02', title: 'Meet your instructor', text: 'We pick you up and assess where you are, then map out your plan.', tone: 'navy' },
  { n: '03', title: 'Learn & track progress', text: 'Structured lessons against the DVSA syllabus, with progress notes after each.', tone: 'navy' },
  { n: '04', title: 'Pass your test', text: 'Mock tests on local routes, then use our car on the big day.', tone: 'blue' },
] as const;

export const features: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'Dual-control cars', text: 'Modern, insured and spotless.' },
  { icon: 'user', title: 'Male & female instructors', text: 'Choose who you feel comfortable with.' },
  { icon: 'calendar', title: 'Flexible scheduling', text: 'Evenings and weekends available.' },
  { icon: 'chart', title: 'Progress tracking', text: 'See your skills improve lesson by lesson.' },
  { icon: 'book', title: 'Theory test support', text: 'Tips and resources to pass first time.' },
  { icon: 'chat', title: 'Multilingual instructors', text: '[Languages, e.g. English, Urdu]' },
];

export interface Review {
  text: string;
  name: string;
  meta: string;
  initial: string;
  color: string;
}

/**
 * Placeholder reviews. TODO: replace with real Google reviews
 * (or load them from the Google Places API — see docs/ROADMAP.md).
 * Local dev shows sample reviews instead (data/preview-data.ts); production uses these.
 */
export const reviews: Review[] = [
  {
    text: '[Real Google review from a student — pulled automatically from your Google Business profile.]',
    name: '[Student name]',
    meta: 'Passed first time · [Month 2026]',
    initial: 'A',
    color: 'var(--red)',
  },
  {
    text: '[Real Google review — highlight patient instructors, nerves, or a fast-track pass story.]',
    name: '[Student name]',
    meta: 'Automatic · [Month 2026]',
    initial: 'B',
    color: 'var(--blue)',
  },
  {
    text: '[Real Google review — highlight flexible times, pick-ups or value for money.]',
    name: '[Student name]',
    meta: 'Intensive course · [Month 2026]',
    initial: 'C',
    color: 'var(--navy)',
  },
];
