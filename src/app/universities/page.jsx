import UniversitiesClient from './UniversitiesClient';
import { getPrograms, getUniversities } from '../../lib/serverData';
import { SITE_URL } from '../../lib/site';

// Rendered on the server for every request so search engines see the university list in the HTML.
export const dynamic = 'force-dynamic';

export default async function UniversitiesPage() {
  const [universities, programs] = await Promise.all([getUniversities(), getPrograms()]);

  const jsonLd = universities?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'UGC-approved online universities at Learnuz',
        itemListElement: universities.map((u, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/universities/${encodeURIComponent(u.id)}`,
          name: u.name,
        })),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <UniversitiesClient initialUniversities={universities} initialPrograms={programs} />
    </>
  );
}
