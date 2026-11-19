/**
 * What the site actually shows for reviews, Google rating, stats, the "Another pass"
 * card and feature list.
 *
 * - Local dev (`npm run dev`) shows sample preview data (data/preview-data.ts).
 * - Production is launch-safe: anything still a [placeholder] is hidden (or swapped for
 *   facts that are already true) until the owner fills in real values in data/home.ts
 *   and config/site.ts. Real values appear automatically once filled in.
 */
import { mainNav, site, footerNav, type NavLink } from '@/config/site';
import { areas } from './areas';
import { features, latestPass, reviews, stats, type LatestPass, type Review, type Stat } from './home';
import { fromPrice } from './pricing';
import { previewLatestPass, previewRating, previewReviews, previewStats } from './preview-data';

const preview = import.meta.env.DEV;

/** True for owner placeholders like "[X.X]" or "[Student name]". */
const isPlaceholder = (s: string): boolean => /\[[^\]]*\]/.test(s);

/** Real reviews only (empty in production until the owner adds them). */
export const shownReviews: Review[] = preview
  ? previewReviews
  : reviews.filter((r) => !isPlaceholder(r.name) && !isPlaceholder(r.text) && !isPlaceholder(r.meta));

export const hasReviews = shownReviews.length > 0;

/** Google rating, or null while it's a placeholder (badge and top-bar rating are then hidden). */
export const shownRating: { rating: string; count: string } | null = preview
  ? previewRating
  : isPlaceholder(site.googleRating) || isPlaceholder(site.googleReviewCount)
    ? null
    : { rating: site.googleRating, count: site.googleReviewCount };

/** Facts that are already true, used while the real stats are placeholders. */
const factStats: Stat[] = [
  { value: `${areas.length}+`, label: 'Areas across Greater Manchester', tone: 'blue' },
  { value: fromPrice('single'), label: 'Lessons from, per hour', tone: 'blue' },
  { value: 'DVSA', label: 'Approved instructors', tone: 'blue' },
  { value: '2 in 1', label: 'Manual & automatic cars', tone: 'red' },
];

export const shownStats: Stat[] = preview ? previewStats : stats.some((s) => isPlaceholder(s.value)) ? factStats : stats;

/** "Another pass this week" card, or null while it's a placeholder. */
export const shownLatestPass: LatestPass | null = preview
  ? previewLatestPass
  : isPlaceholder(latestPass.name) || isPlaceholder(latestPass.centre)
    ? null
    : latestPass;

/** "Why Shark" features without any still-placeholder entries (e.g. languages). */
export const shownFeatures = preview ? features : features.filter((f) => !isPlaceholder(f.text));

/** Navigation without links to sections that are hidden (e.g. Reviews before real reviews exist). */
const visible = (l: NavLink) => hasReviews || l.href !== '/#reviews';
export const shownMainNav: NavLink[] = mainNav.filter(visible);
export const shownFooterNav = footerNav.map((col) => ({ ...col, links: col.links.filter(visible) }));
