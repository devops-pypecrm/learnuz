// Central SEO settings for the public website.
// Override SITE_URL with the NEXT_PUBLIC_SITE_URL environment variable if the domain changes.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.learnuzonline.com').replace(/\/+$/, '');

export const SITE_NAME = 'Learnuz';

export const DEFAULT_TITLE = 'Learnuz – UGC-DEB Approved Online Degrees from Top Indian Universities';

export const DEFAULT_DESCRIPTION =
  "Learnuz helps you find and enroll in UGC-DEB approved online degrees — MBA, MCA, BBA, BCA and more — from India's top universities. Free expert counselling from our Calicut, Kerala office.";

// Image shown when a page is shared on WhatsApp, Facebook, LinkedIn, X, etc.
export const SHARE_IMAGE = '/learnuz%20logo.png';

// Business details used for Google's structured data (keep in sync with the Contact page / admin Contact Details).
export const BUSINESS = {
  name: 'Learnuz',
  slogan: 'Success Starts With Learnuz',
  phone: '+91 9961356256',
  email: 'learnuz.info@learnuzonline.com',
  address: {
    streetAddress: '2nd Floor, Kuttys Tower, YMCA Cross Road',
    addressLocality: 'Calicut',
    addressRegion: 'Kerala',
    postalCode: '673001',
    addressCountry: 'IN',
  },
};

/** Builds the shared Open Graph / Twitter tags for a page. */
export function socialMeta({ title, description, path = '/' }) {
  return {
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_IN',
      url: path,
      title,
      description,
      images: [{ url: SHARE_IMAGE, alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SHARE_IMAGE],
    },
  };
}
