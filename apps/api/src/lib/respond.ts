import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { ApiFailure, ApiSuccess } from '@shark/shared';

export const ok = <T>(c: Context, data: T, status: ContentfulStatusCode = 200) =>
  c.json<ApiSuccess<T>>({ ok: true, data }, status);

export const fail = (
  c: Context,
  status: ContentfulStatusCode,
  code: string,
  message: string,
  fields?: Record<string, string>,
) => c.json<ApiFailure>({ ok: false, error: { code, message, ...(fields ? { fields } : {}) } }, status);
