import {
  ADDRESS,
  CLINIC,
  CONTACT,
  DENTIST,
  FAQ,
  OPENING_HOURS,
  SITE,
  TREATMENTS,
} from '../data/site-content';

/**
 * JSON-LD da home: Dentist + Person + FAQPage + WebSite (AGENTS.md §7).
 * - Só entram campos com dado real: o que for `null` em site-content.ts fica de fora.
 * - SEM Review/AggregateRating (depoimentos publicados pelo próprio negócio).
 */
export function buildHomeJsonLd(): object {
  const base = SITE.url ?? '';
  const id = (fragment: string) => `${base}/#${fragment}`;

  const postalAddress: Record<string, unknown> = {
    '@type': 'PostalAddress',
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    addressCountry: ADDRESS.country,
  };
  if (ADDRESS.street) {
    postalAddress['streetAddress'] = [
      ADDRESS.street,
      ADDRESS.mall,
      ADDRESS.unit ? `Loja ${ADDRESS.unit}` : null,
    ]
      .filter(Boolean)
      .join(', ');
  }
  if (ADDRESS.postalCode) postalAddress['postalCode'] = ADDRESS.postalCode;

  const dentist: Record<string, unknown> = {
    '@type': 'Dentist',
    '@id': id('dentist'),
    name: CLINIC.displayName,
    alternateName: CLINIC.name,
    description:
      'Consultório odontológico com atendimento humanizado e foco em implantes dentários.',
    image: `${base}${SITE.ogImage}`,
    // TODO(logo): trocar pelo arquivo oficial do logo.
    logo: `${base}/icon-512.png`,
    address: postalAddress,
    areaServed: { '@type': 'City', name: ADDRESS.city },
    availableService: TREATMENTS.map((t) => ({ '@type': 'MedicalProcedure', name: t.schemaName })),
    founder: { '@id': id('dentista') },
    employee: { '@id': id('dentista') },
  };
  if (ADDRESS.mapsQuery) {
    dentist['hasMap'] =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS.mapsQuery)}`;
  }
  if (SITE.url) dentist['url'] = `${SITE.url}/`;
  if (CONTACT.phoneE164) dentist['telephone'] = CONTACT.phoneE164;
  if (CONTACT.email) dentist['email'] = CONTACT.email;
  if (ADDRESS.geo) {
    dentist['geo'] = {
      '@type': 'GeoCoordinates',
      latitude: ADDRESS.geo.lat,
      longitude: ADDRESS.geo.lng,
    };
  }
  if (OPENING_HOURS) {
    dentist['openingHoursSpecification'] = OPENING_HOURS.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    }));
  }
  const sameAs = [CONTACT.instagram, CONTACT.googleProfileUrl].filter((v): v is string => !!v);
  if (sameAs.length) dentist['sameAs'] = sameAs;

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': id('dentista'),
    name: DENTIST.schemaName,
    jobTitle: DENTIST.title,
    worksFor: { '@id': id('dentist') },
    identifier: { '@type': 'PropertyValue', propertyID: 'CRO', value: DENTIST.cro },
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': id('faq'),
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const website: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': id('website'),
    name: CLINIC.displayName,
    inLanguage: 'pt-BR',
    publisher: { '@id': id('dentist') },
  };
  if (SITE.url) website['url'] = `${SITE.url}/`;

  return { '@context': 'https://schema.org', '@graph': [dentist, person, faq, website] };
}
