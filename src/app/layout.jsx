import './globals.css';
import VantaBackground from '../components/VantaBackground';
import ScrollToTop from '../components/ScrollToTop';
import LenisProvider from '../components/LenisProvider';
import { SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, BUSINESS, socialMeta } from '../lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  ...socialMeta({ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, path: '/' }),
};

// Business details for Google (shown in search results / Maps / knowledge panel).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: BUSINESS.name,
  slogan: BUSINESS.slogan,
  url: SITE_URL,
  logo: `${SITE_URL}/learnuz%20logo.png`,
  email: BUSINESS.email,
  telephone: BUSINESS.phone,
  address: { '@type': 'PostalAddress', ...BUSINESS.address },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    contactType: 'admissions',
    areaServed: 'IN',
    availableLanguage: ['English', 'Malayalam', 'Hindi'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-transparent text-[#0f172a] font-sans antialiased selection:bg-[#1f3f7a] selection:text-white" suppressHydrationWarning>
        <LenisProvider>
          <VantaBackground />
          <ScrollToTop />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
