import { unstable_cache } from 'next/cache';
import dbConnect from './db';
import Program from '../models/Program';
import University from '../models/University';

// Server-side data loaders used to render public pages with their content already in the HTML (for SEO).
// They return the same data, in the same order, as GET /api/programs and GET /api/universities.
//
// Results are cached for up to CACHE_SECONDS so pages don't wait for the database on every visit.
// The admin API routes call revalidateTag(PROGRAMS_TAG / UNIVERSITIES_TAG) after any change,
// so edits made in the admin panel still show up immediately.
//
// On a database error the loaders return null (nothing is cached), and the page falls back to
// loading the data in the browser.

export const PROGRAMS_TAG = 'programs';
export const UNIVERSITIES_TAG = 'universities';
const CACHE_SECONDS = 300;

const toPlain = (docs) => JSON.parse(JSON.stringify(docs));

// These throw on error so that a failed database call is never stored in the cache.
const loadPrograms = unstable_cache(
  async () => {
    await dbConnect();
    return toPlain(await Program.find({}).lean());
  },
  ['server-data-programs'],
  { revalidate: CACHE_SECONDS, tags: [PROGRAMS_TAG] }
);

const loadUniversities = unstable_cache(
  async () => {
    await dbConnect();
    return toPlain(await University.find({}).sort({ featured: -1, rating: -1 }).lean());
  },
  ['server-data-universities'],
  { revalidate: CACHE_SECONDS, tags: [UNIVERSITIES_TAG] }
);

const loadUniversityById = unstable_cache(
  async (id) => {
    await dbConnect();
    const uni = await University.findOne({ id }).lean();
    return uni ? toPlain(uni) : null;
  },
  ['server-data-university-by-id'],
  { revalidate: CACHE_SECONDS, tags: [UNIVERSITIES_TAG] }
);

export async function getPrograms() {
  try {
    return await loadPrograms();
  } catch (error) {
    console.error('Server data: could not load programs:', error);
    return null;
  }
}

export async function getUniversities() {
  try {
    return await loadUniversities();
  } catch (error) {
    console.error('Server data: could not load universities:', error);
    return null;
  }
}

/**
 * @returns {Promise<{ university: object|null, failed: boolean }>}
 *   university: null + failed: false  → the university does not exist
 *   university: null + failed: true   → the database could not be reached
 */
export async function getUniversityById(id) {
  try {
    return { university: await loadUniversityById(id), failed: false };
  } catch (error) {
    console.error('Server data: could not load university:', error);
    return { university: null, failed: true };
  }
}

/** Same matching rule the university detail page uses to pick that university's programs. */
export function programsForUniversity(programs, uni) {
  if (!programs || !uni) return [];
  const name = (uni.name || '').toLowerCase().trim();
  const short = (uni.shortName || '').toLowerCase().trim();
  return programs.filter((p) => {
    const pu = (p.university || '').toLowerCase().trim();
    return pu === name || (short && pu.includes(short)) || (pu && name.includes(pu));
  });
}
