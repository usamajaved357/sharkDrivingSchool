/**
 * Ways to deliver a WhatsApp message to the owner's phone. Pick one with WHATSAPP_PROVIDER.
 *
 * - "callmebot": free CallMeBot API. Simplest for alerts to your own number; the owner
 *   activates it once (see docs/DEPLOYMENT.md) and gets an API key.
 * - "cloud": Meta's official WhatsApp Cloud API from a WhatsApp Business number. Free-form
 *   text only arrives inside a 24h chat window, so for reliable alerts use an approved
 *   template (WHATSAPP_CLOUD_TEMPLATE) whose body has 6 variables:
 *   {{1}} reference, {{2}} name, {{3}} lesson, {{4}} when, {{5}} phone, {{6}} pick-up.
 */
export interface WhatsAppMessage {
  /** Full formatted message (CallMeBot, or Cloud API text mode). */
  text: string;
  /** Short single-line values for a Cloud API template (no line breaks allowed there). */
  templateParams: string[];
}

export interface WhatsAppSender {
  send(to: string, message: WhatsAppMessage): Promise<void>;
}

export class CallMeBotSender implements WhatsAppSender {
  constructor(
    private readonly apiKey: string,
    private readonly apiUrl = 'https://api.callmebot.com/whatsapp.php',
  ) {}

  async send(to: string, message: WhatsAppMessage): Promise<void> {
    const url = new URL(this.apiUrl);
    url.searchParams.set('phone', `+${to}`);
    url.searchParams.set('text', message.text);
    url.searchParams.set('apikey', this.apiKey);
    const res = await fetch(url);
    const body = await res.text();
    // CallMeBot answers 200 with an HTML page even on some errors, so check the body too.
    if (!res.ok || /error|invalid/i.test(body)) throw new Error(`CallMeBot ${res.status}: ${body.slice(0, 200)}`);
  }
}

export interface CloudOptions {
  token: string;
  phoneNumberId: string;
  /** Approved template name; when unset, a plain text message is sent. */
  template?: string;
  templateLang: string;
  apiUrl?: string;
}

export class WhatsAppCloudSender implements WhatsAppSender {
  constructor(private readonly opts: CloudOptions) {}

  async send(to: string, message: WhatsAppMessage): Promise<void> {
    const base = this.opts.apiUrl ?? 'https://graph.facebook.com/v21.0';
    const payload = this.opts.template
      ? {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: this.opts.template,
            language: { code: this.opts.templateLang },
            components: [{ type: 'body', parameters: message.templateParams.map((text) => ({ type: 'text', text })) }],
          },
        }
      : { messaging_product: 'whatsapp', to, type: 'text', text: { preview_url: false, body: message.text } };

    const res = await fetch(`${base}/${this.opts.phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.opts.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`WhatsApp Cloud ${res.status}: ${await res.text()}`);
  }
}
