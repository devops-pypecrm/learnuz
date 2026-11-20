import React from 'react';
import AboutClientPage from '../../components/about/AboutClientPage';
import { socialMeta } from '../../lib/site';

const title = 'About Learnuz | Your Trusted Education & Study Abroad Partner';
const description = 'Learnuz helps students discover the right universities, courses, scholarships, and career opportunities with expert guidance and global partnerships.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  ...socialMeta({ title, description, path: '/about' }),
};

export default function AboutPage() {
  return <AboutClientPage />;
}
