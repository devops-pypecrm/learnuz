import ProgramsClient from './ProgramsClient';
import { getPrograms, getUniversities } from '../../lib/serverData';
import { SITE_URL } from '../../lib/site';

// Rendered on the server for every request so search engines see the program list in the HTML.
export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  const [programs, universities] = await Promise.all([getPrograms(), getUniversities()]);

  const jsonLd = programs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Online degree programs at Learnuz',
        itemListElement: programs.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Course',
            name: p.title,
            ...(p.code && { courseCode: p.code }),
            description: p.description || `${p.title} — online ${p.level || 'degree'} program${p.university ? ` from ${p.university}` : ''}.`,
            provider: { '@type': 'CollegeOrUniversity', name: p.university || 'Learnuz' },
            url: `${SITE_URL}/programs`,
          },
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
      <ProgramsClient initialPrograms={programs} initialUniversities={universities} />
    </>
  );
}
