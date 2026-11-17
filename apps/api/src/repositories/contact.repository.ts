import type { ContactRequest } from '@shark/shared';

export interface ContactMessage extends ContactRequest {
  id: string;
  createdAt: string;
}

export interface ContactRepository {
  create(message: ContactMessage): Promise<ContactMessage>;
}
