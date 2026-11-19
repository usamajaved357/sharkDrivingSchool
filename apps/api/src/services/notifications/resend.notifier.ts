import type { Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { contactEmail, customerBookingEmail, ownerBookingEmail, type EmailContent } from './booking-emails';
import type { Notifier } from './notifier';

export interface ResendOptions {
  apiKey: string;
  /** Verified sender, e.g. "Shark Driving School <bookings@sharkdrivingschool.co.uk>". */
  from: string;
  /** Where booking and contact notifications go. */
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
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }

  async bookingCreated(b: Booking): Promise<void> {
    const sends = [this.send(this.opts.ownerEmail, ownerBookingEmail(b), b.email)];
    if (this.opts.emailCustomer) sends.push(this.send(b.email, customerBookingEmail(b), this.opts.ownerEmail));
    await Promise.all(sends);
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    await this.send(this.opts.ownerEmail, contactEmail(m), m.email);
  }
}
