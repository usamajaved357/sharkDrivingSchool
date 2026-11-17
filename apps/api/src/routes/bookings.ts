import { Hono } from 'hono';
import { BookingRequestSchema } from '@shark/shared';
import type { AppEnv } from '../deps';
import { ok } from '../lib/respond';
import { validate } from '../middleware/validate';

/** POST /api/bookings — create a booking request from the website wizard. */
export const bookingRoutes = new Hono<AppEnv>().post('/', validate('json', BookingRequestSchema), async (c) => {
  const result = await c.var.deps.services.bookings.create(c.req.valid('json'));
  return ok(c, result, 201);
});
