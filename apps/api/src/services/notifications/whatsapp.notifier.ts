import { LESSON_TYPE_LABELS, TRANSMISSION_LABELS, type Booking } from '@shark/shared';
import type { ContactMessage } from '../../repositories/contact.repository';
import { bookingWhatsAppText, formatWhen } from './booking-format';
import type { Notifier } from './notifier';
import type { WhatsAppSender } from './whatsapp/senders';

/** Sends booking and contact alerts to the owner's WhatsApp. */
export class WhatsAppNotifier implements Notifier {
  constructor(
    private readonly sender: WhatsAppSender,
    /** Owner's number in international digits, e.g. "447440260063". */
    private readonly to: string,
  ) {}

  async bookingCreated(b: Booking): Promise<void> {
    await this.sender.send(this.to, {
      text: bookingWhatsAppText(b),
      templateParams: [
        b.reference,
        b.fullName,
        `${LESSON_TYPE_LABELS[b.lessonType]} (${TRANSMISSION_LABELS[b.transmission]})`,
        formatWhen(b),
        b.phone,
        `${b.address}, ${b.postcode}`,
      ],
    });
  }

  async contactReceived(m: ContactMessage): Promise<void> {
    const text = [`🦈 *New website message*`, `From: ${m.name}`, `Email: ${m.email}`, ...(m.phone ? [`Phone: ${m.phone}`] : []), '', m.message].join('\n');
    await this.sender.send(this.to, { text, templateParams: ['MESSAGE', m.name, 'Website message', '-', m.phone ?? m.email, '-'] });
  }
}
