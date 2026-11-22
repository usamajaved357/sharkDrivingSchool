/**
 * LOCAL PREVIEW ONLY. Sample stats and "latest pass" card so the home page looks finished
 * while running `npm run dev`. These are not real figures and must never be published:
 * `data/shown-content.ts` only uses them in dev, so production builds never include them.
 * (Reviews and the Google rating are real: data/reviews.ts and config/site.ts.)
 *
 * Before launch, put the real figures in `data/home.ts` (`stats`, `latestPass`).
 */
import { site } from '@/config/site';
import type { LatestPass, Stat } from './home';

export const previewLatestPass: LatestPass = { name: 'Daniel H.', centre: 'Manchester (Cheetham Hill) test centre' };

export const previewStats: Stat[] = [
  { value: '78%', label: 'First-time pass rate', tone: 'blue' },
  { value: '1,200+', label: 'Learners on the road', tone: 'blue' },
  { value: `${site.googleRating}★`, label: 'Average Google rating', tone: 'blue' },
  { value: '2 in 1', label: 'Manual & automatic cars', tone: 'red' },
];
