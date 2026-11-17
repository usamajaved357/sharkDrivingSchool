/** Runtime configuration, resolved from Worker bindings or process.env. */
export interface AppConfig {
  allowedOrigins: string[];
  resendApiKey?: string;
  notifyEmail?: string;
  fromEmail?: string;
}

type RawEnv = Record<string, unknown>;

const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;

export function loadConfig(env: RawEnv): AppConfig {
  return {
    allowedOrigins: (str(env.ALLOWED_ORIGINS) ?? 'http://localhost:4321')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    resendApiKey: str(env.RESEND_API_KEY),
    notifyEmail: str(env.NOTIFY_EMAIL),
    fromEmail: str(env.FROM_EMAIL),
  };
}
