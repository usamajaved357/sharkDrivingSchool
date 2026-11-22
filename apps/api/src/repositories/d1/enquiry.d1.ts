import {
  AVAILABILITY_OPTIONS,
  type AvailabilityOption,
  type Enquiry,
  type EnquiryStatus,
  type ExperienceLevel,
  type Gender,
  type InstructorPref,
  type InterestId,
  type Transmission,
} from '@shark/shared';
import type { EnquiryRepository } from '../enquiry.repository';

interface EnquiryRow {
  id: string;
  reference: string;
  full_name: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  postcode: string;
  transmission: string;
  experience: string;
  test_booked: string;
  test_centre: string;
  test_date: string;
  test_time: string;
  availability: string;
  availability_notes: string;
  instructor_pref: string;
  interest: string;
  notes: string;
  status: string;
  created_at: string;
}

const isAvailability = (v: string): v is AvailabilityOption => (AVAILABILITY_OPTIONS as readonly string[]).includes(v);

const toEnquiry = (r: EnquiryRow): Enquiry => ({
  id: r.id,
  reference: r.reference,
  fullName: r.full_name,
  gender: r.gender as Gender,
  phone: r.phone,
  email: r.email,
  address: r.address,
  postcode: r.postcode,
  transmission: r.transmission as Transmission,
  experience: r.experience as ExperienceLevel,
  testBooked: r.test_booked === 'yes' ? 'yes' : 'no',
  testCentre: r.test_centre,
  testDate: r.test_date,
  testTime: r.test_time,
  availability: r.availability.split(',').filter(isAvailability),
  availabilityNotes: r.availability_notes,
  instructorPref: r.instructor_pref as InstructorPref,
  interest: r.interest as InterestId,
  notes: r.notes,
  status: r.status as EnquiryStatus,
  createdAt: r.created_at,
});

export class D1EnquiryRepository implements EnquiryRepository {
  constructor(private readonly db: D1Database) {}

  async create(e: Enquiry): Promise<Enquiry> {
    await this.db
      .prepare(
        `INSERT INTO enquiries (id, reference, full_name, gender, phone, email, address, postcode, transmission,
           experience, test_booked, test_centre, test_date, test_time, availability, availability_notes,
           instructor_pref, interest, notes, status, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21)`,
      )
      .bind(
        e.id,
        e.reference,
        e.fullName,
        e.gender,
        e.phone,
        e.email,
        e.address,
        e.postcode,
        e.transmission,
        e.experience,
        e.testBooked,
        e.testCentre,
        e.testDate,
        e.testTime,
        e.availability.join(','),
        e.availabilityNotes,
        e.instructorPref,
        e.interest,
        e.notes,
        e.status,
        e.createdAt,
      )
      .run();
    return e;
  }

  async findById(id: string): Promise<Enquiry | null> {
    const row = await this.db.prepare('SELECT * FROM enquiries WHERE id = ?1').bind(id).first<EnquiryRow>();
    return row ? toEnquiry(row) : null;
  }
}
