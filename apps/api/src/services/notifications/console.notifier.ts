import type { Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import type { Notifier } from './notifier';

/** Used when no email provider is configured (local dev). */
export class ConsoleNotifier implements Notifier {
  async bookingCreated(b: Booking): Promise<void> {
    console.log(`[notify] new booking ${b.reference}: ${b.fullName} · ${b.date} ${b.time} · ${b.transmission} · ${b.lessonType}`);
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    console.log(`[notify] new contact message from ${m.name} <${m.email}>`);
  }
}
