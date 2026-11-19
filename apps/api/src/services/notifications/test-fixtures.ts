/** Shared sample data for notification tests. */
import type { Booking } from '@shark/shared';

export const sampleBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: 'b1',
  reference: 'SHK-ABC234',
  status: 'pending',
  createdAt: '2026-11-19T10:00:00.000Z',
  transmission: 'manual',
  lessonType: 'block-10',
  date: '2026-11-24',
  time: '10:00',
  fullName: 'Sam Learner',
  phone: '07123456789',
  email: 'sam@example.com',
  address: '12 Test Street',
  postcode: 'M14 5RB',
  experience: 'some',
  theoryTest: 'passed',
  instructorPref: 'female',
  notes: 'Test booked for January',
  ...overrides,
});
