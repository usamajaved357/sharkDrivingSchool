import type { Booking } from '@shark/shared';

export type NewBooking = Booking;

/** Storage port for bookings. Implementations: D1 (prod) and in-memory (Node dev/tests). */
export interface BookingRepository {
  create(booking: NewBooking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  /** Times already taken on a date (excluding cancelled bookings). */
  listBookedTimes(date: string): Promise<string[]>;
}

/** Thrown by implementations when the unique slot constraint is hit. */
export class SlotTakenError extends Error {
  constructor() {
    super('Slot already booked');
    this.name = 'SlotTakenError';
  }
}
