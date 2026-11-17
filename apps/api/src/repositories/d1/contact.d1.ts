import type { ContactMessage, ContactRepository } from '../contact.repository';

export class D1ContactRepository implements ContactRepository {
  constructor(private readonly db: D1Database) {}

  async create(m: ContactMessage): Promise<ContactMessage> {
    await this.db
      .prepare('INSERT INTO contact_messages (id, name, phone, email, message, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
      .bind(m.id, m.name, m.phone ?? null, m.email, m.message, m.createdAt)
      .run();
    return m;
  }
}
