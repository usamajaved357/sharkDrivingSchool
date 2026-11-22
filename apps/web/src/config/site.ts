import { BUSINESS } from '@shark/shared';

/**
 * Business details used across the site. Name, URL, phone, email and address come from
 * BUSINESS in @shark/shared (also used by the API's emails and WhatsApp messages).
 * Values in [brackets] are placeholders the owner must confirm before launch.
 */
export const site = {
  name: BUSINESS.name,
  shortName: 'Shark',
  city: 'Manchester',
  region: 'Greater Manchester',
  url: BUSINESS.url,
  description:
    'Manual and automatic driving lessons across Greater Manchester with patient, DVSA-approved instructors. Flexible slots, door-to-door pick-up and a plan built around your test date.',
  phone: BUSINESS.phone,
  email: BUSINESS.email,
  /** Business address (footer, structured data for Google, policy contact details). */
  address: BUSINESS.address,
  /** Previous trading name, shown so returning customers and older reviews make sense. */
  formerName: BUSINESS.formerName,
  /** From the Google Business Profile (22 Nov 2026). Update when the count changes. */
  googleRating: '5.0',
  googleReviewCount: '18',
  google: BUSINESS.google,
  /** Notice needed to cancel or move a lesson without charge (shown on the booking page and in the terms). */
  cancellationHours: '48',
} as const;

/** One-line address in standard UK style (no comma before the postcode): "9 Havers Road, Manchester M18 8UN". */
export const addressLine = `${site.address.street}, ${site.address.city} ${site.address.postcode}`;
/** Opens the business's Google Maps listing (a plain link; nothing is loaded from Google until clicked). */
export const mapsHref = BUSINESS.google.mapsUrl;

/**
 * Details used by the privacy policy, terms and cookie policy (data/legal/*).
 * Empty strings are left out of the pages, so fill them in when known (see docs/ROADMAP.md).
 */
export const legal = {
  /** Legal owner of the business, e.g. "Jane Smith" (sole trader) or "Shark Driving Ltd". */
  ownerName: '',
  /** Postal address for legal and data-protection requests. */
  address: addressLine,
  /** ICO data-protection registration number (ico.org.uk). */
  icoNumber: '',
  lastUpdated: '19 November 2026',
  /** How long block and course hours stay valid after purchase. */
  blockValidityMonths: 12,
} as const;

/**
 * Search engine verification (paste the codes from Google Search Console / Bing Webmaster
 * Tools when you add the site; empty = not rendered). DNS verification works too.
 */
export const seo = {
  googleSiteVerification: '',
  bingSiteVerification: '',
} as const;

export const telHref = `tel:${site.phone.tel}`;
export const whatsappHref = `https://wa.me/${site.phone.whatsapp}`;
export const mailtoHref = `mailto:${site.email}`;

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: 'Courses', href: '/#courses' },
  { label: 'Prices', href: '/prices' },
  { label: 'Areas', href: '/#areas' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Instructors', href: '/#careers' },
  { label: 'FAQ', href: '/#faq' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Courses',
    links: [
      { label: 'Beginner lessons', href: '/prices' },
      { label: 'Intensive courses', href: '/prices#intensive' },
      { label: 'Automatic lessons', href: '/prices' },
      { label: 'Refresher lessons', href: '/prices#extras' },
      { label: 'Pass Plus', href: '/prices#extras' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Reviews', href: '/#reviews' },
      { label: 'Areas we cover', href: '/#areas' },
      { label: 'Become an instructor', href: '/#careers' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Book a lesson', href: '/book' },
    ],
  },
];
