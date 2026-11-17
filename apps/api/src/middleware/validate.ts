import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import type { ZodType } from 'zod';
import { fail } from '../lib/respond';

/**
 * zValidator wrapper that returns our standard error envelope with
 * per-field messages the web app can show next to inputs.
 */
export const validate = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || '_';
        fields[key] ??= issue.message;
      }
      return fail(c, 400, 'VALIDATION', 'Please check the highlighted fields', fields);
    }
  });
