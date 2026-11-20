import { socialMeta } from '../../../lib/site';
import dbConnect from '../../../lib/db';
import University from '../../../models/University';

// Gives every university page its own title and description, e.g. "GLA University Online Degrees – Fees, Courses & Admission | Learnuz".
export async function generateMetadata({ params }) {
  const { id } = await params;
  const path = `/universities/${encodeURIComponent(id)}`;

  let uni = null;
  try {
    await dbConnect();
    uni = await University.findOne({ id }, { name: 1, location: 1, naacGrade: 1, feeRange: 1, description: 1 }).lean();
  } catch (error) {
    console.error('University metadata: could not load university:', error);
  }

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
