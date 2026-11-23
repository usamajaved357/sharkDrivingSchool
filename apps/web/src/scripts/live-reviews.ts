/**
 * Live Google reviews (components/home/Reviews.astro). When the reviews section comes near
 * the screen, asks our API (which asks Google; nothing is stored) for the current rating
 * and up to 5 reviews. Updates every [data-live-rating] / [data-live-count] on the page and
 * adds any review not already on the site as a quote card, newest first, with the author
 * and Google Maps links Google requires. If Google isn't set up or fails, nothing changes.
 */
import type { LiveReview } from '@shark/shared';
import { getLiveReviews } from '@/lib/api-client';
import { initReviewCards } from './review-cards';

/** "Monira Adam" and "monira adam" are the same reviewer. */
const key = (name: string | undefined) => (name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

function buildCard(template: HTMLTemplateElement, r: LiveReview): HTMLElement {
  const li = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const stars = '★'.repeat(Math.min(5, Math.max(1, r.rating)));
  li.dataset.name = r.author;
  li.dataset.stars = stars;
  li.dataset.date = r.relativeTime;
  li.dataset.live = 'true';

  const set = (sel: string, fn: (el: HTMLElement) => void) => li.querySelectorAll<HTMLElement>(sel).forEach(fn);
  set('[data-review-text]', (el) => (el.textContent = r.text));
  set('.sc__stars', (el) => {
    el.textContent = stars;
    el.setAttribute('aria-label', `${r.rating} out of 5 stars`);
  });
  set('.sc__date', (el) => (el.textContent = r.relativeTime));
  set('.sc__initial', (el) => (el.textContent = r.author.charAt(0).toUpperCase()));
  set('[data-review-author]', (el) => {
    el.textContent = r.author;
    if (r.authorUrl) el.setAttribute('href', r.authorUrl);
  });
  set('[data-review-maps]', (el) => {
    if (r.mapsUrl) el.setAttribute('href', r.mapsUrl);
  });
  set('[data-review-photo]', (el) => {
    if (r.authorPhoto) (el as HTMLImageElement).src = r.authorPhoto;
    else el.remove();
  });
  return li;
}

export function initLiveReviews(): void {
  const section = document.getElementById('reviews');
  const track = section?.querySelector<HTMLElement>('[data-carousel-track]');
  const template = section?.querySelector<HTMLTemplateElement>('template[data-live-review-template]');
  if (!section || !track || !template) return;

  const run = async () => {
    let data;
    try {
      data = await getLiveReviews();
    } catch {
      return; // Google unavailable or daily limit reached: keep the reviews already on the page.
    }
    if (!data) return;

    if (data.rating > 0) document.querySelectorAll('[data-live-rating]').forEach((el) => (el.textContent = data.rating.toFixed(1)));
    if (data.count > 0) document.querySelectorAll('[data-live-count]').forEach((el) => (el.textContent = String(data.count)));

    const known = new Set([...track.querySelectorAll<HTMLElement>('[data-review]')].map((li) => key(li.dataset.name)));
    const fresh = data.reviews.filter((r) => !known.has(key(r.author))).sort((a, b) => b.publishTime.localeCompare(a.publishTime));
    if (!fresh.length) return;

    // Newest first, after the pass-photo cards and before the older written reviews.
    const firstQuote = track.querySelector('.sc--quote');
    for (const r of fresh) track.insertBefore(buildCard(template, r), firstQuote);
    section.querySelector<HTMLElement>('[data-live-note]')?.removeAttribute('hidden');
    initReviewCards();
    window.dispatchEvent(new Event('resize')); // refresh the carousel arrows
  };

  // Only ask Google when someone actually gets near the reviews (keeps usage in the free tier).
  const near = () => section.getBoundingClientRect().top < window.innerHeight + 800;
  if (!('IntersectionObserver' in window) || near()) {
    void run();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      void run();
    },
    { rootMargin: '800px 0px' },
  );
  io.observe(section);
}
