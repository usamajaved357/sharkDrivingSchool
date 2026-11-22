/** Shared sample data for notification tests. */
import type { Enquiry } from '@shark/shared';

export const sampleEnquiry = (overrides: Partial<Enquiry> = {}): Enquiry => ({
  id: 'e1',
  reference: 'SHK-ABC234',
  status: 'new',
  createdAt: '2026-11-19T10:00:00.000Z',
  fullName: 'Sam Learner',
  gender: 'female',
  phone: '07123456789',
  email: 'sam@example.com',
  address: '12 Test Street',
  postcode: 'M14 5RB',
  transmission: 'manual',
  experience: 'some',
  testBooked: 'yes',
  testCentre: 'Cheetham Hill',
  testDate: '2027-01-12',
  testTime: '10:00',
  availability: ['weekday-evenings', 'saturdays'],
  availabilityNotes: 'after 5pm',
  instructorPref: 'female',
  interest: 'block-10',
  notes: 'A bit nervous on roundabouts',
  ...overrides,
});
