import { EXPERIENCE_LABELS, TRANSMISSION_LABELS, type Enquiry } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { enquiryWhatsAppText, formatTest } from './enquiry-format';
import type { Notifier } from './notifier';
import type { WhatsAppSender } from './whatsapp/senders';

/** Sends enquiry and contact alerts to the owner's WhatsApp. */
export class WhatsAppNotifier implements Notifier {
  constructor(
    private readonly sender: WhatsAppSender,
    /** Owner's number in international digits, e.g. "447440260063". */
    private readonly to: string,
  ) {}

  async enquiryReceived(e: Enquiry): Promise<void> {
    await this.sender.send(this.to, {
      text: enquiryWhatsAppText(e),
      // Approved template: "New booking {{1}}: {{2}}, {{3}}, {{4}}. Phone: {{5}}. Pick-up: {{6}}"
      templateParams: [
        e.reference,
        e.fullName,
        `${TRANSMISSION_LABELS[e.transmission]} (${EXPERIENCE_LABELS[e.experience].toLowerCase()})`,
        `Test: ${formatTest(e)}`,
        e.phone,
        `${e.address}, ${e.postcode}`,
      ],
    });
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    const text = [`🦈 *New website message*`, `From: ${m.name}`, `Email: ${m.email}`, ...(m.phone ? [`Phone: ${m.phone}`] : []), '', m.message].join('\n');
    await this.sender.send(this.to, { text, templateParams: ['MESSAGE', m.name, 'Website message', '-', m.phone ?? m.email, '-'] });
  }
}
