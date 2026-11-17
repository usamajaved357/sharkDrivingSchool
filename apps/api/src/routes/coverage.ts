import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../deps';
import { ok } from '../lib/respond';
import { validate } from '../middleware/validate';

const query = z.object({ postcode: z.string().min(2).max(10) });

/** GET /api/coverage?postcode=M14%205RB */
export const coverageRoutes = new Hono<AppEnv>().get('/', validate('query', query), (c) => {
  return ok(c, c.var.deps.services.coverage.check(c.req.valid('query').postcode));
});
