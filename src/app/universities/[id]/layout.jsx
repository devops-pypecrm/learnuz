import { socialMeta } from '../../../lib/site';
import { getUniversityById } from '../../../lib/serverData';

// Gives every university page its own title and description, e.g. "GLA University Online Degrees – Fees, Courses & Admission | Learnuz".
export async function generateMetadata({ params }) {
  const { id } = await params;
  const path = `/universities/${encodeURIComponent(id)}`;

  // Uses the same cached loader as the page, so this doesn't add a second database call.
  const { university: uni } = await getUniversityById(id);

  if (!uni) {
    return {
      title: 'University Not Found | Learnuz',
      robots: { index: false, follow: true },
    };
  }

  const title = `${uni.name} Online Degrees – Fees, Courses & Admission | Learnuz`;
  const details = [
    uni.location && `Located in ${uni.location}`,
    uni.naacGrade && uni.naacGrade !== 'N/A' && `${uni.naacGrade} accredited`,
    uni.feeRange && `fees ${uni.feeRange}`,
  ].filter(Boolean).join(', ');
  const description = (
    `Explore UGC-DEB approved online programs from ${uni.name}. ${details ? details + '. ' : ''}Get free admission counselling from Learnuz.`
  ).slice(0, 300);

  return {
    title,
    description,
    alternates: { canonical: path },
    ...socialMeta({ title, description, path }),
  };
}

export default function UniversityLayout({ children }) {
  return children;
}
