import type { Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { bookingWhatsAppText } from './booking-format';
import type { Notifier } from './notifier';

/** Always on: logs every booking and message to the server console (handy in local dev). */
export class ConsoleNotifier implements Notifier {
  async bookingCreated(b: Booking): Promise<void> {
    console.log(`[notify] new booking ${b.reference}\n${bookingWhatsAppText(b)}`);
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    console.log(`[notify] new contact message from ${m.name} <${m.email}>`);
  }
}
