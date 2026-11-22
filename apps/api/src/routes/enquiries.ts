import { Hono } from 'hono';
import { EnquiryRequestSchema } from '@shark/shared';
import type { AppEnv } from '../deps';
import { ok } from '../lib/respond';
import { validate } from '../middleware/validate';

/** POST /api/enquiries — a learner's details from the website form. */
export const enquiryRoutes = new Hono<AppEnv>().post('/', validate('json', EnquiryRequestSchema), async (c) => {
  const result = await c.var.deps.services.enquiries.create(c.req.valid('json'));
  return ok(c, result, 201);
});
