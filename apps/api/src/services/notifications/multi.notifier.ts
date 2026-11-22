import type { Enquiry } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import type { Notifier } from './notifier';

/**
 * Sends through every configured channel (email, WhatsApp, console) at once.
 * One channel failing never stops the others; failures are logged.
 */
export class MultiNotifier implements Notifier {
  constructor(private readonly channels: { name: string; notifier: Notifier }[]) {}

  private async fanOut(event: string, run: (n: Notifier) => Promise<void>): Promise<void> {
    const results = await Promise.allSettled(this.channels.map((c) => run(c.notifier)));
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`[notify] ${this.channels[i]!.name} ${event} failed:`, r.reason);
    });
  }

  enquiryReceived(e: Enquiry): Promise<void> {
    return this.fanOut('enquiry', (n) => n.enquiryReceived(e));
  }

  contactReceived(m: ContactMessage): Promise<void> {
    return this.fanOut('contact', (n) => n.contactReceived(m));
  }
}
