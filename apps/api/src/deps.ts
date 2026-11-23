import type { AppConfig } from './config';
import type { ContactRepository } from './repositories/contact.repository';
import type { EnquiryRepository } from './repositories/enquiry.repository';
import { ContactService } from './services/contact.service';
import { CoverageService } from './services/coverage.service';
import { EnquiryService } from './services/enquiry.service';
import { GoogleReviewsService } from './services/google-reviews.service';
import { createNotifier } from './services/notifications';

export interface Repositories {
  enquiries: EnquiryRepository;
  contacts: ContactRepository;
}

/** Everything a request handler needs. Built per runtime (Worker or Node). */
export interface AppDeps {
  config: AppConfig;
  services: {
    enquiries: EnquiryService;
    contact: ContactService;
    coverage: CoverageService;
    reviews: GoogleReviewsService;
  };
}

export function buildDeps(config: AppConfig, repos: Repositories): AppDeps {
  const notifier = createNotifier(config);
  return {
    config,
    services: {
      enquiries: new EnquiryService(repos.enquiries, notifier),
      contact: new ContactService(repos.contacts, notifier),
      coverage: new CoverageService(),
      reviews: new GoogleReviewsService(config.google),
    },
  };
}

/** Hono environment type shared by all routes. */
export type AppEnv = {
  Variables: { deps: AppDeps };
};
