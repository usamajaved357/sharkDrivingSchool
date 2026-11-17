/**
 * Booking wizard controller.
 *
 * State lives in the form controls themselves (radios/inputs); this module only
 * moves between steps, renders days/slots, keeps the summary in sync,
 * validates with the shared Zod schema and submits to the API.
 */
import { BOOKING_WINDOW_DAYS, BookingRequestSchema, LESSON_TYPE_IDS, TIME_SLOTS, TRANSMISSIONS } from '@shark/shared';
import { ApiError, createBooking, getAvailability } from '@/lib/api-client';

type Step = 1 | 2 | 3 | 4;
const LAST_INPUT_STEP = 3;
const TZ = 'Europe/London';

const isoFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }); // YYYY-MM-DD
const dowFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short' });
const dayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric' });
const labelFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' });

export function initBookingWizard(form: HTMLFormElement): void {
  const q = <T extends Element = HTMLElement>(sel: string) => form.querySelector<T>(sel);
  const qa = <T extends Element = HTMLElement>(sel: string) => [...document.querySelectorAll<T>(sel)];

  const daysEl = q('[data-days]')!;
  const slotsEl = q('[data-slots]')!;
  const slotsStatus = q('[data-slots-status]')!;
  const formError = q('[data-form-error]')!;
  const nav = q('[data-wizard-nav]')!;
  const backBtn = q<HTMLButtonElement>('[data-back]')!;
  const nextBtn = q<HTMLButtonElement>('[data-next]')!;

  let step: Step = 1;

  // ---------- helpers ----------
  const checked = (name: string) => q<HTMLInputElement>(`input[name="${name}"]:checked`);
  const setText = (key: string, text: string) => qa(`[data-summary="${key}"]`).forEach((el) => (el.textContent = text));

  const showFormError = (msg: string | null) => {
    formError.textContent = msg ?? '';
    formError.hidden = !msg;
  };

  const setStatus = (msg: string | null) => {
    slotsStatus.textContent = msg ?? '';
    slotsStatus.hidden = !msg;
  };

  // ---------- prefill from URL (/book?transmission=automatic&lesson=intensive&postcode=M14) ----------
  const params = new URLSearchParams(location.search);
  const t = params.get('transmission');
  if (t && (TRANSMISSIONS as readonly string[]).includes(t)) q<HTMLInputElement>(`input[name="transmission"][value="${t}"]`)!.checked = true;
  const l = params.get('lesson');
  if (l && (LESSON_TYPE_IDS as readonly string[]).includes(l)) q<HTMLInputElement>(`input[name="lessonType"][value="${l}"]`)!.checked = true;
  const pc = params.get('postcode');
  if (pc) q<HTMLInputElement>('input[name="postcode"]')!.value = pc;

  // ---------- days ----------
  function renderDays(): void {
    const frag = document.createDocumentFragment();
    const now = Date.now();
    for (let i = 1; i <= BOOKING_WINDOW_DAYS; i++) {
      const d = new Date(now + i * 86_400_000);
      const iso = isoFmt.format(d);
      const label = document.createElement('label');
      label.className = 'day';
      const input = Object.assign(document.createElement('input'), { type: 'radio', name: 'date', value: iso, checked: i === 1 });
      input.dataset.label = labelFmt.format(d);
      const dow = document.createElement('small');
      dow.textContent = dowFmt.format(d);
      const num = document.createElement('strong');
      num.textContent = dayFmt.format(d);
      label.append(input, dow, num);
      frag.append(label);
    }
    daysEl.replaceChildren(frag);
  }

  // ---------- slots ----------
  let slotsRequest = 0;
  async function loadSlots(date: string): Promise<void> {
    const reqId = ++slotsRequest;
    const previous = checked('time')?.value;
    slotsEl.setAttribute('aria-busy', 'true');
    setStatus('Checking availability…');

    let slots: { time: string; available: boolean }[];
    let offline = false;
    try {
      slots = (await getAvailability(date)).slots;
    } catch {
      // API unreachable: still let them choose; the owner confirms by text.
      offline = true;
      slots = TIME_SLOTS.map((time) => ({ time, available: true }));
    }
    if (reqId !== slotsRequest) return; // a newer request superseded this one

    const frag = document.createDocumentFragment();
    for (const s of slots) {
      const label = document.createElement('label');
      label.className = 'slot';
      const input = Object.assign(document.createElement('input'), {
        type: 'radio',
        name: 'time',
        value: s.time,
        disabled: !s.available,
        checked: s.available && s.time === previous,
      });
      label.append(input, document.createTextNode(s.time));
      if (!s.available) label.title = 'Already booked';
      frag.append(label);
    }
    slotsEl.replaceChildren(frag);
    slotsEl.removeAttribute('aria-busy');

    const free = slots.filter((s) => s.available).length;
    setStatus(
      offline
        ? "Live availability is offline — pick your preferred time and we'll confirm it by text."
        : free === 0
          ? 'Fully booked on this day — please try another day.'
          : null,
    );
    updateSummary();
  }

  // ---------- summary ----------
  function updateSummary(): void {
    const trans = checked('transmission');
    const lesson = checked('lessonType');
    const date = checked('date');
    const time = checked('time');
    setText('transmission', trans?.dataset.label ?? '—');
    setText('lesson', lesson?.dataset.label ?? '—');
    setText('price', lesson?.dataset.price ?? '—');
    setText('date', date?.dataset.label ?? '—');
    setText('time', time?.value ?? '—');
  }

  // ---------- steps ----------
  function goTo(next: Step, scroll = true): void {
    step = next;
    form.querySelectorAll<HTMLElement>('[data-step-panel]').forEach((p) => (p.hidden = Number(p.dataset.stepPanel) !== step));
    qa('[data-step-indicator]').forEach((li) => {
      const n = Number(li.dataset.stepIndicator);
      li.classList.toggle('is-current', n === step);
      li.classList.toggle('is-done', n < step);
      if (n === step) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    nav.hidden = step > LAST_INPUT_STEP;
    backBtn.hidden = step === 1;
    nextBtn.textContent = step === LAST_INPUT_STEP ? 'Confirm booking' : 'Continue';
    showFormError(null);
    if (scroll) form.closest('.wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- validation ----------
  function clearFieldErrors(): void {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  }

  function showFieldErrors(fields: Record<string, string>): boolean {
    let firstInput: HTMLInputElement | null = null;
    let anyInStep3 = false;
    for (const [name, msg] of Object.entries(fields)) {
      const slot = q(`[data-error-for="${name}"]`);
      if (!slot) continue;
      anyInStep3 = true;
      slot.textContent = msg;
      const input = q<HTMLInputElement>(`[name="${name}"]`);
      input?.setAttribute('aria-invalid', 'true');
      firstInput ??= input;
    }
    firstInput?.focus();
    return anyInStep3;
  }

  function readPayload(): Record<string, unknown> {
    const fd = new FormData(form);
    return {
      transmission: fd.get('transmission'),
      lessonType: fd.get('lessonType'),
      date: fd.get('date'),
      time: fd.get('time'),
      fullName: fd.get('fullName'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      postcode: fd.get('postcode'),
      hasProvisionalLicence: fd.get('hasProvisionalLicence') === 'true',
    };
  }

  async function submit(): Promise<void> {
    clearFieldErrors();
    const parsed = BookingRequestSchema.safeParse(readPayload());
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message;
      if (!showFieldErrors(fields)) showFormError('Please go back and choose a day and time.');
      return;
    }

    nextBtn.disabled = true;
    nextBtn.textContent = 'Booking…';
    try {
      const { reference } = await createBooking(parsed.data);
      q('[data-booking-ref]')!.textContent = reference;
      goTo(4);
      q('[data-step-panel="4"]')?.focus();
    } catch (err) {
      if (err instanceof ApiError && err.code === 'CONFLICT') {
        goTo(2);
        await loadSlots(checked('date')!.value);
        setStatus(err.message);
      } else if (err instanceof ApiError && err.fields) {
        if (!showFieldErrors(err.fields)) showFormError(err.message);
      } else {
        showFormError(err instanceof Error ? err.message : 'Something went wrong. Please call us to book.');
      }
    } finally {
      nextBtn.disabled = false;
      if (step === LAST_INPUT_STEP) nextBtn.textContent = 'Confirm booking';
    }
  }

  // ---------- events ----------
  nextBtn.addEventListener('click', () => {
    if (step === 2 && !checked('time')) {
      setStatus('Please pick a start time to continue.');
      return;
    }
    if (step === LAST_INPUT_STEP) {
      void submit();
      return;
    }
    goTo((step + 1) as Step);
  });

  backBtn.addEventListener('click', () => {
    if (step > 1) goTo((step - 1) as Step);
  });

  form.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.name === 'date') void loadSlots(target.value);
    if (target.name === 'time') setStatus(null);
    updateSummary();
  });

  // Clear a field's error as soon as the learner edits it (on `input`, not `change`,
  // so the layout doesn't shift under the pointer when a blur happens mid-click).
  form.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    if (!target.hasAttribute('aria-invalid')) return;
    target.removeAttribute('aria-invalid');
    const slot = q(`[data-error-for="${target.name}"]`);
    if (slot) slot.textContent = '';
  });

  // Enter key in a text field shouldn't submit the whole form natively.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    nextBtn.click();
  });

  // ---------- boot ----------
  renderDays();
  goTo(1, false);
  updateSummary();
  void loadSlots(checked('date')!.value);
}
