import dbConnect from './db';
import Program from '../models/Program';
import University from '../models/University';

// Server-side data loaders used to render public pages with their content already in the HTML (for SEO).
// They return the same data, in the same order, as GET /api/programs and GET /api/universities.
// On any error they return null, and the page falls back to loading the data in the browser.

const toPlain = (docs) => JSON.parse(JSON.stringify(docs));

export async function getPrograms() {
  try {
    await dbConnect();
    return toPlain(await Program.find({}).lean());
  } catch (error) {
    console.error('Server data: could not load programs:', error);
    return null;
  }
}

export async function getUniversities() {
  try {
    await dbConnect();
    return toPlain(await University.find({}).sort({ featured: -1, rating: -1 }).lean());
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
    await dbConnect();
    const uni = await University.findOne({ id }).lean();
    return { university: uni ? toPlain(uni) : null, failed: false };
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
