import type { AppConfig } from './config';
import type { BookingRepository } from './repositories/booking.repository';
import type { ContactRepository } from './repositories/contact.repository';
import { AvailabilityService } from './services/availability.service';
import { BookingService } from './services/booking.service';
import { ContactService } from './services/contact.service';
import { CoverageService } from './services/coverage.service';
import { createNotifier } from './services/notifications';

export interface Repositories {
  bookings: BookingRepository;
  contacts: ContactRepository;
}

/** Everything a request handler needs. Built per runtime (Worker or Node). */
export interface AppDeps {
  config: AppConfig;
  services: {
    availability: AvailabilityService;
    bookings: BookingService;
    contact: ContactService;
    coverage: CoverageService;
  };
}

export function buildDeps(config: AppConfig, repos: Repositories): AppDeps {
  const notifier = createNotifier(config);
  const availability = new AvailabilityService(repos.bookings);
  return {
    config,
    services: {
      availability,
      bookings: new BookingService(repos.bookings, availability, notifier),
      contact: new ContactService(repos.contacts, notifier),
      coverage: new CoverageService(),
    },
  };
}

/** Hono environment type shared by all routes. */
export type AppEnv = {
  Variables: { deps: AppDeps };
};
