import type { ContactMessage, ContactRepository } from '../contact.repository';

export class MemoryContactRepository implements ContactRepository {
  readonly rows: ContactMessage[] = [];

  async create(m: ContactMessage): Promise<ContactMessage> {
    this.rows.push(m);
    return m;
  }
}
