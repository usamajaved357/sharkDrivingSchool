import type { Enquiry } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { enquiryWhatsAppText } from './enquiry-format';
import type { Notifier } from './notifier';

/** Always on: logs every enquiry and message to the server console (handy in local dev). */
export class ConsoleNotifier implements Notifier {
  async enquiryReceived(e: Enquiry): Promise<void> {
    console.log(`[notify] new enquiry ${e.reference}\n${enquiryWhatsAppText(e)}`);
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    console.log(`[notify] new contact message from ${m.name} <${m.email}>`);
  }
}
