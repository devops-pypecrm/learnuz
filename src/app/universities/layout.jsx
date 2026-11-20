import { socialMeta } from '../../lib/site';

const title = 'Top UGC-Approved Online Universities in India – Compare Fees & Rankings | Learnuz';
const description =
  "Explore India's top UGC-DEB approved online universities. Compare NAAC grades, NIRF rankings, fees and programs, and get free admission counselling from Learnuz.";

export const metadata = {
  title,
  description,
  alternates: { canonical: '/universities' },
  ...socialMeta({ title, description, path: '/universities' }),
};

export default function UniversitiesLayout({ children }) {
  return children;
}
