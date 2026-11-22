/**
 * Review cards ([data-review], e.g. reviews/StoryCard.astro):
 * - "Read more" appears only on reviews whose text is cut off, and expands them
 * - a reviewer's Google photo that fails to load is removed, leaving their initial
 */
export function initReviewCards(): void {
  const cards = document.querySelectorAll<HTMLElement>('[data-review]');

  const showMoreButtons = () =>
    cards.forEach((card) => {
      const text = card.querySelector<HTMLElement>('[data-review-text]');
      const more = card.querySelector<HTMLButtonElement>('[data-review-more]');
      if (!text || !more || text.classList.contains('is-open')) return;
      more.hidden = text.scrollHeight <= text.clientHeight + 2;
    });

  cards.forEach((card) => {
    // Several sections call this; wire each card once.
    if (card.dataset.reviewReady) return;
    card.dataset.reviewReady = 'true';
    card.querySelector<HTMLButtonElement>('[data-review-more]')?.addEventListener('click', (e) => {
      const more = e.currentTarget as HTMLButtonElement;
      const text = card.querySelector<HTMLElement>('[data-review-text]');
      const open = !text?.classList.contains('is-open');
      text?.classList.toggle('is-open', open);
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? 'Show less' : more.dataset.label || 'Read more';
    });
    card.querySelectorAll<HTMLImageElement>('[data-review-photo]').forEach((img) => {
      const drop = () => img.remove();
      if (img.complete && img.naturalWidth === 0 && img.src) drop();
      else img.addEventListener('error', drop, { once: true });
    });
  });

  showMoreButtons();
  window.addEventListener('resize', showMoreButtons);
  document.fonts?.ready.then(showMoreButtons);
}
