/**
 * Cloudflare Workers entry (production). `wrangler dev` / `wrangler deploy` use this file.
 */
import { createApp } from './app';
import { loadConfig } from './config';
import { buildDeps } from './deps';
import { D1EnquiryRepository } from './repositories/d1/enquiry.d1';
import { D1ContactRepository } from './repositories/d1/contact.d1';

export interface WorkerBindings {
  DB: D1Database;
  ALLOWED_ORIGINS?: string;
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
  FROM_EMAIL?: string;
  EMAIL_CUSTOMER?: string;
  WHATSAPP_PROVIDER?: string;
  WHATSAPP_TO?: string;
  CALLMEBOT_API_KEY?: string;
  WHATSAPP_CLOUD_TOKEN?: string;
  WHATSAPP_CLOUD_PHONE_NUMBER_ID?: string;
  WHATSAPP_CLOUD_TEMPLATE?: string;
  WHATSAPP_CLOUD_TEMPLATE_LANG?: string;
}

const app = createApp((c) => {
  const env = c.env as WorkerBindings;
  return buildDeps(loadConfig(env as unknown as Record<string, unknown>), {
    enquiries: new D1EnquiryRepository(env.DB),
    contacts: new D1ContactRepository(env.DB),
  });
});

export default app;
