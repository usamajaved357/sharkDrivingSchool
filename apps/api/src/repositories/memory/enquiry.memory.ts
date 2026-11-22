import type { Enquiry } from '@shark/shared';
import type { EnquiryRepository } from '../enquiry.repository';

/** In-memory store for local Node development and tests. Data resets on restart. */
export class MemoryEnquiryRepository implements EnquiryRepository {
  private readonly rows = new Map<string, Enquiry>();

  async create(e: Enquiry): Promise<Enquiry> {
    this.rows.set(e.id, e);
    return e;
  }

  async findById(id: string): Promise<Enquiry | null> {
    return this.rows.get(id) ?? null;
  }
}
