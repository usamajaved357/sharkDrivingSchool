import type { Enquiry } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';

/** Outbound notifications (console, email, WhatsApp). */
export interface Notifier {
  enquiryReceived(enquiry: Enquiry): Promise<void>;
  contactReceived(message: ContactMessage): Promise<void>;
}
