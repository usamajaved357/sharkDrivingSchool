/**
 * /book form controller (components/enquiry/EnquiryWizard.astro): 3 steps, then thank-you.
 * State lives in the form controls; this module moves between steps, validates the current
 * step with the shared Zod schema (same rules as the API), keeps the summary in sync,
 * shows test details only when a test is booked, and submits to the API.
 */
import { AVAILABILITY_LABELS, BUSINESS, EnquiryRequestSchema, INTEREST_IDS, TRANSMISSIONS, type AvailabilityOption } from '@shark/shared';
import { ApiError, createEnquiry } from '@/lib/api-client';

type Step = 1 | 2 | 3;
const LAST: Step = 3;

/** Which fields belong to which step (for per-step validation). */
const STEP_FIELDS: Record<Step, string[]> = {
  1: ['transmission', 'interest'],
  2: ['availability', 'availabilityNotes', 'testBooked', 'testCentre', 'testDate', 'testTime', 'experience', 'instructorPref'],
  3: ['fullName', 'gender', 'phone', 'email', 'address', 'postcode', 'notes', 'agreeTerms'],
};

const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export function initEnquiryWizard(form: HTMLFormElement): void {
  const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = form) => root.querySelector<T>(sel);
  const card = form.closest<HTMLElement>('.bk__card') ?? form;
  const done = q<HTMLElement>('[data-enquiry-done]', card);
  const formError = q('[data-form-error]')!;
  const backBtn = q<HTMLButtonElement>('[data-back]')!;
  const nextBtn = q<HTMLButtonElement>('[data-next]')!;
  const testDetails = q('[data-test-details]')!;
  let step: Step = 1;

  const checked = (name: string) => q<HTMLInputElement>(`input[name="${name}"]:checked`);
  const setText = (key: string, text: string) => document.querySelectorAll(`[data-summary="${key}"]`).forEach((el) => (el.textContent = text));

  // ---------- prefill (/book?transmission=automatic&lesson=intensive&postcode=M14) ----------
  const params = new URLSearchParams(location.search);
  const t = params.get('transmission');
  if (t && (TRANSMISSIONS as readonly string[]).includes(t)) q<HTMLInputElement>(`input[name="transmission"][value="${t}"]`)!.checked = true;
  const lesson = params.get('lesson');
  if (lesson && (INTEREST_IDS as readonly string[]).includes(lesson)) q<HTMLInputElement>(`input[name="interest"][value="${lesson}"]`)!.checked = true;
  const pc = params.get('postcode');
  if (pc) q<HTMLInputElement>('input[name="postcode"]')!.value = pc;

  // ---------- summary ----------
  function updateSummary(): void {
    testDetails.hidden = checked('testBooked')?.value !== 'yes';
    const interest = checked('interest');
    setText('transmission', checked('transmission')?.dataset.label ?? '—');
    setText('lesson', interest?.dataset.label ?? '—');
    setText('price', interest?.dataset.price ?? '—');
    const days = [...form.querySelectorAll<HTMLInputElement>('input[name="availability"]:checked')].map(
      (i) => AVAILABILITY_LABELS[i.value as AvailabilityOption],
    );
    setText('availability', days.length ? days.join(', ') : q<HTMLInputElement>('[name="availabilityNotes"]')!.value.trim() || '—');
    const test = checked('testBooked')?.value;
    const date = q<HTMLInputElement>('[name="testDate"]')!.value;
    setText(
      'test',
      test === 'yes' ? (date ? `Booked · ${shortDate.format(new Date(`${date}T12:00:00Z`))}` : 'Booked') : test === 'no' ? 'Not booked yet' : '—',
    );
    const pref = checked('instructorPref');
    setText('instructor', pref ? (pref.value === 'any' ? 'No preference' : `${pref.nextElementSibling?.textContent ?? ''}`) : '—');
  }

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
    const target = first?.matches('fieldset') ? q<HTMLInputElement>('input', first) : first;
    target?.focus({ preventScroll: true });
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---------- validation ----------
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
      interest: fd.get('interest') ?? 'not-sure',
      notes: text('notes'),
      agreeTerms: fd.get('agreeTerms') === 'true',
    };
  }

  /** Errors for the given steps only (so step 1 doesn't complain about step 3). */
  function errorsFor(steps: Step[]): Record<string, string> {
    const parsed = EnquiryRequestSchema.safeParse(readPayload());
    if (parsed.success) return {};
    const wanted = new Set(steps.flatMap((s) => STEP_FIELDS[s]));
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (wanted.has(key)) fields[key] ??= issue.message;
    }
    return fields;
  }

  // ---------- steps ----------
  function goTo(next: Step, scroll = true): void {
    step = next;
    form.querySelectorAll<HTMLElement>('[data-step-panel]').forEach((p) => (p.hidden = Number(p.dataset.stepPanel) !== step));
    document.querySelectorAll<HTMLElement>('[data-step-indicator]').forEach((li) => {
      const n = Number(li.dataset.stepIndicator);
      li.classList.toggle('is-current', n === step);
      li.classList.toggle('is-done', n < step);
      if (n === step) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    backBtn.hidden = step === 1;
    nextBtn.textContent = step === LAST ? 'Send my details' : 'Continue';
    clearErrors();
    if (scroll) form.closest('.wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function submit(): Promise<void> {
    const parsed = EnquiryRequestSchema.safeParse(readPayload());
    if (!parsed.success) return;
    nextBtn.disabled = true;
    nextBtn.textContent = 'Sending…';
    try {
      const { reference } = await createEnquiry(parsed.data);
      showDone(parsed.data.fullName, reference, Boolean(parsed.data.email));
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        // Jump back to the earliest step with a problem.
        const first = ([1, 2, 3] as Step[]).find((s) => STEP_FIELDS[s].some((f) => err.fields![f]));
        if (first && first !== step) goTo(first);
        showErrors(err.fields);
      }
      formError.textContent = err instanceof ApiError ? err.message : `Something went wrong. Please call us on ${BUSINESS.phone.display}.`;
      formError.hidden = false;
      nextBtn.disabled = false;
      nextBtn.textContent = 'Send my details';
    }
  }

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
    document.querySelectorAll<HTMLElement>('[data-step-indicator]').forEach((li) => {
      li.classList.remove('is-current');
      li.classList.add('is-done');
    });
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    done.focus({ preventScroll: true });
  }

  // ---------- events ----------
  // Continue / Send (also triggered by Enter in a text field).
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    const errors = errorsFor([step]);
    if (Object.keys(errors).length) {
      showErrors(errors);
      return;
    }
    if (step === LAST) void submit();
    else goTo((step + 1) as Step);
  });

  backBtn.addEventListener('click', () => {
    if (step > 1) goTo((step - 1) as Step);
  });

  form.addEventListener('change', updateSummary);
  // Clear a field's error as soon as it's edited.
  form.addEventListener('input', (e) => {
    const name = (e.target as HTMLInputElement).name;
    if (!name) return;
    const slot = q(`[data-error-for="${name}"]`);
    if (slot) slot.textContent = '';
    fieldFor(name)?.removeAttribute('aria-invalid');
    if (name === 'availabilityNotes' || name === 'testDate') updateSummary();
  });

  // ---------- boot ----------
  goTo(1, false);
  updateSummary();
}
