import type { Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';

/** Outbound notifications (email now; SMS/WhatsApp later). */
export interface Notifier {
  bookingCreated(booking: Booking): Promise<void>;
  contactReceived(message: ContactMessage): Promise<void>;
}
