import HomeClient from './HomeClient';
import { getPrograms, getUniversities } from '../lib/serverData';

// The real universities/programs are loaded on the server (from the 5-minute cache), so the Home page
// shows them immediately — and search engines see links to real university pages.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [universities, programs] = await Promise.all([getUniversities(), getPrograms()]);
  return <HomeClient initialUniversities={universities} initialPrograms={programs} />;
}
