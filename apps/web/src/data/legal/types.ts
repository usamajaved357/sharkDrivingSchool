/**
 * Shape of the legal pages (/privacy, /terms, /cookies).
 * Text supports inline links written as [label](href); see lib/inline-links.ts.
 */
export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export type LegalSlug = 'privacy' | 'terms' | 'cookies';

export interface LegalDoc {
  slug: LegalSlug;
  title: string;
  /** Short label used in the "Other policies" links. */
  short: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}
