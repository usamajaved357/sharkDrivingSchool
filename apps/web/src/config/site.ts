/**
 * Business details used across the site. Edit here — never hard-code in components.
 * Values in [brackets] are placeholders the owner must confirm before launch.
 */
export const site = {
  name: 'Shark Driving School',
  shortName: 'Shark',
  city: 'Manchester',
  region: 'Greater Manchester',
  url: 'https://www.sharkdrivingschool.co.uk',
  description:
    'Manual and automatic driving lessons across Greater Manchester with patient, DVSA-approved instructors. Flexible slots, door-to-door pick-up and a plan built around your test date.',
  phone: {
    display: '07440 260063',
    tel: '07440260063',
    whatsapp: '447440260063',
  },
  email: '[email@sharkdrivingschool.co.uk]',
  googleRating: '[X.X]',
  googleReviewCount: '[XX]',
  cancellationHours: '[48]',
} as const;

export const telHref = `tel:${site.phone.tel}`;
export const whatsappHref = `https://wa.me/${site.phone.whatsapp}`;

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: 'Courses', href: '/#courses' },
  { label: 'Prices', href: '/prices' },
  { label: 'Areas', href: '/#areas' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Instructors', href: '/#careers' },
  { label: 'FAQ', href: '/#faq' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Courses',
    links: [
      { label: 'Beginner lessons', href: '/prices' },
      { label: 'Intensive courses', href: '/prices#intensive' },
      { label: 'Automatic lessons', href: '/prices' },
      { label: 'Refresher lessons', href: '/prices#extras' },
      { label: 'Pass Plus', href: '/prices#extras' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Reviews', href: '/#reviews' },
      { label: 'Areas we cover', href: '/#areas' },
      { label: 'Become an instructor', href: '/#careers' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Book a lesson', href: '/book' },
    ],
  },
];
