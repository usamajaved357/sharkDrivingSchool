/**
 * The reviews, Google rating and stats the site shows.
 * Local dev (`npm run dev`) uses sample preview data; production builds always use
 * the real data in `data/home.ts` and `config/site.ts`.
 */
import { site } from '@/config/site';
import { reviews, stats, type Review, type Stat } from './home';
import { previewRating, previewReviews, previewStats } from './preview-data';

const preview = import.meta.env.DEV;

export const shownReviews: Review[] = preview ? previewReviews : reviews;

export const shownStats: Stat[] = preview ? previewStats : stats;

export const shownRating: { rating: string; count: string } = preview
  ? previewRating
  : { rating: site.googleRating, count: site.googleReviewCount };
