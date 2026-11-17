/**
 * Segmented toggles ([data-segmented="<group>"] > .seg[data-value]).
 *
 * - Sets aria-pressed on click.
 * - Updates any element with data-bind-group="<group>" using its
 *   data-text-<value> attribute (e.g. data-text-manual / data-text-automatic).
 * - Dispatches a bubbling `segmented:change` CustomEvent({ group, value }).
 */
export const SEGMENTED_EVENT = 'segmented:change';

export interface SegmentedChangeDetail {
  group: string;
  value: string;
}

let initialised = false;

export function initSegmented(): void {
  if (initialised) return;
  initialised = true;
  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-segmented] .seg');
    const root = btn?.closest<HTMLElement>('[data-segmented]');
    if (btn?.dataset.value && root) setSegmented(root, btn.dataset.value);
  });
}

export function setSegmented(root: HTMLElement, value: string): void {
  const group = root.dataset.segmented ?? '';
  root.querySelectorAll<HTMLButtonElement>('.seg').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.value === value));
  });
  document.querySelectorAll<HTMLElement>(`[data-bind-group="${group}"]`).forEach((el) => {
    const text = el.getAttribute(`data-text-${value}`);
    if (text !== null) el.textContent = text;
  });
  root.dispatchEvent(
    new CustomEvent<SegmentedChangeDetail>(SEGMENTED_EVENT, { bubbles: true, detail: { group, value } }),
  );
}

export function getSegmentedValue(group: string): string | undefined {
  return document.querySelector<HTMLButtonElement>(`[data-segmented="${group}"] .seg[aria-pressed="true"]`)?.dataset
    .value;
}
