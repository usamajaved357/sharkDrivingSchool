import { z } from 'zod';
import { LESSON_TYPE_IDS, TIME_SLOTS, TRANSMISSIONS } from '../constants';
import { ukPhone, ukPostcode } from './fields';

export const BookingRequestSchema = z.object({
  transmission: z.enum(TRANSMISSIONS),
  lessonType: z.enum(LESSON_TYPE_IDS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.enum(TIME_SLOTS),
  fullName: z.string().trim().min(2, 'Please enter your full name').max(100),
  phone: ukPhone,
  email: z.email('Please enter a valid email').max(200),
  postcode: ukPostcode,
  hasProvisionalLicence: z.literal(true, { error: 'You need a valid UK provisional licence to book' }),
});

export type BookingRequest = z.infer<typeof BookingRequestSchema>;

export const BookingStatusSchema = z.enum(['pending', 'confirmed', 'cancelled']);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

export interface Booking extends Omit<BookingRequest, 'hasProvisionalLicence'> {
  id: string;
  reference: string;
  status: BookingStatus;
  createdAt: string;
}
