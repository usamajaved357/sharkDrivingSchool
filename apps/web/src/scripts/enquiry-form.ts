/**
 * Enquiry form controller (components/enquiry/EnquiryForm.astro).
 * Prefills from the URL, shows the test details only when a test is booked, validates
 * with the shared Zod schema (same rules as the API), submits, then shows the thank-you panel.
 */
import { BUSINESS, EnquiryRequestSchema, INTEREST_IDS, TRANSMISSIONS } from '@shark/shared';
import { ApiError, createEnquiry } from '@/lib/api-client';

export function initEnquiryForm(form: HTMLFormElement): void {
  const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => root.querySelector<T>(sel);
  const card = form.closest<HTMLElement>('.eq__card') ?? form;
  const done = q<HTMLElement>('[data-enquiry-done]', card);
  const formError = q('[data-form-error]')!;
  const submit = q<HTMLButtonElement>('[data-submit]')!;
  const testDetails = q('[data-test-details]')!;

  // ---------- prefill (/book?transmission=automatic&lesson=intensive&postcode=M14) ----------
  const params = new URLSearchParams(location.search);
  const t = params.get('transmission');
  if (t && (TRANSMISSIONS as readonly string[]).includes(t)) q<HTMLInputElement>(`input[name="transmission"][value="${t}"]`)!.checked = true;
  const lesson = params.get('lesson');
  if (lesson && (INTEREST_IDS as readonly string[]).includes(lesson)) q<HTMLSelectElement>('select[name="interest"]')!.value = lesson;
  const pc = params.get('postcode');
  if (pc) q<HTMLInputElement>('input[name="postcode"]')!.value = pc;

  // ---------- test details only when a test is booked ----------
  const syncTest = () => {
    testDetails.hidden = q<HTMLInputElement>('input[name="testBooked"]:checked')?.value !== 'yes';
  };
  form.addEventListener('change', (e) => {
    if ((e.target as HTMLInputElement).name === 'testBooked') syncTest();
  });
  syncTest();

  // ---------- errors ----------
  const fieldFor = (name: string) => q<HTMLElement>(`[data-choice="${name}"]`) ?? q<HTMLElement>(`[name="${name}"]`);

  function clearErrors(): void {
    form.querySelectorAll('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    formError.hidden = true;
  }

  function showErrors(fields: Record<string, string>): void {
    let first: HTMLElement | null = null;
    for (const [name, msg] of Object.entries(fields)) {
      const slot = q(`[data-error-for="${name}"]`);
      if (!slot) continue;
      slot.textContent = msg;
      const field = fieldFor(name);
      field?.setAttribute('aria-invalid', 'true');
      first ??= field;
    }
    const focusable = first?.matches('fieldset') ? q<HTMLInputElement>('input', first) : first;
    focusable?.focus();
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Clear a field's error as soon as it's changed.
  form.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    if (!name) return;
    q(`[data-error-for="${name}"]`)!.textContent = '';
    fieldFor(name)?.removeAttribute('aria-invalid');
  });

  // ---------- submit ----------
  function readPayload(): Record<string, unknown> {
    const fd = new FormData(form);
    const text = (k: string) => String(fd.get(k) ?? '');
    return {
      fullName: text('fullName'),
      gender: fd.get('gender') ?? undefined,
      phone: text('phone'),
      email: text('email'),
      address: text('address'),
      postcode: text('postcode'),
      transmission: fd.get('transmission') ?? undefined,
      experience: fd.get('experience') ?? undefined,
      testBooked: fd.get('testBooked') ?? undefined,
      testCentre: text('testCentre'),
      testDate: text('testDate'),
      testTime: text('testTime'),
      availability: fd.getAll('availability').map(String),
      availabilityNotes: text('availabilityNotes'),
      instructorPref: fd.get('instructorPref') ?? undefined,
      interest: text('interest') || 'not-sure',
      notes: text('notes'),
      agreeTerms: fd.get('agreeTerms') === 'true',
    };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    const parsed = EnquiryRequestSchema.safeParse(readPayload());
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message;
      showErrors(fields);
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const { reference } = await createEnquiry(parsed.data);
      showDone(parsed.data.fullName, reference, Boolean(parsed.data.email));
    } catch (err) {
      if (err instanceof ApiError && err.fields) showErrors(err.fields);
      formError.textContent =
        err instanceof ApiError ? err.message : `Something went wrong. Please call us on ${BUSINESS.phone.display}.`;
      formError.hidden = false;
      submit.disabled = false;
      submit.textContent = 'Send my details';
    }
  });

  function showDone(fullName: string, reference: string, emailed: boolean): void {
    if (!done) return;
    const first = fullName.trim().split(/\s+/)[0] ?? '';
    q('[data-done-name]', done)!.textContent = first ? `, ${first}` : '';
    q('[data-done-ref]', done)!.textContent = reference;
    q('[data-done-email]', done)!.hidden = !emailed;
    q<HTMLAnchorElement>('[data-done-whatsapp]', done)!.href =
      `https://wa.me/${BUSINESS.phone.whatsapp}?text=${encodeURIComponent(`Hi, it's ${fullName} (${reference}). I've just sent my details on your website.`)}`;
    form.hidden = true;
    done.hidden = false;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    done.focus({ preventScroll: true });
  }
}
