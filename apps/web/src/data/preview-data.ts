/**
 * LOCAL PREVIEW ONLY. Sample reviews, rating and stats so the home page looks finished
 * while running `npm run dev`. These are not real students or real figures and must never
 * be published: `data/shown-content.ts` only uses them in dev, so production builds never
 * include them.
 *
 * Before launch, put the real figures in `data/home.ts` (`stats`, `reviews`) and
 * `config/site.ts` (`googleRating`, `googleReviewCount`).
 */
import type { LatestPass, Review, Stat } from './home';

export const previewRating = { rating: '4.9', count: '120+' };

export const previewLatestPass: LatestPass = { name: 'Daniel H.', centre: 'Manchester (Cheetham Hill) test centre' };

export const previewStats: Stat[] = [
  { value: '78%', label: 'First-time pass rate', tone: 'blue' },
  { value: '1,200+', label: 'Learners on the road', tone: 'blue' },
  { value: `${previewRating.rating}★`, label: 'Average Google rating', tone: 'blue' },
  { value: '2 in 1', label: 'Manual & automatic cars', tone: 'red' },
];

export const previewReviews: Review[] = [
  {
    text: 'I was so nervous before my first lesson, but my instructor was calm and patient from day one. Every lesson had a clear plan and I passed first time with only three minors.',
    name: 'Aisha K.',
    meta: 'Passed first time · Oct 2026',
    initial: 'A',
    color: 'var(--red)',
  },
  {
    text: 'Switched to automatic after struggling with the clutch elsewhere. Lessons fitted around my shifts, pick-ups were always on time and I was test-ready in a few months.',
    name: 'Callum R.',
    meta: 'Automatic · Sep 2026',
    initial: 'C',
    color: 'var(--blue)',
  },
  {
    text: 'The intensive course was exactly what I needed before starting a new job. Mock tests on the local routes made the real test feel familiar. Great value and really professional.',
    name: 'Priya S.',
    meta: 'Intensive course · Aug 2026',
    initial: 'P',
    color: 'var(--navy)',
  },
];
