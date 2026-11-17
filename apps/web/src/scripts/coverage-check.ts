/**
 * Postcode coverage forms ([data-coverage-form]).
 * Checks the postcode against the API, then sends covered learners to /book with it prefilled.
 */
import { checkCoverage } from '@/lib/api-client';

export function initCoverageForms(): void {
  document.querySelectorAll<HTMLFormElement>('[data-coverage-form]').forEach((form) => {
    const input = form.querySelector<HTMLInputElement>('input[name="postcode"]');
    const result = form.parentElement?.querySelector<HTMLElement>('[data-coverage-result]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const postcode = input?.value.trim() ?? '';
      if (!postcode) {
        input?.focus();
        return;
      }
      const show = (msg: string) => {
        if (result) {
          result.textContent = msg;
          result.hidden = false;
        }
      };
      try {
        const { covered } = await checkCoverage(postcode);
        if (covered) {
          location.href = `/book?postcode=${encodeURIComponent(postcode)}`;
        } else {
          show("We don't cover that postcode yet — call us and we'll see what we can do.");
        }
      } catch {
        // API down: don't block the learner, just continue to booking.
        location.href = `/book?postcode=${encodeURIComponent(postcode)}`;
      }
    });
  });
}
