import type { Enquiry } from '@shark/shared';

/** Storage port for enquiries. Implementations: D1 (prod) and in-memory (Node dev/tests). */
export interface EnquiryRepository {
  create(enquiry: Enquiry): Promise<Enquiry>;
  findById(id: string): Promise<Enquiry | null>;
}
