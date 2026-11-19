import { cookiePolicy } from './cookies';
import { privacyPolicy } from './privacy';
import { termsAndConditions } from './terms';
import type { LegalDoc } from './types';

export type { LegalBlock, LegalDoc, LegalSection, LegalSlug } from './types';

/** All legal pages, in the order they appear in "Other policies" links. */
export const legalDocs: LegalDoc[] = [privacyPolicy, termsAndConditions, cookiePolicy];
