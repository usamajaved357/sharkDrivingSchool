import { describe, expect, it } from 'vitest';
import { customerBookingEmail, ownerBookingEmail } from './booking-emails';
import { bookingWhatsAppText, formatWhen, toInternational } from './booking-format';
import { sampleBooking } from './test-fixtures';

describe('formatWhen', () => {
  it('formats the calendar date in British style with the time', () => {
    expect(formatWhen({ date: '2026-11-24', time: '10:00' })).toBe('Tuesday 24 November 2026 at 10:00');
  });
});

describe('toInternational', () => {
  it.each([
    ['07123 456789', '447123456789'],
    ['+447123456789', '447123456789'],
    ['447123456789', '447123456789'],
  ])('%s → %s', (input, expected) => {
    expect(toInternational(input)).toBe(expected);
  });
});

describe('bookingWhatsAppText', () => {
  const text = bookingWhatsAppText(sampleBooking());

  it('includes every detail the owner needs', () => {
    for (const part of [
      'Shark Driving School',
      'SHK-ABC234',
      '10-hour block',
      'Manual',
      'Tuesday 24 November 2026 at 10:00',
      'Sam Learner',
      '07123456789',
      'sam@example.com',
      '12 Test Street, M14 5RB',
      'Had some lessons',
      'Theory test: Passed',
      'Female instructor',
      'Test booked for January',
      'https://wa.me/447123456789',
    ]) {
      expect(text).toContain(part);
    }
  });

  it('leaves out the notes line when there are no notes', () => {
    expect(bookingWhatsAppText(sampleBooking({ notes: '' }))).not.toContain('Notes:');
  });
});

describe('booking emails', () => {
  it('owner email has a clear subject, the details and contact buttons', () => {
    const email = ownerBookingEmail(sampleBooking());
    expect(email.subject).toBe('New booking SHK-ABC234: Sam Learner, 10-hour block, Tuesday 24 November 2026 at 10:00');
    expect(email.html).toContain('12 Test Street, M14 5RB');
    expect(email.html).toContain('href="tel:07123456789"');
    expect(email.html).toContain('href="https://wa.me/447123456789"');
    expect(email.html).toContain('src="cid:shark-logo"');
    expect(email.text).toContain('Reference: SHK-ABC234');
  });

  it('escapes learner input in the HTML', () => {
    const email = ownerBookingEmail(sampleBooking({ fullName: '<script>x</script>', notes: 'a & b' }));
    expect(email.html).not.toContain('<script>x</script>');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.html).toContain('a &amp; b');
  });

  it('customer email thanks the learner by first name', () => {
    const email = customerBookingEmail(sampleBooking());
    expect(email.subject).toContain('SHK-ABC234');
    expect(email.html).toContain('Thanks, Sam!');
    expect(email.html).not.toContain('Test booked for January'); // owner-only details stay out
  });
});
