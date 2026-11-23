import { Hono } from 'hono';
import type { AppEnv } from '../deps';
import { ok } from '../lib/respond';

/** GET /api/reviews — live Google rating and reviews (null when not set up). Never cached. */
export const reviewRoutes = new Hono<AppEnv>().get('/', async (c) => {
  c.header('Cache-Control', 'no-store');
  return ok(c, await c.var.deps.services.reviews.get());
});
