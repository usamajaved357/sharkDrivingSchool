import type { ContactRequest } from '@shark/shared';
import { newId, nowIso } from '../lib/ids';
import type { ContactRepository } from '../repositories/contact.repository';
import type { Notifier } from './notifications/notifier';

export class ContactService {
  constructor(
    private readonly repo: ContactRepository,
    private readonly notifier: Notifier,
  ) {}

  async submit(input: ContactRequest): Promise<{ id: string }> {
    const message = await this.repo.create({ ...input, id: newId(), createdAt: nowIso() });
    await this.notifier.contactReceived(message).catch((e) => console.error('[notify] contact', e));
    return { id: message.id };
  }
}
