import { notFound } from 'next/navigation';
import UniversityDetailClient from './UniversityDetailClient';
import { getPrograms, getUniversityById, programsForUniversity } from '../../../lib/serverData';
import { SITE_URL } from '../../../lib/site';

// Rendered on the server for every request so search engines see the university's details and programs in the HTML.
export const dynamic = 'force-dynamic';

export default async function UniversityDetailPage({ params }) {
  const { id } = await params;
  const [{ university, failed }, allPrograms] = await Promise.all([getUniversityById(id), getPrograms()]);

  // The university really doesn't exist → proper 404 "Not found" page (tells search engines it's gone).
  if (!university && !failed) notFound();

  // If either load failed, pass nothing and let the page load (and show errors) in the browser as before.
  const programs = university && allPrograms ? programsForUniversity(allPrograms, university) : null;

  const jsonLd = university
    ? {
        '@context': 'https://schema.org',
        '@type': 'CollegeOrUniversity',
        name: university.name,
        ...(university.shortName && { alternateName: university.shortName }),
        url: `${SITE_URL}/universities/${encodeURIComponent(university.id)}`,
        ...(university.description && { description: university.description }),
        ...(university.logo && /^https?:\/\//.test(university.logo) && { logo: university.logo }),
        ...(university.location && { address: { '@type': 'PostalAddress', addressLocality: university.location, addressCountry: 'IN' } }),
        ...(university.established && { foundingDate: String(university.established) }),
        ...(programs?.length && {
          hasCourse: programs.map((p) => ({
            '@type': 'Course',
            name: p.title,
            ...(p.code && { courseCode: p.code }),
            description: p.description || `${p.title} — online ${p.level || 'degree'} program from ${university.name}.`,
            provider: { '@type': 'CollegeOrUniversity', name: university.name },
          })),
        }),
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
      <UniversityDetailClient
        id={id}
        initialUniversity={university}
        initialPrograms={programs}
      />
    </>
  );
}
