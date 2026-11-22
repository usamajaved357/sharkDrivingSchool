/**
 * Pass photos from the Google Business Profile (posted by learners with their reviews,
 * or by the school). Saved in public/images/passes/<slug>-480.webp and -720.webp (3:4).
 * Left out: a photo with another school's roof sign, and old-logo graphics.
 */
export type PassSlug = 'olaniyi' | 'popoola' | 'ali' | 'pui-san' | 'jemma' | 'jordan' | 'pass-1' | 'pass-2' | 'pass-3';

export interface PassPhoto {
  slug: PassSlug;
  /** First name, when the learner named themselves in a review. */
  name?: string;
  alt: string;
}

/** "Our latest passes" gallery, newest first. */
export const passPhotos: PassPhoto[] = [
  { slug: 'olaniyi', name: 'Olaniyi', alt: 'Olaniyi holding up a driving test pass certificate next to a white car' },
  { slug: 'popoola', name: 'Popoola', alt: 'Popoola with an "I passed with 1-2 Drive" board after passing the test' },
  { slug: 'ali', name: 'Ali', alt: 'Ali holding a driving test pass certificate by the car' },
  { slug: 'pui-san', name: 'Pui-san', alt: 'Pui-san with an "I passed" board beside the white automatic tuition car' },
  { slug: 'jemma', name: 'Jemma', alt: 'Jemma holding a practical driving test pass certificate' },
  { slug: 'jordan', name: 'Jordan', alt: 'Jordan with an "I passed" board next to the white tuition car' },
  { slug: 'pass-1', alt: 'A learner with an "I passed with 1-2 Drive" board beside the grey tuition car' },
  { slug: 'pass-2', alt: 'A learner holding a pass certificate in front of the grey tuition car' },
  { slug: 'pass-3', alt: 'A learner with an "I passed" board next to the grey tuition car' },
];

/** src + srcset for a pass photo (3:4). */
export const passImage = (slug: PassSlug) => ({
  src: `/images/passes/${slug}-720.webp`,
  srcset: `/images/passes/${slug}-480.webp 480w, /images/passes/${slug}-720.webp 720w`,
  width: 720,
  height: 960,
});
