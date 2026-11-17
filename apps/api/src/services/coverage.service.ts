import { COVERED_POSTCODE_AREAS, type CoverageResponse } from '@shark/shared';
import { badRequest } from '../lib/errors';

/** Checks whether a postcode falls in an area we teach in. */
export class CoverageService {
  check(rawPostcode: string): CoverageResponse {
    const postcode = rawPostcode.trim().toUpperCase().replace(/\s+/g, ' ');
    const area = /^([A-Z]{1,2})\d/.exec(postcode)?.[1];
    if (!area) throw badRequest('Please enter a valid postcode', { postcode: 'Invalid postcode' });
    return { postcode, covered: (COVERED_POSTCODE_AREAS as readonly string[]).includes(area) };
  }
}
