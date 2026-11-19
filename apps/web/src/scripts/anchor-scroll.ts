/**
 * Same-page links (e.g. header "Areas" → /#areas) land each section neatly at the top.
 *
 * The header hides while scrolling down and shows while scrolling up
 * (scripts/header-autohide.ts), so the offset depends on direction:
 * - target below → header will be hidden → section lands flush at the top
 * - target above → header shows → section lands just below it
 * Also applies when arriving from another page with a #hash (e.g. /prices → /#areas).
 */
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initAnchorScroll(): void {
  const header = document.querySelector<HTMLElement>('.header:not(.header--minimal)');
  const headerH = () => header?.offsetHeight ?? 0;

  function goTo(id: string, smooth: boolean): boolean {
    const el = document.getElementById(id);
    if (!el) return false;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const down = top > window.scrollY + 1;
    // Keep the header in step with where the page is heading.
    header?.classList.toggle('is-hidden', down && top > headerH() * 2);
    window.scrollTo({ top: Math.max(0, down ? top : top - headerH()), behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
    return true;
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash.length < 2) return;
    const id = decodeURIComponent(url.hash.slice(1));
    if (!document.getElementById(id)) return; // e.g. price tabs handle their own hashes
    e.preventDefault();
    history.pushState(null, '', url.hash);
    goTo(id, true);
    if (id === 'main') document.getElementById('main')?.focus({ preventScroll: true });
  });

  // Arriving with a hash: wait for layout (fonts/images) so the position is right.
  if (location.hash.length > 1) {
    const id = decodeURIComponent(location.hash.slice(1));
    window.addEventListener('load', () => requestAnimationFrame(() => goTo(id, false)), { once: true });
  }
}
