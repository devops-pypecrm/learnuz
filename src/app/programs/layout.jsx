import { socialMeta } from '../../lib/site';

const title = 'Online MBA, MCA, BBA, BCA & More – UGC-DEB Approved Programs | Learnuz';
const description =
  'Compare UGC-DEB approved online undergraduate, postgraduate, diploma and certificate programs — MBA, MCA, BBA, BCA, B.Com, M.Com and more — with fees, duration and university details.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/programs' },
  ...socialMeta({ title, description, path: '/programs' }),
};

export default function ProgramsLayout({ children }) {
  return children;
}
