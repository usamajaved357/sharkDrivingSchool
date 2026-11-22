import { describe, expect, it } from 'vitest';
import { customerEnquiryEmail, ownerEnquiryEmail } from './enquiry-emails';
import { enquiryWhatsAppText, formatAvailability, formatDay, formatTest, toInternational } from './enquiry-format';
import { sampleEnquiry } from './test-fixtures';

describe('enquiry formatting', () => {
  it('formats a calendar day the same way on every runtime', () => {
    expect(formatDay('2027-01-12')).toBe('Tuesday 12 January 2027');
  });

  it('turns UK numbers into international digits for WhatsApp links', () => {
    expect(toInternational('07440 260063')).toBe('447440260063');
    expect(toInternational('+44 7440 260063')).toBe('447440260063');
  });

  it('combines ticked availability with the free-text note', () => {
    expect(formatAvailability(sampleEnquiry())).toBe('Weekday evenings, Saturdays (after 5pm)');
    expect(formatAvailability(sampleEnquiry({ availability: [], availabilityNotes: 'Any time' }))).toBe('Any time');
  });

  it('describes the driving test', () => {
    expect(formatTest(sampleEnquiry())).toBe('Yes: Cheetham Hill, Tuesday 12 January 2027 at 10:00');
    expect(formatTest(sampleEnquiry({ testBooked: 'no' }))).toBe('Not booked yet');
  });

  it('puts every form answer in the WhatsApp message', () => {
    const text = enquiryWhatsAppText(sampleEnquiry());
    for (const part of [
      'SHK-ABC234',
      'Name: Sam Learner',
      'Gender: Female',
      'Mobile: 07123456789',
      'Email: sam@example.com',
      'Address: 12 Test Street, M14 5RB',
      'Gearbox: Manual',
      'Experience: Had some lessons',
      'Available: Weekday evenings, Saturdays (after 5pm)',
      'Instructor: Female instructor',
      'Interested in: 10-hour block',
      'Test booked: Yes: Cheetham Hill',
      'Notes: A bit nervous on roundabouts',
    ]) {
      expect(text).toContain(part);
    }
  });

  it('leaves out empty optional answers', () => {
    const text = enquiryWhatsAppText(sampleEnquiry({ email: '', notes: '', interest: 'not-sure' }));
    expect(text).not.toContain('Email:');
    expect(text).not.toContain('Notes:');
    expect(text).not.toContain('Interested in');
  });

  it('owner email has a clear subject, the details and contact buttons', () => {
    const email = ownerEnquiryEmail(sampleEnquiry());
    expect(email.subject).toBe('New enquiry SHK-ABC234: Sam Learner, Manual, Had some lessons');
    expect(email.html).toContain('12 Test Street, M14 5RB');
    expect(email.html).toContain('href="tel:07123456789"');
    expect(email.html).toContain('href="https://wa.me/447123456789"');
    expect(email.html).toContain('src="cid:shark-logo"');
    expect(email.text).toContain('Reference: SHK-ABC234');
  });

  it('owner email has no Email button when the learner gave no email', () => {
    expect(ownerEnquiryEmail(sampleEnquiry({ email: '' })).html).not.toContain('mailto:sam@');
  });

  it('escapes what learners type', () => {
    const email = ownerEnquiryEmail(sampleEnquiry({ notes: '<script>x</script> a & b' }));
    expect(email.html).not.toContain('<script>x</script>');
    expect(email.html).toContain('&lt;script&gt;');
    expect(email.html).toContain('a &amp; b');
  });

  it('learner email thanks them and keeps owner-only notes out', () => {
    const email = customerEnquiryEmail(sampleEnquiry());
    expect(email.subject).toContain('SHK-ABC234');
    expect(email.html).toContain('Thanks, Sam!');
    expect(email.html).not.toContain('nervous on roundabouts');
  });
});
