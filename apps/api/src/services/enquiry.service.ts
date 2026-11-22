import type { CreateEnquiryResponse, Enquiry, EnquiryRequest } from '@shark/shared';
import { bookingReference, newId, nowIso } from '../lib/ids';
import type { EnquiryRepository } from '../repositories/enquiry.repository';
import type { Notifier } from './notifications/notifier';

/** Saves a learner's enquiry and alerts the owner (email/WhatsApp) and the learner (email, if given). */
export class EnquiryService {
  constructor(
    private readonly repo: EnquiryRepository,
    private readonly notifier: Notifier,
  ) {}

  async create(input: EnquiryRequest): Promise<CreateEnquiryResponse> {
    const { agreeTerms: _terms, ...details } = input;
    const enquiry: Enquiry = {
      ...details,
      // Test details only matter when a test is booked.
      ...(details.testBooked === 'no' ? { testCentre: '', testDate: '', testTime: '' } : {}),
      id: newId(),
      reference: bookingReference(),
      status: 'new',
      createdAt: nowIso(),
    };
    await this.repo.create(enquiry);

    // Notifications must never fail the enquiry itself.
    await this.notifier.enquiryReceived(enquiry).catch((e) => console.error('[notify] enquiry', e));

    return { id: enquiry.id, reference: enquiry.reference };
  }
}
