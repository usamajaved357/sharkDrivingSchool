import { z } from 'zod';
import { AVAILABILITY_OPTIONS, EXPERIENCE_LEVELS, GENDERS, INSTRUCTOR_PREFS, INTEREST_IDS, TRANSMISSIONS } from '../constants';
import { ukPhone, ukPostcode } from './fields';

const optionalText = (max: number, message: string) => z.string().trim().max(max, message).optional().default('');

/**
 * A learner's enquiry from the website form. The school contacts them to arrange lessons,
 * so there is no date/time picking here. Used by the form (browser) and the API.
 */
export const EnquiryRequestSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Please enter your full name').max(100),
    gender: z.enum(GENDERS, { error: 'Please choose one' }),
    phone: ukPhone,
    /** Optional: if given, the learner is emailed a copy. */
    email: z
      .string()
      .trim()
      .max(200)
      .refine((v) => v === '' || z.email().safeParse(v).success, 'Please enter a valid email, or leave it blank')
      .optional()
      .default(''),
    /** Pick-up address (house number and street). */
    address: z.string().trim().min(3, 'Please enter your address').max(120),
    postcode: ukPostcode,
    transmission: z.enum(TRANSMISSIONS, { error: 'Please choose manual or automatic' }),
    experience: z.enum(EXPERIENCE_LEVELS, { error: 'Please tell us your driving experience' }),
    testBooked: z.enum(['yes', 'no'], { error: 'Please tell us if your test is booked' }),
    testCentre: optionalText(80, 'Please keep the test centre under 80 characters'),
    testDate: z.union([z.literal(''), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter the test date')]).optional().default(''),
    testTime: z.union([z.literal(''), z.string().regex(/^\d{2}:\d{2}$/, 'Please enter the test time')]).optional().default(''),
    availability: z.array(z.enum(AVAILABILITY_OPTIONS)).max(AVAILABILITY_OPTIONS.length).optional().default([]),
    availabilityNotes: optionalText(200, 'Please keep this under 200 characters'),
    instructorPref: z.enum(INSTRUCTOR_PREFS, { error: 'Please choose a preference' }),
    interest: z.enum(INTEREST_IDS).optional().default('not-sure'),
    notes: optionalText(500, 'Please keep notes under 500 characters'),
    agreeTerms: z.literal(true, { error: 'Please agree to the terms and privacy policy' }),
  })
  .superRefine(
    (v, ctx) => {
      if (v.testBooked === 'yes') {
        if (!v.testCentre) ctx.addIssue({ code: 'custom', path: ['testCentre'], message: 'Please enter the test centre' });
        if (!v.testDate) ctx.addIssue({ code: 'custom', path: ['testDate'], message: 'Please enter the test date' });
        if (!v.testTime) ctx.addIssue({ code: 'custom', path: ['testTime'], message: 'Please enter the test time' });
      }
      if (!v.availability?.length && !v.availabilityNotes) {
        ctx.addIssue({ code: 'custom', path: ['availability'], message: 'Please tell us when you are free' });
      }
    },
    // Run even when other fields are invalid, so every error shows in one go.
    { when: () => true },
  );

export type EnquiryRequest = z.infer<typeof EnquiryRequestSchema>;

export const EnquiryStatusSchema = z.enum(['new', 'contacted', 'closed']);
export type EnquiryStatus = z.infer<typeof EnquiryStatusSchema>;

/** A stored enquiry. The terms checkbox is required to send, so it isn't stored. */
export interface Enquiry extends Omit<EnquiryRequest, 'agreeTerms'> {
  id: string;
  reference: string;
  status: EnquiryStatus;
  createdAt: string;
}
