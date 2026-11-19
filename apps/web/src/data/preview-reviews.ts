/**
 * LOCAL PREVIEW ONLY. Sample reviews and rating so the Reviews section looks finished
 * while running `npm run dev`. These are not real students and must never be published:
 * `data/review-content.ts` only uses them in dev, so production builds never include them.
 *
 * Replace `reviews` in `data/home.ts` and the rating in `config/site.ts` with real
 * Google data before launch.
 */
import type { Review } from './home';

export const previewRating = { rating: '4.9', count: '120+' };

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
