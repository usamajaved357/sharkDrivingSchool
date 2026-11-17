import { z } from 'zod';

/** Loose UK phone check: 10–11 digits after stripping spaces, optional +44. */
export const ukPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ''))
  .refine((v) => /^(\+44|0)\d{9,10}$/.test(v), 'Please enter a valid UK phone number');

/** UK postcode (outward + inward), normalised to upper case with one space. */
export const ukPostcode = z
  .string()
  .trim()
  .toUpperCase()
  .refine((v) => /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/.test(v), 'Please enter a valid UK postcode')
  .transform((v) => v.replace(/\s+/g, '').replace(/^(.+)(\d[A-Z]{2})$/, '$1 $2'));

/** Outward code only (e.g. "M14") — used by the coverage check. */
export const outwardCode = z
  .string()
  .trim()
  .toUpperCase()
  .refine((v) => /^[A-Z]{1,2}\d[A-Z\d]?/.test(v), 'Please enter a valid postcode');
