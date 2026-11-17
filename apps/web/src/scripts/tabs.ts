/**
 * Accessible tabs with arrow-key support and URL-hash deep links (/prices#intensive).
 * Markup: [data-tabs] containing [role=tab][data-tab="id"] and [role=tabpanel][data-panel="id"].
 */
export function initTabs(): void {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];

    const select = (id: string, focus = false) => {
      for (const t of tabs) {
        const on = t.dataset.tab === id;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      }
      for (const p of panels) p.hidden = p.dataset.panel !== id;
    };

    root.addEventListener('click', (e) => {
      const tab = (e.target as Element).closest<HTMLButtonElement>('[role="tab"]');
      if (tab?.dataset.tab) {
        select(tab.dataset.tab);
        history.replaceState(null, '', `#${tab.dataset.tab}`);
      }
    });

    root.addEventListener('keydown', (e) => {
      const i = tabs.findIndex((t) => t === document.activeElement);
      if (i < 0 || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      if (next?.dataset.tab) select(next.dataset.tab, true);
    });

    const fromHash = location.hash.slice(1);
    if (fromHash && tabs.some((t) => t.dataset.tab === fromHash)) select(fromHash);
  });
}
