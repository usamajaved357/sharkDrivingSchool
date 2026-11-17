import { z } from 'zod';
import { ukPhone } from './fields';

export const ContactRequestSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: ukPhone.optional(),
  email: z.email().max(200),
  message: z.string().trim().min(5).max(2000),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;
