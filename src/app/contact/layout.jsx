import { socialMeta, BUSINESS } from '../../lib/site';

const title = 'Contact Learnuz – Calicut, Kerala | Free Admission Counselling';
const description = `Talk to a Learnuz counsellor about online degrees and admissions. Call ${BUSINESS.phone}, email ${BUSINESS.email}, or visit us at ${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality}, ${BUSINESS.address.addressRegion} - ${BUSINESS.address.postalCode}.`;

export const metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  ...socialMeta({ title, description, path: '/contact' }),
};

export default function ContactLayout({ children }) {
  return children;
}
