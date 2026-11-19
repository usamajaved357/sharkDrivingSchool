/**
 * The reviews and Google rating the site shows.
 * Local dev (`npm run dev`) uses sample preview data; production builds always use
 * the real data in `data/home.ts` and `config/site.ts`.
 */
import { site } from '@/config/site';
import { reviews, type Review } from './home';
import { previewRating, previewReviews } from './preview-reviews';

const preview = import.meta.env.DEV;

export const shownReviews: Review[] = preview ? previewReviews : reviews;

export const shownRating: { rating: string; count: string } = preview
  ? previewRating
  : { rating: site.googleRating, count: site.googleReviewCount };
