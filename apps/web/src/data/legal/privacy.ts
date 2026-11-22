import { site } from '@/config/site';
import { businessName, contactItems } from './shared';
import type { LegalDoc } from './types';

export const privacyPolicy: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy policy',
  short: 'Privacy',
  description: `How ${site.name} collects, uses and protects your personal information when you book lessons or contact us.`,
  intro: `This policy explains what personal information ${site.name} collects when you use this website, book a lesson or get in touch, why we need it, and the choices you have. We only collect what we need to teach you to drive, and we never sell your data.`,
  sections: [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      blocks: [
        {
          type: 'p',
          text: `${businessName} ("we", "us") is the data controller for the personal information described in this policy. We provide manual and automatic driving lessons across ${site.region}. You can contact us about anything in this policy:`,
        },
        { type: 'ul', items: contactItems },
      ],
    },
    {
      id: 'what-we-collect',
      heading: 'What information we collect',
      blocks: [
        { type: 'p', text: '**When you send your details through our booking form**, we collect:' },
        {
          type: 'ul',
          items: [
            'your full name, whether you are male or female (so we can respect your instructor preference), mobile number and, if you give it, your email address',
            'your pick-up address and postcode',
            'your gearbox choice, driving experience, instructor preference and the times you are free',
            'whether your driving test is booked and, if so, the test centre, date and time',
            'anything else you choose to tell us in the notes box',
          ],
        },
        {
          type: 'p',
          text: '**When you contact us** by phone, WhatsApp or email, we keep the details you give us, such as your name, contact details and your message.',
        },
        {
          type: 'p',
          text: '**During your lessons**, your instructor keeps notes on your progress and the skills you are working on, so each lesson builds on the last. Before your first lesson they will check your provisional licence and your eyesight, as the law requires.',
        },
        {
          type: 'p',
          text: '**When you visit the website**, our hosting provider processes technical information such as your IP address and browser type to deliver the site and protect it from abuse. We do not use analytics or advertising trackers.',
        },
      ],
    },
    {
      id: 'how-we-use-it',
      heading: 'How we use it and our lawful basis',
      blocks: [
        {
          type: 'table',
          head: ['What we do', 'Lawful basis'],
          rows: [
            ['Arrange, confirm and deliver your lessons, and send booking confirmations and reminders', 'Contract: we need it to provide the lessons you asked for'],
            ['Reply to your questions before you book', 'Steps taken at your request before entering a contract'],
            ['Track your progress and plan your lessons', 'Contract'],
            ['Keep financial and business records', 'Legal obligation (for example HMRC record-keeping rules)'],
            ['Keep the website secure and prevent misuse', 'Legitimate interests in running a safe, working website'],
            ['Send news or offers (only if you ask us to)', 'Consent, which you can withdraw at any time'],
          ],
        },
      ],
    },
    {
      id: 'sharing',
      heading: 'Who we share it with',
      blocks: [
        { type: 'p', text: 'We share your information only when we need to, and only with:' },
        {
          type: 'ul',
          items: [
            '**your instructor**, so they can pick you up and teach your lessons',
            '**Cloudflare**, which hosts this website and the database that stores bookings and messages',
            '**Resend**, which delivers booking confirmation emails',
            '**Google Fonts**, which serves the fonts on this site and receives your IP address when the page loads',
            '**OpenStreetMap**, which serves the map images on the home page and receives your IP address when they load',
            '**Unsplash**, which serves some of the photos on this site and receives your IP address when they load',
            '**WhatsApp (Meta)**, if you choose to message us on WhatsApp',
            '**the DVSA**, if you ask us to book or manage a driving test for you',
            'the police, courts or other authorities, if the law requires it',
          ],
        },
        { type: 'p', text: 'We never sell your personal information or share it for other companies’ marketing.' },
      ],
    },
    {
      id: 'transfers',
      heading: 'International transfers',
      blocks: [
        {
          type: 'p',
          text: 'Some of our service providers (such as Cloudflare, Resend, Google and Meta) may process data outside the UK, including in the United States. Where they do, the transfer is protected by UK adequacy regulations, the UK Extension to the EU-US Data Privacy Framework, or the UK International Data Transfer Agreement or Addendum.',
        },
      ],
    },
    {
      id: 'retention',
      heading: 'How long we keep it',
      blocks: [
        {
          type: 'ul',
          items: [
            '**Booking and lesson records:** up to 2 years after your last lesson, so we can answer questions about your lessons',
            '**Payment and accounting records:** 6 years, as required by HMRC',
            '**Enquiries that did not lead to a booking:** up to 12 months',
          ],
        },
        { type: 'p', text: 'After these periods we delete or anonymise your information.' },
      ],
    },
    {
      id: 'your-rights',
      heading: 'Your rights',
      blocks: [
        { type: 'p', text: 'Under UK data protection law you have the right to:' },
        {
          type: 'ul',
          items: [
            'ask for a copy of the personal information we hold about you',
            'ask us to correct information that is wrong or incomplete',
            'ask us to delete your information',
            'ask us to restrict or stop using your information',
            'object to how we use your information',
            'receive your information in a portable format',
            'withdraw your consent at any time, where we rely on consent',
          ],
        },
        {
          type: 'p',
          text: 'To use any of these rights, contact us using the details above. We will reply within one month, and there is normally no charge.',
        },
        {
          type: 'p',
          text: 'If you are unhappy with how we have handled your information, please tell us first so we can put it right. You can also complain to the Information Commissioner’s Office at [ico.org.uk](https://ico.org.uk/make-a-complaint/) or on 0303 123 1113.',
        },
      ],
    },
    {
      id: 'security',
      heading: 'Keeping your information safe',
      blocks: [
        {
          type: 'p',
          text: 'The website uses HTTPS encryption, and bookings are stored with a hosting provider that applies strong security controls. Only the people who need your information to run your lessons can see it.',
        },
      ],
    },
    {
      id: 'young-learners',
      heading: 'Young learners',
      blocks: [
        {
          type: 'p',
          text: 'You must hold a UK provisional licence to book lessons. If you are under 18, a parent or guardian may contact us or book on your behalf, and we may share lesson updates with them if you agree.',
        },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        {
          type: 'p',
          text: 'We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated at the top.',
        },
      ],
    },
  ],
};
