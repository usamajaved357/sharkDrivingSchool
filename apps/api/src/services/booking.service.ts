import type { Booking, BookingRequest, CreateBookingResponse } from '@shark/shared';
import { conflict } from '../lib/errors';
import { bookingReference, newId, nowIso } from '../lib/ids';
import { SlotTakenError, type BookingRepository } from '../repositories/booking.repository';
import type { AvailabilityService } from './availability.service';
import type { Notifier } from './notifications/notifier';

const SLOT_TAKEN = 'Sorry, that slot was just taken. Please pick another time.';

export class BookingService {
  constructor(
    private readonly repo: BookingRepository,
    private readonly availability: AvailabilityService,
    private readonly notifier: Notifier,
  ) {}

  async create(input: BookingRequest): Promise<CreateBookingResponse> {
    if (!(await this.availability.isAvailable(input.date, input.time))) throw conflict(SLOT_TAKEN);

    const { hasProvisionalLicence: _licence, agreeTerms: _terms, ...details } = input;
    const booking: Booking = {
      ...details,
      id: newId(),
      reference: bookingReference(),
      status: 'pending',
      createdAt: nowIso(),
    };

    try {
      await this.repo.create(booking);
    } catch (err) {
      if (err instanceof SlotTakenError) throw conflict(SLOT_TAKEN);
      throw err;
    }

    // Notifications must never fail the booking itself.
    await this.notifier.bookingCreated(booking).catch((e) => console.error('[notify] booking', e));

    return { id: booking.id, reference: booking.reference };
  }
}
