import { describe, expect, it, vi } from 'vitest';
import type { BookingRequest } from '@shark/shared';
import { MemoryBookingRepository } from '../repositories/memory/booking.memory';
import { AvailabilityService } from './availability.service';
import { BookingService } from './booking.service';
import type { Notifier } from './notifications/notifier';

const request = (): BookingRequest => ({
  transmission: 'automatic',
  lessonType: 'single',
  date: '2026-11-24',
  time: '08:30',
  fullName: 'Sam Learner',
  phone: '07123456789',
  email: 'sam@example.com',
  address: '12 Test Street',
  postcode: 'M14 5RB',
  experience: 'none',
  theoryTest: 'not-yet',
  instructorPref: 'any',
  notes: '',
  hasProvisionalLicence: true,
  agreeTerms: true,
});

function setup(notifier?: Partial<Notifier>) {
  const repo = new MemoryBookingRepository();
  const notify: Notifier = { bookingCreated: vi.fn(async () => {}), contactReceived: vi.fn(async () => {}), ...notifier };
  return { repo, notify, service: new BookingService(repo, new AvailabilityService(repo), notify) };
}

describe('BookingService.create', () => {
  it('stores the booking with all details and notifies the owner', async () => {
    const { repo, notify, service } = setup();
    const { id, reference } = await service.create(request());
    expect(reference).toMatch(/^SHK-[A-Z0-9]{6}$/);
    const saved = await repo.findById(id);
    expect(saved).toMatchObject({ address: '12 Test Street', experience: 'none', status: 'pending' });
    expect(saved).not.toHaveProperty('agreeTerms');
    expect(notify.bookingCreated).toHaveBeenCalledWith(expect.objectContaining({ reference, fullName: 'Sam Learner' }));
  });

  it('rejects a slot that is already taken', async () => {
    const { service } = setup();
    await service.create(request());
    await expect(service.create(request())).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('still books when notifications fail', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { service } = setup({ bookingCreated: vi.fn(async () => Promise.reject(new Error('down'))) });
    await expect(service.create(request())).resolves.toHaveProperty('reference');
  });
});
