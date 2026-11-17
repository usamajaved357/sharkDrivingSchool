import { Hono } from 'hono';
import { ContactRequestSchema } from '@shark/shared';
import type { AppEnv } from '../deps';
import { ok } from '../lib/respond';
import { validate } from '../middleware/validate';

/** POST /api/contact */
export const contactRoutes = new Hono<AppEnv>().post('/', validate('json', ContactRequestSchema), async (c) => {
  return ok(c, await c.var.deps.services.contact.submit(c.req.valid('json')), 201);
});
