/**
 * Cloudflare Workers entry (production). `wrangler dev` / `wrangler deploy` use this file.
 */
import { createApp } from './app';
import { loadConfig } from './config';
import { buildDeps } from './deps';
import { D1BookingRepository } from './repositories/d1/booking.d1';
import { D1ContactRepository } from './repositories/d1/contact.d1';

export interface WorkerBindings {
  DB: D1Database;
  ALLOWED_ORIGINS?: string;
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
  FROM_EMAIL?: string;
}

const app = createApp((c) => {
  const env = c.env as WorkerBindings;
  return buildDeps(loadConfig(env as unknown as Record<string, unknown>), {
    bookings: new D1BookingRepository(env.DB),
    contacts: new D1ContactRepository(env.DB),
  });
});

export default app;
