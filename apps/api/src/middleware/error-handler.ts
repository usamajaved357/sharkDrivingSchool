import type { ErrorHandler, NotFoundHandler } from 'hono';
import { HttpError } from '../lib/errors';
import { fail } from '../lib/respond';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HttpError) {
    return fail(c, err.status, err.code, err.message, err.fields);
  }
  console.error('[api] unhandled error', err);
  return fail(c, 500, 'INTERNAL', 'Something went wrong. Please call us instead.');
};

export const notFoundHandler: NotFoundHandler = (c) => fail(c, 404, 'NOT_FOUND', 'Route not found');
