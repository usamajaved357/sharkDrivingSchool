import type { IconName } from '@/components/ui/icons';

/** Course tiles in the home-page bento grid. Each variant has its own component in components/home/courses/. */
export type CourseTileVariant = 'feature' | 'wide-red' | 'small' | 'wide-paper';

export interface CourseTile {
  title: string;
  text: string;
  cta: string;
  href: string;
  variant: CourseTileVariant;
  icon?: IconName;
  tone?: 'blue' | 'red';
  badge?: string;
  /** Short glass chips shown on the tile (e.g. course lengths). */
  tags?: string[];
  /**
   * Background photo (base URL; widths are added in the component).
   * Stock photo for now, free under the Unsplash License (no attribution required).
   */
  image?: { src: string; alt: string };
}

export const courseTiles: CourseTile[] = [
  {
    title: 'Beginner lessons',
    text: 'Never driven before? We start on quiet roads and build you up, one skill at a time.',
    cta: 'Start from zero',
    href: '/prices',
    variant: 'feature',
    badge: 'MOST BOOKED',
    // "Young woman driver" by Jan Baborák: https://unsplash.com/photos/4STq2B24S1k
    image: { src: 'https://images.unsplash.com/photo-1578041262130-633307b3bfd6', alt: 'Learner driver behind the wheel during a lesson' },
  },
  {
    title: 'Intensive & fast-track',
    text: 'Test-ready in weeks, not months. Concentrated hours with one dedicated instructor.',
    cta: 'Go fast',
    href: '/prices#intensive',
    variant: 'wide-red',
    icon: 'gauge',
    tags: ['10–40 hours', 'Test in weeks', 'Mock tests included'],
  },
  { title: 'Automatic', text: 'No clutch, no stalling. Learn faster.', cta: 'Learn more', href: '/prices', variant: 'small', icon: 'steering', tone: 'blue' },
  { title: 'Manual', text: 'Full licence, drive any car.', cta: 'Learn more', href: '/prices', variant: 'small', icon: 'gears', tone: 'red' },
  { title: 'Refresher', text: 'Back behind the wheel, calmly.', cta: 'Learn more', href: '/prices#extras', variant: 'small', icon: 'refresh', tone: 'blue' },
  { title: 'Pass Plus', text: 'Motorways, nights & rural roads.', cta: 'Learn more', href: '/prices#extras', variant: 'small', icon: 'trophy', tone: 'red' },
  {
    title: 'Mock tests & test-route practice',
    text: 'Real exam conditions on local test-centre routes, with a written debrief after every mock.',
    cta: 'See mock test prices',
    href: '/prices#extras',
    variant: 'wide-paper',
    icon: 'checklist',
  },
];
