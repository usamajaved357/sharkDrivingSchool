import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadConfig } from '../../config';
import { createNotifier } from './index';
import { MultiNotifier } from './multi.notifier';
import type { Notifier } from './notifier';
import { ResendNotifier } from './resend.notifier';
import { sampleBooking } from './test-fixtures';
import { WhatsAppNotifier } from './whatsapp.notifier';
import { CallMeBotSender, WhatsAppCloudSender } from './whatsapp/senders';

/** Captures outgoing fetch calls and answers each with `reply`. */
function mockFetch(reply: () => Response = () => new Response('Message queued', { status: 200 })) {
  const calls: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      return reply();
    }),
  );
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

describe('ResendNotifier', () => {
  it('emails the owner and the learner', async () => {
    const calls = mockFetch(() => Response.json({ id: 'e1' }));
    await new ResendNotifier({ apiKey: 'k', from: 'Shark <b@x.co.uk>', ownerEmail: 'owner@x.co.uk', emailCustomer: true }).bookingCreated(
      sampleBooking(),
    );
    const bodies = calls.map((c) => JSON.parse(String(c.init?.body)));
    expect(calls[0]!.url).toBe('https://api.resend.com/emails');
    expect(calls[0]!.init?.headers).toMatchObject({ Authorization: 'Bearer k' });
    expect(bodies.map((b) => b.to)).toEqual(['owner@x.co.uk', 'sam@example.com']);
    expect(bodies[0].reply_to).toBe('sam@example.com'); // owner can reply straight to the learner
    expect(bodies[0].subject).toContain('New booking SHK-ABC234');
    expect(bodies[0].text).toContain('Pick-up: 12 Test Street, M14 5RB');
    // Logo travels inline with every email, matching the cid: in the HTML.
    for (const body of bodies) {
      expect(body.attachments[0]).toMatchObject({ content_id: 'shark-logo', filename: expect.stringMatching(/\.jpg$/) });
      expect(body.html).toContain('cid:shark-logo');
    }
  });

  it('can skip the learner email', async () => {
    const calls = mockFetch(() => Response.json({ id: 'e1' }));
    await new ResendNotifier({ apiKey: 'k', from: 'f', ownerEmail: 'o', emailCustomer: false }).bookingCreated(sampleBooking());
    expect(calls).toHaveLength(1);
  });
});

describe('WhatsApp senders', () => {
  it('CallMeBot sends the full message to the owner number', async () => {
    const calls = mockFetch();
    await new WhatsAppNotifier(new CallMeBotSender('secret'), '447440260063').bookingCreated(sampleBooking());
    const url = new URL(calls[0]!.url);
    expect(url.origin + url.pathname).toBe('https://api.callmebot.com/whatsapp.php');
    expect(url.searchParams.get('phone')).toBe('+447440260063');
    expect(url.searchParams.get('apikey')).toBe('secret');
    expect(url.searchParams.get('text')).toContain('New booking request');
    expect(url.searchParams.get('text')).toContain('Sam Learner');
  });

  it('CallMeBot treats an error page as a failure', async () => {
    mockFetch(() => new Response('APIKey is invalid', { status: 200 }));
    await expect(new CallMeBotSender('bad').send('44', { text: 'x', templateParams: [] })).rejects.toThrow(/CallMeBot/);
  });

  it('Cloud API sends an approved template with 6 one-line values', async () => {
    const calls = mockFetch(() => Response.json({ messages: [{ id: 'w1' }] }));
    const sender = new WhatsAppCloudSender({ token: 't', phoneNumberId: '123', template: 'new_booking', templateLang: 'en_GB' });
    await new WhatsAppNotifier(sender, '447440260063').bookingCreated(sampleBooking());
    expect(calls[0]!.url).toBe('https://graph.facebook.com/v21.0/123/messages');
    const body = JSON.parse(String(calls[0]!.init?.body));
    expect(body).toMatchObject({ to: '447440260063', type: 'template', template: { name: 'new_booking', language: { code: 'en_GB' } } });
    const params = body.template.components[0].parameters.map((p: { text: string }) => p.text);
    expect(params).toEqual([
      'SHK-ABC234',
      'Sam Learner',
      '10-hour block (Manual)',
      'Tuesday 24 November 2026 at 10:00',
      '07123456789',
      '12 Test Street, M14 5RB',
    ]);
    expect(params.every((p: string) => !p.includes('\n'))).toBe(true);
  });

  it('Cloud API sends plain text when no template is set', async () => {
    const calls = mockFetch(() => Response.json({}));
    await new WhatsAppCloudSender({ token: 't', phoneNumberId: '123', templateLang: 'en_GB' }).send('44', { text: 'hello', templateParams: [] });
    expect(JSON.parse(String(calls[0]!.init?.body))).toMatchObject({ type: 'text', text: { body: 'hello' } });
  });
});

describe('MultiNotifier', () => {
  it('keeps going when one channel fails', async () => {
    const ok: Notifier = { bookingCreated: vi.fn(async () => {}), contactReceived: vi.fn(async () => {}) };
    const broken: Notifier = { bookingCreated: vi.fn(async () => Promise.reject(new Error('down'))), contactReceived: vi.fn(async () => {}) };
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    await new MultiNotifier([
      { name: 'email', notifier: broken },
      { name: 'whatsapp', notifier: ok },
    ]).bookingCreated(sampleBooking());
    expect(ok.bookingCreated).toHaveBeenCalled();
    expect(err).toHaveBeenCalledWith(expect.stringContaining('email booking failed'), expect.any(Error));
  });
});

describe('createNotifier', () => {
  it('sends to the site email and WhatsApp number by default', async () => {
    const calls = mockFetch(() => Response.json({}));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const notifier = createNotifier(
      loadConfig({ RESEND_API_KEY: 'k', FROM_EMAIL: 'f', WHATSAPP_PROVIDER: 'callmebot', CALLMEBOT_API_KEY: 'c' }),
    );
    await notifier.bookingCreated(sampleBooking());
    const owner = calls.find((c) => c.url.includes('resend') && JSON.parse(String(c.init?.body)).to === 'sharkdrivingschools@gmail.com');
    const wa = calls.find((c) => c.url.includes('callmebot'));
    expect(owner).toBeDefined();
    expect(new URL(wa!.url).searchParams.get('phone')).toBe('+447440260063');
  });
});
