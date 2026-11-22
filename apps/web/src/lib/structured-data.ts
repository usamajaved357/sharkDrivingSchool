/**
 * Schema.org JSON-LD for search engines (local SEO). Built from the same config and
 * data the pages render, so it never drifts from what visitors see.
 * Note: no ratings are included until real Google reviews exist (see data/home.ts).
 */
import { mapsHref, site } from '@/config/site';
import { areas } from '@/data/areas';
import { priceCategories, type Price } from '@/data/pricing';

export interface Crumb {
  name: string;
  path: string;
}

const abs = (path: string) => new URL(path, site.url).href;
const BUSINESS_ID = `${site.url}/#business`;

/** "£1,260" → 1260; null for placeholders like "£[XX]". */
const amount = (p: string): number | null => {
  const n = Number(p.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Every priced row on the prices page as an Offer (automatic → manual price range). */
function offers() {
  return priceCategories.flatMap((cat) =>
    cat.rows.flatMap((row) => {
      const pair: { manual: string; automatic: string } =
        typeof row.price === 'string' ? { manual: row.price, automatic: row.price } : (row.price as Exclude<Price, string>);
      const low = amount(pair.automatic);
      const high = amount(pair.manual);
      if (low === null || high === null) return [];
      return [
        {
          '@type': 'Offer',
          name: row.name,
          description: `${row.desc} (${row.hours})`,
          category: cat.label,
          priceCurrency: 'GBP',
          price: Math.min(low, high),
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'GBP',
            minPrice: Math.min(low, high),
            maxPrice: Math.max(low, high),
          },
          url: abs(`/prices#${cat.id}`),
        },
      ];
    }),
  );
}

function priceRange(): string {
  const all = offers().flatMap((o) => [o.priceSpecification.minPrice, o.priceSpecification.maxPrice]);
  if (!all.length) return '££';
  const fmt = (n: number) => `£${n.toLocaleString('en-GB')}`;
  return `${fmt(Math.min(...all))}–${fmt(Math.max(...all))}`;
}

/** The business itself (DrivingSchool is a schema.org LocalBusiness type). */
export function businessSchema() {
  return {
    '@type': 'DrivingSchool',
    '@id': BUSINESS_ID,
    name: site.name,
    alternateName: site.formerName,
    url: abs('/'),
    logo: abs('/images/logo.jpg'),
    image: abs('/images/og-image.png'),
    description: site.description,
    telephone: `+44${site.phone.tel.slice(1)}`,
    email: site.email,
    priceRange: priceRange(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    hasMap: mapsHref,
    sameAs: [site.google.mapsUrl],
    areaServed: [{ '@type': 'AdministrativeArea', name: site.region }, ...areas.map((name) => ({ '@type': 'City', name }))],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Driving lessons and courses',
      itemListElement: offers(),
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: `+44${site.phone.tel.slice(1)}`,
      email: site.email,
      areaServed: 'GB',
      availableLanguage: ['en-GB'],
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: abs('/'),
    name: site.name,
    inLanguage: 'en-GB',
    publisher: { '@id': BUSINESS_ID },
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Full @graph for a page. */
export function pageGraph(crumbs?: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [businessSchema(), websiteSchema(), ...(crumbs?.length ? [breadcrumbSchema(crumbs)] : [])],
  };
}
