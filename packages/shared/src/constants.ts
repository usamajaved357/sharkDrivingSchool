/**
 * Domain constants shared by the web app and the API.
 * Changing an id here is a breaking change for stored enquiries — add, don't rename.
 */

export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const LESSON_TYPE_IDS = ['single', 'block-10', 'intensive', 'pass-plus'] as const;
export type LessonTypeId = (typeof LESSON_TYPE_IDS)[number];

/** Learner's gender (enquiry form). */
export const GENDERS = ['male', 'female', 'prefer-not'] as const;
export type Gender = (typeof GENDERS)[number];

/** Learner's driving experience (enquiry form). */
export const EXPERIENCE_LEVELS = ['none', 'some', 'test-ready', 'retest'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

/** Instructor preference (enquiry form). */
export const INSTRUCTOR_PREFS = ['any', 'male', 'female'] as const;
export type InstructorPref = (typeof INSTRUCTOR_PREFS)[number];

/** When the learner is free for lessons (enquiry form, tick any). */
export const AVAILABILITY_OPTIONS = ['weekday-mornings', 'weekday-afternoons', 'weekday-evenings', 'saturdays', 'sundays'] as const;
export type AvailabilityOption = (typeof AVAILABILITY_OPTIONS)[number];

/** What the learner is interested in (optional; prefilled from "Book" buttons on the prices page). */
export const INTEREST_IDS = [...LESSON_TYPE_IDS, 'not-sure'] as const;
export type InterestId = (typeof INTEREST_IDS)[number];

/** Human-readable labels, used by the enquiry form, emails and WhatsApp messages. */
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
export const INSTRUCTOR_PREF_LABELS: Record<InstructorPref, string> = {
  any: 'No preference',
  male: 'Male instructor',
  female: 'Female instructor',
};
export const GENDER_LABELS: Record<Gender, string> = { male: 'Male', female: 'Female', 'prefer-not': 'Prefer not to say' };
export const AVAILABILITY_LABELS: Record<AvailabilityOption, string> = {
  'weekday-mornings': 'Weekday mornings',
  'weekday-afternoons': 'Weekday afternoons',
  'weekday-evenings': 'Weekday evenings',
  saturdays: 'Saturdays',
  sundays: 'Sundays',
};
export const INTEREST_LABELS: Record<InterestId, string> = { ...LESSON_TYPE_LABELS, 'not-sure': 'Not sure yet' };

/**
 * Greater Manchester postcode areas we treat as "covered".
 * TODO(owner): confirm the exact districts Shark Driving School covers.
 */
export const COVERED_POSTCODE_AREAS = ['M', 'BL', 'OL', 'SK', 'WN', 'WA'] as const;
