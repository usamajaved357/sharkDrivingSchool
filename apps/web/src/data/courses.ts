import type { IconName } from '@/components/ui/icons';

/** Course tiles in the home-page bento grid. Layout variants map to CSS in CoursesBento.astro. */
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
}

export const courseTiles: CourseTile[] = [
  {
    title: 'Beginner lessons',
    text: 'Never driven before? We start in quiet roads and build you up, one skill at a time.',
    cta: 'Start from zero',
    href: '/prices',
    variant: 'feature',
    badge: 'MOST BOOKED',
  },
  {
    title: 'Intensive & fast-track',
    text: 'Test-ready in weeks, not months. Concentrated hours with one dedicated instructor.',
    cta: 'Go fast',
    href: '/prices#intensive',
    variant: 'wide-red',
    icon: 'gauge',
  },
  { title: 'Automatic', text: 'No clutch, no stalling. Learn faster.', cta: 'Learn more', href: '/prices', variant: 'small', icon: 'steering', tone: 'blue' },
  { title: 'Manual', text: 'Full licence, drive any car.', cta: 'Learn more', href: '/prices', variant: 'small', icon: 'gears', tone: 'red' },
  { title: 'Refresher', text: 'Back behind the wheel, calmly.', cta: 'Learn more', href: '/prices#extras', variant: 'small', icon: 'refresh', tone: 'blue' },
  { title: 'Pass Plus', text: 'Motorways, nights & rural roads.', cta: 'Learn more', href: '/prices#extras', variant: 'small', icon: 'trophy', tone: 'red' },
  {
    title: 'Mock tests & test-route practice',
    text: 'Real exam conditions on local test-centre routes, with a written debrief after every mock.',
    cta: 'Learn more',
    href: '/prices#extras',
    variant: 'wide-paper',
    icon: 'checklist',
  },
];
