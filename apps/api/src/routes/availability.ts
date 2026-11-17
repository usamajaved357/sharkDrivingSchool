import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../deps';
import { ok } from '../lib/respond';
import { validate } from '../middleware/validate';

const query = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD') });

/** GET /api/availability?date=YYYY-MM-DD */
export const availabilityRoutes = new Hono<AppEnv>().get('/', validate('query', query), async (c) => {
  const { date } = c.req.valid('query');
  return ok(c, await c.var.deps.services.availability.forDate(date));
});
