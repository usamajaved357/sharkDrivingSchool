/**
 * Turns a booking into readable text: one set of facts, reused by the owner email,
 * the customer email and the WhatsApp message so they never disagree.
 */
import {
  BUSINESS,
  EXPERIENCE_LABELS,
  INSTRUCTOR_PREF_LABELS,
  LESSON_TYPE_LABELS,
  THEORY_LABELS,
  TRANSMISSION_LABELS,
  type Booking,
} from '@shark/shared';

const whenFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * "Tuesday 24 November 2026 at 10:00". Built from parts so the punctuation is the same on
 * every runtime (Node and Workers ICU differ). The date is a calendar day, so format in UTC.
 */
export function formatWhen(b: Pick<Booking, 'date' | 'time'>): string {
  const [y, m, d] = b.date.split('-').map(Number) as [number, number, number];
  const parts = Object.fromEntries(whenFmt.formatToParts(new Date(Date.UTC(y, m - 1, d, 12))).map((p) => [p.type, p.value]));
  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year} at ${b.time}`;
}

/** UK number → international digits for wa.me links ("07440 260063" → "447440260063"). */
export function toInternational(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits.slice(1);
  if (digits.startsWith('0')) return `44${digits.slice(1)}`;
  return digits;
}

export const firstName = (fullName: string): string => fullName.trim().split(/\s+/)[0] ?? fullName;

export interface FactGroup {
  title: string;
  rows: [label: string, value: string][];
}

/** The booking, grouped for display. Empty optional values are left out. */
export function bookingFacts(b: Booking): FactGroup[] {
  return [
    {
      title: 'Lesson',
      rows: [
        ['Lesson', LESSON_TYPE_LABELS[b.lessonType]],
        ['Gearbox', TRANSMISSION_LABELS[b.transmission]],
        ['When', formatWhen(b)],
      ],
    },
    {
      title: 'Learner',
      rows: [
        ['Name', b.fullName],
        ['Mobile', b.phone],
        ['Email', b.email],
        ['Pick-up', `${b.address}, ${b.postcode}`],
      ],
    },
    {
      title: 'About the learner',
      rows: [
        ['Experience', EXPERIENCE_LABELS[b.experience]],
        ['Theory test', THEORY_LABELS[b.theoryTest]],
        ['Instructor', INSTRUCTOR_PREF_LABELS[b.instructorPref]],
        ...(b.notes ? ([['Notes', b.notes]] as [string, string][]) : []),
      ],
    },
  ];
}

/** WhatsApp message for the owner (WhatsApp supports *bold*). */
export function bookingWhatsAppText(b: Booking): string {
  const lines = [`🦈 *${BUSINESS.name}*`, `*New booking request* · ${b.reference}`, ''];
  for (const group of bookingFacts(b)) {
    lines.push(`*${group.title}*`);
    for (const [label, value] of group.rows) lines.push(`${label}: ${value}`);
    lines.push('');
  }
  lines.push(`Call: tel:${b.phone}`, `WhatsApp: https://wa.me/${toInternational(b.phone)}`);
  return lines.join('\n');
}

/** Plain-text version of the owner email (shown by mail apps that block HTML). */
export function bookingPlainText(b: Booking, intro: string): string {
  const lines = [intro, `Reference: ${b.reference}`, ''];
  for (const group of bookingFacts(b)) {
    lines.push(group.title.toUpperCase());
    for (const [label, value] of group.rows) lines.push(`${label}: ${value}`);
    lines.push('');
  }
  lines.push(`${BUSINESS.name} · ${BUSINESS.phone.display} · ${BUSINESS.email}`);
  return lines.join('\n');
}
