/**
 * Floating WhatsApp button ([data-wa-fab]): hides while the site footer is on screen,
 * so it never covers the footer links (which include their own WhatsApp link).
 */
export function initWhatsappFab(): void {
  const fab = document.querySelector<HTMLElement>('[data-wa-fab]');
  const footer = document.querySelector<HTMLElement>('.footer');
  if (!fab || !footer || !('IntersectionObserver' in window)) return;

  new IntersectionObserver(([entry]) => {
    fab.classList.toggle('is-hidden', Boolean(entry?.isIntersecting));
  }).observe(footer);
}
