import { SITE_URL } from '../lib/site';
import dbConnect from '../lib/db';
import University from '../models/University';

// Served at /sitemap.xml — rebuilt at most once an hour so new universities appear automatically.
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();
  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/programs', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/universities', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let universityPages = [];
  try {
    await dbConnect();
    const universities = await University.find({}, { id: 1, updatedAt: 1 }).lean();
    universityPages = universities
      .filter((u) => u.id)
      .map((u) => ({
        url: `${SITE_URL}/universities/${encodeURIComponent(u.id)}`,
        lastModified: u.updatedAt || now,
        changeFrequency: 'monthly',
        priority: 0.8,
      }));
  } catch (error) {
    // If the database is unreachable, still serve the main pages.
    console.error('Sitemap: could not load universities:', error);
  }

  return [...pages, ...universityPages];
}
