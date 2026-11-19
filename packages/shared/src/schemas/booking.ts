import { z } from 'zod';
import { EXPERIENCE_LEVELS, INSTRUCTOR_PREFS, LESSON_TYPE_IDS, THEORY_STATUSES, TIME_SLOTS, TRANSMISSIONS } from '../constants';
import { ukPhone, ukPostcode } from './fields';

export const BookingRequestSchema = z.object({
  transmission: z.enum(TRANSMISSIONS),
  lessonType: z.enum(LESSON_TYPE_IDS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.enum(TIME_SLOTS),
  fullName: z.string().trim().min(2, 'Please enter your full name').max(100),
  phone: ukPhone,
  email: z.email('Please enter a valid email').max(200),
  /** Street address for pick-up (house number and street). */
  address: z.string().trim().min(3, 'Please enter your pick-up address').max(120),
  postcode: ukPostcode,
  experience: z.enum(EXPERIENCE_LEVELS, { error: 'Please tell us your driving experience' }),
  theoryTest: z.enum(THEORY_STATUSES, { error: 'Please tell us about your theory test' }),
  instructorPref: z.enum(INSTRUCTOR_PREFS).default('any'),
  notes: z.string().trim().max(500, 'Please keep notes under 500 characters').optional().default(''),
  hasProvisionalLicence: z.literal(true, { error: 'You need a valid UK provisional licence to book' }),
  agreeTerms: z.literal(true, { error: 'Please agree to the terms and privacy policy' }),
});

export type BookingRequest = z.infer<typeof BookingRequestSchema>;

export const BookingStatusSchema = z.enum(['pending', 'confirmed', 'cancelled']);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

/** A stored booking. The two confirmation checkboxes are required to book, so they aren't stored. */
export interface Booking extends Omit<BookingRequest, 'hasProvisionalLicence' | 'agreeTerms'> {
  id: string;
  reference: string;
  status: BookingStatus;
  createdAt: string;
}
