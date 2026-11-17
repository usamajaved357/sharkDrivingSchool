import type { ContentfulStatusCode } from 'hono/utils/http-status';

/** Throw from services; the error handler turns it into the JSON envelope. */
export class HttpError extends Error {
  constructor(
    public readonly status: ContentfulStatusCode,
    public readonly code: string,
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const badRequest = (message: string, fields?: Record<string, string>) =>
  new HttpError(400, 'BAD_REQUEST', message, fields);
export const notFound = (message = 'Not found') => new HttpError(404, 'NOT_FOUND', message);
export const conflict = (message: string) => new HttpError(409, 'CONFLICT', message);
