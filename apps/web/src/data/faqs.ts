import { site } from '@/config/site';

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: 'How old do I need to be to start lessons?',
    a: 'You can start driving lessons on public roads from 17, once you have your provisional driving licence from the DVLA.',
  },
  {
    q: 'How many lessons will I need?',
    a: 'Everyone is different. DVSA guidance puts the average learner at around 45 hours of professional lessons plus 22 hours of private practice. Your instructor will give you an honest estimate after your first lesson.',
  },
  {
    q: 'Should I learn manual or automatic?',
    a: 'Automatic is usually quicker to learn, but an automatic test only lets you drive automatic cars. A manual pass lets you drive both. We can help you decide.',
  },
  {
    q: 'Do you offer intensive or fast-track courses?',
    a: 'Yes. Intensive courses pack your hours into a short window so you can be test-ready in weeks. Call us to check availability near your test date.',
  },
  {
    q: 'Can you pick me up from home, work or college?',
    a: 'Yes, lessons start and finish at an address that suits you anywhere in our Greater Manchester coverage area.',
  },
  {
    q: 'Can I use your car for my driving test?',
    a: 'Yes. We offer a pre-test warm-up lesson and you can sit your test in the same dual-control car you learned in.',
  },
  {
    q: `Are you the same as ${site.formerName}?`,
    a: `Yes. ${site.name} was previously called ${site.formerName}. Same instructors, same cars and same Google reviews, just a new name.`,
  },
];
