import { legal, site } from '@/config/site';
import { businessName, contactItems } from './shared';
import type { LegalDoc } from './types';

const notice = `${site.cancellationHours} hours`;

export const termsAndConditions: LegalDoc = {
  slug: 'terms',
  title: 'Terms & conditions',
  short: 'Terms',
  description: `The terms that apply when you book driving lessons, block bookings or courses with ${site.name}.`,
  intro: `These terms apply to every lesson, block booking and course you book with ${site.name}. They are written to be fair and easy to read. By booking, you agree to them, so please take a few minutes to read them first.`,
  sections: [
    {
      id: 'about',
      heading: 'About us',
      blocks: [
        {
          type: 'p',
          text: `Lessons are provided by ${businessName} ("we", "us"). Our instructors are DVSA-approved driving instructors. You can contact us at:`,
        },
        { type: 'ul', items: contactItems },
      ],
    },
    {
      id: 'booking',
      heading: 'Booking lessons',
      blocks: [
        {
          type: 'ul',
          items: [
            'You can book online, by phone, by WhatsApp or by email. An online booking is a request until we confirm it by text, call or email.',
            'We may decline a booking, for example if we do not cover your pick-up area or no instructor is free at that time.',
            'Please give us accurate details. We use them to pick you up and contact you about your lessons.',
          ],
        },
      ],
    },
    {
      id: 'eligibility',
      heading: 'Your licence and fitness to drive',
      blocks: [
        { type: 'p', text: 'Before each lesson you must:' },
        {
          type: 'ul',
          items: [
            'hold a valid UK provisional (or full) driving licence and bring it to your first lesson',
            'meet the legal eyesight standard: reading a number plate from 20 metres, with glasses or contact lenses if you need them',
            'be fit to drive, and not under the influence of alcohol, drugs or medication that affects driving',
          ],
        },
        {
          type: 'p',
          text: 'If you cannot meet these requirements when your instructor arrives, the lesson cannot go ahead and is charged as a late cancellation.',
        },
      ],
    },
    {
      id: 'prices-payment',
      heading: 'Prices and payment',
      blocks: [
        {
          type: 'ul',
          items: [
            'Our current prices are shown on our [prices page](/prices). Prices for manual and automatic lessons may differ.',
            'Pay-as-you-go lessons are paid before or at the start of each lesson.',
            'Block bookings and courses are paid in full before the first lesson. For intensive courses we may take a deposit, with the balance due before the course starts.',
            'We may change our prices from time to time, but never for lessons you have already paid for.',
            `Prices cover lessons within ${site.region}. Pick-ups outside the area may cost more, and we will always tell you before you book.`,
          ],
        },
      ],
    },
    {
      id: 'cancellations',
      heading: 'Cancelling or moving a lesson',
      blocks: [
        {
          type: 'ul',
          items: [
            `You can cancel or move a lesson free of charge if you give us at least ${notice}’ notice.`,
            `If you cancel with less than ${notice}’ notice, or are not there when your instructor arrives, we may charge the full lesson fee (or deduct the hours from your block).`,
            'If we have to cancel, for example because of instructor illness, severe weather or a vehicle problem, we will offer you a new time or a full refund for that lesson.',
          ],
        },
        {
          type: 'p',
          text: '**Your 14-day cancellation right.** If you book online, by phone or by message, you have 14 days to cancel and get a full refund. If you ask us to start lessons within those 14 days, we will deduct the cost of lessons already taken.',
        },
      ],
    },
    {
      id: 'lateness',
      heading: 'Lateness',
      blocks: [
        {
          type: 'p',
          text: 'If you are late, your lesson still ends at the booked time so the next learner is not affected. If your instructor is late, you will get the full lesson time or a refund for the time missed.',
        },
      ],
    },
    {
      id: 'blocks-courses',
      heading: 'Block bookings and courses',
      blocks: [
        {
          type: 'ul',
          items: [
            `Hours in a block booking or course are valid for ${legal.blockValidityMonths} months from the date you pay.`,
            'Hours are for the named learner and cannot be transferred to someone else without our agreement.',
            'If you stop before using all your hours, we will refund the unused hours. The hours you did take will be charged at our pay-as-you-go rate, and that difference is deducted from your refund.',
          ],
        },
      ],
    },
    {
      id: 'driving-tests',
      heading: 'Driving tests and test-day car hire',
      blocks: [
        {
          type: 'ul',
          items: [
            'Driving test fees are paid to the DVSA and are not included in our prices. We can help you book your test.',
            'You can use our car for your test once your instructor agrees you are ready. For safety, they may refuse if you are not yet at test standard, and will tell you why.',
            'If the DVSA cancels or moves your test, we will move your test-day car hire to the new date at no extra charge.',
            'We cannot guarantee a pass. The result of your test is decided by the DVSA examiner.',
          ],
        },
      ],
    },
    {
      id: 'during-lessons',
      heading: 'During your lessons',
      blocks: [
        {
          type: 'p',
          text: 'Our cars are dual-controlled and insured for tuition. Your instructor will always put safety first and may pause or end a lesson if continuing would be unsafe. Please treat your instructor and the car with respect. We may end a lesson, without refund, in cases of abusive or dangerous behaviour.',
        },
      ],
    },
    {
      id: 'liability',
      heading: 'Our responsibility to you',
      blocks: [
        {
          type: 'p',
          text: 'We will provide lessons with reasonable care and skill. Nothing in these terms limits our liability for death or personal injury caused by our negligence, or anything else that cannot be limited by law. These terms do not affect your statutory rights as a consumer.',
        },
      ],
    },
    {
      id: 'complaints',
      heading: 'Complaints',
      blocks: [
        {
          type: 'p',
          text: 'If something is not right, please tell us straight away using the contact details above and we will do our best to fix it. If you are still unhappy with an instructor’s conduct, you can [complain to the DVSA](https://www.gov.uk/complain-about-a-driving-instructor).',
        },
      ],
    },
    {
      id: 'law',
      heading: 'Governing law',
      blocks: [
        {
          type: 'p',
          text: 'These terms are governed by the law of England and Wales, and any dispute will be dealt with by the courts of England and Wales.',
        },
      ],
    },
  ],
};
