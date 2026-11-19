/** The emails sent for a booking (to the owner and to the customer) and for a contact message. */
import { BUSINESS, LESSON_TYPE_LABELS, type Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { bookingFacts, bookingPlainText, firstName, formatWhen, toInternational } from './booking-format';
import { BRAND, EMAIL_FONT, emailButton, emailLayout, esc, factTable } from './email-layout';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const p = (html: string) => `<p style="margin:12px 0 0;color:${BRAND.muted};font:500 15px/1.6 ${EMAIL_FONT}">${html}</p>`;

/** Owner's copy: every detail, plus one-tap buttons to call, WhatsApp or email the learner. */
export function ownerBookingEmail(b: Booking): EmailContent {
  const lesson = LESSON_TYPE_LABELS[b.lessonType];
  const facts = bookingFacts(b)
    .map((g) => factTable(g.title, g.rows))
    .join('');
  const actions =
    `<div style="margin-top:24px">` +
    emailButton(`Call ${firstName(b.fullName)}`, `tel:${b.phone}`, BRAND.red) +
    emailButton('WhatsApp', `https://wa.me/${toInternational(b.phone)}`, BRAND.green) +
    emailButton('Email', `mailto:${b.email}?subject=${encodeURIComponent(`Your booking ${b.reference}`)}`, BRAND.blue) +
    `</div>`;
  return {
    subject: `New booking ${b.reference}: ${b.fullName}, ${lesson}, ${formatWhen(b)}`,
    html: emailLayout({
      preheader: `${b.fullName} booked a ${lesson.toLowerCase()} for ${formatWhen(b)}.`,
      heading: 'New booking request',
      badge: b.reference,
      body: p(`<b style="color:${BRAND.ink}">${esc(b.fullName)}</b> has requested a lesson. Confirm the time with them by call or text.`) + facts + actions,
    }),
    text: bookingPlainText(b, `New booking request from ${b.fullName}`),
  };
}

/** Customer's confirmation that we received the request. */
export function customerBookingEmail(b: Booking): EmailContent {
  const lesson = LESSON_TYPE_LABELS[b.lessonType];
  const summary = factTable('Your request', [
    ['Reference', b.reference],
    ...bookingFacts(b)[0]!.rows,
    ['Pick-up', `${b.address}, ${b.postcode}`],
  ]);
  const next = factTable('What happens next', [
    ['Step 1', 'We check your instructor and pick-up area.'],
    ['Step 2', 'We call or text you to confirm the time.'],
    ['Step 3', 'Your instructor picks you up. Bring your provisional licence.'],
  ]);
  const help = p(
    `Need to change something? Call <a href="tel:${BUSINESS.phone.tel}" style="color:${BRAND.blue}">${esc(BUSINESS.phone.display)}</a>, ` +
      `<a href="https://wa.me/${BUSINESS.phone.whatsapp}" style="color:${BRAND.blue}">WhatsApp us</a> or reply to this email.`,
  );
  return {
    subject: `We've got your booking request (${b.reference})`,
    html: emailLayout({
      preheader: `Thanks ${firstName(b.fullName)}, your ${lesson.toLowerCase()} request for ${formatWhen(b)} is with us.`,
      heading: `Thanks, ${firstName(b.fullName)}!`,
      badge: b.reference,
      body: p(`We've received your request for a <b style="color:${BRAND.ink}">${esc(lesson.toLowerCase())}</b>. We'll be in touch shortly to confirm.`) + summary + next + help,
    }),
    text: [
      `Thanks, ${firstName(b.fullName)}! We've received your booking request.`,
      `Reference: ${b.reference}`,
      `${lesson}, ${formatWhen(b)}`,
      `Pick-up: ${b.address}, ${b.postcode}`,
      '',
      "We'll call or text you shortly to confirm.",
      `${BUSINESS.name} · ${BUSINESS.phone.display} · ${BUSINESS.email}`,
    ].join('\n'),
  };
}

/** Owner's copy of a website contact message. */
export function contactEmail(m: ContactMessage): EmailContent {
  const rows: [string, string][] = [
    ['Name', m.name],
    ['Email', m.email],
    ...(m.phone ? ([['Phone', m.phone]] as [string, string][]) : []),
    ['Message', m.message],
  ];
  return {
    subject: `New website message from ${m.name}`,
    html: emailLayout({
      preheader: m.message.slice(0, 90),
      heading: 'New website message',
      body: factTable('Message', rows) + `<div style="margin-top:24px">${emailButton('Reply by email', `mailto:${m.email}`, BRAND.blue)}</div>`,
    }),
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
  };
}
