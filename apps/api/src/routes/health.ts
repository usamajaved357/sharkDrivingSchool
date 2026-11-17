import { Hono } from 'hono';
import type { AppEnv } from '../deps';
import { ok } from '../lib/respond';

export const healthRoutes = new Hono<AppEnv>().get('/', (c) => ok(c, { status: 'ok', time: new Date().toISOString() }));
