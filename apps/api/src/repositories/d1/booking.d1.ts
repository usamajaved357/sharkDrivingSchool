import type { Booking, BookingStatus, ExperienceLevel, InstructorPref, LessonTypeId, TheoryStatus, TimeSlot, Transmission } from '@shark/shared';
import { SlotTakenError, type BookingRepository, type NewBooking } from '../booking.repository';

interface BookingRow {
  id: string;
  reference: string;
  transmission: string;
  lesson_type: string;
  date: string;
  time: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  postcode: string;
  experience: string;
  theory_test: string;
  instructor_pref: string;
  notes: string;
  status: string;
  created_at: string;
}

const toBooking = (r: BookingRow): Booking => ({
  id: r.id,
  reference: r.reference,
  transmission: r.transmission as Transmission,
  lessonType: r.lesson_type as LessonTypeId,
  date: r.date,
  time: r.time as TimeSlot,
  fullName: r.full_name,
  phone: r.phone,
  email: r.email,
  address: r.address,
  postcode: r.postcode,
  experience: r.experience as ExperienceLevel,
  theoryTest: r.theory_test as TheoryStatus,
  instructorPref: r.instructor_pref as InstructorPref,
  notes: r.notes,
  status: r.status as BookingStatus,
  createdAt: r.created_at,
});

export class D1BookingRepository implements BookingRepository {
  constructor(private readonly db: D1Database) {}

  async create(b: NewBooking): Promise<Booking> {
    try {
      await this.db
        .prepare(
          `INSERT INTO bookings (id, reference, transmission, lesson_type, date, time, full_name, phone, email,
             address, postcode, experience, theory_test, instructor_pref, notes, status, created_at)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)`,
        )
        .bind(
          b.id,
          b.reference,
          b.transmission,
          b.lessonType,
          b.date,
          b.time,
          b.fullName,
          b.phone,
          b.email,
          b.address,
          b.postcode,
          b.experience,
          b.theoryTest,
          b.instructorPref,
          b.notes,
          b.status,
          b.createdAt,
        )
        .run();
    } catch (err) {
      if (String(err).includes('UNIQUE constraint failed')) throw new SlotTakenError();
      throw err;
    }
    return b;
  }

  async findById(id: string): Promise<Booking | null> {
    const row = await this.db.prepare('SELECT * FROM bookings WHERE id = ?1').bind(id).first<BookingRow>();
    return row ? toBooking(row) : null;
  }

  async listBookedTimes(date: string): Promise<string[]> {
    const { results } = await this.db
      .prepare(`SELECT time FROM bookings WHERE date = ?1 AND status != 'cancelled'`)
      .bind(date)
      .all<{ time: string }>();
    return results.map((r) => r.time);
  }
}
