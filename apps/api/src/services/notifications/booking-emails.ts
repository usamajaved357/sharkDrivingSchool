/** The emails sent for a booking (to the owner and to the customer) and for a contact message. */
import { BUSINESS, LESSON_TYPE_LABELS, TRANSMISSION_LABELS, type Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { bookingFacts, bookingPlainText, dateParts, firstName, formatReceived, formatWhen, toInternational } from './booking-format';
import { BRAND, emailLayout, esc } from './email-layout';
import { buttonRow, detailCard, noteBox, progressTracker, smallPrint, stepList, summaryCard } from './email-parts';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/** Bold text on the white body, and on the navy hero. */
const b_ = (s: string) => `<b style="color:${BRAND.ink}">${esc(s)}</b>`;
const onDark = (s: string) => `<b style="color:${BRAND.white}">${esc(s)}</b>`;
const site = BUSINESS.url.replace(/^https?:\/\/(www\.)?/, '');

/** Calendar tile + lesson, time and pick-up. Shared by both booking emails. */
function lessonSummary(b: Booking, extra: [string, string][] = []): string {
  const longDate = formatWhen(b).replace(/ at .*$/, '');
  return summaryCard({
    ...dateParts(b.date),
    title: LESSON_TYPE_LABELS[b.lessonType],
    tag: TRANSMISSION_LABELS[b.transmission],
    lines: [['Date', longDate], ['Time', b.time], ['Pick-up', `${b.address}, ${b.postcode}`], ...extra],
  });
}

/** Owner's copy: the request at a glance, one-tap contact buttons, then every detail. */
export function ownerBookingEmail(b: Booking): EmailContent {
  const lesson = LESSON_TYPE_LABELS[b.lessonType];
  const name = firstName(b.fullName);
  const [, learner, about] = bookingFacts(b);
  const aboutRows = about!.rows.filter(([k]) => k !== 'Notes');

  const body =
    lessonSummary(b) +
    buttonRow([
      { label: 'Call learner', href: `tel:${b.phone}`, bg: BRAND.red },
      { label: 'WhatsApp', href: `https://wa.me/${toInternational(b.phone)}`, bg: BRAND.green },
      { label: 'Email', href: `mailto:${b.email}?subject=${encodeURIComponent(`Your Shark Driving School booking ${b.reference}`)}`, bg: BRAND.navy },
    ]) +
    detailCard('Learner details', learner!.rows.filter(([k]) => k !== 'Pick-up')) + // pick-up is in the summary
    detailCard('About the learner', aboutRows) +
    (b.notes ? noteBox(`<b>Note from ${esc(name)}:</b><br>${esc(b.notes)}`, 'red') : '') +
    stepList('Next steps', [
      `Call or text ${esc(name)} on ${b_(b.phone)} to confirm the time and pick-up.`,
      `Or just hit <b>Reply</b>: your email goes straight to ${esc(name)}.`,
      `Remind them to bring their <b>provisional licence</b> to the first lesson.`,
    ]) +
    smallPrint(`Received ${esc(formatReceived(b.createdAt))} via ${esc(site)} · Reference ${esc(b.reference)}`);

  return {
    subject: `New booking ${b.reference}: ${b.fullName}, ${lesson}, ${formatWhen(b)}`,
    html: emailLayout({
      preheader: `${b.fullName} wants a ${lesson.toLowerCase()} on ${formatWhen(b)}. Tap to call or WhatsApp them.`,
      eyebrow: 'New booking request',
      heading: b.fullName,
      intro: `Has asked for a ${onDark(lesson.toLowerCase())} in a ${onDark(TRANSMISSION_LABELS[b.transmission].toLowerCase())} car. Get in touch to confirm the time.`,
      badge: b.reference,
      body,
    }),
    text: bookingPlainText(b, `New booking request from ${b.fullName}`),
  };
}

/** Customer's confirmation that we received the request (no owner-only details). */
export function customerBookingEmail(b: Booking): EmailContent {
  const lesson = LESSON_TYPE_LABELS[b.lessonType];
  const name = firstName(b.fullName);

  const body =
    progressTracker(['Request received', 'We confirm your time', 'Your first lesson'], 1) +
    lessonSummary(b) +
    stepList('What happens next', [
      'We check instructor availability for your pick-up area.',
      `We call or text you on ${b_(b.phone)} to confirm everything.`,
      `Your instructor picks you up. Remember your ${b_('provisional licence')}.`,
    ]) +
    noteBox(`<b>Need to change something?</b> Reply to this email, or call or WhatsApp us on <a href="tel:${BUSINESS.phone.tel}" style="color:${BRAND.blue};font-weight:700">${esc(BUSINESS.phone.display)}</a>. Please quote ${b_(b.reference)}.`) +
    buttonRow([
      { label: 'Call us', href: `tel:${BUSINESS.phone.tel}`, bg: BRAND.red },
      { label: 'WhatsApp us', href: `https://wa.me/${BUSINESS.phone.whatsapp}?text=${encodeURIComponent(`Hi, it's ${b.fullName} about booking ${b.reference}`)}`, bg: BRAND.green },
    ]) +
    smallPrint(`You're getting this email because you requested a driving lesson at ${esc(site)}. Your reference is ${esc(b.reference)}.`);

  return {
    subject: `We've got your booking request (${b.reference})`,
    html: emailLayout({
      preheader: `Thanks ${name}, your ${lesson.toLowerCase()} request for ${formatWhen(b)} is with us. We'll be in touch shortly.`,
      eyebrow: 'Booking request received',
      heading: `Thanks, ${name}!`,
      intro: `We've got your request for a ${onDark(lesson.toLowerCase())}. We'll call or text you shortly to confirm everything.`,
      badge: b.reference,
      body,
    }),
    text: [
      `Thanks, ${name}! We've received your booking request.`,
      `Reference: ${b.reference}`,
      `${lesson} (${TRANSMISSION_LABELS[b.transmission]}), ${formatWhen(b)}`,
      `Pick-up: ${b.address}, ${b.postcode}`,
      '',
      'What happens next:',
      '1. We check instructor availability for your pick-up area.',
      `2. We call or text you on ${b.phone} to confirm.`,
      '3. Your instructor picks you up. Remember your provisional licence.',
      '',
      `Questions? Reply to this email or call/WhatsApp ${BUSINESS.phone.display}.`,
      `${BUSINESS.name} · ${BUSINESS.email} · ${site}`,
    ].join('\n'),
  };
}

/** Owner's copy of a website contact message. */
export function contactEmail(m: ContactMessage): EmailContent {
  const rows: [string, string][] = [
    ['Name', m.name],
    ['Email', m.email],
    ...(m.phone ? ([['Phone', m.phone]] as [string, string][]) : []),
  ];
  const buttons = [
    { label: 'Reply by email', href: `mailto:${m.email}`, bg: BRAND.navy },
    ...(m.phone ? [{ label: 'Call', href: `tel:${m.phone}`, bg: BRAND.red }] : []),
  ];
  return {
    subject: `New website message from ${m.name}`,
    html: emailLayout({
      preheader: m.message.slice(0, 90),
      eyebrow: 'Website message',
      heading: m.name,
      intro: 'Sent a message through the website contact form.',
      body: detailCard('From', rows) + noteBox(`<b>Message:</b><br>${esc(m.message)}`, 'red') + buttonRow(buttons),
    }),
    text: [...rows, ['Message', m.message] as [string, string]].map(([k, v]) => `${k}: ${v}`).join('\n'),
  };
}
