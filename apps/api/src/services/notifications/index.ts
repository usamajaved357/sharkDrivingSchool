import type { AppConfig } from '../../config';
import { ConsoleNotifier } from './console.notifier';
import { MultiNotifier } from './multi.notifier';
import type { Notifier } from './notifier';
import { ResendNotifier } from './resend.notifier';
import { WhatsAppNotifier } from './whatsapp.notifier';
import { CallMeBotSender, WhatsAppCloudSender, type WhatsAppSender } from './whatsapp/senders';

function whatsappSender(w: AppConfig['whatsapp']): WhatsAppSender | null {
  if (w.provider === 'callmebot' && w.callmebotApiKey) return new CallMeBotSender(w.callmebotApiKey, w.callmebotApiUrl);
  if (w.provider === 'cloud' && w.cloudToken && w.cloudPhoneNumberId) {
    return new WhatsAppCloudSender({
      token: w.cloudToken,
      phoneNumberId: w.cloudPhoneNumberId,
      template: w.cloudTemplate,
      templateLang: w.cloudTemplateLang,
      apiUrl: w.cloudApiUrl,
    });
  }
  return null;
}

/**
 * Builds the notifier from config: email (Resend) and/or WhatsApp, whichever are set up.
 * The console channel always runs, so every booking is also visible in the server logs.
 */
export function createNotifier(config: AppConfig): Notifier {
  const channels: { name: string; notifier: Notifier }[] = [{ name: 'console', notifier: new ConsoleNotifier() }];

  const { email } = config;
  if (email.resendApiKey && email.fromEmail) {
    channels.push({
      name: 'email',
      notifier: new ResendNotifier({
        apiKey: email.resendApiKey,
        from: email.fromEmail,
        ownerEmail: email.notifyEmail,
        emailCustomer: email.emailCustomer,
        apiUrl: email.apiUrl,
      }),
    });
  }

  const sender = whatsappSender(config.whatsapp);
  if (sender) channels.push({ name: 'whatsapp', notifier: new WhatsAppNotifier(sender, config.whatsapp.to) });

  return new MultiNotifier(channels);
}

export type { Notifier } from './notifier';
