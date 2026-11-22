import { describe, expect, it, vi } from 'vitest';
import { EnquiryRequestSchema, type EnquiryRequest } from '@shark/shared';
import { MemoryEnquiryRepository } from '../repositories/memory/enquiry.memory';
import { EnquiryService } from './enquiry.service';
import type { Notifier } from './notifications/notifier';

const request = (overrides: Partial<EnquiryRequest> = {}): EnquiryRequest => ({
  fullName: 'Sam Learner',
  gender: 'male',
  phone: '07123456789',
  email: '',
  address: '12 Test Street',
  postcode: 'M14 5RB',
  transmission: 'automatic',
  experience: 'none',
  testBooked: 'no',
  testCentre: '',
  testDate: '',
  testTime: '',
  availability: ['weekday-mornings'],
  availabilityNotes: '',
  instructorPref: 'any',
  interest: 'not-sure',
  notes: '',
  agreeTerms: true,
  ...overrides,
});

function setup(notifier?: Partial<Notifier>) {
  const repo = new MemoryEnquiryRepository();
  const notify: Notifier = { enquiryReceived: vi.fn(async () => {}), contactReceived: vi.fn(async () => {}), ...notifier };
  return { repo, notify, service: new EnquiryService(repo, notify) };
}

describe('EnquiryService.create', () => {
  it('stores the enquiry and notifies the owner', async () => {
    const { repo, notify, service } = setup();
    const { id, reference } = await service.create(request());
    expect(reference).toMatch(/^SHK-[A-Z0-9]{6}$/);
    const saved = await repo.findById(id);
    expect(saved).toMatchObject({ gender: 'male', experience: 'none', status: 'new' });
    expect(saved).not.toHaveProperty('agreeTerms');
    expect(notify.enquiryReceived).toHaveBeenCalledWith(expect.objectContaining({ reference, fullName: 'Sam Learner' }));
  });

  it('drops leftover test details when no test is booked', async () => {
    const { repo, service } = setup();
    const { id } = await service.create(request({ testBooked: 'no', testCentre: 'Old value', testDate: '2027-01-01', testTime: '09:00' }));
    expect(await repo.findById(id)).toMatchObject({ testCentre: '', testDate: '', testTime: '' });
  });

  it('still succeeds when notifications fail', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { service } = setup({ enquiryReceived: vi.fn(async () => Promise.reject(new Error('down'))) });
    await expect(service.create(request())).resolves.toHaveProperty('reference');
    expect(err).toHaveBeenCalled();
  });
});

describe('EnquiryRequestSchema', () => {
  const parse = (o: Record<string, unknown>) => EnquiryRequestSchema.safeParse({ ...request(), ...o });
  const fields = (o: Record<string, unknown>) => {
    const r = parse(o);
    return r.success ? [] : r.error.issues.map((i) => String(i.path[0]));
  };

  it('accepts a complete form with no email', () => {
    expect(parse({}).success).toBe(true);
  });

  it('needs the test centre, date and time when a test is booked', () => {
    expect(fields({ testBooked: 'yes' })).toEqual(expect.arrayContaining(['testCentre', 'testDate', 'testTime']));
    expect(parse({ testBooked: 'yes', testCentre: 'Cheetham Hill', testDate: '2027-01-12', testTime: '10:00' }).success).toBe(true);
  });

  it('needs some availability (ticked or written)', () => {
    expect(fields({ availability: [], availabilityNotes: '' })).toContain('availability');
    expect(parse({ availability: [], availabilityNotes: 'Any weekday' }).success).toBe(true);
  });

  it('rejects a badly written email but allows none', () => {
    expect(fields({ email: 'not-an-email' })).toContain('email');
    expect(parse({ email: 'sam@example.com' }).success).toBe(true);
  });

  it('needs gender, gearbox and terms agreement', () => {
    expect(fields({ gender: undefined, transmission: undefined, agreeTerms: false })).toEqual(
      expect.arrayContaining(['gender', 'transmission', 'agreeTerms']),
    );
  });
});
