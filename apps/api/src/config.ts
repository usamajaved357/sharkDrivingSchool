import { BUSINESS } from '@shark/shared';

/** Runtime configuration, resolved from Worker bindings or process.env. */
export interface AppConfig {
  allowedOrigins: string[];
  email: {
    resendApiKey?: string;
    fromEmail?: string;
    /** Where enquiry alerts go (defaults to the business email on the site). */
    notifyEmail: string;
    /** Send the learner a confirmation email too (default on). */
    emailCustomer: boolean;
    apiUrl?: string;
  };
  whatsapp: {
    provider?: 'callmebot' | 'cloud';
    /** Owner's WhatsApp number, international digits (defaults to the site's number). */
    to: string;
    callmebotApiKey?: string;
    callmebotApiUrl?: string;
    cloudToken?: string;
    cloudPhoneNumberId?: string;
    cloudTemplate?: string;
    cloudTemplateLang: string;
    cloudApiUrl?: string;
  };
}

type RawEnv = Record<string, unknown>;

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined);

const digits = (v: string) => v.replace(/\D/g, '');

export function loadConfig(env: RawEnv): AppConfig {
  const provider = str(env.WHATSAPP_PROVIDER);
  return {
    allowedOrigins: (str(env.ALLOWED_ORIGINS) ?? 'http://localhost:4321')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    email: {
      resendApiKey: str(env.RESEND_API_KEY),
      fromEmail: str(env.FROM_EMAIL),
      notifyEmail: str(env.NOTIFY_EMAIL) ?? BUSINESS.email,
      emailCustomer: str(env.EMAIL_CUSTOMER) !== 'false',
      apiUrl: str(env.RESEND_API_URL),
    },
    whatsapp: {
      provider: provider === 'callmebot' || provider === 'cloud' ? provider : undefined,
      to: digits(str(env.WHATSAPP_TO) ?? BUSINESS.phone.whatsapp),
      callmebotApiKey: str(env.CALLMEBOT_API_KEY),
      callmebotApiUrl: str(env.CALLMEBOT_API_URL),
      cloudToken: str(env.WHATSAPP_CLOUD_TOKEN),
      cloudPhoneNumberId: str(env.WHATSAPP_CLOUD_PHONE_NUMBER_ID),
      cloudTemplate: str(env.WHATSAPP_CLOUD_TEMPLATE),
      cloudTemplateLang: str(env.WHATSAPP_CLOUD_TEMPLATE_LANG) ?? 'en_GB',
      cloudApiUrl: str(env.WHATSAPP_CLOUD_API_URL),
    },
  };
}
