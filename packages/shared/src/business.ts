/**
 * Core business details, shared by the website (config/site.ts) and the API
 * (booking emails and WhatsApp messages). Edit here and both stay in sync.
 */
export const BUSINESS = {
  name: 'Shark Driving School',
  /** The business used to trade as this; older Google reviews mention it. */
  formerName: '1-2 Drive',
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
  /** Google Business Profile (reviews, map listing). */
  google: {
    placeId: 'ChIJ8f6ZyT6xe0gRJnndLD5SVfE',
    mapsUrl: 'https://www.google.com/maps/place/?q=place_id:ChIJ8f6ZyT6xe0gRJnndLD5SVfE',
    reviewsUrl: 'https://search.google.com/local/reviews?placeid=ChIJ8f6ZyT6xe0gRJnndLD5SVfE',
    writeReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ8f6ZyT6xe0gRJnndLD5SVfE',
  },
} as const;

