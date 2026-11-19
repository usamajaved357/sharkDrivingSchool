/**
 * Core business details, shared by the website (config/site.ts) and the API
 * (booking emails and WhatsApp messages). Edit here and both stay in sync.
 */
export const BUSINESS = {
  name: 'Shark Driving School',
  /** TODO(owner): confirm the final domain before launch. */
  url: 'https://www.sharkdrivingschools.com',
  phone: {
    display: '07440 260063',
    tel: '07440260063',
    /** International format without "+", as used by wa.me and WhatsApp APIs. */
    whatsapp: '447440260063',
  },
  email: 'sharkdrivingschools@gmail.com',
  address: {
    street: '9 Havers Road',
    city: 'Manchester',
    postcode: 'M18 8UN',
    country: 'GB',
  },
  region: 'Greater Manchester',
} as const;

/** Absolute URL of the logo used in emails. */
export const BUSINESS_LOGO_URL = `${BUSINESS.url}/images/logo.jpg`;
