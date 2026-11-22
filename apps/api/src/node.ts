/**
 * Node.js entry (local development, or self-hosting on any Node server).
 * Uses in-memory storage — swap in a SQL repository for persistent Node hosting.
 */
import { serve } from '@hono/node-server';
import { createApp } from './app';
import { loadConfig } from './config';
import { buildDeps } from './deps';
import { MemoryEnquiryRepository } from './repositories/memory/enquiry.memory';
import { MemoryContactRepository } from './repositories/memory/contact.memory';

try {
  process.loadEnvFile?.('.env');
} catch {
  /* no .env file — defaults apply */
}

const deps = buildDeps(loadConfig(process.env), {
  enquiries: new MemoryEnquiryRepository(),
  contacts: new MemoryContactRepository(),
});

const app = createApp(() => deps);
const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🦈 Shark API (Node) listening on http://localhost:${info.port}`);
});
