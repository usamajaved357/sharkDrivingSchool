import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import type { AppDeps, AppEnv } from './deps';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { availabilityRoutes } from './routes/availability';
import { bookingRoutes } from './routes/bookings';
import { contactRoutes } from './routes/contact';
import { coverageRoutes } from './routes/coverage';
import { healthRoutes } from './routes/health';

/**
 * Builds the Hono app. Runtime-agnostic: the caller decides how deps are
 * created (D1 on Cloudflare, in-memory on Node).
 */
export function createApp(resolveDeps: (c: Context) => AppDeps) {
  const app = new Hono<AppEnv>();

  app.use('*', async (c, next) => {
    c.set('deps', resolveDeps(c));
    await next();
  });
  app.use('*', logger());
  app.use('*', secureHeaders());
  app.use(
    '/api/*',
    cors({
      origin: (origin, c: Context<AppEnv>) => (c.var.deps.config.allowedOrigins.includes(origin) ? origin : null),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
      maxAge: 86400,
    }),
  );

  app.route('/api/health', healthRoutes);
  app.route('/api/availability', availabilityRoutes);
  app.route('/api/bookings', bookingRoutes);
  app.route('/api/contact', contactRoutes);
  app.route('/api/coverage', coverageRoutes);

  app.onError(errorHandler);
  app.notFound(notFoundHandler);
  return app;
}
