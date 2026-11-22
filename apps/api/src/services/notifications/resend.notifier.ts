import type { Enquiry } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { contactEmail } from './contact-email';
import { customerEnquiryEmail, ownerEnquiryEmail, type EmailContent } from './enquiry-emails';
import { EMAIL_LOGO } from './email-logo';
import type { Notifier } from './notifier';

export interface ResendOptions {
  apiKey: string;
  /** Verified sender, e.g. "Shark Driving School <bookings@sharkdrivingschools.com>". */
  from: string;
  /** Where enquiry and contact notifications go. */
  ownerEmail: string;
  /** Also email the learner a confirmation. */
  emailCustomer: boolean;
  /** Override for tests; defaults to Resend's API. */
  apiUrl?: string;
}

/** Sends email via Resend's HTTP API (plain fetch, so it works on Workers and Node). */
export class ResendNotifier implements Notifier {
  constructor(private readonly opts: ResendOptions) {}

  private async send(to: string, content: EmailContent, replyTo?: string): Promise<void> {
    const res = await fetch(this.opts.apiUrl ?? 'https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.opts.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: this.opts.from,
        to,
        subject: content.subject,
        html: content.html,
        text: content.text,
        // The logo travels with the email (cid:shark-logo), so it shows even before the site is live.
        attachments: [{ filename: EMAIL_LOGO.filename, content: EMAIL_LOGO.base64, content_id: EMAIL_LOGO.contentId }],
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }

  async enquiryReceived(e: Enquiry): Promise<void> {
    // Owner can reply straight to the learner when they gave an email.
    const sends = [this.send(this.opts.ownerEmail, ownerEnquiryEmail(e), e.email || undefined)];
    // The learner's copy only goes out if they gave an email (it's optional on the form).
    if (this.opts.emailCustomer && e.email) sends.push(this.send(e.email, customerEnquiryEmail(e), this.opts.ownerEmail));
    await Promise.all(sends);
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    await this.send(this.opts.ownerEmail, contactEmail(m), m.email);
  }
}
