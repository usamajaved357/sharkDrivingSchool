/**
 * Domain constants shared by the web app and the API.
 * Changing an id here is a breaking change for stored bookings — add, don't rename.
 */

export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const LESSON_TYPE_IDS = ['single', 'block-10', 'intensive', 'pass-plus'] as const;
export type LessonTypeId = (typeof LESSON_TYPE_IDS)[number];

/** Bookable start times offered in the booking wizard (24h, Europe/London). */
export const TIME_SLOTS = ['07:00', '08:30', '10:00', '11:30', '13:00', '15:30', '17:00', '19:30'] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

/** How many days ahead the booking wizard shows. */
export const BOOKING_WINDOW_DAYS = 7;

/**
 * Greater Manchester postcode areas we treat as "covered".
 * TODO(owner): confirm the exact districts Shark Driving School covers.
 */
export const COVERED_POSTCODE_AREAS = ['M', 'BL', 'OL', 'SK', 'WN', 'WA'] as const;
