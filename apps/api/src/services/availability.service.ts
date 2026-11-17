import { TIME_SLOTS, type AvailabilityResponse } from '@shark/shared';
import { badRequest } from '../lib/errors';
import type { BookingRepository } from '../repositories/booking.repository';

/** Today's date in Europe/London as YYYY-MM-DD. */
export function londonToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(now);
}

export class AvailabilityService {
  constructor(private readonly bookings: BookingRepository) {}

  async forDate(date: string): Promise<AvailabilityResponse> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw badRequest('date must be YYYY-MM-DD');
    if (date < londonToday()) throw badRequest('date is in the past');

    const taken = new Set(await this.bookings.listBookedTimes(date));
    // TODO: per-instructor working hours, holidays and travel buffers.
    return {
      date,
      slots: TIME_SLOTS.map((time) => ({ time, available: !taken.has(time) })),
    };
  }

  async isAvailable(date: string, time: string): Promise<boolean> {
    const { slots } = await this.forDate(date);
    return slots.some((s) => s.time === time && s.available);
  }
}
