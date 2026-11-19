/**
 * Floating "Contact us" button ([data-fab]).
 * Toggles the options card, keeps aria-expanded / inert in sync,
 * and closes on Escape or a click outside.
 */
export function initContactFab(): void {
  const root = document.querySelector<HTMLElement>('[data-fab]');
  const toggle = root?.querySelector<HTMLButtonElement>('[data-fab-toggle]');
  const panel = root?.querySelector<HTMLElement>('[data-fab-panel]');
  if (!root || !toggle || !panel) return;

  const setOpen = (open: boolean, focusToggle = false) => {
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close contact options' : 'Contact us');
    panel.inert = !open;
    if (open) panel.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    else if (focusToggle) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) setOpen(false, true);
  });

  document.addEventListener('click', (e) => {
    if (root.classList.contains('is-open') && !root.contains(e.target as Node)) setOpen(false);
  });
}
