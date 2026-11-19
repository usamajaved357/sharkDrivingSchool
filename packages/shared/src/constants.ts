/**
 * Domain constants shared by the web app and the API.
 * Changing an id here is a breaking change for stored bookings — add, don't rename.
 */

export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const LESSON_TYPE_IDS = ['single', 'block-10', 'intensive', 'pass-plus'] as const;
export type LessonTypeId = (typeof LESSON_TYPE_IDS)[number];

/** Learner's driving experience (booking form). */
export const EXPERIENCE_LEVELS = ['none', 'some', 'test-ready', 'retest'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

/** Theory test status (booking form). */
export const THEORY_STATUSES = ['passed', 'booked', 'not-yet'] as const;
export type TheoryStatus = (typeof THEORY_STATUSES)[number];

/** Instructor preference (booking form). */
export const INSTRUCTOR_PREFS = ['any', 'male', 'female'] as const;
export type InstructorPref = (typeof INSTRUCTOR_PREFS)[number];

/** Human-readable labels, used by the booking form, emails and WhatsApp messages. */
export const TRANSMISSION_LABELS: Record<Transmission, string> = { manual: 'Manual', automatic: 'Automatic' };
export const LESSON_TYPE_LABELS: Record<LessonTypeId, string> = {
  single: 'Single lesson',
  'block-10': '10-hour block',
  intensive: 'Intensive course',
  'pass-plus': 'Pass Plus',
};
export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  none: 'Complete beginner',
  some: 'Had some lessons',
  'test-ready': 'Nearly test-ready',
  retest: 'Retaking my test',
};
export const THEORY_LABELS: Record<TheoryStatus, string> = {
  passed: 'Passed',
  booked: 'Booked',
  'not-yet': 'Not taken yet',
};
export const INSTRUCTOR_PREF_LABELS: Record<InstructorPref, string> = {
  any: 'No preference',
  male: 'Male instructor',
  female: 'Female instructor',
};

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
