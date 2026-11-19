/**
 * Hides the sticky header while scrolling down and brings it back on scroll up.
 * Adds `.is-hidden` to the header; the slide itself is CSS (SiteHeader.astro).
 *
 * The header always stays visible near the top of the page, while the mobile menu
 * is open, and while something inside it has keyboard focus.
 */
const MIN_DELTA = 8; // px of scroll needed before toggling, so small jitters don't flicker it

export function initHeaderAutohide(header: HTMLElement): void {
  let lastY = window.scrollY;
  let ticking = false;

  const menuOpen = () => header.querySelector('.header__menu')?.getAttribute('aria-expanded') === 'true';

  const update = () => {
    ticking = false;
    const y = Math.max(window.scrollY, 0);
    const delta = y - lastY;
    if (Math.abs(delta) < MIN_DELTA) return;

    const nearTop = y < header.offsetHeight * 2;
    const keyboardFocus = header.querySelector(':focus-visible') !== null;
    const hide = delta > 0 && !nearTop && !menuOpen() && !keyboardFocus;
    header.classList.toggle('is-hidden', hide);
    lastY = y;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );

  // Tabbing into the header should always reveal it (mouse clicks don't count).
  header.addEventListener('focusin', () => {
    if (header.querySelector(':focus-visible')) header.classList.remove('is-hidden');
  });
}
