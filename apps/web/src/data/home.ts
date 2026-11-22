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

/** Phrases on the navy tape that crosses the areas strip under the hero. */
export const tapePhrases = [
  'Manual & automatic',
  'DVSA-approved instructors',
  'Free pick-up & drop-off',
  'Early, late & weekend slots',
  'Mock tests on local routes',
  'Pass with bite',
] as const;

export const heroTrust: { icon: IconName; label: string }[] = [
  { icon: 'shield-check', label: 'DVSA-approved' },
  { icon: 'clock', label: 'Early, late & weekend slots' },
  { icon: 'map-pin', label: 'Home, work or college pick-up' },
];

export interface Step {
  n: string;
  title: string;
  text: string;
  tone: 'red' | 'navy' | 'blue';
  icon: IconName;
  /** Short label shown at the bottom of the step card. */
  tag: string;
}

/** "How it works" journey (HowItWorks.astro animates a car along these steps). */
export const steps: Step[] = [
  { n: '01', title: 'Book online or call', text: 'Pick manual or automatic, your area and a time that suits you.', tone: 'red', icon: 'calendar', tag: 'Online, phone or WhatsApp' },
  { n: '02', title: 'Meet your instructor', text: 'We pick you up and assess where you are, then map out your plan.', tone: 'navy', icon: 'user', tag: 'Free pick-up' },
  { n: '03', title: 'Learn & track progress', text: 'Structured lessons against the DVSA syllabus, with progress notes after each.', tone: 'navy', icon: 'chart', tag: 'DVSA syllabus' },
  { n: '04', title: 'Pass your test', text: 'Mock tests on local routes, then use our car on the big day.', tone: 'blue', icon: 'trophy', tag: 'Our car on test day' },
];

/**
 * "Why Shark" photo. Stock photo for now (free under the Unsplash License, no attribution required):
 * "Driving test instructor and student" by Bas Peperzak, https://unsplash.com/photos/tyhpK_QelPo
 * TODO(owner): swap for a real photo of a Shark instructor and branded car (put it in public/images/).
 */
export const whyPhoto = {
  /** Base image URL; widths are added for srcset in WhyShark.astro. */
  src: 'https://images.unsplash.com/photo-1630406144797-821be1f35d75',
  alt: 'Driving instructor with a clipboard talking a learner through a manoeuvre next to the car',
};

export interface LatestPass {
  name: string;
  centre: string;
}

/**
 * "Another pass this week" card on the photo. Replace with a real recent pass
 * (first name + initial, with the learner's permission). Local dev shows a sample (data/preview-data.ts).
 */
export const latestPass: LatestPass = { name: '[Learner name]', centre: '[Test centre]' };

export const features: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'Dual-control cars', text: 'Modern, insured and spotless.' },
  { icon: 'user', title: 'Male & female instructors', text: 'Choose who you feel comfortable with.' },
  { icon: 'calendar', title: 'Flexible scheduling', text: 'Evenings and weekends available.' },
  { icon: 'chart', title: 'Progress tracking', text: 'See your skills improve lesson by lesson.' },
  { icon: 'book', title: 'Theory test support', text: 'Tips and resources to pass first time.' },
  { icon: 'chat', title: 'Multilingual instructors', text: '[Languages, e.g. English, Urdu]' },
];
