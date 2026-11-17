import type { Booking } from '@shark/shared';
import { SlotTakenError, type BookingRepository, type NewBooking } from '../booking.repository';

/** In-memory store for local Node development and tests. Data resets on restart. */
export class MemoryBookingRepository implements BookingRepository {
  private readonly rows = new Map<string, Booking>();

  async create(b: NewBooking): Promise<Booking> {
    const clash = [...this.rows.values()].some((r) => r.date === b.date && r.time === b.time && r.status !== 'cancelled');
    if (clash) throw new SlotTakenError();
    this.rows.set(b.id, b);
    return b;
  }

  async findById(id: string): Promise<Booking | null> {
    return this.rows.get(id) ?? null;
  }

  async listBookedTimes(date: string): Promise<string[]> {
    return [...this.rows.values()].filter((r) => r.date === date && r.status !== 'cancelled').map((r) => r.time);
  }
}
