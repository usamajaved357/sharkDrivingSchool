/** Owner's copy of a website contact message. */
import type { ContactMessage } from '../../repositories/contact.repository';
import type { EmailContent } from './enquiry-emails';
import { BRAND, emailLayout, esc } from './email-layout';
import { infoCard, noteBox, pillButtons } from './email-parts';

export function contactEmail(m: ContactMessage): EmailContent {
  const rows: [string, string][] = [
    ['Name', m.name],
    ['Email', m.email],
    ...(m.phone ? ([['Phone', m.phone]] as [string, string][]) : []),
  ];
  const buttons = pillButtons([
    { label: 'Reply by email', href: `mailto:${m.email}`, bg: BRAND.navy },
    ...(m.phone ? [{ label: 'Call', href: `tel:${m.phone}`, bg: BRAND.red }] : []),
  ]);
  return {
    subject: `New website message from ${m.name}`,
    html: emailLayout({
      preheader: m.message.slice(0, 90),
      eyebrow: 'Website message',
      heading: m.name,
      intro: 'Sent a message through the website contact form.',
      body: infoCard('From', rows, buttons) + noteBox('Message', esc(m.message)),
    }),
    text: [...rows, ['Message', m.message] as [string, string]].map(([k, v]) => `${k}: ${v}`).join('\n'),
  };
}
