/**
 * Inline SVG icon set (24×24 viewBox). Stroke icons use currentColor.
 * Add new icons here; render them with <Icon name="..." />.
 */
interface IconDef {
  body: string;
  filled?: boolean;
}

export const icons = {
  check: { body: '<path d="M20 6 9 17l-5-5"/>' },
  'arrow-right': { body: '<path d="M5 12h14M13 6l6 6-6 6"/>' },
  phone: {
    body: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  },
  'shield-check': { body: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>' },
  shield: { body: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  clock: { body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
  'map-pin': { body: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>' },
  steering: { body: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M3.5 10.5c5-2 12-2 17 0M10.5 13.8 8 20.5M13.5 13.8l2.5 6.7"/>' },
  gears: {
    body: '<circle cx="6" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v10M12 7v10M18 7v5H6"/>',
  },
  refresh: { body: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>' },
  trophy: { body: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>' },
  checklist: { body: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
  gauge: { body: '<path d="M12 13l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/><path d="M12 5v1M5 12h1M18 12h1M7 7l.7.7M17 7l-.7.7"/>' },
  image: { body: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 8"/>' },
  user: { body: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>' },
  calendar: { body: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
  chart: { body: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>' },
  book: { body: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/>' },
  chat: { body: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  whatsapp: {
    body: '<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-1.9z"/>',
  },
  mail: { body: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>' },
  plus: { body: '<path d="M12 5v14M5 12h14"/>' },
  menu: { body: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  close: { body: '<path d="M6 6l12 12M18 6 6 18"/>' },
  star: { body: '<path d="M12 2l3 6.9 7.5.7-5.6 5 1.6 7.4L12 18.3 5.5 22l1.6-7.4-5.6-5 7.5-.7z"/>', filled: true },
  quote: { body: '<path d="M3 21c3 0 7-1 7-8V5H3v8h4c0 4-2 5-4 5zm11 0c3 0 7-1 7-8V5h-7v8h4c0 4-2 5-4 5z"/>', filled: true },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;
