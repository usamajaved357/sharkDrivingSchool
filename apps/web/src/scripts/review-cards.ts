/**
 * Review cards ([data-review], e.g. reviews/StoryCard.astro):
 * - "Read full review" shows only on reviews whose text is cut off, and opens the review
 *   in full in the pop-up (reviews/ReviewDialog.astro)
 * - a reviewer's Google photo that fails to load is removed, leaving their initial
 */
export function initReviewCards(): void {
  const cards = document.querySelectorAll<HTMLElement>('[data-review]');
  const dialog = document.querySelector<HTMLDialogElement>('[data-review-dialog]');
  let opener: HTMLElement | null = null;

  const showMoreButtons = () =>
    cards.forEach((card) => {
      const text = card.querySelector<HTMLElement>('[data-review-text]');
      const more = card.querySelector<HTMLButtonElement>('[data-review-more]');
      if (text && more) more.hidden = text.scrollHeight <= text.clientHeight + 2;
    });

  const open = (card: HTMLElement, trigger: HTMLElement) => {
    if (!dialog) return;
    const set = (sel: string, value: string) => {
      const el = dialog.querySelector<HTMLElement>(sel);
      if (el) el.textContent = value;
    };
    set('[data-rd-name]', card.dataset.name ?? '');
    set('[data-rd-stars]', card.dataset.stars ?? '');
    set('[data-rd-date]', card.dataset.date ?? '');
    set('[data-rd-text]', card.querySelector('[data-review-text]')?.textContent?.trim() ?? '');
    const img = dialog.querySelector<HTMLImageElement>('[data-rd-img]');
    if (img) {
      img.hidden = !card.dataset.img;
      if (card.dataset.img) {
        img.src = card.dataset.img;
        img.alt = card.dataset.imgAlt ?? '';
      }
    }
    opener = trigger;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('.rd__body')?.scrollTo(0, 0);
  };

  cards.forEach((card) => {
    if (card.dataset.reviewReady) return;
    card.dataset.reviewReady = 'true';
    card.querySelector<HTMLButtonElement>('[data-review-more]')?.addEventListener('click', (e) => {
      open(card, e.currentTarget as HTMLElement);
    });
    card.querySelectorAll<HTMLImageElement>('[data-review-photo]').forEach((img) => {
      const drop = () => img.remove();
      if (img.complete && img.naturalWidth === 0 && img.src) drop();
      else img.addEventListener('error', drop, { once: true });
    });
  });

  if (dialog && !dialog.dataset.ready) {
    dialog.dataset.ready = 'true';
    dialog.querySelector('[data-review-close]')?.addEventListener('click', () => dialog.close());
    // Click on the dimmed backdrop closes it.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => opener?.focus());
  }

  showMoreButtons();
  window.addEventListener('resize', showMoreButtons);
  document.fonts?.ready.then(showMoreButtons);
}
