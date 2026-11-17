/** Random UUID — available in both Workers and Node 20+. */
export const newId = (): string => crypto.randomUUID();

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

/** Short human-friendly booking reference, e.g. "SHK-7KQ2M9". */
export function bookingReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let out = '';
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `SHK-${out}`;
}

export const nowIso = (): string => new Date().toISOString();
