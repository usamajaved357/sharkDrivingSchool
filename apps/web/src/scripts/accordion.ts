/**
 * Single-open accordion.
 * Markup: [data-accordion] > .acc-item > button[data-acc-trigger][aria-controls] + .acc-panel#id
 */
export function initAccordions(): void {
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((root) => {
    const items = [...root.querySelectorAll<HTMLElement>('.acc-item')];
    root.addEventListener('click', (e) => {
      const trigger = (e.target as Element).closest<HTMLButtonElement>('[data-acc-trigger]');
      if (!trigger) return;
      const item = trigger.closest<HTMLElement>('.acc-item');
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      for (const it of items) setOpen(it, it === item && willOpen);
    });
  });
}

function setOpen(item: HTMLElement, open: boolean): void {
  item.classList.toggle('is-open', open);
  item.querySelector('[data-acc-trigger]')?.setAttribute('aria-expanded', String(open));
  const panel = item.querySelector<HTMLElement>('.acc-panel');
  if (panel) panel.inert = !open;
}
