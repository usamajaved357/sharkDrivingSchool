import { site } from '@/config/site';
import { contactItems } from './shared';
import type { LegalDoc } from './types';

export const cookiePolicy: LegalDoc = {
  slug: 'cookies',
  title: 'Cookie policy',
  short: 'Cookies',
  description: `Which cookies the ${site.name} website uses (very few) and how to control them.`,
  intro: `Short version: this website does not use advertising or analytics cookies, and it does not track you. This page explains the few technical items that may be used to keep the site secure, and how to control cookies in your browser.`,
  sections: [
    {
      id: 'what-are-cookies',
      heading: 'What cookies are',
      blocks: [
        {
          type: 'p',
          text: 'Cookies are small text files that a website stores on your device. Some are essential to make a site work or keep it secure. Others track what you do, for example for analytics or advertising.',
        },
      ],
    },
    {
      id: 'cookies-we-use',
      heading: 'Cookies we use',
      blocks: [
        {
          type: 'p',
          text: 'We do **not** set any cookies of our own, and we do not use analytics, advertising or social media tracking cookies. You can browse and book lessons without accepting any cookies.',
        },
        {
          type: 'p',
          text: 'Our hosting provider, Cloudflare, may set a strictly necessary security cookie to tell real visitors apart from bots and protect the site from attacks:',
        },
        {
          type: 'table',
          head: ['Cookie', 'Set by', 'Purpose', 'Expires'],
          rows: [
            ['__cf_bm', 'Cloudflare', 'Identifies and blocks malicious bot traffic', '30 minutes'],
            ['cf_clearance', 'Cloudflare', 'Remembers that you passed a security check', 'Up to 1 year'],
          ],
        },
        {
          type: 'p',
          text: 'These cookies do not identify you personally and are exempt from consent under UK law because they are strictly necessary to provide a secure website.',
        },
      ],
    },
    {
      id: 'third-parties',
      heading: 'Third-party services',
      blocks: [
        {
          type: 'ul',
          items: [
            '**Google Fonts:** the fonts on this site load from Google. Google receives your IP address when the page loads but does not set cookies for this.',
            '**OpenStreetMap and Unsplash:** the coverage map images and some photos load from their servers, which receive your IP address. They do not set cookies on this site.',
            '**WhatsApp, Google and other links:** if you follow a link to WhatsApp or another website, that site may set its own cookies under its own policy.',
          ],
        },
      ],
    },
    {
      id: 'managing-cookies',
      heading: 'Managing cookies',
      blocks: [
        {
          type: 'p',
          text: 'You can block or delete cookies in your browser settings. Blocking the Cloudflare security cookie may mean you are occasionally asked to complete a quick security check. Find out more at [ico.org.uk](https://ico.org.uk/for-the-public/online/cookies/).',
        },
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      blocks: [
        {
          type: 'p',
          text: 'If we ever add analytics or other non-essential cookies, we will update this page and ask for your consent before setting them.',
        },
      ],
    },
    {
      id: 'contact',
      heading: 'Contact us',
      blocks: [
        { type: 'p', text: 'Questions about cookies or your privacy? Get in touch:' },
        { type: 'ul', items: contactItems },
      ],
    },
  ],
};
