import type { Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import type { Notifier } from './notifier';

interface ResendOptions {
  apiKey: string;
  from: string;
  ownerEmail: string;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

/** Sends email via Resend's HTTP API (works in Workers and Node — plain fetch). */
export class ResendNotifier implements Notifier {
  constructor(private readonly opts: ResendOptions) {}

  private async send(to: string, subject: string, html: string): Promise<void> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.opts.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: this.opts.from, to, subject, html }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }

  async bookingCreated(b: Booking): Promise<void> {
    const rows = [
      ['Reference', b.reference],
      ['Name', b.fullName],
      ['Phone', b.phone],
      ['Email', b.email],
      ['Postcode', b.postcode],
      ['Lesson', `${b.lessonType} · ${b.transmission}`],
      ['When', `${b.date} at ${b.time}`],
    ]
      .map(([k, v]) => `<tr><td><b>${esc(k!)}</b></td><td>${esc(v!)}</td></tr>`)
      .join('');

    await Promise.all([
      this.send(this.opts.ownerEmail, `New booking ${b.reference} — ${b.date} ${b.time}`, `<table>${rows}</table>`),
      this.send(
        b.email,
        `Your Shark Driving School booking (${b.reference})`,
        `<p>Hi ${esc(b.fullName)},</p><p>Thanks for booking with Shark Driving School. We've received your request for <b>${esc(b.date)} at ${esc(b.time)}</b> and will confirm by text shortly.</p><p>Questions? Call 07440 260063.</p>`,
      ),
    ]);
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    await this.send(
      this.opts.ownerEmail,
      `New website message from ${m.name}`,
      `<p><b>${esc(m.name)}</b> (${esc(m.email)}${m.phone ? `, ${esc(m.phone)}` : ''})</p><p>${esc(m.message)}</p>`,
    );
  }
}
