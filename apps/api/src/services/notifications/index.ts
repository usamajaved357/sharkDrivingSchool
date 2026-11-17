import type { AppConfig } from '../../config';
import { ConsoleNotifier } from './console.notifier';
import type { Notifier } from './notifier';
import { ResendNotifier } from './resend.notifier';

export function createNotifier(config: AppConfig): Notifier {
  if (config.resendApiKey && config.fromEmail && config.notifyEmail) {
    return new ResendNotifier({ apiKey: config.resendApiKey, from: config.fromEmail, ownerEmail: config.notifyEmail });
  }
  return new ConsoleNotifier();
}

export type { Notifier } from './notifier';
