/** The emails sent for a learner's enquiry: the owner's alert and the learner's copy. */
import { BUSINESS, EXPERIENCE_LABELS, INSTRUCTOR_PREF_LABELS, TRANSMISSION_LABELS, type Enquiry } from '@shark/shared';
import { dateParts, enquiryFacts, enquiryPlainText, firstName, formatAvailability, formatDay, formatReceived, formatTest, toInternational } from './enquiry-format';
import { BRAND, emailLayout, esc } from './email-layout';
import { helpCard, infoCard, noteBox, pillButtons, progressTracker, smallPrint, stepList, summaryCard } from './email-parts';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/** Bold text on the white body, and on the navy hero. */
const b_ = (s: string) => `<b style="color:${BRAND.ink}">${esc(s)}</b>`;
const onDark = (s: string) => `<b style="color:${BRAND.white}">${esc(s)}</b>`;
const site = BUSINESS.url.replace(/^https?:\/\/(www\.)?/, '');

/** Calendar tile for a booked driving test, or '' when there isn't one. */
function testSummary(e: Enquiry): string {
  if (e.testBooked !== 'yes' || !e.testDate) return '';
  return summaryCard({
    ...dateParts(e.testDate),
    title: 'Driving test booked',
    tag: TRANSMISSION_LABELS[e.transmission],
    lines: [['Date', formatDay(e.testDate)], ...(e.testTime ? ([['Time', e.testTime]] as [string, string][]) : []), ['Centre', e.testCentre]],
  });
}

/** Owner's alert: who they are, how to reach them, what they want, then every detail. */
export function ownerEnquiryEmail(e: Enquiry): EmailContent {
  const name = firstName(e.fullName);
  const [learner, lessons] = enquiryFacts(e);
  const gearbox = TRANSMISSION_LABELS[e.transmission];
  const lessonRows = e.testBooked === 'yes' ? lessons!.rows : [...lessons!.rows, ['Driving test', formatTest(e)] as [string, string]];

  const body =
    progressTracker(['Enquiry received', `Contact ${name}`, 'First lesson'], 1) +
    testSummary(e) +
    infoCard(
      'Learner',
      learner!.rows,
      pillButtons([
        { label: 'Call', href: `tel:${e.phone}`, bg: BRAND.red },
        { label: 'WhatsApp', href: `https://wa.me/${toInternational(e.phone)}`, bg: BRAND.green },
        ...(e.email
          ? [{ label: 'Email', href: `mailto:${e.email}?subject=${encodeURIComponent(`Your driving lessons with ${BUSINESS.name}`)}`, bg: BRAND.navy }]
          : []),
      ]),
    ) +
    infoCard('Lessons', lessonRows) +
    (e.notes ? noteBox(`Note from ${name}`, esc(e.notes)) : '') +
    stepList('Next steps', [
      `Call or WhatsApp ${esc(name)} on ${b_(e.phone)} to arrange the first lesson.`,
      `Match them with an instructor: ${b_(INSTRUCTOR_PREF_LABELS[e.instructorPref].toLowerCase())}, ${b_(gearbox.toLowerCase())}, covering ${b_(e.postcode)}.`,
      `Remind them to bring their <b>provisional licence</b> to the first lesson.`,
    ]) +
    smallPrint(`Received ${esc(formatReceived(e.createdAt))} via ${esc(site)} · Reference ${esc(e.reference)}`);

  return {
    subject: `New enquiry ${e.reference}: ${e.fullName}, ${gearbox}, ${EXPERIENCE_LABELS[e.experience]}`,
    html: emailLayout({
      preheader: `${e.fullName} wants ${gearbox.toLowerCase()} lessons. Free: ${formatAvailability(e)}. Tap to call or WhatsApp.`,
      eyebrow: 'New learner enquiry',
      heading: e.fullName,
      intro: `Wants ${onDark(gearbox.toLowerCase())} lessons (${esc(EXPERIENCE_LABELS[e.experience].toLowerCase())}). Get in touch to arrange the first lesson.`,
      badge: e.reference,
      body,
    }),
    text: enquiryPlainText(e, `New learner enquiry from ${e.fullName}`),
  };
}

/** Learner's copy (only sent when they gave an email): their details and what happens next. */
export function customerEnquiryEmail(e: Enquiry): EmailContent {
  const name = firstName(e.fullName);
  const details: [string, string][] = [
    ['Gearbox', TRANSMISSION_LABELS[e.transmission]],
    ['Experience', EXPERIENCE_LABELS[e.experience]],
    ['Available', formatAvailability(e)],
    ['Instructor', INSTRUCTOR_PREF_LABELS[e.instructorPref]],
    ['Driving test', formatTest(e)],
    ['Address', `${e.address}, ${e.postcode}`],
  ];

  const body =
    progressTracker(['Details received', 'We contact you', 'Your first lesson'], 1) +
    infoCard('Your details', details) +
    stepList('What happens next', [
      `We call or WhatsApp you on ${b_(e.phone)} to talk through your lessons.`,
      'We match you with an instructor who covers your area and fits your availability.',
      `Your instructor picks you up. Remember your ${b_('provisional licence')}.`,
    ]) +
    helpCard('Need to change something?', `Reply to this email, call or WhatsApp us on ${onDark(BUSINESS.phone.display)}. Please quote ${onDark(e.reference)}.`, [
      { label: 'Call us', href: `tel:${BUSINESS.phone.tel}`, bg: BRAND.red },
      { label: 'WhatsApp us', href: `https://wa.me/${BUSINESS.phone.whatsapp}?text=${encodeURIComponent(`Hi, it's ${e.fullName} (${e.reference})`)}`, bg: BRAND.green },
    ]) +
    smallPrint(`You're getting this email because you sent your details at ${esc(site)}. Your reference is ${esc(e.reference)}.`);

  return {
    subject: `Thanks ${name}, we've got your details (${e.reference})`,
    html: emailLayout({
      preheader: `Thanks ${name}, we'll call or WhatsApp you soon to arrange your driving lessons.`,
      eyebrow: 'Details received',
      heading: `Thanks, ${name}!`,
      intro: `We've got your details. We'll call or WhatsApp you soon to arrange your ${onDark(TRANSMISSION_LABELS[e.transmission].toLowerCase())} lessons.`,
      badge: e.reference,
      body,
    }),
    text: [
      `Thanks, ${name}! We've got your details.`,
      `Reference: ${e.reference}`,
      '',
      ...details.map(([k, v]) => `${k}: ${v}`),
      '',
      'What happens next:',
      `1. We call or WhatsApp you on ${e.phone} to talk through your lessons.`,
      '2. We match you with an instructor who covers your area and fits your availability.',
      '3. Your instructor picks you up. Remember your provisional licence.',
      '',
      `Questions? Reply to this email or call/WhatsApp ${BUSINESS.phone.display}.`,
      `${BUSINESS.name} · ${BUSINESS.email} · ${site}`,
    ].join('\n'),
  };
}
