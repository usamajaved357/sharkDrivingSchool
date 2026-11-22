/**
 * Turns an enquiry into readable text: one set of facts, reused by the owner email,
 * the learner email and the WhatsApp message so they never disagree.
 */
import {
  AVAILABILITY_LABELS,
  BUSINESS,
  EXPERIENCE_LABELS,
  GENDER_LABELS,
  INSTRUCTOR_PREF_LABELS,
  INTEREST_LABELS,
  TRANSMISSION_LABELS,
  type Enquiry,
} from '@shark/shared';

const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const tileFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

const parts = (fmt: Intl.DateTimeFormat, date: string) => {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return Object.fromEntries(fmt.formatToParts(new Date(Date.UTC(y, m - 1, d, 12))).map((p) => [p.type, p.value]));
};

/**
 * "Tuesday 12 January 2027". Built from parts so the punctuation is the same on every
 * runtime (Node and Workers ICU differ). The date is a calendar day, so format in UTC.
 */
export function formatDay(date: string): string {
  const p = parts(dayFmt, date);
  return `${p.weekday} ${p.day} ${p.month} ${p.year}`;
}

/** Pieces for the email calendar tile: { weekday: 'Tue', day: '12', month: 'Jan' }. */
export function dateParts(date: string): { weekday: string; day: string; month: string } {
  const p = parts(tileFmt, date);
  return { weekday: p.weekday ?? '', day: p.day ?? '', month: p.month ?? '' };
}

const receivedFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Europe/London',
});

/** When the enquiry came in, in UK time: "Thu 19 Nov 2026 at 13:37". */
export function formatReceived(iso: string): string {
  const p = Object.fromEntries(receivedFmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.weekday} ${p.day} ${p.month} ${p.year} at ${p.hour}:${p.minute}`;
}

/** UK number → international digits for wa.me links ("07440 260063" → "447440260063"). */
export function toInternational(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits.slice(1);
  if (digits.startsWith('0')) return `44${digits.slice(1)}`;
  return digits;
}

export const firstName = (fullName: string): string => fullName.trim().split(/\s+/)[0] ?? fullName;

/** "Weekday evenings, Saturdays (after 5pm please)". */
export function formatAvailability(e: Pick<Enquiry, 'availability' | 'availabilityNotes'>): string {
  const picked = e.availability.map((a) => AVAILABILITY_LABELS[a]).join(', ');
  if (picked && e.availabilityNotes) return `${picked} (${e.availabilityNotes})`;
  return picked || e.availabilityNotes;
}

/** "Yes: Cheetham Hill, Tuesday 12 January 2027 at 10:00" or "Not booked yet". */
export function formatTest(e: Pick<Enquiry, 'testBooked' | 'testCentre' | 'testDate' | 'testTime'>): string {
  if (e.testBooked !== 'yes') return 'Not booked yet';
  const when = e.testDate ? `${formatDay(e.testDate)}${e.testTime ? ` at ${e.testTime}` : ''}` : '';
  return ['Yes', [e.testCentre, when].filter(Boolean).join(', ')].filter(Boolean).join(': ');
}

export interface FactGroup {
  title: string;
  rows: [label: string, value: string][];
}

/** The enquiry, grouped for display. Empty optional values are left out. */
export function enquiryFacts(e: Enquiry): FactGroup[] {
  const opt = (label: string, value: string): [string, string][] => (value ? [[label, value]] : []);
  return [
    {
      title: 'Learner',
      rows: [
        ['Name', e.fullName],
        ['Gender', GENDER_LABELS[e.gender]],
        ['Mobile', e.phone],
        ...opt('Email', e.email),
        ['Address', `${e.address}, ${e.postcode}`],
      ],
    },
    {
      title: 'Lessons',
      rows: [
        ['Gearbox', TRANSMISSION_LABELS[e.transmission]],
        ['Experience', EXPERIENCE_LABELS[e.experience]],
        ['Available', formatAvailability(e)],
        ['Instructor', INSTRUCTOR_PREF_LABELS[e.instructorPref]],
        ...opt('Interested in', e.interest === 'not-sure' ? '' : INTEREST_LABELS[e.interest]),
      ],
    },
    { title: 'Driving test', rows: [['Test booked', formatTest(e)]] },
    ...(e.notes ? [{ title: 'Notes', rows: [['Notes', e.notes]] as [string, string][] }] : []),
  ];
}

/** WhatsApp message for the owner (WhatsApp supports *bold*). */
export function enquiryWhatsAppText(e: Enquiry): string {
  const lines = [`🦈 *${BUSINESS.name}*`, `*New learner enquiry* · ${e.reference}`, ''];
  for (const group of enquiryFacts(e)) {
    lines.push(`*${group.title}*`);
    for (const [label, value] of group.rows) lines.push(`${label}: ${value}`);
    lines.push('');
  }
  lines.push(`Call: tel:${e.phone}`, `WhatsApp: https://wa.me/${toInternational(e.phone)}`);
  return lines.join('\n');
}

/** Plain-text version of the owner email (shown by mail apps that block HTML). */
export function enquiryPlainText(e: Enquiry, intro: string): string {
  const lines = [intro, `Reference: ${e.reference}`, ''];
  for (const group of enquiryFacts(e)) {
    lines.push(group.title.toUpperCase());
    for (const [label, value] of group.rows) lines.push(`${label}: ${value}`);
    lines.push('');
  }
  lines.push(`${BUSINESS.name} · ${BUSINESS.phone.display} · ${BUSINESS.email}`);
  return lines.join('\n');
}
